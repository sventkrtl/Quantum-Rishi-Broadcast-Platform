# Repository Governance

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Governance
- Constitutional Layer: Layer 4 - Engineering Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Defines the governance model for the Quantum Rishi Broadcast Platform repository. Establishes branch strategy, commit philosophy, pull request expectations, review process, architectural decision workflow, and documentation update workflow.

## Scope

Applies to every contribution, branch, commit, pull request, architectural decision, and documentation change in this repository.

## Audience

- Founder
- Product Owner
- Architect
- Developer
- QA
- Documentation Maintainer
- Future Contributor

## Governing Principles

This governance document is subordinate to:

- [99_ENGINEERING_OATH.md](../99_ENGINEERING_OATH.md)
- [00_READ_FIRST.md](../00_READ_FIRST.md)
- [01_PRODUCT_CONSTITUTION.md](../01_PRODUCT_CONSTITUTION.md)
- [16_DEVELOPMENT_RULES.md](../16_DEVELOPMENT_RULES.md)
- [17_CODE_STANDARDS.md](../17_CODE_STANDARDS.md)

---

## 1. Branch Strategy

### 1.1 Branch Model

The repository follows a protected `main` branch model with feature branches.

| Branch Type     | Format                                  | Lifetime        |
| --------------- | --------------------------------------- | --------------- |
| Main            | `main`                                  | Permanent       |
| Feature         | `feature/<area>-<short-description>`    | Merged and deleted |
| Documentation   | `docs/<area>-<short-description>`       | Merged and deleted |
| Bug Fix         | `fix/<area>-<short-description>`        | Merged and deleted |
| Governance      | `governance/<short-description>`        | Merged and deleted |
| Release         | `release/v<version>`                    | Merged and deleted |

### 1.2 Branch Naming Rules

- Branch names use lowercase kebab-case.
- Branch names must not include contributor names.
- Branch names must not include ticket IDs alone; describe intent.
- Branch names must be prefixed by type (`feature`, `docs`, `fix`, `governance`, `release`).
- Branches must be deleted after merge.

### 1.3 Protected Branch

- `main` is protected.
- Direct pushes to `main` are prohibited.
- All changes enter through pull request.
- `main` must remain green, valid, and constitutionally consistent at all times.

---

## 2. Commit Message Philosophy

### 2.1 Principles

- Commits tell a story of intent, not a log of activity.
- Each commit represents one logical, reviewable change.
- Each commit message describes what changed and why.
- Commit messages are written in the imperative mood.

### 2.2 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.3 Allowed Types

| Type       | Purpose                                            |
| ---------- | -------------------------------------------------- |
| `docs`     | Documentation changes                              |
| `feat`     | Reserved for future implementation (not used now) |
| `fix`      | Reserved for future implementation (not used now) |
| `refactor` | Reserved for future implementation (not used now) |
| `govern`   | Governance, policy, and process changes            |
| `chore`    | Repository tooling and metadata                    |
| `style`    | Formatting, whitespace, and editorial changes      |

### 2.4 Scope

Scope identifies the affected area (for example, `constitution`, `architecture`, `governance`, `glossary`, `console`, `overlays`).

### 2.5 Subject Rules

- Maximum 72 characters.
- Imperative mood (`Add`, not `Added` or `Adds`).
- No trailing period.
- Capitalize the first letter.

### 2.6 Body Rules

- Wrap at 72 characters.
- Explain what and why, not how.
- Separate from the subject with a blank line.

### 2.7 Footer Rules

- Reference related issues, ADRs, or documents.
- Indicate breaking changes with `BREAKING CHANGE:`.

---

## 3. Pull Request Expectations

### 3.1 Before Opening

- Read [99_ENGINEERING_OATH.md](../99_ENGINEERING_OATH.md).
- Read [CONTRIBUTING.md](../CONTRIBUTING.md).
- Confirm the change is consistent with the constitution.
- Confirm no implementation code, framework, package manager, or build file is introduced.
- Confirm terminology matches the [Glossary](../25_GLOSSARY.md).
- Confirm cross-references are valid.

### 3.2 Required Information

- Clear description of intent.
- Linked issue (when applicable).
- Type of change.
- Completed checklist from [PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md).
- Notes for reviewers.

### 3.3 Size Guidance

- One concern per pull request.
- Prefer smaller, focused pull requests.
- Split large changes into a sequence of small pull requests.

### 3.4 Prohibited Content

- Implementation code.
- Framework configuration files.
- Package manager manifests.
- Build system files.
- Secrets, tokens, or credentials.
- Generated or temporary artifacts.
- AI assistant chat transcripts or implementation notes.

---

## 4. Review Process

### 4.1 Required Reviewers

- At least one approval from a [CODEOWNER](../CODEOWNERS) of the affected area.
- Architectural changes require Architect approval.
- Constitutional changes require Founder or Product Owner approval.
- Governance changes require Founder or designated Lead approval.

### 4.2 Review Criteria

Reviewers verify:

- Constitutional consistency.
- Terminological consistency with the [Glossary](../25_GLOSSARY.md).
- Folder rule compliance per [22_FOLDER_RULES.md](../22_FOLDER_RULES.md).
- Single responsibility per [26_DESIGN_PRINCIPLES.md](../26_DESIGN_PRINCIPLES.md).
- Cross-reference validity.
- Spelling, grammar, and professional language.
- No prohibited content introduced.

