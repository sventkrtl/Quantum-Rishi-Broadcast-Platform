const test = require('node:test');
const assert = require('node:assert');
const PlatformKernel = require('../../platform/kernel/PlatformKernel');

test('M1 Platform Kernel Integration - full end-to-end service orchestration', async (t) => {
  const kernel = new PlatformKernel();

  // 1. Initial State Check
  assert.strictEqual(kernel.getHealthState(), 'BOOTING');

  // 2. Boot & Start
  await kernel.boot();
  assert.strictEqual(kernel.getHealthState(), 'READY');

  await kernel.start();
  assert.strictEqual(kernel.getHealthState(), 'RUNNING');

  // 3. Endpoint Checks
  const status = kernel.endpoints.handleStatus();
  assert.strictEqual(status.body.status, 'RUNNING');

  const ready = kernel.endpoints.handleReady();
  assert.strictEqual(ready.statusCode, 200);
  assert.strictEqual(ready.body.ready, true);

  const health = kernel.endpoints.handleHealth();
  assert.strictEqual(health.statusCode, 200);
  assert.strictEqual(health.body.status, 'RUNNING');
  assert.ok(health.body.components['platform-kernel']);

  const version = kernel.endpoints.handleVersion();
  assert.strictEqual(version.body.kernelVersion, '0.1.0-m1');
  assert.strictEqual(version.body.protocolVersion, '1.0.0');

  // 4. Capability Check
  assert.strictEqual(kernel.capabilities.hasCapability('lifecycle'), true);
  assert.strictEqual(kernel.capabilities.hasCapability('config'), true);

  // 5. Diagnostics Logging
  kernel.diagnostics.log('INFO', 'Test diagnostics trace');
  kernel.diagnostics.traceEvent('TEST_EVENT', { data: 123 });
  const diagReport = kernel.diagnostics.getReport();
  assert.ok(diagReport.logCount > 0);

  // 6. Stop
  await kernel.stop();
  assert.strictEqual(kernel.getHealthState(), 'STOPPED');
});
