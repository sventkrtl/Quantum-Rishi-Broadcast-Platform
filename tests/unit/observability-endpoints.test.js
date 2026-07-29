const test = require('node:test');
const assert = require('node:assert');
const PlatformKernel = require('../../platform/kernel/PlatformKernel');
const ObservabilityEndpoints = require('../../platform/monitoring/ObservabilityEndpoints');

test('ObservabilityEndpoints - handles /status, /ready, /health, /version', async (t) => {
  const kernel = new PlatformKernel();
  const endpoints = new ObservabilityEndpoints(kernel);

  // Initial BOOTING state
  let readyRes = endpoints.handleReady();
  assert.strictEqual(readyRes.statusCode, 503);
  assert.strictEqual(readyRes.body.ready, false);

  let statusRes = endpoints.handleStatus();
  assert.strictEqual(statusRes.statusCode, 200);
  assert.strictEqual(statusRes.body.status, 'BOOTING');

  // Boot kernel -> READY
  await kernel.boot();
  statusRes = endpoints.handleStatus();
  assert.strictEqual(statusRes.body.status, 'READY');

  readyRes = endpoints.handleReady();
  assert.strictEqual(readyRes.statusCode, 200);
  assert.strictEqual(readyRes.body.ready, true);

  const healthRes = endpoints.handleHealth();
  assert.strictEqual(healthRes.statusCode, 200);
  assert.strictEqual(healthRes.body.status, 'READY');

  const versionRes = endpoints.handleVersion();
  assert.strictEqual(versionRes.statusCode, 200);
  assert.strictEqual(versionRes.body.kernelVersion, '0.1.0-m1');
});
