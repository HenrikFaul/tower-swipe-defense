# Backend Exceptions

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Backend Exceptions patterns...

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
Define exception taxonomy, safe error messages, correlation IDs, retryability, and logging conventions.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Backend",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["backend/error_handling.md; qa/qa_checklists.md"],
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
- Before executing this, ensure backend/error_handling.md; qa/qa_checklists.md is reviewed for compatibility.
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
- backend/error_handling.md; qa/qa_checklists.md

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Exception Taxonomy Upgrade

Backend exceptions must be stable domain signals, not raw provider leakage. Every error artifact must map validation, authentication, authorization, not-found, conflict, stale-state, rate-limit, timeout, retry-exhausted, upstream-unavailable, partial-failure, data-integrity, and unknown errors to safe API envelopes and observability fields.

Never expose credentials, cookies, provider secrets, stack traces, service-role details, raw SQL, private network details, or PII in user-facing messages. Logs must preserve sanitized operation, requestId, result class, latency, retry count, domain code, and runtime-observed evidence. Exceptions crossing controller boundaries must carry retryability, user action, support/debug code, and compatibility note when the public contract changes.

Cross-check before use: `backend/error_handling.md`, `backend/controllers.md`, `backend/services.md`, `integration/error-handling.md`, and `qa-and-checks/security-checks.md`.

<!-- ENHANCEMENT-PASS-2026-05-06-REPOSITORY: full companion content appended verbatim from exceptions.repository-enhancement-20260506.md -->

# Backend Exceptions - Repository Enhancement 2026-05-06

## Scope
Companion enhancement for `backend/exceptions.md`.

## Analysis
Analyzing all repository sources for error taxonomy, redaction, diagnostics, and support-ready failure message patterns...

The repository favors diagnostic clarity without secret leakage. Backend exceptions must be user-safe, developer-useful, and machine-readable.

## Enhancement Rules
- Every exception must have `code`, `message`, `retryable`, `severity`, `correlation_id`, and optional redacted `details`.
- Do not include bearer tokens, API keys, cookies, service-role keys, raw auth headers, or unredacted provider payloads in logs.
- Distinguish validation, authentication, authorization, RLS denial, provider timeout, provider rate limit, schema cache miss, duplicate source key, partial ETL, and unexpected internal errors.
- Exceptions from Supabase must preserve the original code/message in redacted diagnostics while returning a stable app-level code to consumers.
- Retryability must be explicit. Validation, RLS, and duplicate-key errors are usually not retryable without a data or permission change.

## Contract
Before executing this, ensure `backend/error_handling.md` and `qa-and-checks/security-checks.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "BackendException",
  "type": "object",
  "required": ["code", "message", "severity", "retryable"],
  "properties": {
    "code": { "type": "string" },
    "message": { "type": "string" },
    "severity": { "enum": ["info", "warning", "error", "critical"] },
    "retryable": { "type": "boolean" },
    "correlation_id": { "type": "string" },
    "details": { "type": "object" }
  }
}
```

```ts
type ExceptionBannerProps = {
  errors: Array<{ code: string; message: string; retryable: boolean }>;
  correlationId?: string;
};
```

## Verification
Run redaction checks and ensure each exception class maps to controller responses, logs, support diagnostics, and tests.
