# Quantum Rishi Broadcast Platform

> A documentation-first commercial broadcast graphics platform specification.
> This repository contains product, architecture, engineering, and governance documentation.
> No implementation exists. No technology stack is selected. No framework is initialized.

---

## Repository Status

| Attribute              | Value                                       |
| ---------------------- | ------------------------------------------- |
| Product                | Quantum Rishi Broadcast Platform            |
| Repository Type        | Enterprise Specification Repository         |
| Implementation Status  | Not Started (Documentation-First Phase)     |
| Version                | 1.0                                         |
| Stability              | Constitution Controlled                     |
| Last Updated           | See [CHANGELOG](20_CHANGELOG.md)            |

---

## Read First

Before any product, architecture, or engineering work, read in this order:

1. [Engineering Oath](99_ENGINEERING_OATH.md) - immutable engineering principles
2. [Read First](00_READ_FIRST.md) - mandatory reading order and authority model
3. [Product Constitution](01_PRODUCT_CONSTITUTION.md) - highest product authority
4. [Product Vision](02_PRODUCT_VISION.md) - product direction
5. [Business Constitution](28_BUSINESS_CONSTITUTION.md) - business authority

---

## Document Navigation

### Executive Layer (Layer 0)

| Document                            | Purpose                                                  |
| ----------------------------------- | -------------------------------------------------------- |
| [README.md](README.md)              | Repository entry point and navigation                    |
| [00_READ_FIRST.md](00_READ_FIRST.md) | Mandatory reading order and authority model             |
| [99_ENGINEERING_OATH.md](99_ENGINEERING_OATH.md) | Immutable engineering principles               |

### Product Constitution (Layer 2)

| Document                                        | Purpose                                       |
| ----------------------------------------------- | --------------------------------------------- |
| [01_PRODUCT_CONSTITUTION.md](01_PRODUCT_CONSTITUTION.md) | Permanent product authority         |
| [02_PRODUCT_VISION.md](02_PRODUCT_VISION.md)            | Product direction and intent        |
| [28_BUSINESS_CONSTITUTION.md](28_BUSINESS_CONSTITUTION.md) | Business authority              |
| [19_PRODUCT_ROADMAP.md](19_PRODUCT_ROADMAP.md)          | Product roadmap                    |
| [30_PRODUCT_CONSTRAINTS.md](30_PRODUCT_CONSTRAINTS.md)  | Product constraints                |
| [31_NON_GOALS.md](31_NON_GOALS.md)                      | Explicit non-goals                 |
| [32_STAKEHOLDERS.md](32_STAKEHOLDERS.md)                | Stakeholder map                    |

### Architecture Layer (Layer 3)

| Document                                        | Purpose                                       |
| ----------------------------------------------- | --------------------------------------------- |
| [03_SYSTEM_ARCHITECTURE.md](03_SYSTEM_ARCHITECTURE.md) | Overall system architecture        |
| [04_PLATFORM_KERNEL.md](04_PLATFORM_KERNEL.md)        | Platform kernel design             |
| [05_GRAPHICS_SDK.md](05_GRAPHICS_SDK.md)              | Graphics SDK                       |
| [06_OVERLAY_ARCHITECTURE.md](06_OVERLAY_ARCHITECTURE.md) | Overlay architecture            |
| [07_CONTROL_CONSOLE.md](07_CONTROL_CONSOLE.md)        | Control console design             |
| [08_EVENT_SYSTEM.md](08_EVENT_SYSTEM.md)              | Event system design                |
| [09_DATA_ENGINE.md](09_DATA_ENGINE.md)                | Data engine                        |
| [10_ASSET_ENGINE.md](10_ASSET_ENGINE.md)              | Asset engine                       |
| [11_SERVICE_LAYER.md](11_SERVICE_LAYER.md)            | Service layer                      |
| [12_CONFIGURATION_SYSTEM.md](12_CONFIGURATION_SYSTEM.md) | Configuration system           |
| [13_PLUGIN_SYSTEM.md](13_PLUGIN_SYSTEM.md)            | Plugin system                      |
| [14_OBS_ADAPTER.md](14_OBS_ADAPTER.md)                | OBS adapter                        |
| [15_UI_UX_GUIDELINES.md](15_UI_UX_GUIDELINES.md)      | UI/UX guidelines                   |

### Engineering Constitution (Layer 4)

