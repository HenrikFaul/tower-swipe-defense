# Database Migrations

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Database Migrations patterns...

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
Define migration planning, backfill, rollback, lock safety, forward/backward compatibility, and changelog linkage.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Database",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["database/migration_template.md; qa-and-checks/checklist.md"],
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
- Before executing this, ensure database/migration_template.md; qa-and-checks/checklist.md is reviewed for compatibility.
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
- database/migration_template.md; qa-and-checks/checklist.md

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Migration Safety Upgrade

Migrations must use an expand/contract posture for risky changes: add compatible structures first, backfill idempotently, dual-read or dual-write where needed, verify, then remove legacy structures only after explicit confirmation. Destructive changes require mandatory confirmation and rollback notes.

Every migration artifact must include preflight checks, lock-risk assessment, expected row counts, batching/backfill plan, rollback or forward-fix plan, generated type refresh, service/API compatibility impact, seed fixture update, and QA verification query. RLS/policy migrations must include permission regression checks for allowed, denied, tenant-crossing, and anonymous/user/service-role contexts.

Cross-check before use: `database/migration_template.md`, `database/schema-rules.md`, `backend/tests.md`, `qa-and-checks/data-integrity-checks.md`, and `docs/non-regression-matrix.md`.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: database/migrations.repository-enhancement-20260506.md -->

## Lossless Consolidation Import From `database/migrations.repository-enhancement-20260506.md`

This section preserves unique and potentially unique source content during the 2026-05-08 database-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

### Source Scope
Companion enhancement for `database/migrations.md`.

### Source Analysis
Analyzing all repository sources for idempotent migration process, rollback, chunking, defaults, dependent views, and schema-cache safety patterns...

The repo documents concrete migration failures: incompatible defaults during type conversion, naive schema audits, oversized database-side merge statements, schema-cache lag, and hidden data loss when old target rows mask current import failures.

### Source Enhancement Rules
- Run information_schema preflight before changing column types or assuming source/target compatibility.
- Add missing columns before conversion. Drop dependent views before type changes. Drop incompatible defaults before `ALTER COLUMN TYPE`. Reapply defaults and recreate views only after conversion succeeds.
- Use explicit casts and never rely on mixed-type `COALESCE`.
- Migrations must be idempotent where possible and include `if not exists` or guarded DO blocks.
- Data backfills must be chunked for large tables and verified by current load session or deterministic cursor boundaries.
- RLS changes require positive and negative tests. No RLS weakening without explicit risky-change artifact.
- Every migration needs rollback SQL or documented irreversibility with mitigation.

### Source Contract
Before executing this, ensure `database/migration_template.md`, `database/performance.md`, and `qa-and-checks/performance-checks.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "MigrationPlan",
  "type": "object",
  "required": ["preflight", "ddl", "backfill", "rls", "indexes", "rollback", "postflight"],
  "properties": {
    "preflight": { "type": "array", "items": { "type": "string" } },
    "ddl": { "type": "array", "items": { "type": "string" } },
    "backfill": { "type": "array", "items": { "type": "string" } },
    "rls": { "type": "array", "items": { "type": "string" } },
    "indexes": { "type": "array", "items": { "type": "string" } },
    "rollback": { "type": "array", "items": { "type": "string" } },
    "postflight": { "type": "array", "items": { "type": "string" } }
  }
}
```

```ts
type MigrationStatusProps = {
  phase: "preflight" | "ddl" | "backfill" | "verify" | "rollback";
  errors: Array<{ code: string; message: string }>;
  evidence: string[];
};
```

### Source Verification
Do not mark complete until preflight, postflight, rollback, RLS tests, interface regeneration impact, and changelog/build_log entries are accounted for.