### 4.3 Review Conduct

- Reviews are constructive, specific, and respectful.
- Reviews reference documents, not personal preference.
- Reviewers distinguish between blocking and non-blocking feedback.
- Reviewers follow the [Code of Conduct](../CODE_OF_CONDUCT.md).

### 4.4 Approval and Merge

- A pull request is merged only after required approvals.
- Squash and merge is the default strategy.
- The merge commit message follows the commit message philosophy.
- Branches are deleted after merge.

---

## 5. Architectural Decision Workflow

### 5.1 When an ADR Is Required

An Architecture Decision Record (ADR) is required for any change that affects:

- Module boundaries.
- Cross-module contracts.
- Folder structure or responsibility ownership.
- Constitutional layering.
- Performance, security, or reliability characteristics.
- Any decision with long-term impact.

### 5.2 ADR Process

1. Author drafts the ADR using the template in [docs/adr/](adr/).
2. ADR is reviewed by the Architect and affected owners.
3. ADR is assigned a status: `Proposed`, `Accepted`, `Superseded`, or `Deprecated`.
4. Accepted ADRs are registered in [21_ADR_INDEX.md](../21_ADR_INDEX.md).
5. Implementation work begins only after the ADR is `Accepted`.

### 5.3 ADR Numbering

- ADRs are numbered sequentially starting from `0001`.
- Numbers are never reused.
- Superseded ADRs retain their number and link to the successor.

---

## 6. Documentation Update Workflow

### 6.1 When Documentation Updates Are Required

Documentation updates are required when:

- A product, architecture, or governance decision changes.
- Terminology is added, renamed, or deprecated.
- A folder responsibility changes.
- A new constitutional document is introduced.
- A cross-reference becomes invalid.

### 6.2 Update Process

1. Identify all affected documents using cross-references.
2. Update the primary document.
3. Update all dependent documents.
4. Update the [Glossary](../25_GLOSSARY.md) when terminology changes.
5. Update [23_MODULE_REGISTRY.md](../23_MODULE_REGISTRY.md) when module ownership changes.
6. Update [22_FOLDER_STRUCTURE.md](../22_FOLDER_STRUCTURE.md) when structure changes.
7. Add an entry to [20_CHANGELOG.md](../20_CHANGELOG.md).
8. Submit the change as a single pull request when feasible.

### 6.3 Backward Compatibility

- Constitutional documents are stable.
- Breaking changes require an ADR.
- Deprecated terms remain in the Glossary with a `Deprecated` marker.
- Removed documents leave a tombstone file explaining the removal and successor.

---

## 7. Release Workflow

### 7.1 Versioning

The repository follows semantic versioning at the documentation package level:

- `MAJOR`: constitutional layer changes.
- `MINOR`: backward-compatible additions.
- `PATCH`: corrections and clarifications.

### 7.2 Release Process

1. A release branch is created: `release/v<version>`.
2. The [CHANGELOG](../20_CHANGELOG.md) is finalized.
3. The release is reviewed and approved.
4. The release is tagged.
5. The release branch is merged into `main` and deleted.

---

## 8. Issue Triage

### 8.1 Issue Categories

- `bug`: defect in documentation or governance.
- `enhancement`: improvement to existing documentation.
- `documentation`: new documentation or major rewrite.
- `governance`: policy, process, or ownership change.
- `question`: clarification request.

### 8.2 Triage Rules

- New issues are triaged within five business days.
- Issues without sufficient context are returned to the author.
- Duplicate issues are closed with a reference to the original.
- Issues that violate the constitution are closed with an explanation.

---

## 9. Conflict Resolution

### 9.1 Authority Order

When documents or contributors disagree, authority resolves in this order:

1. [99_ENGINEERING_OATH.md](../99_ENGINEERING_OATH.md)
2. [01_PRODUCT_CONSTITUTION.md](../01_PRODUCT_CONSTITUTION.md)
3. [28_BUSINESS_CONSTITUTION.md](../28_BUSINESS_CONSTITUTION.md)
4. Constitutional layer documents
5. Governance documents
6. Individual contributor opinion

### 9.2 Escalation Path

1. Discuss in the pull request or issue.
2. Escalate to the Architect.
3. Escalate to the Product Owner.
4. Escalate to the Founder.

---

## 10. Stability Rules

- This governance document remains stable across implementation technology choices.
- Process changes require a pull request, review, and approval.
- Governance changes that affect contributors are announced before enforcement.

## Related Documents

- [99_ENGINEERING_OATH.md](../99_ENGINEERING_OATH.md)
- [00_READ_FIRST.md](../00_READ_FIRST.md)
- [01_PRODUCT_CONSTITUTION.md](../01_PRODUCT_CONSTITUTION.md)
- [16_DEVELOPMENT_RULES.md](../16_DEVELOPMENT_RULES.md)
- [17_CODE_STANDARDS.md](../17_CODE_STANDARDS.md)
- [21_ADR_INDEX.md](../21_ADR_INDEX.md)
- [22_FOLDER_RULES.md](../22_FOLDER_RULES.md)
- [25_GLOSSARY.md](../25_GLOSSARY.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

## Read Next

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [GITHUB_ADMINISTRATION.md](GITHUB_ADMINISTRATION.md)
- [21_ADR_INDEX.md](../21_ADR_INDEX.md)