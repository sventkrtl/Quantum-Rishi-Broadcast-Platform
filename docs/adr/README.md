# Architecture Decision Records

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Reference
- Constitutional Layer: Layer 5 - Reference Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Historical record of architectural decisions. Each ADR captures a single decision, its context, alternatives considered, and consequences.

## ADR Status Values

| Status       | Meaning                                                    |
| ------------ | ---------------------------------------------------------- |
| Proposed     | Drafted, awaiting review and acceptance                    |
| Accepted     | Approved and active                                        |
| Deprecated   | No longer relevant; not replaced                           |
| Superseded   | Replaced by a later ADR (link required)                    |

## File Naming

ADRs are numbered sequentially:

```
docs/adr/ADR-XXXX-short-title-in-kebab-case.md
```

Numbers are zero-padded to four digits and never reused.

## ADR Template

When creating a new ADR, use this structure:

```markdown
# ADR-XXXX: <Title>

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Architecture Decision Record
- Status: Proposed | Accepted | Deprecated | Superseded
- Date: YYYY-MM-DD
- Supersedes: <ADR-XXXX or none>
- Superseded By: <ADR-XXXX or none>

## Context

Describe the forces at play, including technological, political, social, and project constraints.

## Problem

State the architectural problem being addressed.

## Alternatives Considered

List each viable alternative with its trade-offs.

## Decision

State the decision clearly and concisely.

## Consequences

Describe the resulting context, positive and negative consequences, and risks introduced.

## Trade-offs

Summarize the trade-offs accepted by this decision.

## Related Decisions

Reference related ADRs and constitutional documents.

## Rejected Alternatives

Briefly note alternatives that were rejected and why.
```

## Allowed Contents

- ADR documents following the template above.
- Index updates to `21_ADR_INDEX.md`.

## Forbidden Contents

- Edited historical decisions.
- Implementation code.
- Unapproved planning material.

## Process

1. Author the ADR using the template.
2. Mark status as `Proposed`.
3. Submit a pull request for review.
4. On approval, update status to `Accepted`.
5. Register the ADR in [21_ADR_INDEX.md](../../21_ADR_INDEX.md).
6. Implementation work begins only after the ADR is `Accepted`.

## Naming Conventions

- Folder names use clear responsibility terms.
- Responsibility names must not be overloaded across unrelated areas.
- New children require a documented responsibility before creation.
- ADR files use the `ADR-XXXX-kebab-case-title.md` form.

## Dependencies

- [01_PRODUCT_CONSTITUTION.md](../../01_PRODUCT_CONSTITUTION.md)
- [21_ADR_INDEX.md](../../21_ADR_INDEX.md)
- [22_FOLDER_RULES.md](../../22_FOLDER_RULES.md)
- [22_FOLDER_STRUCTURE.md](../../22_FOLDER_STRUCTURE.md)

## Boundaries

This folder owns exactly one responsibility: Architecture Decision Records. Contents must remain aligned with the documented boundary.

## Quality Expectations

- Folder contents remain understandable without implementation context.
- Folder ownership remains stable as implementation evolves.
- Navigation remains clear for future contributors.
- Each ADR is self-contained and decision-complete.