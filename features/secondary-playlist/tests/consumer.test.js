'use strict';

/**
 * Unit tests for SecondaryPlaylistConsumer — Phase 2 Consumer Boundary Implementation
 */

const assert                    = require('assert');
const SecondaryPlaylistConsumer = require('../consumer/SecondaryPlaylistConsumer');
const PlaylistModel             = require('../models/PlaylistModel');
const SecondaryPlaylistItem     = require('../models/SecondaryPlaylistItem');
const EventTypes                = require('../contracts/EventTypes');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

function runAll() {
  console.log('\nSecondaryPlaylistConsumer — Phase 2 Consumer Boundary Tests');

  test('normalizes raw CSV rows with header aliases', () => {
    const consumer = new SecondaryPlaylistConsumer();
    const payload = {
      datasetVersion: 1,
      lastRefreshTime: '2026-07-30T10:00:00Z',
      currentDataset: [
        { headline: '  కేంద్ర ప్రభుత్వం  కీలక  నిర్ణయం  ', badge: ' తాజా వార్తలు ', priority: '2', theme: 'gold' },
        { news: 'తెలంగాణలో భారీ వర్షాలు', category: '  హైదరాబాద్  ' }
      ]
    };

    const model = consumer.consumePayload(payload);

    assert.ok(model instanceof PlaylistModel);
    assert.strictEqual(model.datasetVersion, 1);
    assert.strictEqual(model.totalRows, 2);
    assert.strictEqual(model.getItemCount(), 2);

    const items = model.getItems();
    assert.strictEqual(items[0].text, 'కేంద్ర ప్రభుత్వం కీలక నిర్ణయం');
    assert.strictEqual(items[0].category, 'తాజా వార్తలు');
    assert.strictEqual(items[0].priority, 2);
    assert.strictEqual(items[0].theme, 'gold');

    assert.strictEqual(items[1].text, 'తెలంగాణలో భారీ వర్షాలు');
    assert.strictEqual(items[1].category, 'హైదరాబాద్');
    assert.strictEqual(items[1].priority, 1); // default
  });

  test('filters out inactive or empty rows', () => {
    const consumer = new SecondaryPlaylistConsumer();
    const payload = {
      datasetVersion: 2,
      currentDataset: [
        { news: 'Valid News 1', status: 'active' },
        { news: '', status: 'active' },                // empty text
        { news: 'Draft News', status: 'draft' },        // inactive status
        { news: 'Disabled News', status: 'false' },     // inactive status
        { news: 'Valid News 2', status: '1' }
      ]
    };

    const model = consumer.consumePayload(payload);

    assert.strictEqual(model.totalRows, 5);
    assert.strictEqual(model.getItemCount(), 2);
    assert.strictEqual(model.getItems()[0].text, 'Valid News 1');
    assert.strictEqual(model.getItems()[1].text, 'Valid News 2');
  });

  test('handles platform.sheet.updated event envelope', () => {
    const consumer = new SecondaryPlaylistConsumer();
    let notifiedModel = null;
    consumer.setUpdateListener((m) => { notifiedModel = m; });

    const event = {
      type: 'platform.sheet.updated',
      source: 'GoogleSheetService',
      payload: {
        datasetVersion: 3,
        lastRefreshTime: '2026-07-30T10:05:00Z',
        currentDataset: [{ news: 'Breaking Event', category: 'BREAKING' }]
      }
    };

    const model = consumer.handleEvent(event);

    assert.ok(model !== null);
    assert.strictEqual(model.datasetVersion, 3);
    assert.strictEqual(notifiedModel, model);
    assert.strictEqual(model.getItems()[0].text, 'Breaking Event');
  });

  test('ignores irrelevant event types', () => {
    const consumer = new SecondaryPlaylistConsumer();
    const event = { type: 'platform.kernel.running', payload: {} };
    const res = consumer.handleEvent(event);
    assert.strictEqual(res, null);
  });

  test('Rule 17 Purity Check: Consumer exposes no DOM, Timeline, or Rendering methods', () => {
    const consumer = new SecondaryPlaylistConsumer();
    assert.strictEqual(typeof consumer.render, 'undefined', 'Consumer must not have render()');
    assert.strictEqual(typeof consumer.animate, 'undefined', 'Consumer must not have animate()');
    assert.strictEqual(typeof consumer.play, 'undefined', 'Consumer must not have play()');
    assert.strictEqual(typeof consumer.dom, 'undefined', 'Consumer must not access DOM');
  });

  return { passed, failed };
}

module.exports = runAll();

if (require.main === module) {
  runAll();
}
