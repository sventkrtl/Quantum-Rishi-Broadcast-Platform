'use strict';

/**
 * Platform event type constants.
 * All events flow through the EventBus using these string identifiers.
 *
 * Naming convention: <domain>.<component>.<action>
 */
const EventTypes = {
  // ── Kernel lifecycle ────────────────────────────────────────────────────────
  KERNEL_BOOTING:  'platform.kernel.booting',   // Kernel starting
  KERNEL_READY:    'platform.kernel.ready',      // Kernel initialised, services loading
  KERNEL_RUNNING:  'platform.kernel.running',    // Kernel fully operational
  KERNEL_ERROR:    'platform.kernel.error',      // Kernel encountered an error
  KERNEL_STOPPED:  'platform.kernel.stopped',    // Kernel shut down

  // ── Runtime lifecycle ───────────────────────────────────────────────────────
  RUNTIME_STARTED: 'platform.runtime.started',  // Overlay runtime initialised
  RUNTIME_STOPPED: 'platform.runtime.stopped',  // Overlay runtime terminated

  // ── Service lifecycle ───────────────────────────────────────────────────────
  SERVICE_STARTED:   'platform.service.started',    // Service initialised
  SERVICE_FAILED:    'platform.service.failed',     // Service encountered error
  SERVICE_REFRESHED: 'platform.service.refreshed',  // Service data updated

  // ── Google Sheet Data Pipeline (Sprint 0.2) ───────────────────────────────
  SHEET_CONNECTED:  'platform.sheet.connected',   // Successfully connected to Google Sheet
  SHEET_FAILED:     'platform.sheet.failed',      // Sheet fetch or parse failed
  SHEET_REFRESHING: 'platform.sheet.refreshing',  // Sheet refresh started
  SHEET_UPDATED:    'platform.sheet.updated',     // Sheet dataset content updated (version++)
  SHEET_EMPTY:      'platform.sheet.empty',       // Sheet fetched but contains 0 data rows
};

module.exports = EventTypes;
