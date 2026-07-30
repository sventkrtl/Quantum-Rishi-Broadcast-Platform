'use strict';
/**
 * Unit tests for GoogleSheetService — Sprint 0.2 Data Pipeline
 * Tests parsing, validation, change detection, state management, and status snapshots.
 */
const assert             = require('assert');
const EventBus           = require('../../platform/event-bus/eventBus');
const GoogleSheetService = require('../../platform/services/googleSheetService');
const EventTypes         = require('../../platform/constants/EventTypes');

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

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// Helper: create a service instance without starting it
function makeService() {
  return new GoogleSheetService({
    eventBus: new EventBus(),
    sheetUrl: 'https://example.com/sheet.csv',
    refreshMs: 0,
  });
}

async function runAll() {
  console.log('\nGoogleSheetService — Sprint 0.2 Data Pipeline');

  test('parses simple CSV with header row', () => {
    const svc  = makeService();
    const csv  = 'name,city,score\nAlice,Hyderabad,95\nBob,Warangal,80';
    const rows = svc._parseCsv(csv);

    assert.strictEqual(rows.length, 2);
    assert.strictEqual(rows[0].name,  'Alice');
    assert.strictEqual(rows[0].city,  'Hyderabad');
    assert.strictEqual(rows[0].score, '95');
    assert.strictEqual(rows[1].name,  'Bob');
  });

  test('handles CRLF line endings', () => {
    const svc  = makeService();
    const csv  = 'a,b\r\n1,2\r\n3,4';
    const rows = svc._parseCsv(csv);
    assert.strictEqual(rows.length, 2);
    assert.strictEqual(rows[0].a, '1');
  });

  test('handles quoted fields containing commas', () => {
    const svc  = makeService();
    const csv  = 'title,location\n"Sports, News","Hyderabad, TS"';
    const rows = svc._parseCsv(csv);
    assert.strictEqual(rows[0].title,    'Sports, News');
    assert.strictEqual(rows[0].location, 'Hyderabad, TS');
  });

  test('handles escaped double-quotes inside quoted fields', () => {
    const svc  = makeService();
    const csv  = 'quote\n"He said ""hello"""';
    const rows = svc._parseCsv(csv);
    assert.strictEqual(rows[0].quote, 'He said "hello"');
  });

  test('returns empty array for header-only CSV', () => {
    const svc  = makeService();
    const rows = svc._parseCsv('name,city');
    assert.strictEqual(rows.length, 0);
  });

  test('returns empty array for empty string', () => {
    const svc  = makeService();
    assert.strictEqual(svc._parseCsv('').length, 0);
  });

  test('trims whitespace from header names', () => {
    const svc  = makeService();
    const csv  = ' name , city \nAlice,Hyd';
    const rows = svc._parseCsv(csv);
    assert.ok('name' in rows[0], 'Trimmed header "name" should be present');
    assert.ok('city' in rows[0], 'Trimmed header "city" should be present');
  });

  test('getRows / getDataset returns defensive copy', () => {
    const svc = makeService();
    const r1  = svc.getRows();
    const r2  = svc.getDataset();
    assert.notStrictEqual(r1, r2, 'Should return a new array each time');
  });

  test('getStatus includes dataset state fields (Sprint 0.2)', () => {
    const svc    = makeService();
    const status = svc.getStatus();
    assert.strictEqual(status.started,        false);
    assert.strictEqual(status.connected,      false);
    assert.strictEqual(status.sheetStatus,    'DISCONNECTED');
    assert.strictEqual(status.rowCount,       0);
    assert.strictEqual(status.datasetVersion, 0);
    assert.strictEqual(status.lastRefreshTime, null);
    assert.strictEqual(status.sheetUrl,       'https://example.com/sheet.csv');
  });

  test('stop() resets connected and sheetStatus to DISCONNECTED', () => {
    const svc = makeService();
    svc._connected = true;
    svc._sheetStatus = 'CONNECTED';
    svc.stop();
    assert.strictEqual(svc.getStatus().connected, false);
    assert.strictEqual(svc.getStatus().sheetStatus, 'DISCONNECTED');
  });

  test('constructor throws without eventBus', () => {
    assert.throws(
      () => new GoogleSheetService({ sheetUrl: 'https://x.com' }),
      /eventBus/
    );
  });

  test('constructor throws without sheetUrl', () => {
    assert.throws(
      () => new GoogleSheetService({ eventBus: new EventBus() }),
      /sheetUrl/
    );
  });

  // ── Data Pipeline State & Event Transition Tests (Mocked Fetch) ─────────────

  await testAsync('Data Pipeline Transition: Header Only -> platform.sheet.empty', async () => {
    const bus = new EventBus();
    const svc = new GoogleSheetService({ eventBus: bus, sheetUrl: 'https://example.com/sheet.csv' });
    let emptyEventEmitted = false;

    bus.subscribe(EventTypes.SHEET_EMPTY, (e) => {
      emptyEventEmitted = true;
      assert.strictEqual(e.payload.rowCount, 0);
    });

    // Mock fetch returning header only
    global.fetch = async () => ({
      ok: true,
      text: async () => 'Item,Description,Version'
    });

    await svc.refresh();

    assert.ok(emptyEventEmitted, 'platform.sheet.empty should be emitted');
    assert.strictEqual(svc.getStatus().connected, true);
    assert.strictEqual(svc.getStatus().sheetStatus, 'EMPTY');
    assert.strictEqual(svc.getStatus().rowCount, 0);
    assert.strictEqual(svc.getStatus().datasetVersion, 1);
  });

  await testAsync('Data Pipeline Transition: Header + Data Row -> platform.sheet.updated (version: 1)', async () => {
    const bus = new EventBus();
    const svc = new GoogleSheetService({ eventBus: bus, sheetUrl: 'https://example.com/sheet.csv' });
    let updatedEventEmitted = false;

    bus.subscribe(EventTypes.SHEET_UPDATED, (e) => {
      updatedEventEmitted = true;
      assert.strictEqual(e.payload.rowCount, 1);
      assert.strictEqual(e.payload.datasetVersion, 1);
      assert.strictEqual(e.payload.currentDataset[0].Item, 'Test1');
    });

    // Mock fetch returning header + 1 row
    global.fetch = async () => ({
      ok: true,
      text: async () => 'Item,Description,Version\nTest1,Hello World,1.0'
    });

    await svc.refresh();

    assert.ok(updatedEventEmitted, 'platform.sheet.updated should be emitted');
    assert.strictEqual(svc.getStatus().connected, true);
    assert.strictEqual(svc.getStatus().sheetStatus, 'UPDATED');
    assert.strictEqual(svc.getStatus().rowCount, 1);
    assert.strictEqual(svc.getStatus().datasetVersion, 1);
    assert.strictEqual(svc.getDataset().length, 1);
  });

  await testAsync('Data Pipeline Change Detection: Content Expansion -> datasetVersion increments (v1 -> v2)', async () => {
    const bus = new EventBus();
    const svc = new GoogleSheetService({ eventBus: bus, sheetUrl: 'https://example.com/sheet.csv' });

    // Step 1: Initial data (v1)
    global.fetch = async () => ({
      ok: true,
      text: async () => 'Item,Description,Version\nTest1,Hello World,1.0'
    });
    await svc.refresh();
    assert.strictEqual(svc.getStatus().datasetVersion, 1);
    assert.strictEqual(svc.getStatus().rowCount, 1);

    // Step 2: Same data (version stays v1, status becomes CONNECTED)
    await svc.refresh();
    assert.strictEqual(svc.getStatus().datasetVersion, 1);
    assert.strictEqual(svc.getStatus().sheetStatus, 'CONNECTED');

    // Step 3: Expanded data (version increments to v2, status becomes UPDATED)
    global.fetch = async () => ({
      ok: true,
      text: async () => 'Item,Description,Version\nTest1,Hello World,1.0\nTest2,Second Row,2.0'
    });
    await svc.refresh();
    assert.strictEqual(svc.getStatus().datasetVersion, 2);
    assert.strictEqual(svc.getStatus().rowCount, 2);
    assert.strictEqual(svc.getStatus().sheetStatus, 'UPDATED');
  });

  await testAsync('Data Pipeline Validation: HTML Error Response -> platform.sheet.failed', async () => {
    const bus = new EventBus();
    const svc = new GoogleSheetService({ eventBus: bus, sheetUrl: 'https://example.com/sheet.csv' });
    let failedEventEmitted = false;

    bus.subscribe(EventTypes.SHEET_FAILED, (e) => {
      failedEventEmitted = true;
      assert.ok(e.payload.error.includes('Received HTML'));
    });

    // Mock fetch returning Google HTML error page instead of CSV
    global.fetch = async () => ({
      ok: true,
      text: async () => '<!DOCTYPE html><html><body>Error</body></html>'
    });

    await svc.refresh();

    assert.ok(failedEventEmitted, 'platform.sheet.failed should be emitted for HTML responses');
    assert.strictEqual(svc.getStatus().connected, false);
    assert.strictEqual(svc.getStatus().sheetStatus, 'FAILED');
  });

  return { passed, failed };
}

module.exports = runAll();
