# Public API Reference

## PlatformKernel

```js
const { Kernel } = require('./platform');
const kernel = new Kernel(eventBus);
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `start` | `async start(): Promise<void>` | Boot the kernel through BOOTING → READY → RUNNING |
| `shutdown` | `async shutdown(): Promise<void>` | Gracefully stop all runtimes, services, then kernel |
| `getState` | `getState(): { state, uptime, services, runtimes }` | Snapshot of current kernel state |
| `registerService` | `registerService(id: string, service: object): void` | Register a service instance |
| `registerRuntime` | `registerRuntime(id: string, runtime: object): void` | Register a runtime instance |
| `getService` | `getService(id: string): object \| null` | Retrieve a registered service |
| `getRuntime` | `getRuntime(id: string): object \| null` | Retrieve a registered runtime |

---

## EventBus

```js
const { EventBus } = require('./platform');
const eventBus = new EventBus();
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `publish` | `publish(envelope: object): void` | Publish an event to all subscribers |
| `subscribe` | `subscribe(type: string, cb: Function): Function` | Subscribe to an event type; returns unsubscribe function |
| `unsubscribe` | `unsubscribe(type: string, cb: Function): void` | Remove a subscription |
| `getEventTypes` | `getEventTypes(): Set<string>` | All currently subscribed event types |
| `getSubscriberCount` | `getSubscriberCount(type: string): number` | Subscriber count for a type |

### Event Envelope

```ts
interface EventEnvelope {
  id:        string;    // Auto-generated UUID
  type:      string;    // e.g. "platform.kernel.running"
  source:    string;    // e.g. "PlatformKernel"
  timestamp: number;    // Auto-set to Date.now() if omitted
  version:   string;    // Auto-set to "1.0.0" if omitted
  payload:   object;    // Event-specific data
}
```

---

## GoogleSheetService

```js
const { GoogleSheetService } = require('./platform/services');
const svc = new GoogleSheetService({ eventBus, sheetUrl, refreshMs });
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `start` | `async start(): Promise<void>` | Initial fetch + optional auto-refresh timer |
| `stop` | `stop(): void` | Cancel auto-refresh timer |
| `refresh` | `async refresh(): Promise<void>` | Manual data refresh |
| `getRows` | `getRows(): Array<Object>` | Latest parsed CSV rows (first row = headers) |
| `getStatus` | `getStatus(): { started, rowCount, lastRefreshTime }` | Service status snapshot |

---

## OverlayRuntime (RenderRuntime)

```js
const { Runtime } = require('./platform');
const runtime = new Runtime(eventBus);
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `start` | `start(): void` | Start runtime, begin 1s time-tick events |
| `stop` | `stop(): void` | Stop runtime, cancel time-tick |
| `getState` | `getState(): { platformState, runtimeState, currentTime }` | State snapshot |
| `updatePlatformState` | `updatePlatformState(state: string): void` | Update + emit platform state change |
| `updateRuntimeState` | `updateRuntimeState(state: string): void` | Update + emit runtime state change |

---

## HTTP API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/` | Serves the test overlay |
| `GET`  | `/overlay/` | Test overlay (OBS browser source) |
| `GET`  | `/control-panel/` | Developer control panel |
| `GET`  | `/events` | SSE stream — all platform events |
| `GET`  | `/health` | JSON health check |
| `GET`  | `/api/state` | Full kernel + service + runtime state snapshot |
| `POST` | `/api/kernel/start` | Start the platform kernel |
| `POST` | `/api/kernel/stop` | Shutdown the platform kernel |
| `POST` | `/api/service/refresh` | Trigger a manual data refresh |
| `POST` | `/api/simulate/error` | Broadcast a simulated kernel error event |

---

## Event Type Constants

```js
const EventTypes = require('./platform/constants/EventTypes');

// Kernel
EventTypes.KERNEL_BOOTING    // 'platform.kernel.booting'
EventTypes.KERNEL_READY      // 'platform.kernel.ready'
EventTypes.KERNEL_RUNNING    // 'platform.kernel.running'
EventTypes.KERNEL_ERROR      // 'platform.kernel.error'
EventTypes.KERNEL_STOPPED    // 'platform.kernel.stopped'

// Runtime
EventTypes.RUNTIME_STARTED   // 'platform.runtime.started'
EventTypes.RUNTIME_STOPPED   // 'platform.runtime.stopped'

// Service
EventTypes.SERVICE_STARTED   // 'platform.service.started'
EventTypes.SERVICE_FAILED    // 'platform.service.failed'
EventTypes.SERVICE_REFRESHED // 'platform.service.refreshed'
```
