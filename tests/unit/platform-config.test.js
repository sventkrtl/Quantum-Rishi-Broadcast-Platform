const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const PlatformConfig = require('../../platform/config/PlatformConfig');

test('PlatformConfig - loads default configs and fallbacks', (t) => {
  const config = new PlatformConfig();
  assert.strictEqual(config.get('app', 'name'), 'Quantum Rishi Broadcast Platform');
  assert.strictEqual(config.get('app', 'milestone'), 'M1');
  assert.strictEqual(config.get('obs', 'width'), 1920);
  assert.strictEqual(config.get('graphics', 'canvasWidth'), 1920);
  assert.strictEqual(config.get('themes', 'activeTheme'), 'dark-broadcast');
  assert.ok(Array.isArray(config.get('shortcuts', 'shortcuts')));
});

test('PlatformConfig - handles non-existent config directory with fallbacks', (t) => {
  const config = new PlatformConfig(path.join(__dirname, 'non-existent-dir'));
  assert.strictEqual(config.get('app', 'id'), 'quantum-rishi-broadcast-platform');
  assert.strictEqual(config.get('environment', 'env'), 'development');
});
