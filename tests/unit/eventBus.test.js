'use strict';
/**
 * Unit tests for EventBus
 * Uses Node.js built-in assert — no test framework required.
 */
const assert  = require('assert');
const EventBus = require('../../platform/event-bus/eventBus');

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

console.log('\nEventBus');

test('subscribe and receive a published event', () => {
  const bus = new EventBus();
  let received = null;

  bus.subscribe('test.event', (envelope) => { received = envelope; });
  bus.publish({ type: 'test.event', source: 'test', payload: { value: 42 } });

  assert.ok(received, 'Should have received an event');
  assert.strictEqual(received.type, 'test.event');
  assert.strictEqual(received.payload.value, 42);
});

test('auto-stamps id, timestamp, version when missing', () => {
  const bus = new EventBus();
  let received = null;

  bus.subscribe('test.stamp', (e) => { received = e; });
  bus.publish({ type: 'test.stamp', source: 'test', payload: {} });

  assert.ok(received.id,        'Should have id');
  assert.ok(received.timestamp, 'Should have timestamp');
  assert.ok(received.version,   'Should have version');
});

test('multiple subscribers all receive the event', () => {
  const bus = new EventBus();
  const results = [];

  bus.subscribe('multi.event', (e) => results.push('A'));
  bus.subscribe('multi.event', (e) => results.push('B'));
  bus.publish({ type: 'multi.event', source: 'test', payload: {} });

  assert.deepStrictEqual(results.sort(), ['A', 'B']);
});

test('unsubscribe stops receiving events', () => {
  const bus = new EventBus();
  let count = 0;

  const cb = () => count++;
  const unsub = bus.subscribe('unsub.event', cb);
  bus.publish({ type: 'unsub.event', source: 'test', payload: {} });
  unsub();
  bus.publish({ type: 'unsub.event', source: 'test', payload: {} });

  assert.strictEqual(count, 1, 'Should only receive event before unsubscribe');
});

test('returns unsubscribe function from subscribe()', () => {
  const bus = new EventBus();
  const unsub = bus.subscribe('ret.event', () => {});
  assert.strictEqual(typeof unsub, 'function', 'Should return a function');
});

test('throws when publishing without source', () => {
  const bus = new EventBus();
  assert.throws(
    () => bus.publish({ type: 'bad.event', payload: {} }),
    /source/i,
    'Should throw about missing source'
  );
});

test('throws when publishing without type', () => {
  const bus = new EventBus();
  assert.throws(
    () => bus.publish({ source: 'test', payload: {} }),
    /type/i
  );
});

test('getSubscriberCount returns correct count', () => {
  const bus = new EventBus();
  assert.strictEqual(bus.getSubscriberCount('x.event'), 0);
  bus.subscribe('x.event', () => {});
  assert.strictEqual(bus.getSubscriberCount('x.event'), 1);
  bus.subscribe('x.event', () => {});
  assert.strictEqual(bus.getSubscriberCount('x.event'), 2);
});

test('subscriber error does not crash other subscribers', () => {
  const bus = new EventBus();
  let secondCalled = false;

  // Temporarily suppress console.error for this intentional-error test
  const origError = console.error;
  console.error = () => {};

  bus.subscribe('err.event', () => { throw new Error('intentional'); });
  bus.subscribe('err.event', () => { secondCalled = true; });
  bus.publish({ type: 'err.event', source: 'test', payload: {} });

  console.error = origError; // restore

  assert.ok(secondCalled, 'Second subscriber should still be called');
});

module.exports = { passed, failed };
