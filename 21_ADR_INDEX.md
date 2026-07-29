# ADR Index

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Registry
- Constitutional Layer: Layer 5 - Reference Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Indexes Architecture Decision Records and preserves decision traceability.

## Scope

Covers ADR status, titles, relationships, supersession references, and decision history navigation.

## Audience

- Architect
- Developer
- QA
- Documentation Maintainer
- Future Contributor

## Responsibilities

- Maintains decision history
- Preserves historical ADRs
- Directs readers to active decisions
- Defines ADR quality expectations

## Boundaries

- Does not rewrite ADR history
- Does not contain full decisions
- Does not replace architecture documents

## Dependencies

- docs/adr/README.md
- 20_CHANGELOG.md

## Constraints

- Referenceable
- Version Controlled
- Maintainable

## Design Principles

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Quality Expectations

- Traceable decisions
- Stable architectural memory
- Clear supersession path
- Consistent ADR structure

## Rules

- Each ADR must include context, problem, alternatives, decision, status, consequences, trade-offs, related decisions, rejected alternatives, and timestamp
- Historical ADRs are not edited to change the decision record
- Superseding ADRs preserve history

## Extension Rules

- New ADR categories require index updates
- Superseded decisions must remain discoverable

## Stability Rules

- ADR history remains stable across product evolution

## Active ADRs

- [ADR-0001: M1 Platform Services Architecture](file:///d:/Quantum%20Rishi%20Broadcast%20Platform/docs/adr/ADR_M1_PLATFORM_SERVICES.md)
- [ADR-0002: M2 Runtime Stability & Performance Subsystems](file:///d:/Quantum%20Rishi%20Broadcast%20Platform/docs/adr/ADR_M2_RUNTIME_STABILITY.md)

## Related Documents

- docs/adr/README.md
- 03_SYSTEM_ARCHITECTURE.md

## Read Next

- docs/adr/README.md


