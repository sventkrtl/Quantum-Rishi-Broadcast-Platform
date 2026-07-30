# Event Flow

## Boot Sequence

```
server.js          Kernel           EventBus         SSE Bridge       Overlay
    │                │                  │                │               │
    │ startPlatform()│                  │                │               │
    │───────────────►│                  │                │               │
    │                │                  │                │               │
    │ kernel.start() │                  │                │               │
    │───────────────►│                  │                │               │
    │                │ publish(booting) │                │               │
    │                │─────────────────►│                │               │
    │                │                  │ sseBroadcast() │               │
    │                │                  │───────────────►│               │
    │                │                  │                │ data: booting │
    │                │                  │                │──────────────►│
    │                │                  │                │               │ update DOM
    │                │ [100ms init]     │                │               │
    │                │ publish(ready)   │                │               │
    │                │─────────────────►│                │               │
    │                │                  │ sseBroadcast() │               │
    │                │                  │───────────────►│──────────────►│
    │                │ [100ms init]     │                │               │
    │                │ publish(running) │                │               │
    │                │─────────────────►│                │               │
    │                │                  │───────────────►│──────────────►│
    │                │                  │                │               │
    │ runtime.start()│                  │                │               │
    │───────────────►│                  │                │               │
    │                │ [via runtime]    │                │               │
    │                │ publish(runtime.started)          │               │
    │                │─────────────────►│───────────────►│──────────────►│
    │                │                  │                │               │
    │ sheetSvc.start()                  │                │               │
    │───────────────────────────────────────────────────►│               │
    │                │ publish(service.started)          │               │
    │                │─────────────────►│───────────────►│──────────────►│
```

## Service Refresh Flow

```
GoogleSheetService          EventBus           SSE Bridge       Overlay
       │                       │                   │               │
       │ [timer fires / manual]│                   │               │
       │ fetch(sheetUrl)       │                   │               │
       │────────────────── Google Sheets ─────────►│               │
       │◄────────────────── CSV text ──────────────│               │
       │ _parseCsv()           │                   │               │
       │ publish(refreshed)    │                   │               │
       │──────────────────────►│                   │               │
       │                       │ sseBroadcast()    │               │
       │                       │──────────────────►│               │
       │                       │                   │──────────────►│
       │                       │                   │               │ update lastRefresh
```

## Event Envelope Format

Every event published on the EventBus conforms to this envelope:

```json
{
  "id":        "uuid-v4",
  "type":      "platform.kernel.running",
  "source":    "PlatformKernel",
  "timestamp": 1706529600000,
  "version":   "1.0.0",
  "payload": {
    "previousState": "READY",
    "currentState":  "RUNNING",
    "uptime":        204
  }
}
```
