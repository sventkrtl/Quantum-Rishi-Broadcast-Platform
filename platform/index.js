const EventBus = require('./event-bus');
const Kernel = require('./kernel');
const Runtime = require('./runtime');

/**
 * Start the platform and return the kernel, runtime, and event bus instances.
 * @returns {{
 *   kernel: Kernel,
 *   runtime: Runtime,
 *   eventBus: EventBus
 * }} The platform instances
 */
function startPlatform() {
  const eventBus = new EventBus();
  const kernel = new Kernel(eventBus);
  const runtime = new Runtime(eventBus);
  
  return {
    kernel,
    runtime,
    eventBus
  };
}

module.exports = {
  startPlatform,
  EventBus,
  Kernel,
  Runtime
};