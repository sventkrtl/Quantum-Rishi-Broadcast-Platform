const test = require('node:test');
const assert = require('node:assert');
const PlatformKernel = require('../../platform/kernel/PlatformKernel');
const ErrorRecoverySystem = require('../../platform/recovery/ErrorRecoverySystem');

test('ErrorRecoverySystem - isolates failures, attempts retries, and degrades kernel state', async (t) => {
  const kernel = new PlatformKernel();
  await kernel.start();
  const recovery = new ErrorRecoverySystem(kernel, { maxRetries: 2 });

  const res1 = recovery.handleComponentError('test-comp', new Error('Fail 1'));
  assert.strictEqual(res1.action, 'RETRY');
  assert.strictEqual(res1.attempt, 1);
  assert.strictEqual(kernel.getHealthState(), 'DEGRADED');

  const res2 = recovery.handleComponentError('test-comp', new Error('Fail 2'));
  assert.strictEqual(res2.action, 'RETRY');
  assert.strictEqual(res2.attempt, 2);

  const res3 = recovery.handleComponentError('test-comp', new Error('Fail 3'));
  assert.strictEqual(res3.action, 'FAIL_SAFE');
  assert.strictEqual(res3.fatal, true);
  assert.strictEqual(kernel.getHealthState(), 'ERROR');
});
