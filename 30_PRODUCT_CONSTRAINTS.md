# Product Constraints

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Frozen
- Constitutional Layer: Layer 2 - Product Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines permanent product constraints that govern architecture and implementation.

## Scope

Covers One Overlay URL, cross-platform architecture, OBS as rendering runtime only, zero vendor lock, configuration first, documentation first, platform first, event-driven communication, and single source of truth.

## Audience

- Founder
- Product Owner
- Architect
- Developer
- QA
- System Integrator
- Future Contributor

## Responsibilities

- Constrains product decisions before architecture detail
- Prevents vendor or implementation lock-in
- Protects the platform identity
- Provides clear limits for future development

## Boundaries

- Does not define implementation details
- Does not define deployment model
- Does not describe package or build behavior

## Dependencies

- 01_PRODUCT_CONSTITUTION.md
- 26_DESIGN_PRINCIPLES.md
- 31_NON_GOALS.md

## Constraints

- One Overlay URL
- Cross-platform Architecture
- OBS as Rendering Runtime only
- Zero Vendor Lock
- Configuration First
- Documentation First
- Platform First
- Event-driven Communication
- Single Source of Truth

## Design Principles

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Quality Expectations

- Stable architectural direction
- Reduced scope drift
- Portable product behavior
- Clear commercial product boundaries

## Rules

- The overlay system exposes one primary rendering entry point
- The platform remains operating-system neutral
- OBS is never documented as the platform
- Vendor-specific behavior stays behind adapters
- Configuration defines product variation
- Documentation precedes architecture and implementation
- The platform owns coordination
- Modules communicate through documented events
- Constitution-controlled documents remain the source of truth

## Extension Rules

- New constraints require constitutional approval
- Constraint changes require impact review across architecture, quality, testing, and registries

## Stability Rules

- Product constraints remain stable above implementation and architecture choices

## Related Documents

- 26_DESIGN_PRINCIPLES.md
- 03_SYSTEM_ARCHITECTURE.md
- 31_NON_GOALS.md

## Read Next

- 31_NON_GOALS.md
- 03_SYSTEM_ARCHITECTURE.md

