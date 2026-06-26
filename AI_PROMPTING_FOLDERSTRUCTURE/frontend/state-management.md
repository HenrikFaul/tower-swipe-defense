# Frontend State Management Expanded

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Frontend State Management Expanded patterns...

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
Act as a senior Frontend owner with 15+ years of production experience. You are accountable for business behavior, technical correctness, accessibility, security, performance, observability, and QA handoff.

## Purpose
Mirror and expand state standards for server cache, local state, optimistic updates, invalidation, and stale perception.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Frontend",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["frontend/state_management.md; integration/api-contracts.md"],
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
- Before executing this, ensure frontend/state_management.md; integration/api-contracts.md is reviewed for compatibility.
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
- frontend/state_management.md; integration/api-contracts.md

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/frontend/frontend_state_management.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/frontend/frontend_state_management.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# State Management Rules

## PURPOSE
This file defines how frontend state should be managed so the application remains predictable, testable, and stable.

## STATE PRINCIPLES
- Choose the simplest state model that solves the problem.
- Keep server state and UI state conceptually separate when possible.
- Avoid leaking global state into every component.
- Make state transitions explicit.
- Preserve state only when it improves UX or continuity.
- Keep state logic readable for future maintenance.

## STATE CATEGORIES
- Server state.
- Client/UI state.
- Form state.
- Route state.
- Local component state.
- Shared feature state.

## SELECTION RULES
- Use local state for local concerns.
- Use shared state only when multiple components need it.
- Use query/cache tools for server-driven data when relevant.
- Use form libraries for complex forms.
- Use state machines or structured models for complex flows if appropriate.

## UX-DRIVEN STATE RULES
- Loading state must not feel broken.
- Empty state must be designed, not accidental.
- Error state must be recoverable.
- Success state must keep the user moving forward.
- Search state must preserve what the user already typed or selected when reasonable.

## RESPONSIVE STATE RULES
- Do not let state management create layout thrashing.
- Mobile and desktop may present the same state differently, but the meaning must stay consistent.
- Keep filter/search state understandable across breakpoints.
- Preserve important selections during responsive transitions where useful.

## RULE FOR AI
Whenever the AI proposes state management, it must explain:
1. What kind of state it is.
2. Why it belongs there.
3. How it changes.
4. How it affects UX.
5. How it behaves on mobile and desktop.
6. What files define the rules.


<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Frontend State Management

## Purpose
This guide defines production-grade rules for client state ownership, server cache boundaries, optimistic updates, invalidation, and visible consistency inside the Product-Engineering OS.

## Analysis
Analyzing all repository sources for Frontend State Management patterns...

Source files analyzed:
AI_PROMPTING_FOLDERSTRUCTURE/ai_dev_system.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/error_handling.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/prompt_template_backend_api.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/service_layer_template.md; AI_PROMPTING_FOLDERSTRUCTURE/build_log.md; AI_PROMPTING_FOLDERSTRUCTURE/database/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/database/migration_template.md; AI_PROMPTING_FOLDERSTRUCTURE/database/performance_tuning.md; AI_PROMPTING_FOLDERSTRUCTURE/database/schema_template.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/arch_diagrams.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/prd_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/component_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/page_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/auth_protocols.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/webhook_handler.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ab_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/qa_checklists.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/unit_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/Refactoring masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_ai_prompting_structure.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_product_engineering_os.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/ci_cd_pipeline.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/linting_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/SYSTEM.md; AI_PROMPTING_FOLDERSTRUCTURE/UI Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/component_library_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens.md; AI_PROMPTING_FOLDERSTRUCTURE/UX Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/microcopy_guide.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/user_journey_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/wizard_flow_template.md

The current repository contributes these standards: high-stakes production quality, zero functional regression, accessibility, responsive states, behavior preservation, data stability, rollback planning, test-first safety, and complete cross-folder traceability.

