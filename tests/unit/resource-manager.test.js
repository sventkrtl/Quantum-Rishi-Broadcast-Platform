const test = require('node:test');
const assert = require('node:assert');
const ResourceManager = require('../../platform/runtime/ResourceManager');

test('ResourceManager - tracks, releases, and disposes resources', (t) => {
  const manager = new ResourceManager();
  let disposedCount = 0;

  const dummyObject = { name: 'canvas-context' };
  manager.acquire('res-1', dummyObject, () => {
    disposedCount++;
  });

  assert.strictEqual(manager.getMetrics().activeResourceCount, 1);
  assert.strictEqual(manager.release('res-1'), true);
  assert.strictEqual(disposedCount, 1);
  assert.strictEqual(manager.getMetrics().activeResourceCount, 0);

  // Test disposeAll
  manager.acquire('res-2', { name: 'timer' }, () => disposedCount++);
  manager.acquire('res-3', { name: 'listener' }, () => disposedCount++);
  assert.strictEqual(manager.disposeAll(), 2);
  assert.strictEqual(disposedCount, 3);
});
