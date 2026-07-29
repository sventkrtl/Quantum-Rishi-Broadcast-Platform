const test = require('node:test');
const assert = require('node:assert');
const PerformanceMonitor = require('../../platform/monitoring/PerformanceMonitor');

test('PerformanceMonitor - calculates FPS and frame durations', (t) => {
  const monitor = new PerformanceMonitor({ fpsThreshold: 45 });

  for (let i = 0; i < 60; i++) {
    monitor.recordFrame(16.6);
  }

  const metrics = monitor.getMetrics();
  assert.strictEqual(metrics.fpsThreshold, 45);
  assert.strictEqual(metrics.averageFrameDurationMs, 16.6);
  assert.strictEqual(metrics.minFrameDurationMs, 16.6);
  assert.strictEqual(metrics.maxFrameDurationMs, 16.6);
});
