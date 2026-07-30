'use strict';

/**
 * Unit tests for Phase 3 — Domain Model Construction (Validation 2)
 * Tests Phase 3 Domain Rules, Ordering Rules, Immutability, Stable IDs, and Metadata Support.
 */

const assert                                 = require('assert');
const { SecondaryPlaylistItem, ItemStatus } = require('../models/SecondaryPlaylistItem');
const PlaylistModel                          = require('../models/PlaylistModel');
const SecondaryPlaylistConsumer              = require('../consumer/SecondaryPlaylistConsumer');

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
  console.log('\nSecondaryPlaylist Domain — Phase 3 Domain Model Construction Tests');

  test('Rule 18: Pure JS Domain Model has zero dependency on DOM, window, CSS, Timeline, or Renderer', () => {
    const item = new SecondaryPlaylistItem({ text: 'Pure Domain Item', category: 'NEWS' });
    const model = new PlaylistModel({ items: [item] });

    assert.strictEqual(typeof global.window, 'undefined');
    assert.strictEqual(typeof global.document, 'undefined');
    assert.strictEqual(typeof model.render, 'undefined');
    assert.strictEqual(typeof model.animate, 'undefined');
    assert.strictEqual(typeof model.play, 'undefined');
  });

  test('Rule 19: Immutable Domain — Object.isFrozen for model and items', () => {
    const item  = new SecondaryPlaylistItem({ text: 'Immutable Item' });
    const model = new PlaylistModel({ datasetVersion: 1, items: [item] });

    assert.ok(Object.isFrozen(item), 'PlaylistItem must be frozen');
    assert.ok(Object.isFrozen(model), 'PlaylistModel must be frozen');
    assert.ok(Object.isFrozen(model.items), 'items array must be frozen');

    // Attempt mutation should throw in strict mode
    assert.throws(() => { item.text = 'Mutated'; }, TypeError);
    assert.throws(() => { model.datasetVersion = 99; }, TypeError);
  });

  test('Stable Identity: Generates deterministic slug hash from category and text when explicit ID omitted', () => {
    const item1 = new SecondaryPlaylistItem({ text: 'క్రీడలు వార్తలు', category: 'SPORTS', rowIndex: 0 });
    const item2 = new SecondaryPlaylistItem({ text: 'క్రీడలు వార్తలు', category: 'SPORTS', rowIndex: 5 });
    const item3 = new SecondaryPlaylistItem({ id: 'custom-id-123', text: 'క్రీడలు వార్తలు' });

    assert.ok(item1.id.startsWith('item-'));
    assert.strictEqual(item1.id, item2.id, 'Identical text + category should generate stable identical hash ID');
    assert.strictEqual(item3.id, 'custom-id-123', 'Explicit ID should be preserved');
  });

  test('Ordering Rules: Priority descending -> RowIndex ascending -> Sequence 1-indexed assignment', () => {
    const i1 = new SecondaryPlaylistItem({ id: '1', text: 'Low priority row 0', priority: 1, rowIndex: 0 });
    const i2 = new SecondaryPlaylistItem({ id: '2', text: 'High priority row 1', priority: 5, rowIndex: 1 });
    const i3 = new SecondaryPlaylistItem({ id: '3', text: 'High priority row 2', priority: 5, rowIndex: 2 });
    const i4 = new SecondaryPlaylistItem({ id: '4', text: 'Medium priority row 3', priority: 3, rowIndex: 3 });

    const model = new PlaylistModel({ items: [i1, i2, i3, i4] });
    const sorted = model.getItems();

    assert.strictEqual(sorted.length, 4);
    assert.strictEqual(sorted[0].id, '2'); // Priority 5, row 1
    assert.strictEqual(sorted[0].sequence, 1);

    assert.strictEqual(sorted[1].id, '3'); // Priority 5, row 2
    assert.strictEqual(sorted[1].sequence, 2);

    assert.strictEqual(sorted[2].id, '4'); // Priority 3, row 3
    assert.strictEqual(sorted[2].sequence, 3);

    assert.strictEqual(sorted[3].id, '1'); // Priority 1, row 0
    assert.strictEqual(sorted[3].sequence, 4);
  });

  test('Status State Machine: Filters out INACTIVE, DRAFT, and EXPIRED items', () => {
    const activeItem   = new SecondaryPlaylistItem({ text: 'Active News', status: ItemStatus.ACTIVE });
    const draftItem    = new SecondaryPlaylistItem({ text: 'Draft News', status: ItemStatus.DRAFT });
    const inactiveItem = new SecondaryPlaylistItem({ text: 'Inactive News', status: ItemStatus.INACTIVE });
    const expiredItem  = new SecondaryPlaylistItem({ text: 'Expired News', status: ItemStatus.EXPIRED });

    const model = new PlaylistModel({ items: [activeItem, draftItem, inactiveItem, expiredItem] });

    assert.strictEqual(model.totalRows, 0); // items filtered before constructor length count
    assert.strictEqual(model.getItemCount(), 1);
    assert.strictEqual(model.getItems()[0].text, 'Active News');
  });

  test('Future Metadata Support: startsAt, expiresAt, region, language', () => {
    const item = new SecondaryPlaylistItem({
      text: 'Regional Headline',
      category: 'WARANGAL',
      startsAt: '2026-07-01T00:00:00Z',
      expiresAt: '2026-12-31T23:59:59Z',
      region: 'WARANGAL',
      language: 'te',
    });

    assert.strictEqual(item.region, 'WARANGAL');
    assert.strictEqual(item.language, 'te');
    assert.strictEqual(item.startsAt, '2026-07-01T00:00:00Z');
    assert.strictEqual(item.expiresAt, '2026-12-31T23:59:59Z');
    assert.strictEqual(item.isValid(), true);
  });

  test('Domain Queries: getItemById, getItemBySequence, filterByTheme, filterByCategory', () => {
    const consumer = new SecondaryPlaylistConsumer();
    const payload = {
      datasetVersion: 1,
      currentDataset: [
        { headline: 'News 1', badge: 'TELANGANA', theme: 'default', priority: 2, id: 'n1' },
        { headline: 'News 2', badge: 'SPORTS', theme: 'gold', priority: 5, id: 'n2' },
        { headline: 'News 3', badge: 'TELANGANA', theme: 'default', priority: 1, id: 'n3' },
      ]
    };

    const model = consumer.consumePayload(payload);

    assert.strictEqual(model.getItemById('n2').text, 'News 2');
    assert.strictEqual(model.getItemBySequence(1).id, 'n2'); // Highest priority first

    const goldModel = model.filterByTheme('gold');
    assert.strictEqual(goldModel.getItemCount(), 1);
    assert.strictEqual(goldModel.getItems()[0].id, 'n2');

    const sportsModel = model.filterByCategory('SPORTS');
    assert.strictEqual(sportsModel.getItemCount(), 1);
    assert.strictEqual(sportsModel.getItems()[0].id, 'n2');
  });

  return { passed, failed };
}

module.exports = runAll();

if (require.main === module) {
  runAll();
}
