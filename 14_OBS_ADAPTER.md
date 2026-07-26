# OBS Adapter

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Architecture
- Constitutional Layer: Layer 3 - Architecture Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines OBS as a rendering runtime integration boundary.

## Scope

Covers adapter responsibilities between the platform and OBS Browser Source usage at a product architecture level.

## Audience

- Architect
- Developer
- QA
- System Integrator

## Responsibilities

- Keeps OBS separate from the platform
- Supports one URL rendering
- Defines adapter-level integration boundaries
- Protects the platform from renderer-specific ownership

## Boundaries

- Does not treat OBS as the platform
- Does not place OBS control inside overlays
- Does not define OBS-specific implementation commands

## Dependencies

- 06_OVERLAY_ARCHITECTURE.md
- 12_CONFIGURATION_SYSTEM.md
- 30_PRODUCT_CONSTRAINTS.md

## Constraints

- Renderer Last
- One URL
- Zero Vendor Lock

## Design Principles

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Quality Expectations

- Portable platform architecture
- Clear rendering runtime boundary
- Testable rendering validation
- Reduced vendor coupling

## Rules

- OBS is documented only as a rendering runtime
- Platform behavior must not depend on OBS-specific ownership
- Rendering validation must follow testing standards

## Extension Rules

- New renderer adapters must preserve platform independence and one URL philosophy where applicable
- Adapter changes must not move product logic into the renderer

## Stability Rules

- OBS adapter principles remain valid if rendering runtime changes

## Related Documents

- 18_TESTING_STANDARD.md
- 30_PRODUCT_CONSTRAINTS.md

## Read Next

- 18_TESTING_STANDARD.md
- 30_PRODUCT_CONSTRAINTS.md

