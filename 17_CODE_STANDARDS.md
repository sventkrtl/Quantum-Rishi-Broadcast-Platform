# Code Standards

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Governance
- Constitutional Layer: Layer 4 - Engineering Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines architecture-level standards that future code must satisfy.

## Scope

Covers coupling, hardcoded values, renderer boundaries, service boundaries, module imports, configuration-first behavior, and review expectations.

## Audience

- Architect
- Developer
- QA
- Future Contributor

## Responsibilities

- Translates constitution rules into engineering constraints
- Protects long-term maintainability
- Keeps implementation subordinate to architecture
- Defines prohibited coupling patterns at a product level

## Boundaries

- Does not include code snippets
- Does not prescribe a programming language
- Does not define package structure

## Dependencies

- 16_DEVELOPMENT_RULES.md
- 22_FOLDER_RULES.md
- 26_DESIGN_PRINCIPLES.md

## Constraints

- Maintainability
- Simplicity
- Configurability
- Testability

## Design Principles

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Quality Expectations

- Low coupling
- Clear ownership
- Consistent product behavior
- Implementation replaceability

## Rules

- Hardcoded product behavior is not allowed
- Renderers must not own business logic
- Services must not own user interface behavior
- Modules must not import unrelated internal module details

## Extension Rules

- New standards require product impact and architectural rationale
- Standards must remain implementation-neutral where possible

## Stability Rules

- Code standards remain valid across language and framework changes

## Related Documents

- 18_TESTING_STANDARD.md
- 29_QUALITY_ATTRIBUTES.md

## Read Next

- 18_TESTING_STANDARD.md
- 29_QUALITY_ATTRIBUTES.md

