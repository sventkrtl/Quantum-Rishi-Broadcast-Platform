'use strict';

const EventTypes = require('../constants/EventTypes');

/**
 * GoogleSheetService (Sprint 0.2 Data Pipeline)
 *
 * Fetches a publicly-published Google Sheet as CSV, parses it into an
 * array of row objects (first row = headers), detects dataset changes,
 * tracks dataset versioning, and maintains state.
 *
 * Dataset State Maintained:
 *   - connected      : boolean
 *   - sheetStatus    : string ('DISCONNECTED', 'CONNECTING', 'CONNECTED', 'REFRESHING', 'UPDATED', 'FAILED', 'EMPTY')
 *   - lastRefreshTime: string (ISO timestamp)
 *   - datasetVersion : number (starts at 0 before connect, sets to 1 on initial load, increments on content update)
 *   - rowCount       : number
 *   - currentDataset : Array<Object>
 *
 * Event Contracts (published via EventBus):
 *   - platform.sheet.refreshing — data refresh initiated
 *   - platform.sheet.connected  — successfully connected to Google Sheet
 *   - platform.sheet.updated    — dataset content updated (datasetVersion++)
 *   - platform.sheet.empty      — valid CSV fetched but contains 0 data rows
 *   - platform.sheet.failed     — fetch, validation, or parse failure
 *   - platform.service.started  — legacy service lifecycle event
 *   - platform.service.failed   — legacy service failure event
 *   - platform.service.refreshed— legacy service refresh event
 */
