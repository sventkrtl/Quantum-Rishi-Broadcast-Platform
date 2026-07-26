# Design Principles

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Frozen
- Constitutional Layer: Layer 2 - Product Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines permanent design principles that remain stable above architecture-level decisions.

## Scope

Covers Single Responsibility, Composition over Duplication, Event First, Configuration First, One URL, Platform First, and Renderer Last.

## Audience

- Founder
- Product Owner
- Architect
- Developer
- QA
- Future Contributor

## Responsibilities

- Guides all architecture
- Resolves design conflict before implementation
- Keeps product responsibilities stable
- Defines what must never change without formal governance

## Boundaries

- Does not define implementation
- Does not depend on framework choices
- Does not change through local module preference

## Dependencies

- 01_PRODUCT_CONSTITUTION.md
- 30_PRODUCT_CONSTRAINTS.md

## Constraints

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Design Principles

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Quality Expectations

- Stable design judgment
- Clear conflict resolution
- Consistent architecture
- Reduced duplication

## Rules

- Single Responsibility governs every folder, module, service, adapter, and document
- Composition is preferred when duplication would create drift
- Events are the default communication model
- Configuration precedes hardcoded behavior
- The overlay system keeps one rendering entry point
- The platform owns coordination before specialized modules
- Renderers present state after platform and data responsibilities are resolved

## Extension Rules

- New principles require constitutional approval and impact review
- Principles may be clarified but not weakened by architecture documents

## Stability Rules

- Design principles remain stable above architecture and implementation

## Related Documents

- 01_PRODUCT_CONSTITUTION.md
- 30_PRODUCT_CONSTRAINTS.md

## Read Next

- 30_PRODUCT_CONSTRAINTS.md
- 03_SYSTEM_ARCHITECTURE.md

