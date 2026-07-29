const test = require('node:test');
const assert = require('node:assert');
const EventQueueOptimizer = require('../../platform/events/EventQueueOptimizer');

test('EventQueueOptimizer - prioritizes CRITICAL events and handles batching', (t) => {
  const optimizer = new EventQueueOptimizer({ maxQueueSize: 100 });

  optimizer.enqueue('NORMAL_EVENT_1', { data: 1 }, 'NORMAL');
  optimizer.enqueue('CRITICAL_EVENT_1', { data: 999 }, 'CRITICAL');
  optimizer.enqueue('HIGH_EVENT_1', { data: 50 }, 'HIGH');

  assert.strictEqual(optimizer.getTotalQueueSize(), 3);

  const batch = optimizer.dequeueBatch(2);
  assert.strictEqual(batch.length, 2);
  assert.strictEqual(batch[0].event, 'CRITICAL_EVENT_1');
  assert.strictEqual(batch[1].event, 'HIGH_EVENT_1');
  assert.strictEqual(optimizer.getTotalQueueSize(), 1);
});
