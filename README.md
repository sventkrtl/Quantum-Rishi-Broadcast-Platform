# AV Media Telangana Platform

> **Platform-first broadcast graphics platform for Telugu news production.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-blue)]()

---

## Architecture

This is a **platform-first** broadcast graphics system. The platform kernel boots first, establishes the event bus and data pipeline, and then graphic overlays attach to it.

```
Platform Kernel
     ↓
  Event Bus
     ↓
  Google Sheet Provider  (Live newsroom data)
     ↓
  Overlay Bridge
     ↓
  OBS Browser Source Overlays
```

---

## Repository Structure

```
av-media-telangana-platform/
│
├── docs/                       # Governance, Constitution, ADRs
│   └── adr/                    # Architecture Decision Records
│
├── shared/                     # Shared platform layer
│   ├── platform-services/      # Runtime service contracts & adapters
│   ├── animations/             # CSS keyframes & JS transition helpers
│   ├── styles/                 # Design tokens, variables, typography
│   ├── utils/                  # DOM helpers, state handlers, utilities
│   └── contracts/              # JSDoc interfaces & data schemas
│
├── platform/                   # Platform kernel — Runtime, Kernel, Services
│   ├── kernel/                 # Core boot sequence & module registration
│   └── services/               # Event Bus, Overlay Bridge, runtime services
│
├── overlay/                    # OBS Browser Source overlays
│   └── test-box/               # Sprint 0: Proof-of-life overlay
│
├── config/                     # Global & per-engine JSON configuration
│
├── tests/                      # Test suites
│
├── NewsFeedAutomate/            # Google Apps Script automation (v1.0.0 ❄️ Frozen)
│
└── .github/                    # PR templates
```

> **Note:** There is no `modules/` folder. Every graphic engine lives in `overlay/`.

---

## Development Principles

1. **Platform first** — Kernel and Event Bus must be proven before any graphic engine.
2. **Zcode workflow** — All development through Zcode. No exceptions.
3. **Constitution governs** — See [`docs/constitution.md`](./docs/constitution.md).
4. **Google Sheets as data source** — Not application logic. See [`docs/google-sheets-spec.md`](./docs/google-sheets-spec.md).

---

## Sprint 0 — Platform Foundation (Current)

Building the core pipeline before any graphic engine:

- [ ] Platform Kernel (`platform/kernel/`)
- [ ] Event Bus (`platform/services/event-bus.js`)
- [ ] Google Sheet Provider (`shared/platform-services/sheet-provider.js`)
- [ ] Overlay Bridge (`platform/services/overlay-bridge.js`)
- [ ] Test Box overlay (`overlay/test-box/`) — proof-of-life

> **Sprint 1 begins only when Sprint 0 Test Box is working end-to-end.**

---

## NewsFeedAutomate

Google Apps Script automation for newsroom feed processing.
**Frozen at v1.0.0** — Bug fixes only. See [`NewsFeedAutomate/README.md`](./NewsFeedAutomate/README.md).

---

*AV Media Telangana — Telugu Broadcast Engineering*
