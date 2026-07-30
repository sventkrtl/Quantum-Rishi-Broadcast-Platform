const EventBus = require('../event-bus');
const EventTypes = require('../constants/EventTypes');

class RenderRuntime {
  /**
   * @param {EventBus} [eventBus] - An optional event bus instance. If not provided, a new one will be created.
   */
  constructor(eventBus) {
    this.platformState = 'UNKNOWN';
    this.runtimeState = 'STOPPED';
    this.currentTime = new Date().toISOString();
    this.eventBus = eventBus || new EventBus();
    this.renderTargets = new Map();
    this.timeInterval = null;
  }

  /**
   * Start the render runtime
   */
  start() {
    if (this.runtimeState === 'STARTED') {
      return;
    }

    this.runtimeState = 'STARTED';
    
    // Start time update interval
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date().toISOString();
      this.eventBus.publish({
        type: 'platform.runtime.timeUpdated',
        source: 'RenderRuntime',
        payload: { currentTime: this.currentTime }
      });
    }, 1000);

    // Emit started event
    this.eventBus.publish({
      type: EventTypes.RUNTIME_STARTED,
      source: 'RenderRuntime',
      payload: {
        previousRuntimeState: 'STOPPED',
        currentRuntimeState: this.runtimeState
      }
    });
  }

  /**
   * Stop the render runtime
   */
  stop() {
    if (this.runtimeState === 'STOPPED') {
      return;
    }

    // Clear time interval
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }

    this.runtimeState = 'STOPPED';
    
    // Emit stopped event
    this.eventBus.publish({
      type: EventTypes.RUNTIME_STOPPED,
      source: 'RenderRuntime',
      payload: {
        previousRuntimeState: 'STARTED',
        currentRuntimeState: this.runtimeState
      }
    });
  }

  /**
   * Update the platform state
   * @param {string} state - The platform state
   */
  updatePlatformState(state) {
    if (typeof state !== 'string') {
      throw new Error('Platform state must be a string');
    }
    
    const previousState = this.platformState;
    this.platformState = state;
    
    this.eventBus.publish({
      type: 'platform.runtime.platformStateUpdated',
      source: 'RenderRuntime',
      payload: {
        previousPlatformState: previousState,
        currentPlatformState: this.platformState
      }
    });
  }

  /**
   * Update the runtime state
   * @param {string} state - The runtime state
   */
  updateRuntimeState(state) {
    if (typeof state !== 'string') {
      throw new Error('Runtime state must be a string');
    }
    
    const previousState = this.runtimeState;
    this.runtimeState = state;
    
    this.eventBus.publish({
      type: 'platform.runtime.runtimeStateUpdated',
      source: 'RenderRuntime',
      payload: {
        previousRuntimeState: previousState,
        currentRuntimeState: this.runtimeState
      }
    });
  }

  /**
   * Update the current time
   * @param {string} time - The current time as ISO string
   */
  updateCurrentTime(time) {
    if (typeof time !== 'string') {
      throw new Error('Time must be a string');
    }
    
    const previousTime = this.currentTime;
    this.currentTime = time;
    
    this.eventBus.publish({
      type: 'platform.runtime.timeUpdated',
      source: 'RenderRuntime',
      payload: {
        previousTime: previousTime,
        currentTime: this.currentTime
      }
    });
  }

  /**
   * Get the current runtime state
   * @returns {{
   *   platformState: string,
   *   runtimeState: string,
   *   currentTime: string
   * }} Current state
   */
  getState() {
    return {
      platformState: this.platformState,
      runtimeState: this.runtimeState,
      currentTime: this.currentTime
    };
  }

  /**
   * Register a render target
   * @param {string} id - The target ID
   * @param {Object} target - The target object
   * @returns {string} The registration ID
   */
  registerRenderTarget(id, target) {
    if (!id || typeof id !== 'string') {
      throw new Error('Render target ID must be a string');
    }
    if (!target || typeof target !== 'object') {
      throw new Error('Render target must be an object');
    }
    
    this.renderTargets.set(id, target);
    return id;
  }

  /**
   * Unregister a render target
   * @param {string} id - The target ID
   * @returns {boolean} True if unregistered
   */
  unregisterRenderTarget(id) {
    return this.renderTargets.delete(id);
  }

  /**
   * Get a render target
   * @param {string} id - The target ID
   * @returns {Object|null} The target object or null
   */
  getRenderTarget(id) {
    return this.renderTargets.get(id) || null;
  }

  /**
   * Get all registered render targets
   * @returns {Map} Map of render targets
   */
  getRenderTargets() {
    return new Map(this.renderTargets);
  }

  /**
   * Get the event bus instance
   * @returns {EventBus} The event bus
   */
  getEventBus() {
    return this.eventBus;
  }
}

module.exports = RenderRuntime;