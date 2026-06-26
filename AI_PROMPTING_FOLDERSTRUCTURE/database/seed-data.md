# Database Seed Data

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Database Seed Data patterns...

Sources reviewed include the current OS files, AGENTS.md, AI_EXECUTION_PROMPTS.md, CLAUDE.md, LOCAL_EXECUTION_MODE.md, governance/*, continue/rules, cursor/rules, GitHub workflow guidance, Source/Changelogs, Source/Codinglessonslearnt, prompt metadata schemas, Next/shadcn/React/Tailwind prompt packs, UI/UX master prompts, and design master rules.

Extracted repository principles:
- Treat clear user requests as execution instructions and avoid repeated permission loops unless the action is destructive, external, production-affecting, security-sensitive, or genuinely ambiguous.
- Preserve already working behavior. Prefer the smallest regression-risk solution and re-check affected flows after every change.
- Use append-only knowledge management for changelogs, coding lessons, build logs, governance notes, and architectural decisions.
- Mine changelogs and coding lessons before work. Explicitly avoid repeated traps: interface/schema drift, Supabase FK typing surprises, auth/session misuse, middleware redirect traps, RLS cross-table joins, provider param errors, concurrency/rate-limit omissions, and overly strict filters that erase valid results.
- For UI and frontend work, enforce Tailwind, shadcn/ui, Radix-compatible primitives, semantic tokens, Headline/CTA/Grid hierarchy, visible focus states, mobile/desktop validation, readable dropdowns, complete loading/empty/error/success states, and no overflow.
- For Next 15 / React 19 work, prefer App Router, Server Components by default, Client Components only for interactivity, explicit TypeScript props, route loading/error boundaries, Suspense when appropriate, minimal dependencies, and 
px shadcn@latest add.
- For prompt packages, require metadata validation, unique slugs, no hidden prompt-package files, no unsupported nested prompt structures, and .md, .mdc, or iprompt.json only when following the source prompt catalog rules.

## Persona
Act as a senior Database owner with 15+ years of production experience. You are accountable for business behavior, technical correctness, accessibility, security, performance, observability, and QA handoff.

## Purpose
Define safe seed types, test fixtures, anonymization, sample data boundaries, and repeatable setup rules.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Database",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["database/schema-rules.md; qa-and-checks/qa-strategy.md"],
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'idle' | 'loading' | 'empty' | 'success' | 'error'; error?: { code: string; message: string; retryable?: boolean } }",
    "api_envelope": {
      "ok": true,
      "data": {},
      "meta": { "requestId": "string", "schemaVersion": "string" },
      "errors": []
    }
  },
  "acceptance_criteria": ["string"]
}
`

## Required Output Contract
`json
{
  "summary": "string",
  "asset_type": "documentation | prompt | template | checklist | sample | system-rule",
  "files_created_or_enhanced": ["string"],
  "repository_patterns_applied": ["string"],
  "edge_cases_handled": ["validation", "permission", "timeout", "stale-state", "empty", "loading", "error", "partial-failure", "rollback"],
  "non_regression_checks": ["string"],
  "qa_handoff": ["string"],
  "open_risks": ["string"]
}
`

## Operating Rules
- Read i_dev_system.md, SYSTEM.md, docs/repository_source_inventory.md, and the local domain instruction before execution.
- Before executing this, ensure database/schema-rules.md; qa-and-checks/qa-strategy.md is reviewed for compatibility.
- Do not erase prior decisions. If a new rule supersedes an older one, append a migration note and compatibility rationale.
- Keep business intent visible: define user problem, expected behavior, scope, non-goals, validation, and rollout impact.
- Include at least happy path, empty state, error state, permission failure, timeout/retry behavior, and rollback or recovery handling.
- When user-facing, provide React props, keyboard behavior, ARIA labels, responsive breakpoints, focus states, and loading/empty/error/success copy.
- When server-facing, provide API envelope, error taxonomy, idempotency, logging, redaction, rate limits, timeout caps, and observability fields.
- When data-facing, provide schema invariants, FK/index rules, migration/backfill strategy, rollback strategy, seed-data behavior, and query performance checks.

## Verification Checklist
- [ ] All repository sources were scanned or the inventory was refreshed.
- [ ] The artifact links to the global controller and relevant owner files.
- [ ] No existing functionality or content was reduced.
- [ ] JSON schema and React/interface expectations are explicit where applicable.
- [ ] Error/empty/loading/success states are covered.
- [ ] Accessibility, security, performance, and regression checks are named.
- [ ] Build log entry exists for this file.

## Compatibility References
- ../ai_dev_system.md
- ../SYSTEM.md
- ../docs/repository_source_inventory.md
- database/schema-rules.md; qa-and-checks/qa-strategy.md

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Seed Data Upgrade

Seed data must be deterministic, idempotent, environment-scoped, PII-safe, and useful for permission testing. It must include happy-path records, empty-state coverage, denied-access records, tenant-boundary records, stale/conflict records, and edge-case records that exercise nullable relations and FK behavior.

Seeds must not mask RLS failures by using elevated permissions everywhere. If service-role seeding is required, provide a separate verification step using normal authenticated and anonymous contexts. Every seed change must declare schema compatibility, generated type impact, reset behavior, and QA scenarios unlocked by the data.

Cross-check before use: `database/schema-rules.md`, `database/migrations.md`, `backend/tests.md`, `qa-and-checks/data-integrity-checks.md`, and `qa-and-checks/security-checks.md`.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: database/seed-data.repository-enhancement-20260506.md -->

## Lossless Consolidation Import From `database/seed-data.repository-enhancement-20260506.md`

This section preserves unique and potentially unique source content during the 2026-05-08 database-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

### Source Scope
Companion enhancement for `database/seed-data.md`.

### Source Analysis
Analyzing all repository sources for seed idempotency, authoritative source hierarchy, safe examples, and no invented facts patterns...

Seed lessons in the repo are unusually clear: do not invent Jira keys, do not hand-author huge unsafe strings, do not rely on seed-only routes when runtime entities exist, and do not fabricate seniority levels when source data is silent.

### Source Enhancement Rules
- Seeds must be idempotent and replayable.
- Seeds must declare authoritative source hierarchy: provider export, CSV, SQL source, markdown interpretation, then inferred examples.
- Never invent external IDs, provider facts, seniority levels, permission keys, or issue keys.
- Large seed sets must be generated by serializer/normalizer processes, not hand-edited multiline strings.
- Seed consumers must use explicit exported getters or APIs, not private local arrays.
- Runtime-created entities must be merged with seed entities in lookup paths.
- Seeds must be anonymized and contain no secrets or production tokens.

### Source Contract
Before executing this, ensure `database/schema-rules.md`, `database/migrations.md`, and `qa-and-checks/data-integrity-checks.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SeedDataPlan",
  "type": "object",
  "required": ["source_authority", "idempotency", "validation", "anonymization", "consumer_contract"],
  "properties": {
    "source_authority": { "type": "array", "items": { "type": "string" } },
    "idempotency": { "type": "string" },
    "validation": { "type": "array", "items": { "type": "string" } },
    "anonymization": { "type": "string" },
    "consumer_contract": { "type": "string" }
  }
}
```

```ts
type SeedDataReportProps = {
  sourceCounts: Array<{ source: string; expected: number; inserted: number }>;
  errors: Array<{ code: string; message: string }>;
};
```

### Source Verification
Seed work is incomplete until IDs are validated, reruns are safe, consumer lookups include runtime state, and invented facts are explicitly absent.

<!-- SOURCE-WIDE-INGESTION-20260510 -->

## Global Catalog And Workspace Import Seed Layer

Analyzing all repository sources for seed-data patterns... Seed data must separate canonical global inventories from tenant/workspace-customized copies. Global catalogs provide stable reference values; workspace imports create editable local records only through explicit, idempotent import functions.

Catalog seed requirements:
- Global catalog seed scripts must be idempotent and deterministic. Re-running a seed must not duplicate roles, skills, positions, capabilities, feature flags, help anchors, localization namespaces, provider registries, or status values.
- Seed data must not invent precision. Unknown seniority, experience level, taxonomy confidence, address match confidence, or provider quality must remain `NULL` or an explicit `unknown` enum instead of being guessed.
- Workspace import functions must copy only the selected global catalog items into tenant scope and preserve `source_catalog_id` or equivalent lineage.
- Tenant-customized copies must not mutate global catalog definitions. Global definitions remain system-owned unless the product explicitly supports curated global updates.
- Seed validation must compare expected count, inserted count, updated count, skipped count, duplicate count, and missing dependency count.
- Seed prompts must include rollback or cleanup behavior for preview/test environments, but production catalog removals require deprecation states rather than hard deletes.

Catalog seed contract:
```ts
type CatalogSeedPlan = {
  catalog: string;
  scope: "global" | "tenant" | "workspace" | "demo";
  idempotencyKey: string;
  unknownValuePolicy: "null" | "unknown-enum" | "explicit-not-applicable";
  importToWorkspace?: {
    functionName: string;
    preservesSourceCatalogId: boolean;
    tenantEditableCopy: boolean;
  };
  verification: {
    expectedCount: number;
    duplicatesPrevented: boolean;
    rerunSafe: boolean;
    rlsVisibilityChecked: boolean;
  };
};
```

Compatibility cross-links: before creating or changing seed data, review `schema-rules.md`, `migrations.md`, `performance.md`, `../backend/services.md`, `../qa-and-checks/data-integrity-checks.md`, and `../qa-and-checks/checklist.md`.
