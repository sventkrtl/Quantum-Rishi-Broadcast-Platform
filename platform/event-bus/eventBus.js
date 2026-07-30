const crypto = require('crypto');

class EventBus {
  constructor() {
    this.subscribers = new Map(); // Map<eventType, Set<callback>>
    this.sequenceCounter = 0;
  }

  /**
   * Generate a unique ID for events
   * @returns {string} Unique ID
   */
  generateId() {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    // Fallback for older Node.js versions
    return `${Date.now()}-${this.sequenceCounter++}`;
  }

  /**
   * Validate an event envelope
   * @param {Object} envelope - The event envelope to validate
   * @throws {Error} If envelope is invalid
   */
  validateEnvelope(envelope) {
    if (!envelope || typeof envelope !== 'object') {
      throw new Error('Event envelope must be an object');
    }

    if (!envelope.id || typeof envelope.id !== 'string') {
      throw new Error('Event envelope must have a string id');
    }

    if (!envelope.type || typeof envelope.type !== 'string') {
      throw new Error('Event envelope must have a string type');
    }

    if (!envelope.source || typeof envelope.source !== 'string') {
      throw new Error('Event envelope must have a string source');
    }

    if (typeof envelope.timestamp !== 'number' || isNaN(envelope.timestamp)) {
      throw new Error('Event envelope must have a valid number timestamp');
    }

    if (!envelope.version || typeof envelope.version !== 'string') {
      throw new Error('Event envelope must have a string version');
    }

    if (envelope.payload === undefined || typeof envelope.payload !== 'object') {
      throw new Error('Event envelope must have an object payload');
    }
  }

  /**
   * Publish an event
   * @param {Object} envelope - The event envelope to publish
   */
  publish(envelope) {
    // Ensure required fields are present
    if (!envelope.id) {
      envelope.id = this.generateId();
    }
    if (!envelope.timestamp) {
      envelope.timestamp = Date.now();
    }
    if (!envelope.version) {
      envelope.version = '1.0.0'; // This should come from config/version.js in production
    }

    // Validate the envelope
    this.validateEnvelope(envelope);

    // Notify subscribers
    const subscribers = this.subscribers.get(envelope.type);
    if (subscribers) {
      // Create a copy to avoid issues if subscribers modify the set during iteration
      const subscribersCopy = new Set(subscribers);
      for (const callback of subscribersCopy) {
        try {
          callback(envelope);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      }
    }
  }

  /**
   * Subscribe to an event type
   * @param {string} type - The event type to subscribe to
   * @param {Function} callback - The callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(type, callback) {
    if (!type || typeof type !== 'string') {
      throw new Error('Event type must be a string');
    }
    if (!callback || typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    
    const subscribers = this.subscribers.get(type);
    subscribers.add(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(type, callback);
  }

  /**
   * Unsubscribe from an event type
   * @param {string} type - The event type to unsubscribe from
   * @param {Function} callback - The callback function
   */
  unsubscribe(type, callback) {
    if (!type || typeof type !== 'string') {
      throw new Error('Event type must be a string');
    }
    if (!callback || typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    const subscribers = this.subscribers.get(type);
    if (subscribers) {
      subscribers.delete(callback);
      // Clean up empty sets
      if (subscribers.size === 0) {
        this.subscribers.delete(type);
      }
    }
  }

  /**
   * Get all subscribed event types
   * @returns {Set} Set of event types
   */
  getEventTypes() {
    return new Set(this.subscribers.keys());
  }

  /**
   * Get number of subscribers for an event type
   * @param {string} type - The event type
   * @returns {number} Number of subscribers
   */
  getSubscriberCount(type) {
    const subscribers = this.subscribers.get(type);
    return subscribers ? subscribers.size : 0;
  }
}

module.exports = EventBus;