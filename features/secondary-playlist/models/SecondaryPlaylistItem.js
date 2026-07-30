'use strict';

/**
 * Item Status Enum (Phase 3 Domain Rule)
 */
const ItemStatus = Object.freeze({
  ACTIVE:   'ACTIVE',
  INACTIVE: 'INACTIVE',
  DRAFT:    'DRAFT',
  EXPIRED:  'EXPIRED',
});

/**
 * SecondaryPlaylistItem DTO & Domain Model
 *
 * Represents an immutable news item in the Secondary Playlist.
 * Conforms 100% to DATASET_CONTRACT_SECONDARY_PLAYLIST.md and Phase 3 Domain Rules.
 *
 * Rules:
 *  - Rule 18: Pure JS business model (NO DOM, NO Renderer, NO CSS, NO Timeline).
 *  - Rule 19: 100% Immutable (Object.freeze).
 */
class SecondaryPlaylistItem {
  /**
   * @param {object} params
   * @param {string} [params.id] - Stable identity key (explicit or auto-generated hash)
   * @param {string} params.text - News text content
   * @param {string} [params.category] - Badge category label
   * @param {number} [params.priority] - Priority weight (higher = first)
   * @param {string} [params.theme] - Visual theme key
   * @param {string} [params.status] - Item status ('ACTIVE', 'INACTIVE', 'DRAFT', 'EXPIRED')
   * @param {number} [params.rowIndex] - Original row index in CSV
   * @param {number} [params.sequence] - Sequence position index in sorted playlist
   * @param {string|null} [params.startsAt] - Future metadata: ISO start time
   * @param {string|null} [params.expiresAt] - Future metadata: ISO expiration time
   * @param {string} [params.region] - Future metadata: Region code
   * @param {string} [params.language] - Future metadata: Language code
   */
  constructor({
    id = null,
    text = '',
    category = 'TELANGANA',
    priority = 1,
    theme = 'default',
    status = ItemStatus.ACTIVE,
    rowIndex = 0,
    sequence = 0,
    startsAt = null,
    expiresAt = null,
    region = 'TELANGANA',
    language = 'te',
  } = {}) {
    const cleanText     = (text || '').trim().replace(/\s+/g, ' ');
    const cleanCategory = (category || 'TELANGANA').trim();

    // Stable Identity: use explicit ID or generate deterministic slug hash from category + text
    this.id = id ? String(id).trim() : this._generateStableId(cleanCategory, cleanText, rowIndex);

    this.text      = cleanText;
    this.category  = cleanCategory;
    this.priority  = typeof priority === 'number' && !isNaN(priority) ? priority : parseInt(priority, 10) || 1;
    this.theme     = (theme || 'default').trim().toLowerCase();
    this.status    = this._normalizeStatus(status);
    this.active    = (this.status === ItemStatus.ACTIVE);
    this.rowIndex  = typeof rowIndex === 'number' ? rowIndex : parseInt(rowIndex, 10) || 0;
    this.sequence  = typeof sequence === 'number' ? sequence : parseInt(sequence, 10) || 0;

    // Future Metadata Support (Phase 3 Domain Rule)
    this.startsAt  = startsAt ? String(startsAt).trim() : null;
    this.expiresAt = expiresAt ? String(expiresAt).trim() : null;
    this.region    = (region || 'TELANGANA').trim();
    this.language  = (language || 'te').trim().toLowerCase();

    // Rule 19: Immutable Domain
    Object.freeze(this);
  }

  /**
   * Check if item is valid and active for playlist rendering.
   * @returns {boolean}
   */
  isValid() {
    if (this.text.length === 0) return false;
    if (this.status !== ItemStatus.ACTIVE) return false;

    // Time window validation if startsAt/expiresAt are provided
    const now = new Date().getTime();
    if (this.startsAt) {
      const startTime = new Date(this.startsAt).getTime();
      if (!isNaN(startTime) && now < startTime) return false;
    }
    if (this.expiresAt) {
      const expireTime = new Date(this.expiresAt).getTime();
      if (!isNaN(expireTime) && now > expireTime) return false;
    }

    return true;
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Compute stable identity hash string from text + category.
   * @private
   */
  _generateStableId(category, text, rowIndex) {
    if (!text) return `item-row-${rowIndex}`;
    let hash = 0;
    const str = `${category}:${text}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return `item-${Math.abs(hash).toString(36)}`;
  }

  /**
   * Normalize string to ItemStatus enum value.
   * @private
   */
  _normalizeStatus(rawStatus) {
    if (!rawStatus) return ItemStatus.ACTIVE;
    const s = String(rawStatus).trim().toUpperCase();
    if (s === 'ACTIVE' || s === 'TRUE' || s === '1' || s === 'ENABLED') return ItemStatus.ACTIVE;
    if (s === 'DRAFT') return ItemStatus.DRAFT;
    if (s === 'EXPIRED') return ItemStatus.EXPIRED;
    return ItemStatus.INACTIVE;
  }
}

module.exports = {
  SecondaryPlaylistItem,
  ItemStatus,
};
