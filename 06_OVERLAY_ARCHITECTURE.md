# Overlay Architecture

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Architecture
- Constitutional Layer: Layer 3 - Architecture Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines how overlay modules are organized and composed.

## Scope

Covers overlay root, registry, layer composition, module independence, event use, and one URL rendering philosophy.

## Audience

- Architect
- Developer
- QA
- System Integrator

## Responsibilities

- Defines self-contained overlay modules
- Defines layer composition through one overlay root
- Keeps overlays independent and event-driven
- Supports broadcast composition through a single rendering entry point

## Boundaries

- Does not define visual implementation
- Does not directly control OBS
- Does not permit overlay modules to depend on internal files of other overlays

## Dependencies

- 05_GRAPHICS_SDK.md
- 08_EVENT_SYSTEM.md
- 14_OBS_ADAPTER.md

## Constraints

- One URL
- Event First
- Renderer Last
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

- Predictable rendering composition
- Independent overlay replacement
- Consistent operational behavior
- Testability through isolated overlays

## Rules

- Every overlay has one responsibility
- Overlay communication uses documented events
- Overlay rendering remains separate from data fetching

## Extension Rules

- New overlays require registry entry, events, configuration, and quality expectations
- Future overlays must preserve one URL composition

## Stability Rules

- Overlay architecture remains valid across renderer and framework changes

## Related Documents

- 05_GRAPHICS_SDK.md
- 08_EVENT_SYSTEM.md
- 14_OBS_ADAPTER.md

## Read Next

- 08_EVENT_SYSTEM.md
- 14_OBS_ADAPTER.md

