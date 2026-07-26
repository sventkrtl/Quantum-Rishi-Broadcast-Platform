# Docs

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Reference
- Constitutional Layer: Layer 5 - Reference Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Supplemental documentation area for records that support the root constitution. Holds extended governance, administration guides, and Architecture Decision Records.

## Allowed Contents

- Architecture Decision Records (`adr/`)
- Repository governance documentation
- GitHub administration guides
- Supporting reference documents approved by governance

## Forbidden Contents

- Primary constitution documents (those live at the repository root)
- Non-product conversation records
- Unapproved planning material
- Build or installation instructions

## Documents in This Folder

| Document                             | Purpose                                          |
| ------------------------------------ | ------------------------------------------------ |
| [GOVERNANCE.md](GOVERNANCE.md)       | Repository governance and contribution process   |
| [GITHUB_ADMINISTRATION.md](GITHUB_ADMINISTRATION.md) | Manual GitHub platform configuration |
| [adr/](adr/)                         | Architecture Decision Records                    |

## Naming Conventions

- Folder names use clear responsibility terms.
- Responsibility names must not be overloaded across unrelated areas.
- New children require a documented responsibility before creation.
- Markdown files use `UPPER_SNAKE_CASE.md`.

## Dependencies

- [01_PRODUCT_CONSTITUTION.md](../01_PRODUCT_CONSTITUTION.md)
- [22_FOLDER_RULES.md](../22_FOLDER_RULES.md)
- [22_FOLDER_STRUCTURE.md](../22_FOLDER_STRUCTURE.md)

## Boundaries

This folder owns exactly one responsibility: supplemental governance and reference records. Contents must remain aligned with the documented boundary.

## Quality Expectations

- Folder contents remain understandable without implementation context.
- Folder ownership remains stable as implementation evolves.
- Navigation remains clear for future contributors.