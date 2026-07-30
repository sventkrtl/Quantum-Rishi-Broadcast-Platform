'use strict';

const { SecondaryPlaylistItem, ItemStatus } = require('../models/SecondaryPlaylistItem');
const PlaylistModel                         = require('../models/PlaylistModel');

/**
 * SecondaryPlaylistConsumer (Rule 17: Consumer Purity)
 *
 * Listens for platform dataset events (`platform.sheet.updated`), normalizes
 * CSV rows according to DATASET_CONTRACT_SECONDARY_PLAYLIST.md and Phase 3 Domain Rules,
 * and produces an immutable PlaylistModel.
 *
 * Pure Consumer: NO Rendering, NO Animation, NO Timeline Control, NO DOM Access.
 */
class SecondaryPlaylistConsumer {
  /**
   * @param {object} [options]
   * @param {function(PlaylistModel): void} [options.onPlaylistUpdated] - Listener callback
   */
  constructor({ onPlaylistUpdated = null } = {}) {
    this._onPlaylistUpdated = onPlaylistUpdated;
    this._currentModel       = new PlaylistModel();
  }

  /**
   * Set or update listener callback.
   * @param {function(PlaylistModel): void} callback
   */
  setUpdateListener(callback) {
    this._onPlaylistUpdated = callback;
  }

  /**
   * Handle incoming platform event envelope.
   * @param {object} event - Platform event envelope
   * @returns {PlaylistModel|null}
   */
  handleEvent(event) {
    if (!event || typeof event !== 'object') return null;

    if (event.type === 'platform.sheet.updated' && event.payload) {
      return this.consumePayload(event.payload);
    }
    return null;
  }

  /**
   * Consume raw platform sheet payload and produce an immutable PlaylistModel.
   * @param {object} payload
   * @param {number} [payload.datasetVersion]
   * @param {string} [payload.lastRefreshTime]
   * @param {Array<Object>} [payload.currentDataset]
   * @returns {PlaylistModel}
   */
  consumePayload(payload = {}) {
    const rawRows        = Array.isArray(payload.currentDataset) ? payload.currentDataset : (Array.isArray(payload) ? payload : []);
    const datasetVersion = payload.datasetVersion || 0;
    const lastRefresh    = payload.lastRefreshTime || new Date().toISOString();

    const items = [];

    rawRows.forEach((row, idx) => {
      if (!row || typeof row !== 'object') return;

      const text      = this._extractFieldValue(row, ['news', 'headline', 'text', 'title', 'content']);
      const category  = this._extractFieldValue(row, ['category', 'label', 'badge', 'type']) || 'TELANGANA';
      const id        = this._extractFieldValue(row, ['id', 'item_id']) || null;
      const priority  = this._extractFieldValue(row, ['priority', 'order', 'rank']) || '1';
      const theme     = this._extractFieldValue(row, ['theme', 'style']) || 'default';
      const rawStatus = this._extractFieldValue(row, ['status', 'active', 'state', 'enabled']) || 'active';

      // Future Metadata Fields (Phase 3 Domain Rule)
      const startsAt  = this._extractFieldValue(row, ['starts_at', 'startsat', 'start_time']) || null;
      const expiresAt = this._extractFieldValue(row, ['expires_at', 'expiresat', 'expire_time']) || null;
      const region    = this._extractFieldValue(row, ['region', 'location', 'area']) || 'TELANGANA';
      const language  = this._extractFieldValue(row, ['language', 'lang']) || 'te';

      const item = new SecondaryPlaylistItem({
        id,
        text,
        category,
        priority: parseInt(priority, 10) || 1,
        theme,
        status: rawStatus,
        rowIndex: idx,
        startsAt,
        expiresAt,
        region,
        language,
      });

      if (item.isValid()) {
        items.push(item);
      }
    });

    const model = new PlaylistModel({
      datasetVersion,
      lastRefreshTime: lastRefresh,
      totalRows: rawRows.length,
      items,
    });

    this._currentModel = model;

    if (typeof this._onPlaylistUpdated === 'function') {
      this._onPlaylistUpdated(model);
    }

    return model;
  }

  /**
   * Get the most recently constructed PlaylistModel.
   * @returns {PlaylistModel}
   */
  getCurrentModel() {
    return this._currentModel;
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Extract field value from object by trying an array of alias keys case-insensitively.
   * @param {object} row
   * @param {string[]} aliases
   * @returns {string}
   * @private
   */
  _extractFieldValue(row, aliases) {
    const keys = Object.keys(row);
    for (const alias of aliases) {
      const match = keys.find(k => k.trim().toLowerCase() === alias.toLowerCase());
      if (match && row[match] !== undefined && row[match] !== null) {
        return String(row[match]);
      }
    }
    return '';
  }
}

module.exports = SecondaryPlaylistConsumer;
