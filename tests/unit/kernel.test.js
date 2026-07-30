'use strict';
/**
 * Unit tests for PlatformKernel lifecycle
 */
const assert        = require('assert');
const EventBus      = require('../../platform/event-bus/eventBus');
const PlatformKernel = require('../../platform/kernel/kernel');
const KernelStates  = require('../../platform/constants/KernelStates');
const EventTypes    = require('../../platform/constants/EventTypes');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\nPlatformKernel');

// Wrap all tests in an async IIFE so we can await testAsync calls
// in a CommonJS module (top-level await not available in CJS).
async function runAll() {
  test('initial state is BOOTING', () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    assert.strictEqual(kernel.getState().state, KernelStates.BOOTING);
  });

  await testAsync('start() transitions to RUNNING', async () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    await kernel.start();
    assert.strictEqual(kernel.getState().state, KernelStates.RUNNING);
  });

  await testAsync('start() emits booting, ready, running events in order', async () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    const events = [];

    bus.subscribe(EventTypes.KERNEL_BOOTING, (e) => events.push(e.type));
    bus.subscribe(EventTypes.KERNEL_READY,   (e) => events.push(e.type));
    bus.subscribe(EventTypes.KERNEL_RUNNING, (e) => events.push(e.type));

    await kernel.start();

    assert.deepStrictEqual(events, [
      EventTypes.KERNEL_BOOTING,
      EventTypes.KERNEL_READY,
      EventTypes.KERNEL_RUNNING,
    ]);
  });

  await testAsync('start() is idempotent when already RUNNING', async () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    let runCount = 0;

    bus.subscribe(EventTypes.KERNEL_RUNNING, () => runCount++);

    await kernel.start();
    await kernel.start(); // second call should be no-op

    assert.strictEqual(runCount, 1, 'RUNNING event should fire only once');
  });

  await testAsync('shutdown() transitions to STOPPED', async () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    await kernel.start();
    await kernel.shutdown();
    assert.strictEqual(kernel.getState().state, KernelStates.STOPPED);
  });

  await testAsync('shutdown() emits stopped event', async () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    let stoppedFired = false;

    bus.subscribe(EventTypes.KERNEL_STOPPED, () => { stoppedFired = true; });

    await kernel.start();
    await kernel.shutdown();

    assert.ok(stoppedFired, 'STOPPED event should have fired');
  });

  test('registerService stores and retrieves service', () => {
    const bus     = new EventBus();
    const kernel  = new PlatformKernel(bus);
    const service = { name: 'test' };

    kernel.registerService('testSvc', service);
    assert.strictEqual(kernel.getService('testSvc'), service);
  });

  test('registerService throws on non-string id', () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    assert.throws(() => kernel.registerService(123, {}), /string/);
  });

  test('registerRuntime stores and retrieves runtime', () => {
    const bus     = new EventBus();
    const kernel  = new PlatformKernel(bus);
    const runtime = { name: 'testRuntime' };

    kernel.registerRuntime('testRt', runtime);
    assert.strictEqual(kernel.getRuntime('testRt'), runtime);
  });

  test('getState includes uptime 0 before start', () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    const state  = kernel.getState();
    assert.strictEqual(state.uptime, 0);
  });

  await testAsync('getState uptime increases after start', async () => {
    const bus    = new EventBus();
    const kernel = new PlatformKernel(bus);
    await kernel.start();
    await new Promise(r => setTimeout(r, 50));
    const state  = kernel.getState();
    assert.ok(state.uptime > 0, 'Uptime should be > 0');
  });

  return { passed, failed };
}

module.exports = runAll();