Before executing this, ensure integration/api_client_template.md is reviewed for compatibility. Also read ../ai_dev_system.md and frontend/ai_instructions.md.

## Required Contract
~~~json
{
  "owner": "frontend",
  "focus": "client state ownership, server cache boundaries, optimistic updates, invalidation, and visible consistency",
  "source_files_analyzed": ["string"],
  "inputs": {},
  "outputs": {},
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'loading' | 'empty' | 'success' | 'error' }"
  },
  "edge_cases": ["string"],
  "verification": ["string"],
  "compatibility": ["../ai_dev_system.md", "frontend/ai_instructions.md", "integration/api_client_template.md"]
}
~~~

## Production Rules
- Produce assets with complete lifecycle states, not partial notes.
- Preserve behavior unless a migration is named, justified, tested, and rollback-ready.
- Use typed interfaces for data, APIs, components, events, jobs, or docs.
- Where UI is involved, enforce Tailwind, shadcn/ui, Radix primitives, semantic tokens, accessible labels, focus states, responsive breakpoints, and loading/error/empty/success states.
- Where data or backend behavior is involved, enforce transactions, idempotency, validation, observability, retry semantics, and rollback strategy.
- Where QA is involved, convert requirements into executable checks and regression matrices.

## Error Handling
Cover validation failure, missing dependencies, unauthorized access, stale state, duplicate operations, timeouts, rate limits, partial writes, rollback failures, malformed external data, empty states, and user-visible recovery.

## Verification
Check references, schemas, prop contracts, accessibility, performance, regression coverage, and release readiness. A guide output is complete only if QA can verify it without private explanation.

## Compatibility References
- ../ai_dev_system.md
- frontend/ai_instructions.md
- integration/api_client_template.md

<!-- ENHANCEMENT-PASS-2026-05-05-NON-REGRESSION -->

## Recursive Enhancement Pass - Non-Regression Layer

### Self-Challenge Result
Analyzing all repository sources for frontend patterns revealed that the existing Product-Engineering OS was structurally strong but could be deepened with newly discovered governance, editor-rule, changelog, coding-lesson, and framework-specific standards. This section augments the existing file without deleting or reducing any prior content.

### Newly Integrated Repository Paradigms
- Execution authority: treat clear user requests as execution instructions. Do not create permission loops for non-destructive governance, changelog, documentation, GitHub/Jira-supporting, or delivery-supporting artifacts when those actions are naturally implied.
- Mandatory confirmation boundary: ask before destructive deletion, irreversible overwrite, production deployment, external publishing, external messaging, security-sensitive changes, or access-control-sensitive work.
- Canonical read order: read governance/controller, execution authority rules, coding lessons, UI/UX rules when UI is affected, changelogs, latest versioning artifacts, the global OS controller, SYSTEM.md, and the local target instructions.
- Append-only knowledge: changelogs, coding lessons, build logs, governance history, and design/system decisions must be augmented rather than replaced. Never overwrite delivery history to make a clean narrative.
- Cursor/Continue integration: when .cursor, cursor/rules, .continue, or continue/rules are present, treat them as editor-enforced local governance. Mirror their standards into scripts/linting_rules.md and QA checks before changing generated assets.
- Prompt package discipline: prompt collections must include validated metadata such as name, description, type, slug, files, author, development process, categories, tags, tech stack, model, editor, and version. Slugs must be unique, hidden prompt-package files are invalid, and prompt packages should avoid nested structures unless explicitly supported.
- Framework standards: Next 15 and React 19 work should prefer App Router, Server Components by default, Client Components only for interaction, strict TypeScript, explicit props, route-level loading/error boundaries, Suspense where appropriate, minimal dependencies, and shadcn/ui components installed with the current 
px shadcn@latest add command.
- Design standards: preserve every working entrypoint, validate mobile and desktop layouts, prevent overflow and broken focus states, keep dropdowns readable, maintain usable CTAs/filters/dialogs/navigation, and make hierarchy follow business priority.
- Operational risk standards: compare at least two solution options when risk is non-trivial, choose the smallest regression-risk path, re-check previously working flows, update governance/changelog artifacts when naturally implied, and provide QA handoff.
- Changelog-derived lessons: use modular feature registries instead of single-purpose app shells, add SSRF/private-network guardrails for request tools, redact sensitive headers, cap timeouts, use cache: no-store when stale perception is harmful, and distinguish runtime-observed evidence from code-inferred evidence.
- Coding-lesson traps: align TypeScript interfaces with SQL columns, handle Supabase FK relation typing deliberately, prefer getUser() over trusting getSession() for auth-critical checks, avoid middleware redirect traps, avoid RLS policies that join across protected tables, validate provider-specific geospatial params, never mix bbox and point-radius casually, apply provider throttling/backoff, and avoid hard filters that zero out valid results.

