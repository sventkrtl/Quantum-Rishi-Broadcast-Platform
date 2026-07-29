const PlatformConfig = require('../config/PlatformConfig');
const CapabilityRegistry = require('../registry/CapabilityRegistry');
const RuntimeManifest = require('../version/RuntimeManifest');
const HealthSnapshot = require('../monitoring/HealthSnapshot');
const ObservabilityEndpoints = require('../monitoring/ObservabilityEndpoints');
const DiagnosticsEngine = require('../diagnostics/DiagnosticsEngine');
const ErrorRecoverySystem = require('../recovery/ErrorRecoverySystem');

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

    // Register built-in kernel capability
    this.capabilities.registerModule({
      id: 'platform-kernel',
      supportsVersion: '^0.1.0',
      requiresKernel: '0.1.0-m1',
      dependencies: [],
      capabilities: ['lifecycle', 'config', 'health', 'diagnostics', 'recovery']
    });

    this.health.setComponentStatus('platform-kernel', true, { role: 'orchestrator' });
    this.diagnostics.log('INFO', 'PlatformKernel instantiated', { state: 'BOOTING' });
  }

  async boot() {
    this.diagnostics.log('INFO', 'PlatformKernel booting components...');
    
    // Simulate loading modules from config
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
    this.health.setState('RUNNING');
    this.diagnostics.log('INFO', 'PlatformKernel running', { state: 'RUNNING' });
  }

  async stop() {
    this.health.setState('STOPPED');
    this.diagnostics.log('INFO', 'PlatformKernel stopped', { state: 'STOPPED' });
  }

  getHealthState() {
    return this.health.getState();
  }

  getHealthSnapshot() {
    return this.health.getSnapshot();
  }

  getRuntimeManifest() {
    return this.manifest.getManifest();
  }
}

module.exports = PlatformKernel;
