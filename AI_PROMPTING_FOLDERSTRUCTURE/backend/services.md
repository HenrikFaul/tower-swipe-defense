# Backend Services

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Backend Services patterns...

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
Act as a senior Backend owner with 15+ years of production experience. You are accountable for business behavior, technical correctness, accessibility, security, performance, observability, and QA handoff.

## Purpose
Define service-layer business logic, transaction ownership, idempotency, retries, and DB boundary rules.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Backend",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["backend/service_layer_template.md; database/schema-rules.md"],
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
- Before executing this, ensure backend/service_layer_template.md; database/schema-rules.md is reviewed for compatibility.
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
- backend/service_layer_template.md; database/schema-rules.md

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Service Layer Upgrade

Services own business invariants, orchestration, authorization decisions after identity verification, transaction shape, and recovery behavior. Each service artifact must name domain inputs, trusted identity source, tenant boundary, database calls, external calls, transaction/idempotency strategy, duplicate-prevention rule, domain-event behavior, and rollback/reconciliation path.

Services must not trust client-supplied actor, role, tenant, organization, price, permission, or status values without server-side verification. Supabase-backed services must plan for RLS denial, nullable FK relation rows, generated type drift, and service-role isolation. External calls need timeout caps, backoff, provider-specific parameter validation, and redacted diagnostics. The service handoff must include unit tests, contract tests, integration tests, failure injection, and affected flow re-checks.

Cross-check before use: `database/schema-rules.md`, `database/performance.md`, `backend/exceptions.md`, `backend/tests.md`, and `docs/interface-contract-registry.md`.

<!-- ENHANCEMENT-PASS-2026-05-06-REPOSITORY: full companion content appended verbatim from services.repository-enhancement-20260506.md -->

# Services - Repository Enhancement 2026-05-06

## Scope
Companion enhancement for `backend/services.md`.

## Analysis
Analyzing all repository sources for service-layer orchestration, idempotency, provider calls, transaction boundaries, and retries...

Repo evidence shows that service failures often come from unbounded provider calls, unclear side effects, stale target rows, and hidden Supabase errors. Services must make uncertainty explicit and verify outcomes.

## Enhancement Rules
- Services own business orchestration, not HTTP parsing.
- Every side effect must have an idempotency key or documented reason why idempotency is impossible.
- External provider calls must use endpoint constants, allowed host checks, timeout caps, retry/backoff, concurrency caps, and redacted request/response logging.
- Supabase calls must inspect both `data` and `error`; ignoring `.error` is forbidden.
- ETL services must stamp current session IDs and verify source-to-target parity after write completion.
- Large data services must chunk by stable cursor unless measured SQL plans prove a single statement is safe.
- Service results must preserve uncertainty: `needsReview`, confidence, source evidence, and match status are real output fields, not TODO comments.

## Contract
Before executing this, ensure `backend/controllers.md`, `database/performance.md`, and `database/migrations.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ServiceExecutionResult",
  "type": "object",
  "required": ["ok", "changed_count", "errors", "warnings", "evidence", "rollback_hint"],
  "properties": {
    "ok": { "type": "boolean" },
    "changed_count": { "type": "integer", "minimum": 0 },
    "errors": { "type": "array", "items": { "type": "object" } },
    "warnings": { "type": "array", "items": { "type": "object" } },
    "evidence": { "type": "array", "items": { "type": "object" } },
    "rollback_hint": { "type": "string" }
  }
}
```

```ts
type ServiceRunPanelProps = {
  runId: string;
  result?: unknown;
  errors: Array<{ code: string; message: string }>;
  evidence: Array<{ sourcePath: string; claim: string }>;
};
```

## Verification
Service tests must assert idempotent reruns, partial provider failure, retry exhaustion, duplicate source keys, Supabase `.error`, and rollback safety.