### Required Enhancement Checklist
`json
{
  "repository_sources_analyzed": "all files listed in docs/repository_source_inventory.md",
  "non_regression": {
    "existing_content_preserved": true,
    "append_only_change": true,
    "working_features_rechecked": "required before handoff"
  },
  "execution_authority": {
    "execute_clear_requests": true,
    "ask_only_for_real_ambiguity_or_mandatory_confirmation": true,
    "update_related_governance_and_delivery_artifacts_when_implied": true
  },
  "interfaces": {
    "json_schema_required": true,
    "react_props_required_when_user_facing": true,
    "api_envelope_required_when_server_or_integration": true,
    "data_invariants_required_when_database": true
  },
  "qa": {
    "mobile_desktop_validation": true,
    "accessibility_focus_validation": true,
    "regression_matrix_required": true,
    "changelog_or_build_log_update_required": true
  }
}
`

### guide Application Rule
For this guide artifact, every future generated asset must explicitly state which newly discovered repository standards apply, which do not apply, and why. If a source class is absent in a future run, record that absence instead of silently assuming it does not matter.


<!-- FRONTEND-INTERNET-TUNED-RATIONALIZATION-2026-05-09 -->
## 2026-05-09 Internet-Tuned Rationalization Layer

### Analysis
Analyzing all repository sources for frontend rationalization patterns, then upgrading the canonical frontend prompt surface with current external documentation from React, Next.js, Tailwind CSS, shadcn/ui, Radix Primitives, WCAG 2.2, and web.dev Core Web Vitals.

### Current Source Anchors
- Next.js App Router docs list 16.2.2 as the current docs latest version and expose App Router primitives for project structure, layouts/pages, linking/navigation, server/client components, fetching data, caching, error handling, testing, and production checks.
- Next.js production guidance says Server Components are default, Client Components should be used as needed for interactivity, route segments enable code splitting, and streaming with Loading UI plus React Suspense prevents entire routes from blocking on data.
- React Server Components guidance requires Client Components for interactivity through the `use client` boundary; avoid spreading that boundary higher than needed because it increases client JavaScript.
- React Server Functions guidance treats all client-passed arguments as untrusted input, requires authorization for mutations, and positions Server Functions primarily for state-changing mutations rather than general data fetching.
- Tailwind CSS v4 exposes design tokens as native CSS variables and supports a CSS-first theme model; frontend prompts must connect this to `../ui/tokens.md` instead of inventing token scales.
- shadcn/ui Tailwind v4 guidance supports React 19 and Tailwind v4, updates primitives with `data-slot`, prefers `sonner` over deprecated toast usage, and modernizes new projects toward `new-york` and OKLCH tokens.
- Radix Primitives follow WAI-ARIA authoring practices and include keyboard support patterns; prompts must still require labels, roles, focus behavior, and QA checks rather than assuming primitives alone guarantee accessibility.
- WCAG 2.2 adds focus-not-obscured, focus appearance, dragging alternatives, target size minimum, and accessible authentication criteria that must be reflected in frontend acceptance tests.
- web.dev Core Web Vitals remain LCP, INP, and CLS; target LCP at 2.5s or less, INP at 200ms or less, and CLS at 0.1 or less for user-facing frontend work.

