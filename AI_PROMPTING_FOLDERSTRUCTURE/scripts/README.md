# Scripts Canonical Map

<!-- SCRIPTS-RATIONALIZATION-2026-05-10 -->

## Purpose

`scripts/` owns automation, validation, bootstrap, CI/CD, linting, prompt metadata validation, and reference verification for the Product-Engineering OS.

Use this folder when the task asks how the system should be created, enhanced, checked, linted, verified, or prepared for CI/CD.

## Canonical Active Documentation

- `ci-cd-pipeline.md`: canonical CI/CD orchestration and release automation guide.
- `linting-rules.md`: canonical linting, prompt hygiene, static checks, and repo consistency guide.
- `prompt-metadata-validation.md`: prompt package metadata and catalog validation guide.
- `reference-verification.md`: cross-folder reference, alias, broken-link, and placeholder verification guide.

## Archived Documentation Aliases

The underscore variants are no longer active documentation entrypoints because their content is already preserved in the canonical hyphenated files:

- `ci_cd_pipeline.md` -> `ci-cd-pipeline.md`
- `linting_rules.md` -> `linting-rules.md`

They are archived under `archive/2026-05-10-rationalized/`.

## Active PowerShell Automation

The PowerShell scripts remain active because they represent different historical automation passes:

- `bootstrap_ai_prompting_structure.ps1`: initial folder and prompt bootstrap.
- `bootstrap_product_engineering_os.ps1`: ultimate Product-Engineering OS bootstrap.
- `enhance_product_engineering_os.ps1`: recursive enhancement and inventory pass.
- `expand_my_ai_dev_system.ps1`: expanded structure generation pass.
- `supadupa_transform_my_ai_dev_system.ps1`: deeper supadupa enhancement pass.

Future automation should prefer a new wrapper or documented runbook over deleting these historical scripts. If a script is superseded, archive it only after its behavior is represented in an active script or guide and the build log records the migration.

## Required Read Order

1. `../ai_dev_system.md`
2. `../SYSTEM.md`
3. `README.md`
4. `ci-cd-pipeline.md` for release automation tasks
5. `linting-rules.md` for static verification tasks
6. `prompt-metadata-validation.md` for prompt package validation
7. `reference-verification.md` for cross-folder link checks
8. `../qa-and-checks/checklist.md` before any release-impacting automation

## External Standards Added In 2026-05-10 Pass

- GitHub Actions secure-use guidance: least-privilege `GITHUB_TOKEN`, secret minimization, safe third-party actions, and injection avoidance.
- GitHub Actions workflow syntax: explicit triggers, permissions, concurrency, environment gates, and job-level outputs.
- ESLint flat configuration: treat lint config as executable quality policy, not optional style.
- Prettier configuration: centralize formatting configuration and avoid hidden style drift.
- PowerShell `ShouldProcess`: destructive or broad file-changing automation should support dry-run/confirmation behavior.
- PSScriptAnalyzer: PowerShell automation should be lintable and reviewed for maintainability issues.
- Semantic Versioning: release automation should label breaking, minor, and patch impacts explicitly.

## Non-Regression Rule

Do not remove a script or alias unless its behavior is represented in a canonical active file and the archive manifest explains the migration.
