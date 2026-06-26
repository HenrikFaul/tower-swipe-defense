# Frontend System

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Frontend System patterns...

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
Define Next 15/React 19 frontend ownership, routing, server/client components, state, accessibility, and visual validation.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Frontend",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["frontend/ai_instructions.md; ui/tokens.md; ux/states.md"],
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
- Before executing this, ensure frontend/ai_instructions.md; ui/tokens.md; ux/states.md is reviewed for compatibility.
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
- frontend/ai_instructions.md; ui/tokens.md; ux/states.md

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Supadupa Enhancement Layer

### Analysis
Analyzing all repository sources for Frontend System supadupa-enhancement patterns...

This enhancement layer deepens the existing Frontend artifact with the newest repository-wide operating memory. It preserves all prior content and adds stronger instructions for source ingestion, append-only governance, production-ready asset generation, and QA-verifiable delivery.

### Added Capability
Adds visual regression and state-matrix obligations for every user-facing asset.

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
  "artifact": "Frontend System",
  "source_files_analyzed": "all repository sources, with inventory reference",
  "non_regression": true,
  "append_only": true,
  "compatibility_links": ["qa-and-checks/visual-regression-checks.md; ux/states.md"],
  "verification_required": ["reference check", "schema/interface check", "edge-state check", "qa handoff check"]
}
~~~

Before executing this enhancement, ensure qa-and-checks/visual-regression-checks.md; ux/states.md are reviewed for compatibility.

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

<!-- SOURCE-WIDE-INGESTION-20260510 -->

## Source-Wide Framework Adapter Layer

Analyzing all repository sources for frontend framework patterns... The frontend system must be able to guide production assets across the actual project stack instead of assuming a single React-only execution model. The default recommendation remains to follow the active repository framework, but every frontend prompt must first identify the runtime family, routing model, rendering model, data-fetching model, state model, component library, styling contract, and deployment target before prescribing code.

Framework adapter rules:
- Next.js assets must distinguish App Router server components, client components, route handlers, server actions/functions, middleware, metadata, cache/revalidation policy, `loading`, `error`, `not-found`, and streaming boundaries. Client boundaries must stay at the smallest interactive leaf.
- React assets must use typed props/interfaces, avoid broad `React.FC` defaults, protect hook order before early returns, isolate optimistic updates, and treat every mutation argument as untrusted until validated and authorized.
- Vue assets must use Composition API and `<script setup>` patterns, keep Pinia stores small and typed, prefer composables for shared behavior, and avoid reactivity traps from destructuring or deep watchers where computed state is enough.
- Svelte assets must explicitly declare rune-style state, derived state, effects, props, and event callbacks when the project uses the newer model; reactive side effects must be scoped and cleaned up.
- Angular assets must prefer standalone components, signals for local reactive state, deferrable views for expensive regions, route render-mode decisions, strict typing, and OnPush-compatible update patterns.
- Astro, Remix, Nuxt, Vite, and static-hosted assets must document their routing and hydration model before implementation, especially refresh-safe fallback behavior, OAuth/reset/invite link compatibility, and client-only island boundaries.

Mandatory output for any framework-specific asset:
```json
{
  "framework_adapter": {
    "runtime": "next | react | vue | svelte | angular | astro | remix | nuxt | vite | static",
    "routing_model": "app-router | file-router | spa-router | server-router | static-fallback",
    "rendering_model": ["server", "client", "ssr", "ssg", "islands", "hydrated"],
    "state_owners": ["server-cache", "url", "form", "local-ui", "optimistic", "persisted-preference"],
    "boundaries": ["auth", "error", "loading", "empty", "permission", "retry"],
    "non_regression_checks": ["existing_routes_preserved", "refresh_safe", "mobile_desktop_verified"]
  }
}
```

Compatibility cross-links: before applying this adapter layer, also review `project-structure.md`, `routing.md`, `state-management.md`, `tests.md`, `../integration/auth-flows.md`, `../integration/api-contracts.md`, `../ui/components.md`, `../ux/states.md`, and `../qa-and-checks/checklist.md`.
