'use strict';

const { SecondaryPlaylistItem } = require('./SecondaryPlaylistItem');

/**
 * PlaylistModel — Phase 3 Domain Model Construction
 *
 * Immutable, domain-driven container for the Secondary Playlist.
 * Conforms 100% to DATASET_CONTRACT_SECONDARY_PLAYLIST.md and Phase 3 Domain Rules.
 *
 * Rules:
 *  - Rule 18: Pure JS business logic (NO DOM, NO Renderer, NO Timeline, NO CSS).
 *  - Rule 19: 100% Immutable (Object.freeze).
 */
class PlaylistModel {
  /**
   * @param {object} [params]
   * @param {number} [params.datasetVersion]
   * @param {string} [params.lastRefreshTime]
   * @param {number} [params.totalRows]
   * @param {SecondaryPlaylistItem[]} [params.items]
   */
  constructor({
    datasetVersion = 0,
    lastRefreshTime = null,
    totalRows = 0,
    items = [],
  } = {}) {
    this.datasetVersion  = datasetVersion;
    this.lastRefreshTime = lastRefreshTime;
    this.totalRows       = totalRows;

    // Apply Phase 3 Ordering Rules:
    // 1. Priority descending (higher number first)
    // 2. RowIndex ascending (original CSV position)
    const sorted = items
      .filter(item => item && item.isValid && item.isValid())
      .slice()
      .sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority; // Priority descending
        }
        return a.rowIndex - b.rowIndex;   // Row index ascending
      });

    // Assign 1-indexed sequence number to sorted active items
    const sequencedItems = sorted.map((item, idx) => {
      return new SecondaryPlaylistItem({
        id:        item.id,
        text:      item.text,
        category:  item.category,
        priority:  item.priority,
        theme:     item.theme,
        status:    item.status,
        rowIndex:  item.rowIndex,
        sequence:  idx + 1,
        startsAt:  item.startsAt,
        expiresAt: item.expiresAt,
        region:    item.region,
        language:  item.language,
      });
    });

    this.items = Object.freeze(sequencedItems);

    // Fast lookup map by ID
    const idMap = new Map();
    this.items.forEach(item => idMap.set(item.id, item));
    this._idMap = idMap;

    // Rule 19: Immutable Domain
    Object.freeze(this);
  }

  /**
   * Returns defensive copy of sorted, active playlist items.
   * @returns {SecondaryPlaylistItem[]}
   */
  getItems() {
    return this.items.slice();
  }

  /**
   * Returns total count of active items available for crawl playback.
   * @returns {number}
   */
  getItemCount() {
    return this.items.length;
  }

  /**
   * Check if playlist contains 0 active items.
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Lookup item by stable identity ID.
   * @param {string} id
   * @returns {SecondaryPlaylistItem|null}
   */
  getItemById(id) {
    if (!id) return null;
    return this._idMap.get(String(id).trim()) || null;
  }

  /**
   * Lookup item by 1-based sequence index.
   * @param {number} sequenceIndex - 1-based sequence index
   * @returns {SecondaryPlaylistItem|null}
   */
  getItemBySequence(sequenceIndex) {
    const idx = sequenceIndex - 1;
    if (idx >= 0 && idx < this.items.length) {
      return this.items[idx];
    }
    return null;
  }

  /**
   * Create a new immutable PlaylistModel filtered by theme.
   * @param {string} themeKey
   * @returns {PlaylistModel}
   */
  filterByTheme(themeKey) {
    const t = String(themeKey).trim().toLowerCase();
    const filtered = this.items.filter(item => item.theme === t);
    return new PlaylistModel({
      datasetVersion:  this.datasetVersion,
      lastRefreshTime: this.lastRefreshTime,
      totalRows:       this.totalRows,
      items:           filtered,
    });
  }

  /**
   * Create a new immutable PlaylistModel filtered by category.
   * @param {string} categoryName
   * @returns {PlaylistModel}
   */
  filterByCategory(categoryName) {
    const c = String(categoryName).trim().toLowerCase();
    const filtered = this.items.filter(item => item.category.toLowerCase() === c);
    return new PlaylistModel({
      datasetVersion:  this.datasetVersion,
      lastRefreshTime: this.lastRefreshTime,
      totalRows:       this.totalRows,
      items:           filtered,
    });
  }
}

module.exports = PlaylistModel;
