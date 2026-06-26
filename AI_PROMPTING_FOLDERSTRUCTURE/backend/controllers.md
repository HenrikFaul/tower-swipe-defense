# Backend Controllers

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Backend Controllers patterns...

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
Define controller structure, route validation, permission checks, response envelopes, redaction, and timeout behavior.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Backend",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["backend/backend-system.md; backend/error_handling.md"],
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
- Before executing this, ensure backend/backend-system.md; backend/error_handling.md is reviewed for compatibility.
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
- backend/backend-system.md; backend/error_handling.md

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Controller Contract Upgrade

Controllers must stay thin, deterministic, and contract-owned. Each controller prompt or implementation artifact must declare route ownership, allowed methods, auth source, tenant source, input schema, request normalization, service call boundary, response envelope, status-code mapping, safe user-facing error copy, and log redaction rules.

Controller logic must not embed business rules that belong in services or SQL assumptions that belong in database artifacts. It must explicitly handle validation failure, permission denial, missing resource, conflict/stale version, upstream timeout, retry exhaustion, empty result, and partial success. For mutation endpoints, require idempotency or duplicate-prevention notes. For list/search endpoints, require pagination, sort stability, filter defaults, and "no hard filter that erases valid results" review.

Cross-check before use: `backend/services.md`, `backend/exceptions.md`, `database/schema-rules.md`, `integration/api-contracts.md`, and `qa-and-checks/security-checks.md`.

# Controllers - Repository Enhancement 2026-05-06

## Scope
Companion enhancement for `backend/controllers.md`.

## Analysis
Analyzing all repository sources for controller validation, request normalization, auth checks, and stable response envelope patterns...

Repository lessons repeatedly show that thin controllers prevent regressions. Controllers must not hide provider ambiguity, partial failures, stale diagnostics, or Supabase errors behind a green status.

## Enhancement Rules
- Controller order: parse request, validate schema, authenticate, authorize, normalize input, call service, normalize output, log redacted evidence, return stable envelope.
- Never trust client-visible session state for auth-critical behavior. Server-side user verification is required.
- Do not run business rules, ETL loops, SQL-building, or provider retry logic directly in controllers.
- Always include request ID or correlation ID in logs and error responses when possible.
- Response envelopes must include `ok`, `status`, `data`, `errors`, `warnings`, and `evidence`. Arrays must always exist.
- Diagnostics controllers must set no-store semantics where stale perception is harmful.

## Contract
Before executing this, ensure `backend/services.md`, `backend/error_handling.md`, and `integration/api-contracts.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ControllerResponseEnvelope",
  "type": "object",
  "required": ["ok", "status", "data", "errors", "warnings", "evidence"],
  "properties": {
    "ok": { "type": "boolean" },
    "status": { "enum": ["success", "partial", "validation_error", "auth_error", "forbidden", "provider_error", "system_error"] },
    "data": {},
    "errors": { "type": "array", "items": { "type": "object" } },
    "warnings": { "type": "array", "items": { "type": "object" } },
    "evidence": { "type": "array", "items": { "type": "object" } }
  }
}
```

```ts
type ControllerResultProps = {
  envelope: { ok: boolean; status: string; errors: unknown[]; warnings: unknown[] };
  onRetry?: () => void;
};
```

## Verification
Test success, partial, invalid body, unauthenticated, unauthorized, RLS denial, provider timeout, duplicate key, and unexpected exception paths.