### Rationalized Frontend Rules
- Keep Server Components as the default for data-heavy, non-interactive UI; introduce Client Components only at the smallest interactive leaf.
- Do not reference `window`, `document`, browser storage, effects, or event handlers in Server Components.
- Use route-level `loading`, `error`, `not-found`, and layout boundaries deliberately; every route prompt must specify loading, empty, error, auth, permission, retry, and recovery states.
- Use Server Functions for mutations only after validation, authorization, CSRF/session considerations, and typed success/error envelopes are defined.
- Keep state ownership explicit: server/cache state, URL/search-param state, local UI state, form state, optimistic state, and persisted preference state must not be blurred together.
- Use Tailwind v4 theme variables and local UI tokens as the source of truth; no new color, radius, shadow, or spacing scale may be invented without linking to `../ui/tokens.md`.
- Prefer shadcn/ui and Radix-compatible primitives for complex accessible components, but still define keyboard paths, accessible names, focus visibility, escape/close behavior, and screen-reader states.
- Performance acceptance must name bundle risk, client-boundary risk, image/font/script handling, streaming strategy, and Core Web Vitals impact.
- Every generated frontend asset must provide JSON schema, React props or TypeScript interfaces, state matrix, responsive behavior, accessibility checks, error handling, QA handoff, and rollback/non-regression notes.

### Compatibility Gate
Before executing this rationalized frontend guidance, review `README.md`, `ai_instructions.md`, `frontend-system.md`, the task-specific frontend file, `../ui/tokens.md`, `../ui/accessibility.md`, `../ux/states.md`, `../integration/api-contracts.md`, and `../qa-and-checks/checklist.md`.

<!-- CODING-LESSONS-20260510-INGESTION -->

## Coding Lessons Ingestion - React State And Async Safety

Source reviewed: `C:/Users/Lenovo/Downloads/codingLessonsLearnt (2).md`.

New state-management lessons to enforce:
- Hooks must be declared before any conditional or early return. New `useState`, `useEffect`, `useMemo`, `useCallback`, and custom hook calls are forbidden below `if (...) return ...` branches because they can produce hook-order mismatches and blank production screens.
- If a child calls a parent callback from `useEffect`, avoid putting an unstable inline callback prop directly in the dependency array. Stabilize the parent callback with `useCallback` and/or store the latest callback in a child `useRef` that is updated by a separate effect. The notifying effect should call `ref.current?.()` and guard against empty/loading data.
- For month switches, timeline filters, search filters, and other rapid re-query triggers, use debounce before firing network requests and prefer `Promise.allSettled` for non-critical parallel calls. A failed optional request must degrade to a safe fallback instead of freezing the entire view.
- Optional feature tables or not-yet-applied migrations must not block auth-critical or page-critical state. Load them after the core route is usable, with `maybeSingle`, `|| []`, typed fallback payloads, and user-visible degraded states when needed.
- Multi-source progress indicators must use a priority cascade: explicit done/closed status, reliable numeric completion ratio, status fallback, then zero/unknown. Do not assume a single progress field is always populated.

State safety contract:
```json
{
  "hooks_before_returns": true,
  "callback_from_effect": {
    "parent_use_callback": true,
    "child_ref_indirection": true,
    "loading_guard": true
  },
  "async_resilience": {
    "debounce_ms": "250-300 for rapid navigation/search triggers",
    "non_critical_parallel_calls": "Promise.allSettled",
    "fallback_shape": "typed empty or degraded payload"
  },
  "optional_feature_queries": "non_blocking_after_core_auth",
  "progress_cascade": ["terminal_status", "numeric_ratio", "semantic_status", "unknown_zero"]
}
```
