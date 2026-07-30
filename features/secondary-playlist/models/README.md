# Secondary Playlist — Models Module

**Architectural Responsibility (Rule 14)**:  
Maintains reactive Playlist state, DTO representations of news items, dataset versioning validation, and row normalization rules specified in the Dataset Contract.

**Strict Boundaries**:
- Pure data structures and normalization logic only.
- NO event subscription logic (belongs to `consumer/`).
- NO rendering or DOM manipulation logic.

*Status*: Skeleton initialized (Phase 1) — No functional logic.
