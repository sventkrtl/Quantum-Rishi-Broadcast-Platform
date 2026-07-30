# 🏛️ Git Governance Policy v1.0

**Document Path**: `docs/GIT_GOVERNANCE.md`  
**Status**: APPROVED & LOCKED 🔒  
**Scope**: AV Media Telangana Platform Engine & Graphics Feature Packages  
**GitHub Repository**: `https://github.com/sventkrtl/Quantum-Rishi-Broadcast-Platform`  

---

## 🎯 Purpose

This document establishes the official **Git Workflow, Branching Strategy, Commit Standards, Tagging Policy, and Automation Rules** for the AV Media Telangana Platform.

All developers and AI assistants working on this codebase MUST strictly adhere to these 8 Git Governance Rules.

---

## 🔒 Master Git Governance Rules

### Rule G1 — Production `main` Branch
`main` is strictly a **Production Branch**.
- **NO** direct working commits on `main`.
- **NO** half-completed or unvalidated features on `main`.
- **NO** code without passing unit tests (`npm test`) on `main`.

### Rule G2 — Short-Lived Phase Branches
Every engineering phase MUST be developed on its own dedicated feature branch:
```text
feature/sprint-0.3-phase-0-contract
feature/sprint-0.3-phase-1-skeleton
feature/sprint-0.3-phase-2-consumer
feature/sprint-0.3-phase-3-domain
feature/sprint-0.3-phase-4-timeline
```
*Lifecycle*: Phase Branch Created ──► Development ──► Validation Pass ──► Merge to `main` ──► Delete Branch.

### Rule G3 — Phase Completion Protocol
For every officially approved phase, the execution sequence MUST be:
```
Commit  ──►  Push to GitHub  ──►  Annotated Tag  ──►  Merge to main  ──►  Delete Feature Branch
```

### Rule G4 — Conventional Commit Format
All commit messages MUST follow the **Conventional Commits** specification:
```text
feat(<scope>): <description>
docs(<scope>): <description>
test(<scope>): <description>
fix(<scope>): <description>
refactor(<scope>): <description>
```
*Examples*:
- `feat(secondary-playlist): complete phase 2 consumer boundary implementation`
- `feat(secondary-playlist): complete phase 3 domain model construction`
- `docs(roadmap): freeze phase 3 domain model architecture`
- `test(domain): add immutable model and stable ID validation`

### Rule G5 — Annotated Phase Tags
Every approved phase MUST be stamped with an annotated Git tag:
- `phase-0-frozen` — Secondary Playlist Dataset Contract Frozen
- `phase-1-frozen` — Reference Feature Skeleton Frozen
- `phase-2-frozen` — Consumer Boundary Implementation Frozen
- `phase-3-frozen` — Domain Model Construction Frozen
- `v1.0.0-secondary-playlist` — Official Production Release after Sprint 0.3 Freeze.

### Rule G6 — Rollback Points
Every phase tag serves as a verified, immutable **Rollback Point**:
```bash
git checkout phase-3-frozen
```
If a regression or architectural issue occurs in a later phase, the codebase can instantly roll back to any frozen phase checkpoint.

### Rule G7 — No Untagged Freeze
No phase shall be considered **Frozen** in documentation or governance unless the Git Commit, Push, and Annotated Tag have been completed successfully on GitHub.

### Rule G8 — One Phase = One Clean Commit
Each completed phase MUST produce a clean, unified final commit. Intermediate draft commits on feature branches must be clean or squashed prior to merging so that the `main` branch history remains pristine.

---

## 🤖 Antigravity AI Automation Workflow

When Antigravity completes an approved Phase:

1. Create & checkout feature branch:
   ```bash
   git checkout -b feature/sprint-0.3-phase-X
   ```
2. Verify all unit tests pass:
   ```bash
   node tests/unit/run-all.js
   ```
3. Stage & Commit using Conventional Commit format:
   ```bash
   git add .
   git commit -m "feat(secondary-playlist): complete phase X..."
   ```
4. Merge to `main`:
   ```bash
   git checkout main
   git merge feature/sprint-0.3-phase-X
   ```
5. Tag the frozen phase:
   ```bash
   git tag -a phase-X-frozen -m "Phase X Frozen Checkpoint"
   ```
6. Push commits and tags to GitHub:
   ```bash
   git push origin main --tags
   ```
7. Clean up local feature branch:
   ```bash
   git branch -d feature/sprint-0.3-phase-X
   ```

---

## 🏛️ Branch Topology Model

```text
main (Production Only)
 │
 ├──► feature/sprint-0.3-phase-0  ──► Tag: phase-0-frozen  ──► Merge & Delete
 │
 ├──► feature/sprint-0.3-phase-1  ──► Tag: phase-1-frozen  ──► Merge & Delete
 │
 ├──► feature/sprint-0.3-phase-2  ──► Tag: phase-2-frozen  ──► Merge & Delete
 │
 └──► feature/sprint-0.3-phase-3  ──► Tag: phase-3-frozen  ──► Merge & Delete
```
