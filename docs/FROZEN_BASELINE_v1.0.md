# FROZEN BASELINE v1.0 — Platform Core & Data Pipeline (Sprint 0.1 + Sprint 0.2)

**Frozen Date**: 2026-07-29 (23:20 IST)  
**Version Tag**: `v0.2.0-baseline`  
**Status**: APPROVED & LOCKED 🔒  

---

## 🏛️ SCM Baseline Policy

As per Software Configuration Management (SCM) standards, this document establishes **Sprint 0.1 (Platform Kernel)** and **Sprint 0.2 (Google Sheet Data Pipeline)** as the formally approved **Platform Baseline v0.2.0**.

Starting from **Sprint 0.3**:
- All feature developments (Graphics, Headlines, Lower Thirds, Tickers, Crawls, Clock, Weather, Audio, Automation) **MUST adapt to Platform APIs**.
- **DO NOT modify the Platform or Data Pipeline to accommodate a feature.** Features build ON TOP OF the platform data events.
- Platform baseline changes require formal Change Control approval (see [CHANGE_CONTROL.md](file:///d:/AV%20Media%20Telangana/av-media-telangana-platform/docs/CHANGE_CONTROL.md)).

---

## 🧊 Frozen Components (Baseline Core & Data Pipeline)

The following core components are **FROZEN** and sealed:

1. **Platform Kernel** (`platform/kernel/`)
   - Lifecycle management (`BOOTING → READY → RUNNING → (ERROR) → STOPPED`)
   - Service & Runtime Registries
2. **Event Bus** (`platform/event-bus/`)
   - Pub/Sub Hub and Event Envelope Validation (`id`, `type`, `source`, `timestamp`, `version`, `payload`)
3. **Render Runtime** (`platform/runtime/`)
   - Overlay runtime state and 1-second time tick orchestrator
4. **Google Sheet Data Pipeline** (`platform/services/googleSheetService.js`)
   - CSV fetch, validation, parsing, content change detection hash, `datasetVersion` tracking (`v1` baseline start, increment on content change), state management
   - Event publication: `platform.sheet.refreshing`, `platform.sheet.connected`, `platform.sheet.updated`, `platform.sheet.empty`, `platform.sheet.failed`
5. **Overlay Presentation Layer** (`overlay/`)
   - Permanent Root Canvas (`/overlay/`)
   - Production Mode (transparent empty canvas) vs Developer Mode (`/overlay/?dev=1` displaying `NO DATA`, `Connected: YES`, `v1` dataset version)
6. **HTTP Server & SSE Bridge** (`server.js`)
   - Static asset server, SSE `/events` bridge, `/health` endpoint, `/api/*` control routes including `POST /api/service/reconnect`
7. **Control Panel** (`control-panel/`)
   - Live state cards (Kernel, Runtime, Sheet Status, Connected, Dataset Version, Row Count, Last Refresh), `↺ Manual Refresh` & `🔌 Reconnect Sheet` buttons, live SSE event log
8. **Contracts & Constants** (`platform/contracts/`, `platform/constants/`)
   - Standard interfaces and event constants (`EventTypes.js`, `KernelStates.js`, `RuntimeStates.js`)

---

## 🛡️ Permanent Platform Diagnostics (Immutable Diagnostics)

The following 5 diagnostic cards are **PERMANENT Platform Diagnostics** and must NEVER be removed, renamed, or modified by future features:
1. `Connected` (`YES`/`NO`)
2. `Sheet Status` (`CONNECTED`, `NO DATA`, `UPDATED`, `REFRESHING`, `FAILED`)
3. `Row Count` (Number of CSV data rows)
4. `Dataset Version` (`v1`, `v2`, `v3`...)
5. `Last Refresh` (Timestamp)

*Future features (e.g. Sprint 0.3 Primary Headline) may add new feature-specific metrics (e.g. `Headline Count`), but Platform Diagnostics remain permanently intact.*

---

## 🏗️ Reference Feature Package Architecture Model (Sprint 0.3+)

Sprint 0.3 acts as the **Reference Implementation Package** for all future broadcast graphics (Headline, Breaking, Lower Third, Crawl, Weather, Clock). All upcoming graphics features must follow this exact architecture model:

```
Google Sheet Dataset  ──►  EventBus ('platform.sheet.updated')
                                      │
                                      ▼
                        Reference Feature Consumer
                                      │
                                      ▼
                             Feature Timeline
                                      │
                                      ▼
                         Feature Overlay Renderer
                                      │
                                      ▼
                                     OBS
```

- **Platform Core**: UNTOUCHED
- **GoogleSheetService**: UNTOUCHED
- **EventBus**: UNTOUCHED
- **RenderRuntime**: UNTOUCHED
- **Feature Package**: Built as a decoupled consumer package listening to platform events (`platform.*`) and publishing strictly within its own feature namespace (e.g. `primary-headline.*`).

---

## 🏷️ Event Namespace Ownership (Rule 6)

- **`platform.*` Events**: Published exclusively by Platform Core & Services.
- **`<feature-name>.*` Events**: Published by Feature Packages (e.g. `secondary-playlist.started`, `secondary-playlist.updated`, `primary-headline.started`).

---

## 🗺️ Master Sprint 0.3 Specification
See [SPRINT_0.3_ROADMAP.md](file:///d:/AV%20Media%20Telangana/av-media-telangana-platform/docs/SPRINT_0.3_ROADMAP.md) for the complete **12 Master Rules**, **12 Phases**, and **Release Strategy** specification.

---

## ✅ Allowed Changes (Sprint 0.3+)

- **Adding new graphics features** under feature-specific directories (e.g., `features/`, `graphics/`, `overlays/`).
- **Subscribing to `platform.sheet.updated` and EventBus events** in new frontend overlay modules.
- **Adding unit tests** for new feature modules.
- **Updating documentation** (`docs/`).

---

## 🎯 Architecture Rule for Sprint 0.3+

> **"Feature Platformకి adapt కావాలి. Platformని మార్చి featureని పనిచేయించకూడదు."**  
> *(Features must adapt to the Platform. Never alter the Platform or Data Pipeline to make a feature work.)*
