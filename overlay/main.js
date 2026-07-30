/**
 * overlay/main.js
 *
 * Connects to the server's SSE stream (/events) and updates the
 * overlay DOM in real time.
 *
 * Supports two rendering modes via query parameters:
 *  - Production Mode (/overlay/)           → Fully transparent empty canvas
 *  - Developer Mode (/overlay/?dev=1)      → Visual diagnostic card
 */

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CLASSES = ['booting', 'ready', 'running', 'error', 'stopped', 'unknown', 'started', 'failed', 'connected', 'refreshing', 'updated', 'empty', 'nodata', 'yes', 'no'];

/**
 * Set the text and colour-class of a status element.
 * @param {string} id        - Element ID
 * @param {string} text      - Text to display
 * @param {string} [cssClass] - Optional class name (defaults to text.toLowerCase())
 */
function setStatus(id, text, cssClass) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.classList.remove(...STATUS_CLASSES);
    const cls = (cssClass || text || '').toLowerCase().replace(/\s+/g, '');
    if (cls) el.classList.add(cls);
}

/** Update the time display using the local clock. */
function updateCurrentTime() {
    const el = document.getElementById('current-time-value');
    if (el) el.textContent = new Date().toLocaleTimeString();
}

/** Fetch state snapshot from /api/state to populate initial state. */
async function fetchInitialState() {
    try {
        const res  = await fetch('/api/state');
        const data = await res.json();
        if (data.kernel) {
            setStatus('platform-status-value', data.kernel.state, data.kernel.state.toLowerCase());
            setStatus('kernel-status-value',   data.kernel.state, data.kernel.state.toLowerCase());
        }
        if (data.service) {
            updateSheetUI(data.service);
        }
    } catch (_) { /* ignore */ }
}

function updateSheetUI(service) {
    if (!service) return;
    let status = service.sheetStatus || (service.connected ? 'CONNECTED' : 'DISCONNECTED');
    if (status === 'EMPTY') status = 'NO DATA';
    
    setStatus('sheet-status-value',    status, status === 'NO DATA' ? 'nodata' : status.toLowerCase());
    setStatus('sheet-connected-value', service.connected ? 'YES' : 'NO', service.connected ? 'yes' : 'no');
    
    const rowsEl = document.getElementById('sheet-rows-value');
    if (rowsEl) rowsEl.textContent = service.rowCount ?? 0;

    const verEl = document.getElementById('sheet-version-value');
    if (verEl) verEl.textContent = 'v' + (service.datasetVersion ?? 0);

    if (service.lastRefreshTime) {
        const refreshEl = document.getElementById('sheet-refresh-value');
        if (refreshEl) refreshEl.textContent = new Date(service.lastRefreshTime).toLocaleTimeString();
    }
}

// ── Event handler ─────────────────────────────────────────────────────────────

/**
 * Route an incoming SSE event envelope to the appropriate DOM update.
 * @param {{ type: string, payload: object }} envelope
 */
