const test = require('node:test');
const assert = require('node:assert');
const FrameScheduler = require('../../platform/runtime/FrameScheduler');

test('FrameScheduler - manages 60 FPS clock ticks and metrics', (t) => {
  const scheduler = new FrameScheduler({ targetFps: 60 });
  let tickCount = 0;

  scheduler.addCallback((deltaMs) => {
    tickCount++;
    assert.ok(deltaMs >= 0);
  });

  scheduler.tick();
  scheduler.tick();

  const metrics = scheduler.getMetrics();
  assert.strictEqual(metrics.targetFps, 60);
  assert.strictEqual(metrics.frameCount, 2);
  assert.strictEqual(tickCount, 2);
});
