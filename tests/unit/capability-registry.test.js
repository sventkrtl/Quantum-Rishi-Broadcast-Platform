const test = require('node:test');
const assert = require('node:assert');
const CapabilityRegistry = require('../../platform/registry/CapabilityRegistry');

test('CapabilityRegistry - registers and validates module declarations', (t) => {
  const registry = new CapabilityRegistry('0.1.0-m1');

  assert.throws(() => {
    registry.registerModule({ id: 'bad-mod' });
  }, /missing required field: supportsVersion/);

  const mod1 = {
    id: 'base-module',
    supportsVersion: '^0.1.0',
    requiresKernel: '0.1.0-m1',
    dependencies: [],
    capabilities: ['base-feature']
  };

  assert.strictEqual(registry.registerModule(mod1), true);
  assert.strictEqual(registry.hasCapability('base-feature'), true);
  assert.strictEqual(registry.hasCapability('non-existent'), false);
});

test('CapabilityRegistry - checks missing dependencies', (t) => {
  const registry = new CapabilityRegistry('0.1.0-m1');
  const modWithDep = {
    id: 'dependent-module',
    supportsVersion: '^0.1.0',
    requiresKernel: '0.1.0-m1',
    dependencies: ['missing-dep'],
    capabilities: ['extended-feature']
  };

  assert.throws(() => {
    registry.registerModule(modWithDep);
  }, /missing dependency 'missing-dep'/);
});