function handleEvent(envelope) {
    const { type, payload } = envelope;

    switch (type) {
        // ── Kernel Events ──────────────────────────────────────────────────
        case 'platform.kernel.booting':
            setStatus('platform-status-value', 'BOOTING', 'booting');
            setStatus('kernel-status-value',   'BOOTING', 'booting');
            break;

        case 'platform.kernel.ready':
            setStatus('platform-status-value', 'READY', 'ready');
            setStatus('kernel-status-value',   'READY', 'ready');
            break;

        case 'platform.kernel.running':
            setStatus('platform-status-value', 'RUNNING', 'running');
            setStatus('kernel-status-value',   'RUNNING', 'running');
            break;

        case 'platform.kernel.error':
            setStatus('platform-status-value', 'ERROR', 'error');
            setStatus('kernel-status-value',   'ERROR', 'error');
            break;

        case 'platform.kernel.stopped':
            setStatus('platform-status-value', 'STOPPED', 'stopped');
            setStatus('kernel-status-value',   'STOPPED', 'stopped');
            break;

        // ── Runtime Events ─────────────────────────────────────────────────
        case 'platform.runtime.timeUpdated': {
            const timeStr = payload?.currentTime;
            if (timeStr) {
                const el = document.getElementById('current-time-value');
                if (el) el.textContent = new Date(timeStr).toLocaleTimeString();
            }
            break;
        }

        // ── Data Pipeline Events (Sprint 0.2) ──────────────────────────────
        case 'platform.sheet.refreshing':
            setStatus('sheet-status-value', 'REFRESHING', 'refreshing');
            break;

        case 'platform.sheet.connected':
            setStatus('sheet-status-value',    'CONNECTED', 'connected');
            setStatus('sheet-connected-value', 'YES', 'yes');
            if (payload?.rowCount !== undefined) {
                const rowsEl = document.getElementById('sheet-rows-value');
                if (rowsEl) rowsEl.textContent = payload.rowCount;
            }
            if (payload?.datasetVersion !== undefined) {
                const verEl = document.getElementById('sheet-version-value');
                if (verEl) verEl.textContent = 'v' + payload.datasetVersion;
            }
            if (payload?.lastRefreshTime) {
                const refreshEl = document.getElementById('sheet-refresh-value');
                if (refreshEl) refreshEl.textContent = new Date(payload.lastRefreshTime).toLocaleTimeString();
            }
            break;

        case 'platform.sheet.updated':
            setStatus('sheet-status-value',    'UPDATED', 'updated');
            setStatus('sheet-connected-value', 'YES', 'yes');
            if (payload?.rowCount !== undefined) {
                const rowsEl = document.getElementById('sheet-rows-value');
                if (rowsEl) rowsEl.textContent = payload.rowCount;
            }
            if (payload?.datasetVersion !== undefined) {
                const verEl = document.getElementById('sheet-version-value');
                if (verEl) verEl.textContent = 'v' + payload.datasetVersion;
            }
            if (payload?.lastRefreshTime) {
                const refreshEl = document.getElementById('sheet-refresh-value');
                if (refreshEl) refreshEl.textContent = new Date(payload.lastRefreshTime).toLocaleTimeString();
            }
            break;

        case 'platform.sheet.empty':
            setStatus('sheet-status-value',    'NO DATA', 'nodata');
            setStatus('sheet-connected-value', 'YES', 'yes');
            const emptyRowsEl = document.getElementById('sheet-rows-value');
            if (emptyRowsEl) emptyRowsEl.textContent = 0;
            break;

        case 'platform.sheet.failed':
            setStatus('sheet-status-value',    'FAILED', 'failed');
            setStatus('sheet-connected-value', 'NO', 'no');
            break;

        default:
            break;
    }
}

// ── SSE connection ────────────────────────────────────────────────────────────

function connectSSE() {
    const es = new EventSource('/events');

    es.onmessage = (event) => {
        try {
            handleEvent(JSON.parse(event.data));
        } catch (e) {
            console.warn('[Overlay] Failed to parse SSE event:', e);
        }
    };

    es.onerror = () => {
        // Browser auto-reconnects; no action needed
    };
}

// ── Developer / Production mode detection ─────────────────────────────────────

/**
 * Detect whether developer mode is requested via query parameters.
 *   /overlay/            → production  (transparent canvas)
 *   /overlay/?dev=1      → developer   (diagnostic panel)
 *   /overlay/?debug=true → developer   (diagnostic panel)
 * @returns {boolean}
 */
function isDeveloperMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('dev') === '1' || params.get('debug') === 'true';
}

/**
 * Render the developer diagnostic panel:
 *   - show the test-box
 *   - set initial values and clock
 */
function renderDeveloperPanel() {
    document.body.classList.add('developer');
    document.body.classList.remove('production');

    const testBox = document.getElementById('test-box');
    if (testBox) {
        testBox.style.display = 'block';
    }

    setStatus('platform-status-value', 'BOOTING', 'booting');
    setStatus('kernel-status-value',   'UNKNOWN',  'unknown');
    setStatus('sheet-status-value',    'DISCONNECTED', 'disconnected');
    setStatus('sheet-connected-value', 'NO', 'no');
    updateCurrentTime();

    fetchInitialState();
    setInterval(updateCurrentTime, 1000);
}

/**
 * Production mode: hide the diagnostic panel and ensure canvas is transparent.
 */
function hideDeveloperPanel() {
    document.body.classList.remove('developer');
    document.body.classList.add('production');

    const testBox = document.getElementById('test-box');
    if (testBox) {
        testBox.style.display = 'none';
    }
}

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    if (isDeveloperMode()) {
        renderDeveloperPanel();
    } else {
        hideDeveloperPanel();
    }

    // Always connect SSE so overlay receives platform events internally
    connectSSE();
});