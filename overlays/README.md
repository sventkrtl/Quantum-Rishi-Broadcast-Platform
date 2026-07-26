# Overlays

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Reference
- Constitutional Layer: Layer 5 - Reference Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Self-contained overlay module responsibility area.

## Allowed Contents

- Primary, breaking, secondary, lower-third, reporter, clock, logo, weather, live, and future overlay modules

## Forbidden Contents

- Platform kernel logic
- direct module internals from other overlays
- direct OBS control

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
