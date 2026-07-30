# Runtime Lifecycle

## Kernel State Machine

```
                    ┌─────────┐
               ┌───►│ BOOTING │  ← Initial state on construction
               │    └────┬────┘
               │         │ async init (≈100ms)
               │         ▼
               │    ┌─────────┐
               │    │  READY  │  ← Services may now be loaded
               │    └────┬────┘
               │         │ async service init (≈100ms)
               │         ▼
    start() ───┘    ┌─────────┐
                    │ RUNNING │◄──────────────────┐
                    └────┬────┘                   │
                         │                        │
              error ─────┤                        │
                         ▼                        │
                    ┌─────────┐                   │
                    │  ERROR  │───── recover? ────►│
                    └────┬────┘
                         │ shutdown()
                         ▼
                    ┌─────────┐
                    │ STOPPED │  ← Terminal state
                    └─────────┘
```

## Kernel Events Emitted

| State Transition | Event Type |
|-----------------|------------|
| Entry into BOOTING | `platform.kernel.booting` |
| BOOTING → READY | `platform.kernel.ready` |
| READY → RUNNING | `platform.kernel.running` |
| Any → ERROR | `platform.kernel.error` |
| Any → STOPPED | `platform.kernel.stopped` |

## Service Lifecycle

Services are registered with `kernel.registerService(id, service)` and stopped automatically on `kernel.shutdown()`.

```
  start() → SERVICE_STARTED
              │
              ├─ refresh() → SERVICE_REFRESHED  (repeats on timer)
              │
              └─ error     → SERVICE_FAILED
```

## Runtime Lifecycle

```
  start() → RUNTIME_STARTED → [ticking time events every 1s]
  stop()  → RUNTIME_STOPPED
```
