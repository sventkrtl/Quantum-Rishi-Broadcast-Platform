'use strict';

/**
 * Central platform configuration.
 *
 * Override any value via environment variables before starting the server.
 * Example:
 *   PORT=3000 SHEET_URL=https://... node server.js
 */
const config = {
  // ── HTTP Server ──────────────────────────────────────────────────────────────
  port: parseInt(process.env.PORT, 10) || 8085,
  host: process.env.HOST || 'localhost',

  // ── Google Sheets CSV Service ────────────────────────────────────────────────
  // Publish your Google Sheet: File → Share → Publish to web → CSV
  // The URL format is: https://docs.google.com/spreadsheets/d/<ID>/export?format=csv
  // pubhtml  → https://.../pubhtml
  // CSV export → https://.../pub?output=csv
  sheetUrl: process.env.SHEET_URL ||
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTcrvEO5W5ossRLy1O1kjU-ZnTSdDLCIH0dBVrKctMFbsWEbSogl5GT9-XBE7_FaRnENyaR4Cca0t8D/pub?output=csv',

  // How often (ms) the GoogleSheetService auto-refreshes data
  sheetRefreshIntervalMs: parseInt(process.env.SHEET_REFRESH_MS, 10) || 30_000,

  // ── Platform ────────────────────────────────────────────────────────────────
  platformName: 'AV Media Telangana Platform',
};

module.exports = config;
