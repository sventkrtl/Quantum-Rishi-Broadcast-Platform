# Secondary Playlist — Timeline Module

**Architectural Responsibility (Rule 14)**:  
Orchestrates item sequencing, state machine lifecycle (`WAIT → IN → CRAWL → OUT → NEXT`), loop queue management, and playback timing.

**Strict Boundaries**:
- Lifecycle and timing control ONLY.
- NO DOM drawing or CSS animation execution (belongs to `renderer/` and `motion/`).
- NO layout coordinate calculations (belongs to `layout/`).

*Status*: Skeleton initialized (Phase 1) — No functional logic.
