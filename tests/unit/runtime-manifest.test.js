const test = require('node:test');
const assert = require('node:assert');
const RuntimeManifest = require('../../platform/version/RuntimeManifest');

test('RuntimeManifest - returns structured component version telemetry', (t) => {
  const manifest = new RuntimeManifest();
  const data = manifest.getManifest();

  assert.strictEqual(data.kernelVersion, '0.1.0-m1');
  assert.strictEqual(data.protocolVersion, '1.0.0');
  assert.strictEqual(data.configVersion, '1.0.0');
  assert.strictEqual(data.overlayRuntimeVersion, '0.1.0');
  assert.strictEqual(data.obsAdapterVersion, '0.1.0');
  assert.ok(data.buildTimestamp);
});
