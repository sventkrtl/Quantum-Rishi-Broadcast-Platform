# Folder Rules

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Governance
- Constitutional Layer: Layer 4 - Engineering Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines folder ownership, responsibility boundaries, and nesting rules.

## Scope

Applies to every repository folder and future module folder.

## Audience

- Architect
- Developer
- Documentation Maintainer
- Future Contributor

## Responsibilities

- Requires one responsibility per folder
- Defines allowed and forbidden folder contents
- Prevents structural drift
- Keeps repository organization aligned with product architecture

## Boundaries

- Does not define source implementation
- Does not define build artifacts
- Does not permit mixed responsibilities

## Dependencies

- 22_FOLDER_STRUCTURE.md
- 23_MODULE_REGISTRY.md

## Constraints

- Single Responsibility
- Consistency
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

- Readable structure
- Stable responsibility ownership
- Low navigation ambiguity
- Maintainable growth

## Rules

- Each folder owns exactly one responsibility
- Generated and build folders are not part of constitutional structure
- New folders require documented responsibility

## Extension Rules

- New folder categories require purpose, allowed contents, forbidden contents, naming convention, and dependencies
- Folder changes that affect module boundaries require registry review

## Stability Rules

- Folder rules remain stable across implementation technologies

## Related Documents

- 22_FOLDER_STRUCTURE.md
- 25_GLOSSARY.md

## Read Next

- 22_FOLDER_STRUCTURE.md
- 23_MODULE_REGISTRY.md

