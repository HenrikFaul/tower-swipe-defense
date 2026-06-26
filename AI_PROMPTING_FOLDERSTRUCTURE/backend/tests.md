# Backend Tests

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Backend Tests patterns...

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
Act as a senior Backend QA owner with 15+ years of production experience. You are accountable for business behavior, technical correctness, accessibility, security, performance, observability, and QA handoff.

## Purpose
Define backend unit, integration, contract, migration, idempotency, and regression testing guidelines.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Backend QA",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["backend/services.md; qa/unit_test_template.md"],
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
- Before executing this, ensure backend/services.md; qa/unit_test_template.md is reviewed for compatibility.
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
- backend/services.md; qa/unit_test_template.md

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Backend Test Upgrade

Backend tests must cover contract, behavior, and regression safety. Minimum expected coverage: validation failures, permission/RLS denial, happy path, empty result, not-found, conflict/stale version, timeout, retry exhaustion, duplicate/idempotent retry, provider throttling, data-integrity failure, and redaction expectations.

For database-backed services, tests must include fixture/schema alignment and generated type compatibility. For APIs, tests must assert response envelope shape, status-code mapping, public error codes, and no secret/PII leakage. For critical flows, add regression notes that identify previously working behavior and the exact re-check performed.

Cross-check before use: `qa/unit_test_template.md`, `qa-and-checks/data-integrity-checks.md`, `qa-and-checks/security-checks.md`, and `docs/non-regression-matrix.md`.

<!-- ENHANCEMENT-PASS-2026-05-06-REPOSITORY: full companion content appended verbatim from tests.repository-enhancement-20260506.md -->

# Backend Tests - Repository Enhancement 2026-05-06

## Scope
Companion enhancement for `backend/tests.md`.

## Analysis
Analyzing all repository sources for unit, integration, contract, RLS-aware backend, and diagnostics regression testing patterns...

Tests must encode repository lessons so bugs do not return: hidden Supabase `.error`, stale diagnostic results, undefined response arrays, provider rate-limit handling, duplicate source keys, and RLS regressions.

## Required Test Matrix
- Controller tests: valid input, invalid input, unauthenticated, unauthorized, service error, provider timeout, partial result, and unexpected exception.
- Service tests: idempotent replay, duplicate provider key, retry exhaustion, current-session verification, chunk boundary, and rollback behavior.
- Database integration tests: RLS positive/negative pair, index-supported query shape, migration preflight, and generated type compatibility.
- Diagnostics tests: no-store response, auth/no-auth probe comparison, secret redaction, SSRF blocked target, redirect cap, and timeout cap.
- Consumer contract tests: errors, warnings, evidence, and retry logs always exist as arrays.

## Contract
Before executing this, ensure `backend/services.md`, `database/ai_instructions.md`, and `qa-and-checks/qa-strategy.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "BackendTestPlan",
  "type": "object",
  "required": ["unit", "integration", "contract", "security", "performance"],
  "properties": {
    "unit": { "type": "array", "items": { "type": "string" } },
    "integration": { "type": "array", "items": { "type": "string" } },
    "contract": { "type": "array", "items": { "type": "string" } },
    "security": { "type": "array", "items": { "type": "string" } },
    "performance": { "type": "array", "items": { "type": "string" } }
  }
}
```

```ts
type BackendTestReportProps = {
  suites: Array<{ name: string; status: "pass" | "fail" | "skip"; evidence: string[] }>;
  errors: Array<{ code: string; message: string }>;
};
```

## Verification
Backend testing is incomplete without at least one negative authorization/RLS case and one partial-response consumer-safety case.
