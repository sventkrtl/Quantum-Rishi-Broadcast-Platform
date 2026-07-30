'use strict';

/**
 * Platform kernel lifecycle state constants.
 * The kernel transitions through these states in sequence:
 *
 *   BOOTING → READY → RUNNING → (RUNNING | ERROR) → STOPPED
 */
const KernelStates = {
  BOOTING: 'BOOTING',   // Kernel is initialising
  READY:   'READY',     // Kernel initialised, loading services
  RUNNING: 'RUNNING',   // Kernel fully operational
  ERROR:   'ERROR',     // Kernel encountered a non-fatal error
  STOPPED: 'STOPPED',   // Kernel has shut down
};

module.exports = KernelStates;
