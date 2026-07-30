'use strict';
/**
 * control-panel.js
 *
 * Client-side logic for the AV Media Telangana Platform Control Panel.
 *
 * Responsibilities:
 *  - Opens an SSE connection to /events and live-updates state display
 *  - Polls /api/state on load to populate initial values
 *  - Exposes button handlers for Kernel and Google Sheet Pipeline controls
 *  - Appends all incoming events to the on-screen event log
 */

// ── Globals ──────────────────────────────────────────────────────────────────
let eventSource = null;
const MAX_LOG_ENTRIES = 200;

// ── DOM helpers ──────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function setState(elementId, value) {
    const el = $(elementId);
    if (!el) return;
    el.textContent = value || '—';
    el.className = 'state-card-value';
    if (value) el.classList.add(value.toLowerCase().replace(/\s+/g, ''));
}

function setSmallState(elementId, value) {
    const el = $(elementId);
    if (!el) return;
    el.textContent = value || '—';
    el.className = 'state-card-value small';
}

// ── State polling ─────────────────────────────────────────────────────────────
async function pollState() {
    try {
        const res  = await fetch('/api/state');
        const data = await res.json();
        applyState(data);
    } catch (_) { /* silently ignore */ }
}

function applyState({ kernel, runtime, service } = {}) {
    if (kernel)  {
        setState('kernel-state', kernel.state);
    }
    if (runtime) {
        setState('runtime-state', runtime.runtimeState);
    }
    if (service) {
        updateSheetState(service);
    }
}

function updateSheetState(service) {
    if (!service) return;
    let status = service.sheetStatus || (service.connected ? 'CONNECTED' : 'DISCONNECTED');
    if (status === 'EMPTY') status = 'NO DATA';

    setState('sheet-status', status);
    setState('sheet-connected', service.connected ? 'YES' : 'NO');
    $('row-count').textContent = service.rowCount ?? 0;
    $('dataset-version').textContent = 'v' + (service.datasetVersion ?? 0);
    setSmallState('last-refresh', service.lastRefreshTime
        ? new Date(service.lastRefreshTime).toLocaleTimeString()
        : '—');
}

// Re-fetch full state every 10 s as a fallback
setInterval(pollState, 10_000);

// ── SSE connection ────────────────────────────────────────────────────────────
function connectSSE() {
    if (eventSource) {
        eventSource.close();
    }

    eventSource = new EventSource('/events');

    eventSource.addEventListener('open', () => {
        setConnectionStatus(true);
        pollState(); // grab fresh state immediately on (re)connect
    });

    eventSource.onmessage = (event) => {
        try {
            const envelope = JSON.parse(event.data);
            handleEvent(envelope);
            appendLog(envelope);
        } catch (e) {
            console.warn('[ControlPanel] Failed to parse SSE event:', e);
        }
    };

    eventSource.onerror = () => {
        setConnectionStatus(false);
    };
}

function setConnectionStatus(connected) {
    const badge = $('connection-status');
    if (!badge) return;
    badge.className = 'connection-badge ' + (connected ? 'connected' : 'disconnected');
    badge.querySelector('span').textContent = '';
    badge.lastChild.textContent = connected ? ' Connected' : ' Disconnected';
}

// ── Event routing ─────────────────────────────────────────────────────────────
function handleEvent({ type, payload } = {}) {
    if (!type) return;

    // Kernel events
    if (type.startsWith('platform.kernel.')) {
        const state = type.replace('platform.kernel.', '').toUpperCase();
        setState('kernel-state', state);
    }

    // Runtime events
    if (type === 'platform.runtime.started') setState('runtime-state', 'STARTED');
    if (type === 'platform.runtime.stopped') setState('runtime-state', 'STOPPED');

    // Data Pipeline events (Sprint 0.2)
    if (type === 'platform.sheet.refreshing') {
        setState('sheet-status', 'REFRESHING');
    }
    if (type === 'platform.sheet.connected') {
        setState('sheet-status', 'CONNECTED');
        setState('sheet-connected', 'YES');
        if (payload?.rowCount !== undefined) $('row-count').textContent = payload.rowCount;
        if (payload?.datasetVersion !== undefined) $('dataset-version').textContent = 'v' + payload.datasetVersion;
        if (payload?.lastRefreshTime) setSmallState('last-refresh', new Date(payload.lastRefreshTime).toLocaleTimeString());
    }
    if (type === 'platform.sheet.updated') {
        setState('sheet-status', 'UPDATED');
        setState('sheet-connected', 'YES');
        if (payload?.rowCount !== undefined) $('row-count').textContent = payload.rowCount;
        if (payload?.datasetVersion !== undefined) $('dataset-version').textContent = 'v' + payload.datasetVersion;
        if (payload?.lastRefreshTime) setSmallState('last-refresh', new Date(payload.lastRefreshTime).toLocaleTimeString());
    }
    if (type === 'platform.sheet.empty') {
        setState('sheet-status', 'NO DATA');
        setState('sheet-connected', 'YES');
        $('row-count').textContent = 0;
    }
    if (type === 'platform.sheet.failed') {
        setState('sheet-status', 'FAILED');
        setState('sheet-connected', 'NO');
    }
}

// ── Event log ─────────────────────────────────────────────────────────────────
function appendLog({ type, source, payload } = {}) {
    const log = $('event-log');
    if (!log) return;

    // Remove placeholder if present
    const placeholder = log.querySelector('.log-placeholder');
    if (placeholder) placeholder.remove();

    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    entry.innerHTML =
        `<span class="log-time">${time}</span>` +
        `<span class="log-type">${type || '?'}</span>` +
        `<span class="log-payload">${JSON.stringify(payload || {})}</span>`;

    log.prepend(entry); // newest at top

    // Trim log to MAX_LOG_ENTRIES
    const entries = log.querySelectorAll('.log-entry');
    if (entries.length > MAX_LOG_ENTRIES) {
        entries[entries.length - 1].remove();
    }
}

function clearLog() {
    const log = $('event-log');
    log.innerHTML = '<div class="log-placeholder">Log cleared — waiting for events…</div>';
}

// ── Button handlers (called from HTML onclick) ────────────────────────────────

async function kernelStart() {
    await apiPost('/api/kernel/start');
}

async function kernelStop() {
    await apiPost('/api/kernel/stop');
}

async function serviceRefresh() {
    await apiPost('/api/service/refresh');
}

async function serviceReconnect() {
    await apiPost('/api/service/reconnect');
}

async function simulateError() {
    await apiPost('/api/simulate/error');
}

async function apiPost(endpoint) {
    try {
        const res  = await fetch(endpoint, { method: 'POST' });
        const data = await res.json();
        console.log(`[ControlPanel] ${endpoint}:`, data);
        await pollState();
    } catch (err) {
        console.error(`[ControlPanel] ${endpoint} failed:`, err);
    }
}

// ── Boot ──────────────────────────────────────────────────────────────────────
pollState();
connectSSE();
