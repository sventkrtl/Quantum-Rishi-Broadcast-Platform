'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

// ── Config & version ──────────────────────────────────────────────────────────
const config            = require('./config/config');
const { PLATFORM_VERSION } = require('./config/version');

const PORT = config.port;

// ── Platform bootstrap ────────────────────────────────────────────────────────
const platform            = require('./platform');
const { GoogleSheetService } = require('./platform/services');

const { kernel, runtime, eventBus } = platform.startPlatform();

// Register GoogleSheetService with the kernel
const sheetService = new GoogleSheetService({
  eventBus,
  sheetUrl:  config.sheetUrl,
  refreshMs: config.sheetRefreshIntervalMs,
});
kernel.registerService('googleSheet', sheetService);

// ── MIME types ────────────────────────────────────────────────────────────────
const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
    res.end(data);
  });
}

// ── SSE client registry ───────────────────────────────────────────────────────
const sseClients = new Set();

/**
 * Broadcast an event envelope to all connected SSE clients.
 * Automatically removes disconnected clients.
 */
function sseBroadcast(envelope) {
  const payload = `data: ${JSON.stringify(envelope)}\n\n`;
  for (const res of sseClients) {
    if (!res.writableEnded) {
      res.write(payload);
    } else {
      sseClients.delete(res);
    }
  }
}

// ── Subscribe platform events → SSE broadcast ────────────────────────────────
const FORWARD_EVENTS = [
  'platform.kernel.booting',
  'platform.kernel.ready',
  'platform.kernel.running',
  'platform.kernel.error',
  'platform.kernel.stopped',
  'platform.runtime.started',
  'platform.runtime.stopped',
  'platform.runtime.platformStateUpdated',
  'platform.runtime.runtimeStateUpdated',
  'platform.runtime.timeUpdated',
  'platform.service.started',
  'platform.service.failed',
  'platform.service.refreshed',
  'platform.sheet.connected',
  'platform.sheet.failed',
  'platform.sheet.refreshing',
  'platform.sheet.updated',
  'platform.sheet.empty',
];

for (const eventType of FORWARD_EVENTS) {
  eventBus.subscribe(eventType, sseBroadcast);
}

// ── Start kernel, runtime, and service ───────────────────────────────────────
(async () => {
  try {
    await kernel.start();
    console.log('[Platform] Kernel started');

    runtime.start();
    console.log('[Platform] Runtime started');

    await sheetService.start();
    console.log('[Platform] GoogleSheetService started');
  } catch (error) {
    console.error('[Platform] Failed to start:', error);
    process.exit(1);
  }
})();

// ── HTTP request handler ──────────────────────────────────────────────────────
function handleRequest(req, res) {
  // Enable CORS for all responses (OBS/browser sources need this)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Use WHATWG URL API (no deprecation warning)
  const parsed   = new URL(req.url, `http://localhost`);
  const pathname = parsed.pathname;

  // ── GET /events — Server-Sent Events stream ────────────────────────────────
  if (req.method === 'GET' && pathname === '/events') {
    res.writeHead(200, {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no', // disable nginx buffering if behind proxy
    });

    // Send initial heartbeat so the browser knows the connection is live
    res.write(': connected\n\n');

    sseClients.add(res);

    // Send current state immediately on connect
    const state = kernel.getState();
    res.write(`data: ${JSON.stringify({
      type:    'platform.kernel.' + state.state.toLowerCase(),
      source:  'server',
      payload: state,
    })}\n\n`);

    // Clean up when client disconnects
    req.on('close', () => {
      sseClients.delete(res);
    });

    return;
  }

  // ── GET /health — health check ─────────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/health') {
    const kernelState   = kernel.getState();
    const serviceStatus = sheetService.getStatus();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status:    'ok',
      version:   PLATFORM_VERSION,
      kernel:    kernelState,
      service:   serviceStatus,
      clients:   sseClients.size,
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // ── GET /api/state — full state snapshot ───────────────────────────────────
  if (req.method === 'GET' && pathname === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      kernel:  kernel.getState(),
      service: sheetService.getStatus(),
      runtime: runtime.getState(),
    }));
    return;
  }

  // ── POST /api/kernel/start ─────────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/kernel/start') {
    kernel.start()
      .then(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, state: kernel.getState() }));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      });
    return;
  }

  // ── POST /api/kernel/stop ──────────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/kernel/stop') {
    kernel.shutdown()
      .then(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, state: kernel.getState() }));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      });
    return;
  }

  // ── POST /api/service/refresh ──────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/service/refresh') {
    sheetService.refresh()
      .then(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, service: sheetService.getStatus() }));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      });
    return;
  }

  // ── POST /api/service/reconnect ────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/service/reconnect') {
    sheetService.reconnect()
      .then(() => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, service: sheetService.getStatus() }));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      });
    return;
  }

  // ── POST /api/simulate/error ───────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/simulate/error') {
    eventBus.publish({
      type:    'platform.kernel.error',
      source:  'ControlPanel',
      payload: { error: 'Simulated error from control panel', timestamp: Date.now() },
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, simulated: 'error' }));
    return;
  }

  // ── Static file serving ────────────────────────────────────────────────────
  let filePath = '.' + pathname;

  // Root → overlay
  if (pathname === '/') {
    filePath = './overlay/index.html';
  }

  // Directory → index.html
  if (pathname.endsWith('/')) {
    filePath = path.join('.' + pathname, 'index.html');
  }

  serveStaticFile(res, filePath);
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`\n${config.platformName} v${PLATFORM_VERSION}`);
  console.log(`  Server:        http://localhost:${PORT}/`);
  console.log(`  Overlay:       http://localhost:${PORT}/overlay/`);
  console.log(`  Control Panel: http://localhost:${PORT}/control-panel/`);
  console.log(`  Health:        http://localhost:${PORT}/health`);
  console.log(`  Events (SSE):  http://localhost:${PORT}/events`);
  console.log('\nPress Ctrl+C to stop\n');
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
process.on('SIGINT', async () => {
  console.log('\n[Platform] Shutting down gracefully...');
  try {
    sheetService.stop();
    runtime.stop();
    await kernel.shutdown();
    server.close(() => {
      console.log('[Platform] Server closed. Goodbye.');
      process.exit(0);
    });
  } catch (error) {
    console.error('[Platform] Error during shutdown:', error);
    process.exit(1);
  }
});