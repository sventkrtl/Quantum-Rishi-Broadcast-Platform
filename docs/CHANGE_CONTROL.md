# Platform & Feature Change Control Policy

This document governs modifications to the AV Media Telangana Platform baseline and Feature Architecture. Any developer working on this codebase must adhere strictly to these rules:

---

### Rule 1: Frozen Platform files cannot be modified directly
No developer may edit files in the baseline (`platform/`, `contracts/`, `kernel/`, `runtime/`, `event-bus/`, `server.js`) during feature development. Platform core is locked.

### Rule 2: Every Platform change requires an ADR
If a platform modification is genuinely required, an Architecture Decision Record (ADR) must be written and approved before touching baseline code.

### Rule 3: Features must consume Platform APIs only
All graphics features (Headlines, Tickers, Lower Thirds, Crawls, Clock, Weather, Audio, Automation) must be built outside the platform core and consume public Platform APIs (`EventBus`, `GoogleSheetService`, SSE stream). Features adapt to the Platform; the Platform is never altered to fit a feature.

### Rule 4: Breaking the baseline requires a new baseline version
Any approved modification that alters existing Platform API contracts or baseline behavior requires a formal version bump and a new baseline release (`v1.1`, `v2.0`, etc.).

### Rule 5: Platform Diagnostics are Permanent and Immutable
The 5 platform diagnostic cards (`Connected`, `Sheet Status`, `Row Count`, `Dataset Version`, `Last Refresh`) are permanent platform diagnostics. Features may add new feature metrics (e.g. `Headline Count`), but must never remove or alter platform diagnostics.

### Rule 6: Platform Event Ownership
Platform is the **only publisher of `platform.*` events**. Feature packages must never publish, modify, or redefine any `platform.*` event. Features may only subscribe to `platform.*` events and publish events within their own feature namespace (e.g. `secondary-playlist.*`).

### Rule 7: Motion Hierarchy Rule
Motion elements must follow strict priority levels:
- **Level 1 (Content Motion)**: High priority (Crawl / News text) ★★★★★
- **Level 2 (Identity Motion)**: Medium priority (Channel Logo) ★★☆☆☆
- **Level 3 (Ambient Motion)**: Low priority (Badge accent) ★☆☆☆☆
*Constraint*: Low priority motion must never compete with high priority content motion for viewer attention.

### Rule 8: Continuous Crawl Rule
Motion must never stop, reset, flicker, or jump. When datasets update, only the text payload changes; animation loops continue scrolling smoothly without interruption.

### Rule 9: Logo Separator Loop
Channel Logo acts as an inline item separator within the Crawl loop (`News Item 1 → Logo → News Item 2 → Logo → News Item 3`).

### Rule 10: Visual Validation Gate
Every Phase requires **Visual Validation & Explicit Approval in Browser/OBS** before starting the next Phase.

### Rule 11: Sprint Evolution Rule (Living Roadmap)
The Roadmap is an evolving engineering document. Until officially frozen:
- New phases may be added (e.g. Phase 4.5, 6.5, 9.75).
- Existing phases may be split, merged, or re-ordered if it improves architecture.
- Additional validation gates may be inserted.
*Constraint*: The Master Architectural Rules, Frozen Baseline, and Core Principles must NEVER be violated.

### Rule 12: Version After Freeze Rule
No production release version number (e.g. `v1.0.0`) shall be assigned until the Sprint is officially Frozen. All work prior to Freeze is an evolving implementation. Version `v1.0.0` is birthed ONLY after final Architecture Review, Performance Benchmarking, OBS Production Validation, and Formal Freeze.

### Rule 13: Design Authority Rule
Implementation MUST always follow an **Approved Specification**. Coding must never alter architecture ad-hoc. If a new design idea arises during implementation, it must first be specified, updated in the Roadmap/Contract, and approved before entering implementation.

### Rule 14: One Folder — One Responsibility Rule
Every folder in a Feature Package shall have **exactly one architectural responsibility**. (e.g., Renderer does not contain Timeline logic; Timeline does not contain Motion profiles; Motion does not contain Layout offsets).

### Rule 15: Single Feature Public Entry Point Rule
Every Feature Package MUST expose a single entry point file (`index.js`). External platform or feature consumers MUST import the feature exclusively via `index.js`. Deep internal imports into feature sub-folders are strictly prohibited.

### Rule 16: Boundary Before Behaviour Rule
Feature development MUST lock data boundaries before defining internal behavior, and lock behavior before implementing rendering:
```
Feature Boundaries ──► Data Flow ──► Internal Behaviour ──► Rendering
```

### Rule 17: Consumer Purity Rule
Consumer modules shall **Receive, Validate, Normalize, and Forward ONLY**. Consumer modules shall NEVER render DOM elements, execute animations, control timeline playback, or access the DOM.

### Rule 18: Domain Independence Rule
The Domain Model shall have **NO knowledge** of Browser, OBS, Renderer, Timeline, Motion, or CSS. The Domain Model must be 100% pure JavaScript business logic.

### Rule 19: Immutable Domain Rule
Once created, Playlist Items and Playlist Models shall **NEVER mutate**. Data updates produce new immutable model instances (`Object.freeze()`).
