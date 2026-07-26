# Folder Structure

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Reference
- Constitutional Layer: Layer 5 - Reference Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines the repository structure at a responsibility level.

## Scope

Covers top-level folders and approved child responsibility areas.

## Audience

- Architect
- Developer
- Documentation Maintainer
- Future Contributor

## Responsibilities

- Documents structure only
- Keeps generated and build folders out of architecture
- Supports repository freeze review
- Provides a folder registry reference

## Boundaries

- Does not explain implementation
- Does not include generated folders
- Does not include package folders

## Dependencies

- 22_FOLDER_RULES.md
- 23_MODULE_REGISTRY.md

## Constraints

- Structure reflects product responsibility
- No implementation assumptions
- No generated artifacts

## Design Principles

- Single Responsibility
- Composition over Duplication
- Event First
- Configuration First
- One URL
- Platform First
- Renderer Last

## Quality Expectations

- Clear navigation
- Stable folder ownership
- Consistent naming
- Referenceable structure

## Rules

- Folder trees describe structure only
- Folder names must use approved terminology
- Folder structure must not imply implementation choices

## Extension Rules

- New structure entries require matching folder rules and module registry alignment
- Structure changes require documentation update before repository change

## Stability Rules

- The folder structure remains product-level and implementation-neutral

## Related Documents

- 22_FOLDER_RULES.md
- 25_GLOSSARY.md

## Read Next

- 23_MODULE_REGISTRY.md
- 25_GLOSSARY.md

