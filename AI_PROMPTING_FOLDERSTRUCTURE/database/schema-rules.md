# Database Schema Rules

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Database Schema Rules patterns...

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
Define entity modeling, FK/index standards, SQL-to-TypeScript alignment, RLS warnings, and invariant ownership.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Database",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["database/schema_template.md; backend/services.md"],
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
- Before executing this, ensure database/schema_template.md; backend/services.md is reviewed for compatibility.
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
- database/schema_template.md; backend/services.md

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Supadupa Enhancement Layer

### Analysis
Analyzing all repository sources for Database Schema Rules supadupa-enhancement patterns...

This enhancement layer deepens the existing Database artifact with the newest repository-wide operating memory. It preserves all prior content and adds stronger instructions for source ingestion, append-only governance, production-ready asset generation, and QA-verifiable delivery.

### Added Capability
Adds data integrity check links and schema-to-interface enforcement.

### Mandatory Source Patterns To Apply
- Read governance and execution authority before implementation when present.
- Treat clear requests as execution instructions; avoid extra permission loops for non-destructive implied work.
- Ask before destructive deletion, irreversible overwrite, production deployment, external publishing, external messages, security-sensitive operations, or access-control-sensitive operations.
- Mine changelogs and coding lessons before changing templates or production assets.
- Preserve working behavior; compare at least two solution options when risk is non-trivial.
- Keep changelogs, build logs, lessons, and architectural notes append-only.
- Enforce Tailwind, shadcn/ui, Radix, Headline/CTA/Grid hierarchy, responsive breakpoints, focus states, and loading/empty/error/success states for user-facing assets.
- Require JSON schemas, React props, API envelopes, data invariants, and QA handoff where relevant.

### Supadupa Contract
~~~json
{
  "artifact": "Database Schema Rules",
  "source_files_analyzed": "all repository sources, with inventory reference",
  "non_regression": true,
  "append_only": true,
  "compatibility_links": ["qa-and-checks/data-integrity-checks.md; docs/interface-contract-registry.md"],
  "verification_required": ["reference check", "schema/interface check", "edge-state check", "qa handoff check"]
}
~~~

Before executing this enhancement, ensure qa-and-checks/data-integrity-checks.md; docs/interface-contract-registry.md are reviewed for compatibility.

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Schema Rule Upgrade

Schema rules must now act as the first gate for all downstream assets. Every entity must declare business owner, lifecycle, tenant boundary, privacy class, retention rule, uniqueness model, nullable semantics, FK behavior, index strategy, RLS/access policy, generated type impact, and backend contract impact.

Avoid schema/interface drift by forcing TypeScript or client type regeneration notes for every column, relation, enum, view, function, or policy change. Supabase relation outputs must account for nullable rows, one-to-many arrays, FK naming, and RLS-visible relation gaps. RLS policies must avoid unsafe cross-table joins unless explicitly justified and tested.

Cross-check before use: `database/schema_template.md`, `database/migrations.md`, `backend/services.md`, `docs/interface-contract-registry.md`, and `qa-and-checks/data-integrity-checks.md`.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: database/schema-rules.repository-enhancement-20260506.md -->

## Lossless Consolidation Import From `database/schema-rules.repository-enhancement-20260506.md`

This section preserves unique and potentially unique source content during the 2026-05-08 database-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

### Source Scope
Companion enhancement for `database/schema-rules.md`.

### Source Analysis
Analyzing all repository sources for table modeling, FK policy, canonical identity, address/provider lineage, and workspace-scoped schema patterns...

The canonical address architecture and SQL files establish a strong pattern: master entities, provider registries, source records, merge keys, lineage, review queues, source payloads, generated columns, and never-delete semantics for canonical rows.

### Source Enhancement Rules
- Use stable UUID primary keys unless an existing table uses a documented alternative.
- Use unique provider/source keys for imports, for example `(external_source, external_id)` or `(provider_id, provider_native_id)`.
- Use `ON DELETE RESTRICT` for catalog/reference rows consumed by historical data. Use cascade only inside tightly bounded owned aggregates.
- Include lifecycle fields such as `is_active`, `status`, `address_quality`, `valid_from`, `valid_to`, or deprecation fields instead of deleting canonical records.
- Include `source_payload jsonb`, source timestamps, source hash, import session, or lineage table where data comes from providers.
- For canonical matching, preserve ambiguity via evidence, confidence, review queue, and audit rows instead of over-merging.
- SQL names, enum codes, and permission keys must not be localized; only display strings may localize.

