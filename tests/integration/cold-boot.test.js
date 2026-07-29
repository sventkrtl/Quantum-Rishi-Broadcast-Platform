const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const PlatformKernel = require('../../platform/kernel/PlatformKernel');

test('Cold Boot Integration Test - starts with empty config dir, applies fallbacks, and boots healthy', async (t) => {
  const emptyConfigDir = path.join(__dirname, '../fixtures/empty-config-dir');
  const kernel = new PlatformKernel({ configDir: emptyConfigDir });

  assert.strictEqual(kernel.getHealthState(), 'BOOTING');

  // Verify fallback config applied
  assert.strictEqual(kernel.config.get('app', 'name'), 'Quantum Rishi Broadcast Platform');
  assert.strictEqual(kernel.config.get('obs', 'width'), 1920);
  assert.strictEqual(kernel.config.get('graphics', 'canvasWidth'), 1920);

  // Boot kernel
  await kernel.boot();
  assert.strictEqual(kernel.getHealthState(), 'READY');

  // Start kernel
  await kernel.start();
  assert.strictEqual(kernel.getHealthState(), 'RUNNING');

  const snapshot = kernel.getHealthSnapshot();
  assert.strictEqual(snapshot.status, 'RUNNING');
  assert.strictEqual(snapshot.components['platform-kernel'].available, true);

  const readyRes = kernel.endpoints.handleReady();
  assert.strictEqual(readyRes.statusCode, 200);
  assert.strictEqual(readyRes.body.ready, true);

  await kernel.stop();
  assert.strictEqual(kernel.getHealthState(), 'STOPPED');
});
