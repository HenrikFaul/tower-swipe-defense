# Frontend Routing

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Frontend Routing patterns...

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
Define SPA/SSR routing, App Router boundaries, loading/error pages, auth guards, redirects, and route state preservation.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Frontend",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["frontend/frontend-system.md; integration/auth-flows.md"],
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
- Before executing this, ensure frontend/frontend-system.md; integration/auth-flows.md is reviewed for compatibility.
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
- frontend/frontend-system.md; integration/auth-flows.md

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/frontend/frontend_routing.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/frontend/frontend_routing.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Routing Rules

## PURPOSE
This file defines how page navigation should be designed and implemented so the application feels clear, predictable, and easy to explore.

## ROUTING PRINCIPLES
- Routes should reflect the userâ€™s mental model.
- Navigation should be obvious and stable.
- Deep links should work where meaningful.
- Loading and error behavior must exist at route level when needed.
- Route changes should not feel disorienting.

## ROUTE DESIGN RULES
- Use descriptive route names.
- Keep nested routes logical.
- Keep route boundaries aligned with feature boundaries when possible.
- Prefer route-level loading and error handling.
- Keep protected routes explicitly separated from public ones.
- Avoid over-nesting unless it improves clarity.

## MODERN ROUTING BEHAVIOR
For modern React/Next.js apps:
- Prefer App Router style organization when applicable.
- Use route-level layouts when the product benefits from persistent chrome.
- Use nested route structures only when they improve readability and reuse.
- Use loading boundaries and error boundaries deliberately.
- Use search params for stateful navigation when appropriate and stable.

## RESPONSIVE NAVIGATION RULES
- On mobile, navigation may collapse into drawer, sheet, bottom nav, or menu.
- On desktop, navigation may be visible and persistent.
- Navigation should never steal too much vertical space on small screens.
- Keep the current location clear.
- Do not hide critical paths behind low-discoverability controls.

## SEARCH AND FILTER ROUTING RULES
- Search-driven pages may use search params or route state.
- Filters should remain shareable or recoverable when meaningful.
- Reset and back behavior should be predictable.
- Deep links to filtered views should remain stable if the product benefits from it.

## ERROR / FALLBACK RULES
- Route-level 404 and error states must be meaningful.
- Do not leave blank pages without recovery paths.
- Redirects must preserve intent where possible.
- Auth failures should send users to clear and relevant recovery states.

## OUTPUT REQUIREMENT
Whenever the AI works on routing, it must describe:
1. Route purpose.
2. Route structure.
3. Layout behavior.
4. Loading/error behavior.
5. Responsive navigation behavior.
6. Search/filter implications.
7. Files to update.


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

## Coding Lessons Ingestion - Routing Stability

Source reviewed: `C:/Users/Lenovo/Downloads/codingLessonsLearnt (2).md`.

New routing lessons to enforce:
- Static-hosted React Router apps must not assume that every internal path is rewritten to the SPA entrypoint. If even one published refresh/deep-link 404 is observed, prefer `HashRouter` as the durable fallback and update every OAuth, invite, password-reset, email, and external callback URL to use the hash route shape.
- With hash routing, query parameters often live inside the router location, not `window.location.search`. Route prompts must specify the exact source of truth for `location.search`, `location.hash`, and search-param parsing.
- Cloudflare Pages or similar static hosts require explicit SPA fallback configuration. A routing task must either verify the fallback file/config exists or choose hash routing intentionally.
- Do not leak stable workspace UUIDs or tenant IDs into public URLs unless the product explicitly requires shareable deep links. Prefer persisted workspace selection in scoped storage and keep the URL focused on user intent, for example `?tab=organization`.
- Navigation replacements must preserve existing route values and query-param contracts. If a horizontal tab bar is replaced by sidebar navigation, keep the same route state and tab value mapping.

Routing acceptance addendum:
```json
{
  "static_host_strategy": "rewrite_fallback | hash_router | server_router",
  "deep_link_refresh_safe": true,
  "external_callbacks_updated": ["oauth", "invite", "reset_password", "email_link"],
  "query_source_of_truth": "router_location",
  "tenant_or_workspace_id_exposure": "none | required_and_justified",
  "regression_paths": ["direct_open", "refresh", "back_forward", "auth_callback", "invite_link"]
}
```
