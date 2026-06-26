# Backend Prompts

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Backend Prompts patterns...

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
Provide backend prompt patterns for APIs, services, jobs, validation, observability, and safe refactors.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Backend",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["backend/backend-system.md; backend/prompt_template_backend_api.md"],
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
- Before executing this, ensure backend/backend-system.md; backend/prompt_template_backend_api.md is reviewed for compatibility.
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
- backend/backend-system.md; backend/prompt_template_backend_api.md

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Backend Prompt Upgrade

Backend prompts must force production asset output, not advice. Each prompt must ask for source files analyzed, existing patterns, DB assumptions, controller boundary, service boundary, API envelope, JSON schema or TypeScript interfaces, auth/tenant source, idempotency, timeout/retry plan, redaction, tests, and non-regression checks.

Prompt outputs must separate runtime-observed evidence from code-inferred evidence and must include "standards applied", "standards not applicable", and "why". If schema or generated types are impacted, the prompt must route through database artifacts first. If user-facing states are impacted, the prompt must include frontend/UI/UX handoff requirements.

Cross-check before use: `backend/ai_instructions.md`, `backend/service_layer_template.md`, `database/schema_template.md`, and `.ai/best-practices.md`.

<!-- ENHANCEMENT-PASS-2026-05-06-REPOSITORY: full companion content appended verbatim from prompts.repository-enhancement-20260506.md -->

# Backend Prompts - Repository Enhancement 2026-05-06

## Scope
Companion enhancement for `backend/prompts.md`. Use it when composing backend prompts that must create production-ready assets.

## Analysis
Analyzing all repository sources for backend prompt contracts that generate production assets rather than snippets...

Repo lessons show that prompts must force evidence, normalized interfaces, edge-case handling, and verification. The backend prompt must ask for more than code: it must require contracts, RLS assumptions, provider limits, rollback plans, and compatibility checks.

## Required Prompt Blocks
- Persona: senior backend engineer with Supabase, Postgres, RLS, API diagnostics, provider ingestion, and incident-debugging experience.
- Repository evidence: list the specific files read and the extracted lesson from each.
- Compatibility: name every backend, database, integration, QA, and system file that must be checked before implementation.
- Interface contract: include JSON Schema for input and output, plus TypeScript shapes for backend/admin consumers.
- Failure modes: validation error, auth failure, RLS denial, provider timeout, provider rate limit, schema cache mismatch, duplicate source key, partial ETL, statement timeout, and unexpected exception.
- Verification: list unit, integration, contract, RLS, performance, and rollback checks.

## Contract
Before executing this, ensure `backend/prompt_template_backend_api.md`, `backend/error_handling.md`, and `qa-and-checks/checklist.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "BackendPromptAsset",
  "type": "object",
  "required": ["persona", "repo_evidence", "interfaces", "failure_modes", "verification"],
  "properties": {
    "persona": { "type": "string" },
    "repo_evidence": { "type": "array", "items": { "type": "string" } },
    "interfaces": { "type": "object" },
    "failure_modes": { "type": "array", "items": { "type": "string" } },
    "verification": { "type": "array", "items": { "type": "string" } }
  }
}
```

```ts
type BackendPromptPreviewProps = {
  promptId: string;
  requiredReads: string[];
  errors: Array<{ code: string; message: string }>;
  warnings: Array<{ code: string; message: string }>;
};
```

## Verification
A backend prompt fails quality review if it can produce an untyped snippet without source evidence, tests, rollback, or compatibility checks.
