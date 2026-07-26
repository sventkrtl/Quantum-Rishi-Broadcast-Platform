# Development Rules

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Governance
- Constitutional Layer: Layer 4 - Engineering Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines the order and constraints for future engineering work.

## Scope

Covers documentation-first workflow, architecture-before-code order, module independence, testing expectations, review expectations, and freeze discipline.

## Audience

- Architect
- Developer
- QA
- Documentation Maintainer
- Future Contributor

## Responsibilities

- Prevents implementation from defining architecture
- Defines readiness before coding
- Protects module independence
- Connects development work to documentation and ADRs

## Boundaries

- Does not contain build commands
- Does not name package managers
- Does not contain unapproved task lists

## Dependencies

- 99_ENGINEERING_OATH.md
- 01_PRODUCT_CONSTITUTION.md
- 18_TESTING_STANDARD.md
- 24_FROZEN_MODULES.md

## Constraints

- Documentation First
- Testability
- Maintainability

## Design Principles

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Quality Expectations

- Predictable engineering workflow
- Traceable decisions
- Lower regression risk
- Maintainable module ownership

## Rules

- The Engineering Oath is the first contributor commitment.
- Implementation begins only after governing documentation exists
- Module work proceeds through documented boundaries
- Reviews check conformance to constitution and architecture

## Extension Rules

- New development practices require governance updates
- Process changes must preserve documentation authority

## Stability Rules

- Development rules remain valid across engineering tool changes

## Related Documents

- 17_CODE_STANDARDS.md
- 18_TESTING_STANDARD.md
- 21_ADR_INDEX.md

## Read Next

- 17_CODE_STANDARDS.md
- 18_TESTING_STANDARD.md

