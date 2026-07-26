# GitHub Administration

## Metadata

- Product: Quantum Rishi Broadcast Platform
- Document Category: Governance
- Constitutional Layer: Layer 4 - Engineering Constitution
- Version: 1.0
- Stability: Constitution controlled

## Purpose

Documents the manual GitHub platform configuration required for the Quantum Rishi Broadcast Platform repository. These settings cannot be automated from files in version control and must be applied by a repository administrator through the GitHub web interface or API.

## Scope

Covers repository settings, branch protection, rulesets, secrets, teams, integrations, and any platform-level configuration that complements the in-repository governance.

## Audience

- Founder
- Repository Administrator
- Architect
- Documentation Maintainer

---

## 1. Repository Settings

Configure the following under **Settings → General**:

### 1.1 Repository Name

- `quantum-rishi-broadcast-platform`

### 1.2 Description

> Enterprise documentation-first specification for a commercial broadcast graphics platform.

### 1.3 Visibility

- Private during the specification phase.
- Public visibility is a business decision and requires Founder approval.

### 1.4 Features

Enable:

- Issues
- Projects (if planning boards are used)
- Discussions (for community Q&A)
- Wiki (disabled - documentation lives in the repository)

Disable:

- Sponsorships (unless [FUNDING.yml](../FUNDING.yml) is activated)

### 1.5 Default Branch

- `main`

### 1.6 Pull Requests

Enable:

- Allow merge commits: No
- Allow squash merging: Yes (default)
- Allow rebase merging: No
- Always suggest updating pull request branches
- Allow auto-merge: No
- Automatically delete head branches: Yes

### 1.7 Archives

Enable:

- Git LFS: Disabled (no large binary assets anticipated during documentation phase)
- Automated security fixes: Enabled

---

## 2. Branch Protection

Configure the following under **Settings → Branches** or via **Rulesets**.

### 2.1 Protected Branch: `main`

Require:

- Pull request before merging.
- At least one approval from a [CODEOWNER](../CODEOWNERS).
- Approval on new commits (dismiss stale approvals).
- Status checks to pass before merging.
- Conversation resolution before merging.
- Signed commits (recommended).
- Linear history (squash merge).
- Do not allow bypassing the above.

### 2.2 Required Status Checks

Add checks as they become available during the implementation phase. At minimum:

- Markdown lint check (when configured).
- Link validation check (when configured).
- Repository validation check (when configured).

### 2.3 Rulesets (Recommended)

Prefer repository rulesets over classic branch protection for finer control:

- Rule name: `main-protection`
- Target: `main`
- Enforcement: Active
- Bypass list: Founder only

---

## 3. Access and Teams

Configure under **Settings → Collaborators and teams**.

### 3.1 Roles

| Role        | Permission            | Granted To                |
| ----------- | --------------------- | ------------------------- |
| Owner       | Admin                 | Founder                   |
| Maintainer  | Maintain              | Architect, Product Owner  |
| Contributor | Write (per invite)    | Active contributors       |
| Reviewer    | Triage + Read         | Documentation Maintainer  |

### 3.2 CODEOWNERS

The [CODEOWNERS](../CODEOWNERS) file maps paths to owners. GitHub automatically requests review from these owners when their paths change. Keep the file synchronized with the actual team structure.

---

## 4. Secrets and Variables

Configure under **Settings → Secrets and variables → Actions**.

### 4.1 Secrets

During the documentation phase, no secrets are required.

When implementation begins, define secrets through GitHub UI only. Never commit secrets to the repository.

### 4.2 Variables

Define non-sensitive variables (such as default environment names) as repository variables. Document each variable's purpose in this file.

---

## 5. Security

Configure under **Settings → Security**.

### 5.1 Security Advisories

Enable private vulnerability reporting.

### 5.2 Dependabot

Enable Dependabot security updates once package manifests exist. No configuration is needed during the documentation phase.

### 5.3 Secret Scanning

Enable:

- Secret scanning
- Push protection

### 5.4 Code Scanning

Code scanning (CodeQL) is enabled once implementation begins. Not required for documentation-only content.

---

## 6. Webhooks and Integrations

Configure under **Settings → Webhooks**.

No webhooks are required during the documentation phase. Add integrations as the implementation phase requires.

---

## 7. GitHub Actions

Configure under **Settings → Actions → General**.

### 7.1 Workflow Permissions

- Read repository contents permission: Yes
- Read and write permissions: No (default to read-only)
- Allow GitHub Actions to create and approve pull requests: No

### 7.2 Workflow Files

No workflow files exist during the documentation phase. Add them under `.github/workflows/` once continuous integration is required.

---

## 8. Issue and Pull Request Settings

### 8.1 Issue Templates

Issue templates live in [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE). Configure the issue creator to use these templates exclusively.

### 8.2 Pull Request Template

The pull request template lives in [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) and is applied automatically.

---

## 9. Project Board (Optional)

If a GitHub Project is used:

- Name: `Quantum Rishi Broadcast Platform`
- Visibility: Private
- Fields: Status, Document Layer, Owner, Priority, Version

Map documentation work to constitutional layers and assign owners per [CODEOWNERS](../CODEOWNERS).

---

## 10. Repository Initialization Checklist

Apply the following steps once after the repository is created:

1. Set repository name, description, and visibility.
2. Set `main` as the default branch.
3. Configure pull request settings (squash merge, auto-delete branches).
4. Apply branch protection on `main` (see Section 2).
5. Configure roles and teams (see Section 3).
6. Enable security features (see Section 5).
7. Configure Actions permissions (see Section 7).
8. Confirm issue and pull request templates are recognized.
9. Add the project board if used (see Section 9).
10. Verify the [CODEOWNERS](../CODEOWNERS) file maps to existing GitHub accounts or teams.

---

## 11. Periodic Review

Review this configuration:

- After each major release.
- When team membership changes.
- When the repository transitions from documentation to implementation.
- When GitHub releases new security or governance features.

---

## Related Documents

- [GOVERNANCE.md](GOVERNANCE.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [SECURITY.md](../SECURITY.md)
- [CODEOWNERS](../CODEOWNERS)

## Read Next

- [GOVERNANCE.md](GOVERNANCE.md)
- [SECURITY.md](../SECURITY.md)