| Document                                        | Purpose                                       |
| ----------------------------------------------- | --------------------------------------------- |
| [16_DEVELOPMENT_RULES.md](16_DEVELOPMENT_RULES.md)    | Development rules                  |
| [17_CODE_STANDARDS.md](17_CODE_STANDARDS.md)          | Code standards                     |
| [18_TESTING_STANDARD.md](18_TESTING_STANDARD.md)      | Testing standard                   |
| [26_DESIGN_PRINCIPLES.md](26_DESIGN_PRINCIPLES.md)    | Design principles                  |
| [27_ERROR_POLICY.md](27_ERROR_POLICY.md)              | Error policy                       |
| [29_QUALITY_ATTRIBUTES.md](29_QUALITY_ATTRIBUTES.md)  | Quality attributes                 |

### Reference Constitution (Layer 5)

| Document                                        | Purpose                                       |
| ----------------------------------------------- | --------------------------------------------- |
| [20_CHANGELOG.md](20_CHANGELOG.md)                    | Versioned change log               |
| [21_ADR_INDEX.md](21_ADR_INDEX.md)                    | Architecture Decision Record index |
| [22_FOLDER_RULES.md](22_FOLDER_RULES.md)              | Folder rules                       |
| [22_FOLDER_STRUCTURE.md](22_FOLDER_STRUCTURE.md)      | Folder structure                   |
| [23_MODULE_REGISTRY.md](23_MODULE_REGISTRY.md)       | Module registry                    |
| [24_FROZEN_MODULES.md](24_FROZEN_MODULES.md)          | Frozen modules list                |
| [25_GLOSSARY.md](25_GLOSSARY.md)                      | Unified glossary                   |

### Governance

| Document                                        | Purpose                                       |
| ----------------------------------------------- | --------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md)                    | How to contribute                  |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)             | Community code of conduct          |
| [SECURITY.md](SECURITY.md)                            | Security policy                    |
| [SUPPORT.md](SUPPORT.md)                              | Support channels                   |
| [docs/GOVERNANCE.md](docs/GOVERNANCE.md)              | Repository governance              |
| [docs/GITHUB_ADMINISTRATION.md](docs/GITHUB_ADMINISTRATION.md) | Manual GitHub configuration |

---

## Repository Structure

```
Quantum Rishi Broadcast Platform/
├── 00_READ_FIRST.md            Mandatory reading order
├── 01-32_*.md                  Constitutional documents
├── 99_ENGINEERING_OATH.md      Immutable engineering principles
├── README.md                   This document
├── CONTRIBUTING.md             Contribution process
├── CODE_OF_CONDUCT.md          Community conduct
├── SECURITY.md                 Security policy
├── SUPPORT.md                  Support guidance
├── CODEOWNERS                  Module ownership map
├── .env.example                Environment template (no secrets)
├── .editorconfig               Editor configuration
├── .gitignore                  Git ignore rules
├── .gitattributes              Git attributes and line endings
├── .github/                    GitHub platform configuration
│   ├── ISSUE_TEMPLATE/         Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── FUNDING.yml                 Funding configuration
├── adapters/                   External integration boundaries
├── assets/                     Brand, media, and templates
├── config/                     Configuration schemas (placeholders)
├── console/                    Control console modules
├── docs/                       Governance, ADRs, extended docs
├── examples/                   Documentation examples
├── overlays/                   Overlay specifications
├── platform/                   Platform kernel modules
├── plugins/                    Plugin specifications
├── sdk/                        Graphics SDK modules
├── services/                   Service layer modules
├── shared/                     Shared contracts and types
├── tests/                      Test specifications
└── tools/                      Tooling specifications
```

See [22_FOLDER_STRUCTURE.md](22_FOLDER_STRUCTURE.md) for the authoritative folder structure.

---

## Quick Facts

- **Documentation First.** Documentation precedes and governs implementation.
- **Architecture Before Code.** Architecture defines implementation, not the reverse.
- **No Implementation.** No source code, no frameworks, no package managers.
- **One Vocabulary.** All documents use the unified [Glossary](25_GLOSSARY.md).
- **Constitution Controlled.** Stability is governed by constitutional documents.

---

## Getting Oriented

If you are new to the repository:

1. Read [Engineering Oath](99_ENGINEERING_OATH.md)
2. Read [Read First](00_READ_FIRST.md)
3. Read [Product Constitution](01_PRODUCT_CONSTITUTION.md)
4. Read [Product Vision](02_PRODUCT_VISION.md)
5. Skim the [System Architecture](03_SYSTEM_ARCHITECTURE.md)
6. Review the [Glossary](25_GLOSSARY.md) for terminology
7. Read [Contributing](CONTRIBUTING.md) before opening a pull request

---

## License

To be defined. No license file is committed until the legal review is complete.

---

## Contact

See [SUPPORT.md](SUPPORT.md) for support channels and communication paths.