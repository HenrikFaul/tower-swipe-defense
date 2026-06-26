# UX States

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for UX States patterns...

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
Act as a senior UX owner with 15+ years of production experience. You are accountable for business behavior, technical correctness, accessibility, security, performance, observability, and QA handoff.

## Purpose
Define loading, empty, error, success, disabled, optimistic, conflict, offline, and permission-denied state standards.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "UX",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["ux/microcopy_guide.md; ui/accessibility.md"],
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
- Before executing this, ensure ux/microcopy_guide.md; ui/accessibility.md is reviewed for compatibility.
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
- ux/microcopy_guide.md; ui/accessibility.md

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Supadupa Enhancement Layer

### Analysis
Analyzing all repository sources for UX States supadupa-enhancement patterns...

This enhancement layer deepens the existing UX artifact with the newest repository-wide operating memory. It preserves all prior content and adds stronger instructions for source ingestion, append-only governance, production-ready asset generation, and QA-verifiable delivery.

### Added Capability
Adds state coverage matrix and no-blame recovery verification.

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
  "artifact": "UX States",
  "source_files_analyzed": "all repository sources, with inventory reference",
  "non_regression": true,
  "append_only": true,
  "compatibility_links": ["docs/non-regression-matrix.md; qa-and-checks/visual-regression-checks.md"],
  "verification_required": ["reference check", "schema/interface check", "edge-state check", "qa handoff check"]
}
~~~

Before executing this enhancement, ensure docs/non-regression-matrix.md; qa-and-checks/visual-regression-checks.md are reviewed for compatibility.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ux/ux_states.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ux/ux_states.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# UX State Rules

## PURPOSE
This file defines how journeys and surfaces should behave in different conditions so the experience remains stable, understandable, and trustworthy.

## REQUIRED UX STATES
- Loading.
- Empty.
- Error.
- Success.
- Partial progress.
- Interrupted flow.
- Retry / recovery.
- No-results if search is involved.

## STATE GUIDELINES
### Loading
- Communicate that progress is happening.
- Keep context visible when possible.
- Preserve layout to avoid jumps.

### Empty
- Explain why the state exists.
- Guide the next action.
- Avoid dead ends.

### Error
- Explain what failed.
- Tell the user what can be done next.
- Avoid overtechnical language unless the audience needs it.

### Success
- Confirm completion.
- Avoid overdoing the celebration unless the product brand calls for it.

### Partial / Interrupted
- Help the user resume without losing work.
- Make persistence obvious if applicable.

## SEARCH-RELATED UX STATES
- Typing.
- Fetching suggestions.
- No matches.
- Filtered results.
- Clear / reset state.
- Selection state.

## RULE FOR AI
No UX flow is complete unless the state behavior is defined explicitly for both common and failure conditions.

<!-- UX-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UX Rationalization Layer

Analyzing all repository sources for UX state patterns plus current public UX standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ux/README.md`, `ux/design-system.md`, `ux/user-flows.md`, `ux/messaging.md`, `ux/copy-rules.md`, `ui/accessibility.md`, `ui/components.md`, `frontend/tests.md`, and `qa-and-checks/checklist.md`.

Every state definition must satisfy five checks: visible status, understandable cause, available next action, accessible announcement, and stable layout. Required state coverage includes default, hover, focus-visible, pressed, selected, disabled, loading, optimistic, partial, empty, no-results, validation-error, permission-denied, timeout, offline, rate-limited, degraded, and success. Error prevention takes priority over error copy; when an error remains possible, the message must identify the problem and offer recovery without exposing technical internals.

State contract:
```json
{
  "component_or_flow": "string",
  "state": "loading | empty | error | partial | success | disabled | permission_denied",
  "visible_feedback": "what the user sees immediately",
  "assistive_feedback": "aria-live, role, label, or focus movement",
  "layout_stability": "reserved dimensions or skeleton strategy",
  "recovery_action": "primary next step",
  "regression_checks": ["keyboard", "mobile", "desktop", "slow_network", "screen_reader"]
}
```

Rationalization rule: `ux/states.md` is the canonical home for state behavior. Archived state variants must not be regenerated; add new state rules here and cross-link to `ux/copy-rules.md` for wording and `ui/accessibility.md` for focus/ARIA behavior.

