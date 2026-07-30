# 🟢 Sprint 0.3 — Secondary Playlist (Reference Feature Package)

> **AV Media Telangana Platform — First Broadcast Graphics Reference Package**  
> This Sprint serves as the **Permanent Master Reference Architecture** for all future broadcast graphics packages (*Primary Headline, Breaking News, Lower Thirds, Tickers, Crawls, Clock, Weather, Reporter Cards*).

---

## 🎯 Sprint Goal

Build the first production-grade broadcast graphic (**Secondary Playlist Continuous Crawl**) on top of the frozen Sprint 0.1 & 0.2 platform baseline without modifying a single line of Platform code.

**OBS Target**:  
`http://localhost:8085/overlay/` — Production-grade Continuous Crawl running on a transparent canvas.

---

## 🔒 Master Architecture Rules (The 13 Commandments)

### Rule 1: Platform Frozen
The platform baseline is 100% locked. Do NOT edit `platform/`, `server.js`, `contracts`, `constants`.

### Rule 2: Feature Adapts to Platform
Features adapt to the Platform. The Platform is NEVER altered to fit a feature.

### Rule 3: Consumer Architecture
Secondary Playlist is strictly an EventBus consumer (`Google Sheet → Platform → Feature Consumer → Renderer`).

### Rule 4: Platform Event Ownership
Platform is the ONLY publisher of `platform.*` events. Features subscribe to `platform.*` events and publish strictly within their own namespace (e.g. `secondary-playlist.*`).

### Rule 5: Permanent Diagnostics
The 5 platform diagnostic cards (`Connected`, `Sheet Status`, `Row Count`, `Dataset Version`, `Last Refresh`) are permanent and immutable.

### Rule 6: Motion Hierarchy
```
Level 1: Content Motion (Crawl)       ★★★★★ (High Priority)
   ↓
Level 2: Identity Motion (Logo)       ★★☆☆☆ (Medium Priority)
   ↓
Level 3: Ambient Motion (Badge)       ★☆☆☆☆ (Low Priority)
```
*Rule*: Low priority motion must never compete with high priority content motion for viewer attention.

### Rule 7: Continuous Crawl Principle
```
Never Stop  |  Never Reset  |  Never Flicker  |  Never Jump
```
When dataset updates occur, only the text payload changes. The smooth scroll animation loop NEVER resets or jumps.

### Rule 8: Ambient Badge Motion
Badges are non-static with ambient motion only (Soft Gradient Shift, Gold Accent Sweep, Soft Pulse). No harsh flashing or blinking.

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
Every folder in a Feature Package shall have **exactly one architectural responsibility**.

### Rule 15: Single Feature Public Entry Point Rule
Every Feature Package MUST expose a single entry point file (`index.js`). External platform or feature consumers MUST import the feature exclusively via `index.js`.

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

---

## 🏛️ Release Strategy Lifecycle

```
Architecture Decisions  ──►  Approved Specification  ──►  Implementation  ──►  Visual Validation  ──►  Performance Validation  ──►  OBS Validation  ──►  Documentation  ──►  Freeze  ──►  v1.0.0 Release
```

> **📌 Architectural Milestone Governance Note**:  
> **"Phase 3 is the last non-visual phase."**  
> - **Phases 0–3**: Architecture, Contracts, Skeleton, Consumer Boundary, Domain Model (100% Pure Architecture & Data Domain).  
> - **Phase 4+**: Visual Broadcast System (Timeline State Machine, Continuous Crawl Motion, Rendering, OBS Overlay).

---

## 🗺️ Sprint 0.3 Execution Roadmap

### 🚀 Phase 0: Dataset Contract Freeze
Create and lock contract specification:
- `docs/contracts/DATASET_CONTRACT_SECONDARY_PLAYLIST.md`

### 🚀 Phase 1: Reference Feature Skeleton
Set up feature package architecture under `features/secondary-playlist/`:
```text
features/
└── secondary-playlist/
    ├── consumer/
    ├── timeline/
    ├── renderer/
    ├── layout/
    ├── motion/
    ├── styles/
    ├── contracts/
    ├── models/
    ├── assets/
    └── tests/
```