### Source Contract
Before executing this, ensure `database/migrations.md`, `database/schema_template.md`, and `integration/api-contracts.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SchemaRuleAsset",
  "type": "object",
  "required": ["tables", "constraints", "rls", "indexes", "type_interfaces"],
  "properties": {
    "tables": { "type": "array", "items": { "type": "string" } },
    "constraints": { "type": "array", "items": { "type": "string" } },
    "rls": { "type": "array", "items": { "type": "string" } },
    "indexes": { "type": "array", "items": { "type": "string" } },
    "type_interfaces": { "type": "array", "items": { "type": "string" } }
  }
}
```

<!-- SOURCE-WIDE-INGESTION-20260510 -->

## Canonical Source Matching And MDM Layer

Analyzing all repository sources for database schema patterns... When a product ingests the same real-world entity from multiple providers, the database must model canonical identity separately from provider provenance. Do not merge provider records directly into one mutable row without preserving evidence, confidence, manual review, and audit history.

Canonical matching requirements:
- Create a provider registry for every upstream source, including source name, trust tier, refresh cadence, ownership, terms constraints, and import status.
- Store raw or normalized provider source records separately from canonical entities. Provider records keep upstream identifiers, payload hash, source timestamps, geocode/geometry evidence where relevant, and import batch/run IDs.
- Link provider records to canonical entities through a link table with confidence score, match method, match run ID, evidence summary, reviewer fields, and active/inactive state.
- Use confidence bands: high-confidence links may auto-attach only when deterministic identifiers or very strong geospatial/textual evidence agree; medium confidence requires review; low confidence stays unlinked.
- Ambiguous entities must enter a review queue. The system must never force a merge when evidence conflicts across address, name, geometry, tenant, ownership, or provider identity.
- Preserve immutable audit trails for provider payload changes, manual review decisions, merge/split operations, and canonical field overrides.
- Read models may denormalize best display fields, but must retain pointers to canonical entity ID and provider evidence so downstream services can explain why data appears.

Reference schema contract:
```json
{
  "canonical_entity_model": {
    "canonical_table": "required",
    "provider_registry": "required",
    "provider_source_record": "required",
    "canonical_provider_link": "required",
    "match_run": "required",
    "match_evidence": "required",
    "review_queue": "required",
    "audit_log": "required"
  },
  "matching_policy": {
    "auto_link_threshold_documented": true,
    "manual_review_band_documented": true,
    "ambiguous_merge_forbidden": true,
    "source_lineage_visible_to_consumers": true
  }
}
```

Compatibility cross-links: before modeling canonical/provider data, review `migrations.md`, `performance.md`, `seed-data.md`, `../backend/services.md`, `../integration/third-party-services.md`, `../qa-and-checks/data-integrity-checks.md`, and `../docs/arch-diagrams.md`.

```ts
type SchemaRuleReviewProps = {
  tables: Array<{ name: string; hasRls: boolean; hasIndexes: boolean }>;
  errors: Array<{ code: string; message: string }>;
};
```

### Source Verification
Schema review must prove column/interface parity, RLS posture, index coverage, unique key strategy, and non-regression against preserved domain semantics.

<!-- CODING-LESSONS-20260510-INGESTION -->

## Coding Lessons Ingestion - Database Integrity Guards

Source reviewed: `C:/Users/Lenovo/Downloads/codingLessonsLearnt (2).md`.

New database lessons to enforce:
- Scheduling, dependency, workflow, org-chart, and graph-like systems must block dependency cycles at the database layer before insert/update. Prefer PostgreSQL recursive CTE reachability checks inside a transaction over application-only graph traversal, because application checks can race concurrent writes.
- SECURITY DEFINER helpers used for integrity checks must set a safe `search_path` and must accept only typed identifiers. Never concatenate user-controlled identifiers into dynamic SQL for cycle checks.
- Global catalog tables with RLS enabled but no SELECT policy will return zero rows even when seed data exists. Every catalog table must explicitly document whether it is public-read, authenticated-read, tenant-scoped, or service-only.
- Optional new columns must be schema-cache safe from the frontend. During expand/contract migrations, frontend payloads should omit optional columns until the schema cache and generated types are updated, or use safe fallbacks documented in the migration.
- Legacy compatibility columns must be considered before replacing rules. If both `day_of_week` and `days_of_week` style fields exist, migration and query prompts must identify canonical and legacy read paths.

Database integrity contract:
```json
{
  "graph_or_dependency_edges": {
    "cycle_detection": "recursive_cte_database_guard",
    "application_guard_only": false,
    "security_definer_search_path_set": true
  },
  "catalog_rls": {
    "rls_enabled": true,
    "select_policy_declared": true,
    "visibility_model": "public | authenticated | tenant | service"
  },
  "expand_contract": {
    "schema_cache_safe_payload": true,
    "legacy_columns_reviewed": true,
    "generated_types_regeneration_plan": true
  }
}
```
