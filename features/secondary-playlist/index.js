'use strict';

/**
 * Secondary Playlist Feature Package — Public Entry Point (Rule 15)
 *
 * Single Public Entry Point for the Secondary Playlist (Continuous Crawl) feature.
 * External platform or overlay code must import this feature exclusively via this file.
 */

const SecondaryPlaylistConsumer         = require('./consumer/SecondaryPlaylistConsumer');
const PlaylistModel                     = require('./models/PlaylistModel');
const { SecondaryPlaylistItem, ItemStatus } = require('./models/SecondaryPlaylistItem');
const EventTypes                        = require('./contracts/EventTypes');

module.exports = {
  name: 'SecondaryPlaylistFeature',
  version: '0.3.0-domain-model',
  description: 'Reference Feature Package for Secondary Playlist Continuous Crawl',
  SecondaryPlaylistConsumer,
  PlaylistModel,
  SecondaryPlaylistItem,
  ItemStatus,
  EventTypes,
};
