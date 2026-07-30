'use strict';

/**
 * Secondary Playlist Feature Event Types (Rule 6)
 *
 * Feature packages publish strictly within their own namespace (secondary-playlist.*).
 * Platform events (platform.*) are subscribed to, never published by features.
 */
module.exports = Object.freeze({
  PLAYLIST_UPDATED: 'secondary-playlist.updated',
  PLAYLIST_EMPTY:   'secondary-playlist.empty',
});
