# Asset Engine

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Product Design
- Constitutional Layer: Layer 3 - Architecture Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines how platform assets are governed and organized.

## Scope

Covers asset categories, ownership, branding boundaries, template boundaries, discoverability, and asset quality.

## Audience

- Product Owner
- Architect
- Developer
- System Integrator

## Responsibilities

- Defines asset ownership
- Keeps assets discoverable
- Preserves branding and template boundaries
- Supports consistent broadcast presentation

## Boundaries

- Does not embed assets in source logic
- Does not define build packaging
- Does not mix configuration ownership with asset storage

## Dependencies

- 12_CONFIGURATION_SYSTEM.md
- 15_UI_UX_GUIDELINES.md

## Constraints

- Configuration First
- Consistency
- Single Responsibility

## Design Principles

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Quality Expectations

- Consistent visual assets
- Maintainable asset organization
- Portable asset references
- Clear ownership

## Rules

- Assets must be organized by responsibility
- Asset selection must be configuration-aware
- Branding assets must not redefine product architecture

## Extension Rules

- New asset categories require documented ownership and allowed contents
- Asset expansion must preserve discoverability

## Stability Rules

- Asset governance remains valid across packaging and delivery changes

## Related Documents

- 15_UI_UX_GUIDELINES.md
- 22_FOLDER_RULES.md

## Read Next

- 15_UI_UX_GUIDELINES.md
- 12_CONFIGURATION_SYSTEM.md