class GoogleSheetService {
  /**
   * @param {object} options
   * @param {object} options.eventBus       - Platform EventBus instance
   * @param {string} options.sheetUrl       - Public CSV export URL
   * @param {number} [options.refreshMs]    - Auto-refresh interval in ms (0 = disabled)
   */
  constructor({ eventBus, sheetUrl, refreshMs = 0 }) {
    if (!eventBus) throw new Error('GoogleSheetService: eventBus is required');
    if (!sheetUrl) throw new Error('GoogleSheetService: sheetUrl is required');

    this.eventBus   = eventBus;
    this.sheetUrl   = sheetUrl;
    this.refreshMs  = refreshMs;

    this._rows           = [];
    this._connected      = false;
    this._sheetStatus    = 'DISCONNECTED';
    this._lastRefreshTime = null;
    this._datasetVersion = 0;
    this._lastHash       = null;
    this._refreshTimer   = null;
    this._started        = false;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Start the service: perform initial fetch and optionally schedule
   * auto-refresh.
   * @returns {Promise<void>}
   */
  async start() {
    if (this._started) return;
    this._started = true;

    await this._fetchAndParse();

    if (this.refreshMs > 0) {
      this._refreshTimer = setInterval(() => this._fetchAndParse(), this.refreshMs);
    }

    this.eventBus.publish({
      type:    EventTypes.SERVICE_STARTED,
      source:  'GoogleSheetService',
      payload: {
        sheetUrl:        this.sheetUrl,
        connected:       this._connected,
        rowCount:        this._rows.length,
        datasetVersion:  this._datasetVersion,
        lastRefreshTime: this._lastRefreshTime,
      },
    });
  }

  /**
   * Stop the service and cancel any scheduled refresh.
   */
  stop() {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
    this._started     = false;
    this._connected   = false;
    this._sheetStatus = 'DISCONNECTED';
  }

  /**
   * Manually trigger a data refresh.
   * @returns {Promise<void>}
   */
  async refresh() {
    await this._fetchAndParse();
  }

  /**
   * Trigger a reconnect: resets connection state and re-fetches sheet data.
   * @returns {Promise<void>}
   */
  async reconnect() {
    this._connected   = false;
    this._sheetStatus = 'CONNECTING';
    await this._fetchAndParse();
  }

  /**
   * Return the current dataset rows (defensive copy).
   * @returns {Array<Object>} Array of row objects keyed by header values
   */
  getRows() {
    return this._rows.slice();
  }

  /**
   * Alias for getRows().
   * @returns {Array<Object>}
   */
  getDataset() {
    return this.getRows();
  }

  /**
   * Return complete dataset state snapshot.
   * @returns {{
   *   started: boolean,
   *   connected: boolean,
   *   sheetStatus: string,
   *   rowCount: number,
   *   datasetVersion: number,
   *   lastRefreshTime: string|null,
   *   sheetUrl: string
   * }}
   */
  getStatus() {
    return {
      started:         this._started,
      connected:       this._connected,
      sheetStatus:     this._sheetStatus,
      rowCount:        this._rows.length,
      datasetVersion:  this._datasetVersion,
      lastRefreshTime: this._lastRefreshTime,
      sheetUrl:        this.sheetUrl,
    };
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Fetch the CSV from the configured URL, validate, parse, detect changes,
   * update dataset state, and emit platform events.
   * @private
   */
  async _fetchAndParse() {
    // Publish refreshing event
    this._sheetStatus = 'REFRESHING';
    this.eventBus.publish({
      type:    EventTypes.SHEET_REFRESHING,
      source:  'GoogleSheetService',
      payload: {
        sheetUrl:        this.sheetUrl,
        datasetVersion:  this._datasetVersion,
        lastRefreshTime: this._lastRefreshTime,
      },
    });

    try {
      const response = await fetch(this.sheetUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const text = await response.text();

      // Validation 1: Ensure body is not empty
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response body — check sheet URL and publish settings');
      }

      // Validation 2: Ensure response is not an HTML error/login page from Google
      const trimmedText = text.trim();
      if (trimmedText.startsWith('<!DOCTYPE') || trimmedText.startsWith('<html') || trimmedText.startsWith('<HTML')) {
        throw new Error('Received HTML instead of CSV — ensure Google Sheet is published to web as CSV');
      }

      const newRows = this._parseCsv(text);
      this._lastRefreshTime = new Date().toISOString();

      const wasConnected = this._connected;
      this._connected    = true;

      // Versioning rule: Initial connection/dataset load sets version to 1 (v1).
      // Subsequent content changes increment version (v2, v3, ...).
      if (this._datasetVersion === 0) {
        this._datasetVersion = 1;
      }

      // Emit connected event on initial connection or after reconnect
      if (!wasConnected) {
        this.eventBus.publish({
          type:    EventTypes.SHEET_CONNECTED,
          source:  'GoogleSheetService',
          payload: {
            sheetUrl:        this.sheetUrl,
            rowCount:        newRows.length,
            datasetVersion:  this._datasetVersion,
            lastRefreshTime: this._lastRefreshTime,
          },
        });
      }

      // Check if data is empty (0 rows)
      if (newRows.length === 0) {
        this._sheetStatus = 'EMPTY';
        this._rows        = [];

        this.eventBus.publish({
          type:    EventTypes.SHEET_EMPTY,
          source:  'GoogleSheetService',
          payload: {
            rowCount:        0,
            datasetVersion:  this._datasetVersion,
            lastRefreshTime: this._lastRefreshTime,
          },
        });
        return;
      }

      // Change detection: calculate hash/serialized string of rows
      const currentHash = JSON.stringify(newRows);
      const hasChanged  = (currentHash !== this._lastHash);

      if (hasChanged) {
        // Increment dataset version if this is not the first hash record
        if (this._lastHash !== null) {
          this._datasetVersion++;
        }

        this._lastHash    = currentHash;
        this._rows        = newRows;
        this._sheetStatus = 'UPDATED';

        this.eventBus.publish({
          type:    EventTypes.SHEET_UPDATED,
          source:  'GoogleSheetService',
          payload: {
            rowCount:        this._rows.length,
            datasetVersion:  this._datasetVersion,
            lastRefreshTime: this._lastRefreshTime,
            currentDataset:  this._rows,
          },
        });

        // Also emit legacy service.refreshed for backwards compatibility
        this.eventBus.publish({
          type:    EventTypes.SERVICE_REFRESHED,
          source:  'GoogleSheetService',
          payload: {
            rowCount:        this._rows.length,
            datasetVersion:  this._datasetVersion,
            lastRefreshTime: this._lastRefreshTime,
          },
        });
      } else {
        // Content unchanged
        this._sheetStatus = 'CONNECTED';
      }

    } catch (error) {
      console.error('[GoogleSheetService] Fetch/parse failed:', error.message);

      this._connected   = false;
      this._sheetStatus = 'FAILED';

      this.eventBus.publish({
        type:    EventTypes.SHEET_FAILED,
        source:  'GoogleSheetService',
        payload: {
          error:           error.message,
          datasetVersion:  this._datasetVersion,
          lastRefreshTime: this._lastRefreshTime,
        },
      });

      // Also emit legacy service.failed for backwards compatibility
      this.eventBus.publish({
        type:    EventTypes.SERVICE_FAILED,
        source:  'GoogleSheetService',
        payload: {
          error:           error.message,
          lastRefreshTime: this._lastRefreshTime,
        },
      });
    }
  }

  /**
   * Parse CSV text into an array of row objects.
   * Uses the first row as column headers.
   *
   * Handles:
   *  - Quoted fields (including those containing commas)
   *  - CRLF and LF line endings
   *
   * @param {string} csv - Raw CSV text
   * @returns {Array<Object>}
   * @private
   */
  _parseCsv(csv) {
    const lines = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

    // Filter empty trailing lines
    const nonEmpty = lines.filter(l => l.trim().length > 0);
    if (nonEmpty.length < 2) return []; // need at least header + one data row

    const headers = this._splitCsvLine(nonEmpty[0]);

    const rows = [];
    for (let i = 1; i < nonEmpty.length; i++) {
      const values = this._splitCsvLine(nonEmpty[i]);
      const row    = {};
      headers.forEach((header, idx) => {
        row[header.trim()] = (values[idx] || '').trim();
      });
      rows.push(row);
    }

    return rows;
  }

  /**
   * Split a single CSV line respecting quoted fields.
   * @param {string} line
   * @returns {string[]}
   * @private
   */
  _splitCsvLine(line) {
    const fields = [];
    let current  = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }

    fields.push(current);
    return fields;
  }
}

module.exports = GoogleSheetService;
