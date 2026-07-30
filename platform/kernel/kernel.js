const EventBus = require('../event-bus');
const EventTypes = require('../constants/EventTypes');
const KernelStates = require('../constants/KernelStates');

class PlatformKernel {
  /**
   * @param {EventBus} [eventBus] - An optional event bus instance. If not provided, a new one will be created.
   */
  constructor(eventBus) {
    this.state = KernelStates.BOOTING; // Start in BOOTING state
    this.eventBus = eventBus || new EventBus();
    this.services = new Map();
    this.runtimes = new Map();
    this.startTime = null;
  }

  /**
   * Start the platform kernel
   * @returns {Promise<void>}
   */
  async start() {
    if (this.state === KernelStates.RUNNING) {
      return;
    }

    this.startTime = Date.now();
    
    // Emit booting event
    this.eventBus.publish({
      type: EventTypes.KERNEL_BOOTING,
      source: 'PlatformKernel',
      payload: {
        previousState: this.state,
        currentState: this.state,
        timestamp: this.startTime
      }
    });

    // Simulate async initialization
    await new Promise(resolve => setTimeout(resolve, 100));

    // Transition to READY
    this.state = KernelStates.READY;
    this.eventBus.publish({
      type: EventTypes.KERNEL_READY,
      source: 'PlatformKernel',
      payload: {
        previousState: KernelStates.BOOTING,
        currentState: this.state,
        timestamp: Date.now()
      }
    });

    // Simulate async service/runtime initialization
    await new Promise(resolve => setTimeout(resolve, 100));

    // Transition to RUNNING
    this.state = KernelStates.RUNNING;
    this.eventBus.publish({
      type: EventTypes.KERNEL_RUNNING,
      source: 'PlatformKernel',
      payload: {
        previousState: KernelStates.READY,
        currentState: this.state,
        timestamp: Date.now(),
        uptime: Date.now() - this.startTime
      }
    });
  }

  /**
   * Shutdown the platform kernel
   * @returns {Promise<void>}
   */
  async shutdown() {
    if (this.state === KernelStates.STOPPED) {
      return;
    }

    // Transition to ERROR state if shutting down unexpectedly
    if (this.state !== KernelStates.STOPPED) {
      this.state = KernelStates.ERROR;
      this.eventBus.publish({
        type: EventTypes.KERNEL_ERROR,
        source: 'PlatformKernel',
        payload: {
          previousState: this.state === KernelStates.ERROR ? this.state : KernelStates.RUNNING,
          currentState: this.state,
          timestamp: Date.now(),
          error: 'Shutdown initiated'
        }
      });
    }

    // Stop all runtimes
    for (const [id, runtime] of this.runtimes) {
      if (runtime && typeof runtime.stop === 'function') {
        try {
          await runtime.stop();
        } catch (error) {
          console.error(`Error stopping runtime ${id}:`, error);
        }
      }
    }
    this.runtimes.clear();

    // Stop all services
    for (const [id, service] of this.services) {
      if (service && typeof service.stop === 'function') {
        try {
          await service.stop();
        } catch (error) {
          console.error(`Error stopping service ${id}:`, error);
        }
      }
    }
    this.services.clear();

    // Transition to STOPPED
    this.state = KernelStates.STOPPED;
    this.eventBus.publish({
      type: EventTypes.KERNEL_STOPPED,
      source: 'PlatformKernel',
      payload: {
        previousState: this.state === KernelStates.ERROR ? KernelStates.ERROR : KernelStates.RUNNING,
        currentState: this.state,
        timestamp: Date.now(),
        uptime: this.startTime ? Date.now() - this.startTime : 0
      }
    });
  }

  /**
   * Register a service with the kernel
   * @param {string} id - The service ID
   * @param {Object} service - The service object
   */
  registerService(id, service) {
    if (!id || typeof id !== 'string') {
      throw new Error('Service ID must be a string');
    }
    if (!service || typeof service !== 'object') {
      throw new Error('Service must be an object');
    }
    
    this.services.set(id, service);
    
    // Notify that a service was registered
    this.eventBus.publish({
      type: 'platform.kernel.serviceRegistered',
      source: 'PlatformKernel',
      payload: {
        serviceId: id,
        service: service
      }
    });
  }

  /**
   * Register a runtime with the kernel
   * @param {string} id - The runtime ID
   * @param {Object} runtime - The runtime object
   */
  registerRuntime(id, runtime) {
    if (!id || typeof id !== 'string') {
      throw new Error('Runtime ID must be a string');
    }
    if (!runtime || typeof runtime !== 'object') {
      throw new Error('Runtime must be an object');
    }
    
    this.runtimes.set(id, runtime);
    
    // Notify that a runtime was registered
    this.eventBus.publish({
      type: 'platform.kernel.runtimeRegistered',
      source: 'PlatformKernel',
      payload: {
        runtimeId: id,
        runtime: runtime
      }
    });
  }

  /**
   * Get the current kernel state
   * @returns {{
   *   state: string,
   *   uptime: number,
   *   services: number,
   *   runtimes: number
   * }} Current state information
   */
  getState() {
    return {
      state: this.state,
      uptime: this.startTime ? Date.now() - this.startTime : 0,
      services: this.services.size,
      runtimes: this.runtimes.size
    };
  }

  /**
   * Get the event bus instance
   * @returns {EventBus} The event bus
   */
  getEventBus() {
    return this.eventBus;
  }

  /**
   * Get a service by ID
   * @param {string} id - The service ID
   * @returns {Object|null} The service or null
   */
  getService(id) {
    return this.services.get(id) || null;
  }

  /**
   * Get a runtime by ID
   * @param {string} id - The runtime ID
   * @returns {Object|null} The runtime or null
   */
  getRuntime(id) {
    return this.runtimes.get(id) || null;
  }

  /**
   * Get all services
   * @returns {Map} Map of services
   */
  getServices() {
    return new Map(this.services);
  }

  /**
   * Get all runtimes
   * @returns {Map} Map of runtimes
   */
  getRuntimes() {
    return new Map(this.runtimes);
  }
}

module.exports = PlatformKernel;