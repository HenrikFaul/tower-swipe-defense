# Database Performance

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Database Performance patterns...

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
Define query-plan review, index strategy, concurrency limits, pagination, caching, and performance budgets.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Database",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["database/performance_tuning.md; scripts/ci_cd_pipeline.md"],
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
- Before executing this, ensure database/performance_tuning.md; scripts/ci_cd_pipeline.md is reviewed for compatibility.
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
- database/performance_tuning.md; scripts/ci_cd_pipeline.md

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Performance Gate Upgrade

Database performance artifacts must define read/write budgets before backend implementation: expected cardinality, index selectivity, pagination method, sort stability, filter defaults, cache behavior, invalidation trigger, explain/analyze requirement, and maximum acceptable latency.

Queries must avoid unbounded scans, accidental N+1 relation loading, unstable offset pagination on large sets, hard filters that zero out valid results, and provider-specific geospatial mistakes. For geospatial data, declare SRID, coordinate order, bbox versus radius semantics, precision/null handling, and index type. Critical paths need regression evidence comparing before/after behavior.

Cross-check before use: `database/performance_tuning.md`, `database/schema-rules.md`, `backend/services.md`, `qa-and-checks/performance-checks.md`, and `scripts/ci-cd-pipeline.md`.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: database/performance.repository-enhancement-20260506.md -->

## Lossless Consolidation Import From `database/performance.repository-enhancement-20260506.md`

This section preserves unique and potentially unique source content during the 2026-05-08 database-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

### Source Scope
Companion enhancement for `database/performance.md`.

### Source Analysis
Analyzing all repository sources for query planning, indexes, chunked ETL, realtime limits, provider imports, and statement-timeout resilience patterns...

The repo shows real performance risks: polling every few seconds, oversized database-side merges, row-by-row JavaScript loops for large POI transfers, and RLS cost from policy complexity.

### Source Enhancement Rules
- Every performance recommendation must name the query shape, expected cardinality, index strategy, and validation query.
- Use EXPLAIN/ANALYZE or Supabase-equivalent evidence for high-risk queries.
- Large provider imports must use stable cursor chunks and statement-timeout budgets.
- Database-side set operations are preferred over row-by-row JavaScript only when measured plans and lock budgets are safe.
- Polling should be challenged when Supabase realtime or server-side push is more efficient.
- RLS policies must be evaluated for cross-table recursion and helper-function cost.
- Indexes must match actual filters: workspace, provider/source key, event date, city, active status, status queue fields, and canonical merge keys.

### Source Contract
Before executing this, ensure `database/performance_tuning.md`, `database/schema-rules.md`, and `qa-and-checks/performance-checks.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "DatabasePerformancePlan",
  "type": "object",
  "required": ["baseline", "query_shapes", "indexes", "risks", "remeasurement"],
  "properties": {
    "baseline": { "type": "array", "items": { "type": "string" } },
    "query_shapes": { "type": "array", "items": { "type": "string" } },
    "indexes": { "type": "array", "items": { "type": "string" } },
    "risks": { "type": "array", "items": { "type": "string" } },
    "remeasurement": { "type": "array", "items": { "type": "string" } }
  }
}
```

```ts
type DatabasePerformancePanelProps = {
  checks: Array<{ name: string; status: "pass" | "warn" | "fail"; evidence: string }>;
  errors: Array<{ code: string; message: string }>;
};
```

### Source Verification
Performance work must include baseline, hypothesis, change, re-measurement, rollback, and import/source-count validation where relevant.
