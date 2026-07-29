const test = require('node:test');
const assert = require('node:assert');
const PlatformKernel = require('../../platform/kernel/PlatformKernel');

test('Runtime Stress Test - 10,000 continuous event dispatches and frame cycles', async (t) => {
  const kernel = new PlatformKernel();
  await kernel.boot();
  await kernel.start();

  const initialMemory = kernel.memMonitor.takeSnapshot().heapUsedMb;

  // Simulate 10,000 rapid event dispatches
  for (let i = 0; i < 10000; i++) {
    const prio = i % 10 === 0 ? 'CRITICAL' : (i % 3 === 0 ? 'HIGH' : 'NORMAL');
    kernel.eventQueue.enqueue(`STRESS_EVENT_${i}`, { index: i }, prio);

    // Process in batches every 50 events
    if (i % 50 === 0) {
      const batch = kernel.eventQueue.dequeueBatch(50);
      for (const item of batch) {
        kernel.diagnostics.traceEvent(item.event, item.payload);
      }
      kernel.frameScheduler.tick();
    }

    // Acquire and release transient resources
    const resId = `temp-res-${i % 100}`;
    kernel.resources.acquire(resId, { id: i }, (obj) => {
      // Disposer callback
    });
    if (i % 10 === 0) {
      kernel.resources.release(resId);
    }
  }

  // Dequeue remaining events
  while (kernel.eventQueue.getTotalQueueSize() > 0) {
    kernel.eventQueue.dequeueBatch(100);
  }

  // Purge resources
  kernel.resources.disposeAll();

  const finalMemory = kernel.memMonitor.takeSnapshot().heapUsedMb;
  const memoryDeltaMb = Math.abs(finalMemory - initialMemory);

  const snapshot = kernel.getHealthSnapshot();
  assert.strictEqual(snapshot.status, 'RUNNING');
  assert.strictEqual(snapshot.eventQueue.queueSize, 0);
  assert.strictEqual(snapshot.resources.activeResourceCount, 0);
  assert.ok(memoryDeltaMb < 15, `Memory drift excessive: ${memoryDeltaMb} MB`);

  const startupRes = kernel.endpoints.handleStartup();
  assert.strictEqual(startupRes.statusCode, 200);
  assert.strictEqual(startupRes.body.started, true);

  await kernel.stop();
  assert.strictEqual(kernel.getHealthState(), 'STOPPED');
});
