const PlatformConfig = require('../config/PlatformConfig');
const CapabilityRegistry = require('../registry/CapabilityRegistry');
const RuntimeManifest = require('../version/RuntimeManifest');
const HealthSnapshot = require('../monitoring/HealthSnapshot');
const ObservabilityEndpoints = require('../monitoring/ObservabilityEndpoints');
const DiagnosticsEngine = require('../diagnostics/DiagnosticsEngine');
const ErrorRecoverySystem = require('../recovery/ErrorRecoverySystem');
const FrameScheduler = require('../runtime/FrameScheduler');
const PerformanceMonitor = require('../monitoring/PerformanceMonitor');
const MemoryMonitor = require('../monitoring/MemoryMonitor');
const EventQueueOptimizer = require('../events/EventQueueOptimizer');
const ResourceManager = require('../runtime/ResourceManager');

class PlatformKernel {
  constructor(options = {}) {
    this.config = new PlatformConfig(options.configDir);
    this.health = new HealthSnapshot();
    this.health.setState('BOOTING');

    this.capabilities = new CapabilityRegistry(this.config.get('app', 'version', '0.1.0-m1'));
    this.manifest = new RuntimeManifest({
      kernelVersion: this.config.get('app', 'version', '0.1.0-m1')
    });
    this.diagnostics = new DiagnosticsEngine();
    this.recovery = new ErrorRecoverySystem(this, options.recoveryOptions);
    this.endpoints = new ObservabilityEndpoints(this);

    // M2 Stability Subsystems
    this.frameScheduler = new FrameScheduler({ targetFps: this.config.get('obs', 'fps', 60) });
    this.perfMonitor = new PerformanceMonitor();
    this.memMonitor = new MemoryMonitor();
    this.eventQueue = new EventQueueOptimizer();
    this.resources = new ResourceManager();

    // Hook frame scheduler into perf monitor
    this.frameScheduler.addCallback((deltaMs) => {
      this.perfMonitor.recordFrame(deltaMs);
      this.diagnostics.recordFrameLatency(deltaMs);
    });

    // Register built-in kernel capability
    this.capabilities.registerModule({
      id: 'platform-kernel',
      supportsVersion: '^0.1.0',
      requiresKernel: '0.1.0-m1',
      dependencies: [],
      capabilities: ['lifecycle', 'config', 'health', 'diagnostics', 'recovery', 'scheduler', 'performance', 'memory', 'event-optimizer', 'resources']
    });

    this.health.setComponentStatus('platform-kernel', true, { role: 'orchestrator' });
    this.diagnostics.log('INFO', 'PlatformKernel instantiated with M2 Runtime Stability capabilities', { state: 'BOOTING' });
  }

  async boot() {
    this.diagnostics.log('INFO', 'PlatformKernel booting components...');
    
    // Load modules from config
    const moduleList = this.config.get('modules', 'modules', []);
    for (const modConfig of moduleList) {
      if (modConfig.id !== 'platform-kernel' && modConfig.enabled) {
        this.capabilities.registerModule({
          id: modConfig.id,
          supportsVersion: '^0.1.0',
          requiresKernel: '0.1.0-m1',
          dependencies: ['platform-kernel'],
          capabilities: [modConfig.id]
        });
        this.health.setComponentStatus(modConfig.id, true, { priority: modConfig.priority });
      }
    }

    this.health.setState('READY');
    this.diagnostics.log('INFO', 'PlatformKernel boot complete', { state: 'READY' });
  }

  async start() {
    if (this.health.getState() !== 'READY') {
      await this.boot();
    }
    this.frameScheduler.start();
    this.health.setState('RUNNING');
    this.diagnostics.log('INFO', 'PlatformKernel running with 60 FPS scheduler', { state: 'RUNNING' });
  }

  async stop() {
    this.frameScheduler.stop();
    this.resources.disposeAll();
    this.health.setState('STOPPED');
    this.diagnostics.log('INFO', 'PlatformKernel stopped and resources purged', { state: 'STOPPED' });
  }

  getHealthState() {
    return this.health.getState();
  }

  getHealthSnapshot() {
    const baseSnapshot = this.health.getSnapshot();
    return {
      ...baseSnapshot,
      performance: this.perfMonitor.getMetrics(),
      memory: this.memMonitor.getMetrics(),
      scheduler: this.frameScheduler.getMetrics(),
      eventQueue: this.eventQueue.getMetrics(),
      resources: this.resources.getMetrics()
    };
  }

  getRuntimeManifest() {
    return this.manifest.getManifest();
  }
}

module.exports = PlatformKernel;