### 🚀 Phase 2: Consumer Boundary Implementation
Subscribe to `platform.sheet.updated` SSE events, normalize rows according to Dataset Contract, and construct internal `PlaylistModel`.
- **Validation 1**: Verify Dataset arrival, Consumer normalization, and PlaylistModel creation (NO rendering/DOM).

### 🚀 Phase 3: Domain Model Construction
Build pure, immutable Secondary Playlist Domain Model:
- Stable Item Identity tracking (`id`)
- Ordering Rules (Priority → Row Index → Sequence)
- Status State Machine (`ACTIVE`, `INACTIVE`, `DRAFT`, `EXPIRED`)
- Future Metadata Support (`expiresAt`, `startsAt`, `theme`, `region`, `language`)
- **Validation 2**: Verify Domain Model purity, ordering rules, immutable updates, and stable IDs (100% pure JS, NO DOM/Renderer/Timeline).

### 🚀 Phase 4: Timeline Engine
Build lifecycle state machine for item display:
```
WAIT  ──►  IN  ──►  CRAWL  ──►  OUT  ──►  NEXT
```
- **Validation 2**: Verify Timeline Loop, Queueing, Item Sequencing, and Timing.

### 🚀 Phase 5: Continuous Crawl Motion Engine
Implement smooth 60 FPS GPU-accelerated motion using CSS transforms (`translate3d`) and `requestAnimationFrame`.
- **Validation 3**: Verify OBS Crawl smoothness, Logo spacing, and FPS stability.

### 🚀 Phase 6: Overlay Layout Lock
Lock 1920x1080 Broadcast Layout:
- Bottom Safe Area
- Badge Width / Height
- Logo Gap
- Padding / Margins / Container Height
- **Validation 4**: Verify 1920x1080 OBS Browser Source Safe Area alignment.

### 🚀 Phase 7: Motion Language Lock
Freeze motion curves (Linear Crawl, Ease-in-out Fades, Reveal, Ambient Pulsing).
- **Validation 5**: Verify Natural Motion feel and Viewer Comfort.

### 🚀 Phase 8: Renderer Decoupling
Implement `Render`, `Update`, `Destroy`.
- *Rule*: Renderer does NOT animate. Timeline and Motion Engine control position; Renderer only draws.
- **Validation 6**: Verify Memory usage, FPS, CPU utilization during continuous rendering.

### 🎨 Phase 9: Broadcast Designer (Control Panel Studio UI)
Add Broadcast Designer controls to Control Panel:
- **Typography**: Font Family, Size, Weight, Letter Spacing, Line Height
- **Colors**: Text, Background, Badge, Border, Gradient, Opacity
- **Badge**: Show/Hide, Width, Height, Radius, Color
- **Logo**: Show/Hide, Size, Gap, Opacity
- **Crawl**: Speed, Direction, Gap, Loop
- **Theme**: Default, Corporate, Custom
- **Preview**: Live Preview, Apply, Reset

### 🚀 Phase 9.5: Configuration Persistence Store
Persist Broadcast Designer settings permanently to disk:
```text
config/
└── secondary-playlist/
    ├── theme.json
    ├── layout.json
    ├── motion.json
    ├── typography.json
    ├── colors.json
    ├── logo.json
    └── badge.json
```
- **Validation 7**: Test live update in OBS when changing Font, Color, or Speed without server/browser restart.

### 🎬 Phase 10: OBS Production Validation Checklist
Complete full end-to-end production validation:
```text
Browser  ──►  OBS  ──►  Google Sheet  ──►  Configuration  ──►  Continuous Crawl  ──►  Stress Test
```

### 📄 Phase 11: Documentation & ADRs
Update system documentation:
- Architecture Diagram
- ADR for Feature Consumer Pattern
- Test Suite & Benchmark Report

### 🧊 Phase 12: Freeze & Release
Formally freeze and tag version:
- `Release v1.0.0-secondary-playlist` (Official Production Release)

---

## 🏛️ Operating Philosophy

```
Platform Publishes  ──►  Feature Consumes  ──►  Timeline Controls  ──►  Renderer Draws  ──►  Designer Configures  ──►  Configuration Persists  ──►  OBS Displays
```
