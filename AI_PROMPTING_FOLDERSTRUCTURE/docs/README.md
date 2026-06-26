# Documentation Governance README

## Single Role

This folder is the Product-Engineering OS documentation-governance layer.

It does not generate the target repository's end-user documentation by itself. It defines the rules, PRD structure, architecture-diagram expectations, source-mining protocols, interface contracts, non-regression matrices, and traceability gates that a documentation generator must obey.

For actual repository documentation generation, use the documentation pack entry point:

[`../../doc creation/SYSTEM.md`](<../../doc creation/SYSTEM.md>)

## Relationship To `doc creation/`

Use both folders together like this:

1. Start external documentation generation from [`../../doc creation/SYSTEM.md`](<../../doc creation/SYSTEM.md>).
2. When `AI_PROMPTING_FOLDERSTRUCTURE/` is present in the same repository, the documentation generator must also read this file.
3. Use this folder's governance files to strengthen the generated `docs/` output.
4. Write generated product documentation into repository-root `docs/`, not into `AI_PROMPTING_FOLDERSTRUCTURE/docs/`.

Ownership split:

| Folder | Owns | Does not own |
|---|---|---|
| `AI_PROMPTING_FOLDERSTRUCTURE/docs/` | PRD rules, architecture diagram rules, source mining, traceability, interface contracts, non-regression documentation gates | Generated user manuals, feature catalogs, navigation trees, help-menu JSON output |
| `doc creation/` | The documentation-generation engine and templates for repository-root `docs/` output | Product-Engineering OS governance for all AI development domains |

## Canonical Files

Read these active files for documentation-governance work:

- `prd-template.md` - product requirements, scope, rollout, help/manual, localization, and reconstructability rules.
- `arch-diagrams.md` - architecture, sequence, data-flow, contract-boundary, and change-impact diagram rules.
- `source-pattern-digest.md` - reusable repository source patterns that generated artifacts must apply.
- `repository_source_inventory.md` - source inventory model and refresh expectations.
- `source-to-template-traceability.md` - source-to-output traceability rules.
- `interface-contract-registry.md` - JSON schema, API envelope, React props, event payload, DB invariant, and prompt metadata registry rules.
- `non-regression-matrix.md` - behavior-preservation matrix for features, routes, APIs, permissions, data mutations, UI states, and integrations.
- `changelog-mining-protocol.md` - rules for mining changelogs and release notes.
- `coding-lessons-digest.md` - rules for incorporating recurring coding lessons.

Archived underscore aliases:

- `archive/2026-05-10-docs-harmonization/arch_diagrams.md`
- `archive/2026-05-10-docs-harmonization/prd_template.md`

The archived files are preserved for provenance only. Do not recreate them in the active folder; their useful content is already consolidated into `arch-diagrams.md` and `prd-template.md`.

## Relative Path Policy

All cross-links must be repository-relative. Do not write local workstation paths, usernames, drive letters, desktop/download folders, or checkout-specific absolute paths into these docs.

When referencing the doc-generation pack from this folder, use:

[`../../doc creation/SYSTEM.md`](<../../doc creation/SYSTEM.md>)

When referencing this folder from `doc creation/`, use:

`../AI_PROMPTING_FOLDERSTRUCTURE/docs/README.md`

## Compatibility Gate

Before a documentation-generation task finishes, verify:

- `doc creation/SYSTEM.md` was the single entry point for generated target-repo docs.
- This `README.md` was read when `AI_PROMPTING_FOLDERSTRUCTURE/` exists.
- `prd-template.md` and `arch-diagrams.md` were applied where product scope or architecture docs are generated.
- `source-to-template-traceability.md`, `interface-contract-registry.md`, and `non-regression-matrix.md` were applied when generated docs make behavior, interface, or regression claims.
- Generated docs use repository-relative paths only.
- Archived underscore aliases were not used as active docs.
