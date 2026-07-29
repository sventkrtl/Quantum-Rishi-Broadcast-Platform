const test = require('node:test');
const assert = require('node:assert');
const MemoryMonitor = require('../../platform/monitoring/MemoryMonitor');

test('MemoryMonitor - takes snapshots and evaluates memory trends', (t) => {
  const monitor = new MemoryMonitor();
  const snap1 = monitor.takeSnapshot();
  const snap2 = monitor.takeSnapshot();

  assert.ok(snap1.heapUsedMb >= 0);
  assert.ok(snap2.heapTotalMb >= 0);

  const metrics = monitor.getMetrics();
  assert.ok(metrics.latest);
  assert.strictEqual(typeof metrics.leakAnalysis.leakDetected, 'boolean');
});
