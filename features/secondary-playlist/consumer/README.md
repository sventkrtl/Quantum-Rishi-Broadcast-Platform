# Secondary Playlist — Consumer Module

**Architectural Responsibility (Rule 14)**:  
Receives raw platform events (`platform.sheet.updated`) from EventBus / SSE and delegates row validation and parsing to the Models module.

**Strict Boundaries**:
- Subscribes ONLY to platform events (Rule 4).
- NO rendering logic.
- NO timeline animation logic.

*Status*: Skeleton initialized (Phase 1) — No functional logic.
