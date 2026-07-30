# Architecture

## Overview

AV Media Telangana Platform is a **platform-first** broadcast graphics system for Telugu news production. All feature work (headlines, tickers, lower-thirds) sits **above** a stable, event-driven platform kernel.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           HTTP Server (port 8085)                        │
│  /overlay/          /control-panel/       /events (SSE)   /health        │
└──────────┬──────────────────┬──────────────────┬───────────┬─────────────┘
           │                  │                  │           │
           ▼                  ▼                  ▼           ▼
  ┌────────────────┐  ┌───────────────┐  ┌────────────┐ ┌─────────┐
  │  Test Overlay  │  │ Control Panel │  │ SSE Bridge │ │ Health  │
  │  (browser src) │  │  (manual UI)  │  │            │ │  JSON   │
  └───────┬────────┘  └───────┬───────┘  └─────┬──────┘ └─────────┘
          │                   │                 │
          └───────────────────┴────────── subscribes ◄──────────────┐
                                                                     │
┌───────────────────────────────────────────────────────────────────┴──────┐
│                           Platform Kernel                                │
│                                                                          │
│   ┌──────────────┐    ┌──────────────────┐    ┌──────────────────────┐  │
│   │  Event Bus   │◄───│  Platform Kernel │───►│   Overlay Runtime    │  │
│   │ (pub/sub hub)│    │  (lifecycle mgr) │    │  (state management)  │  │
│   └──────┬───────┘    └──────────────────┘    └──────────────────────┘  │
│          │                                                               │
│          │  publishes                                                    │
│          ▼                                                               │
│   ┌──────────────────┐                                                   │
│   │ GoogleSheetService│                                                  │
│   │ (CSV data layer)  │                                                  │
│   └──────────────────┘                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Platform Kernel** | Lifecycle management (`BOOTING→READY→RUNNING→STOPPED`), service & runtime registry |
| **Event Bus** | Publish/subscribe messaging — the only coupling point between components |
| **GoogleSheetService** | Fetches CSV from Google Sheets, parses into row objects, emits refresh events |
| **Overlay Runtime** | Tracks platform state; no DOM manipulation — pure state machine |
| **HTTP Server** | Serves static files, SSE stream, health check, control API endpoints |
| **Test Overlay** | Browser source for OBS — subscribes to SSE and updates DOM |
| **Control Panel** | Developer tool — manual controls and live event log |

## Design Principles

1. **Platform-first** — No feature code in the kernel layer
2. **Event-driven** — Components communicate only through the EventBus
3. **Separation of concerns** — Each component owns exactly one domain
4. **No circular dependencies** — Platform → Services → Features (one direction only)
