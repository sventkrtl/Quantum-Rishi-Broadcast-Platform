# SDK

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Reference
- Constitutional Layer: Layer 5 - Reference Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Graphics-only SDK responsibility area.

## Allowed Contents

- Runtime, renderer, motion, typography, theme, animation, layout, timeline, and graphics engine boundaries

## Forbidden Contents

- Business logic
- data fetching
- service ownership
- direct external runtime control

## Naming Conventions

- Folder names use clear responsibility terms.
- Responsibility names must not be overloaded across unrelated areas.
- New children require a documented responsibility before creation.

## Dependencies

- 01_PRODUCT_CONSTITUTION.md
- 22_FOLDER_RULES.md
- 22_FOLDER_STRUCTURE.md

## Boundaries

This folder owns exactly one responsibility. Contents must remain aligned with the documented boundary.

## Quality Expectations

- Folder contents remain understandable without implementation context.
- Folder ownership remains stable as implementation evolves.
- Navigation remains clear for future contributors.
