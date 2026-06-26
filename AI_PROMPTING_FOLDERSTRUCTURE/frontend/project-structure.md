# Frontend Project Structure

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Frontend Project Structure patterns...

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
Define app router layout, feature folders, components, libs, route groups, public assets, and naming conventions.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Frontend",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["frontend/frontend-system.md; Source/prompts/next-shadcn/rule-next-shadcn-coding-standards.md"],
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
- Before executing this, ensure frontend/frontend-system.md; Source/prompts/next-shadcn/rule-next-shadcn-coding-standards.md is reviewed for compatibility.
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
- frontend/frontend-system.md; Source/prompts/next-shadcn/rule-next-shadcn-coding-standards.md

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/frontend/frontend_project_structure.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/frontend/frontend_project_structure.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Frontend Project Structure

## PURPOSE
This file defines how the frontend codebase should be organized so the AI can generate features in a predictable, scalable, and maintainable way.

## STRUCTURE PRINCIPLES
- Keep feature boundaries clear.
- Group files by responsibility, not by convenience alone.
- Separate UI, business logic, data handling, and state management where appropriate.
- Make the structure easy for both humans and AI to navigate.
- Prefer consistent naming across features.
- Preserve existing architecture unless a higher-priority system rule requires change.

## RECOMMENDED ORGANIZATION MODEL
A modern frontend structure should typically include:
- `app/` or `pages/` for routes.
- `components/` for reusable UI blocks.
- `features/` for business-specific modules.
- `hooks/` for reusable logic.
- `lib/` for helpers and utilities.
- `types/` for shared TypeScript definitions.
- `services/` or `api/` for data access.
- `styles/` or token files if needed.
- `public/` for static assets.

## FEATURE MODULE RULES
Each feature module should ideally own:
- Its UI pieces.
- Its data hooks.
- Its local types.
- Its validation schema if relevant.
- Its feature-specific constants.
- Its loading/empty/error behavior if unique.

## REUSABILITY RULES
- Promote reusable UI into shared component folders.
- Avoid mixing global utilities with feature logic.
- Keep shared design patterns in one place.
- Extract repeatable patterns into documented component templates.

## FILE PLACEMENT RULES FOR AI
When the AI is generating code, it must decide:
1. Is this route-level logic?
2. Is this reusable UI?
3. Is this feature-specific logic?
4. Is this shared utility?
5. Is this type or schema shared across multiple features?

If the answer is unclear, the AI must explain the architectural choice before writing.

## DEPENDENCY RULES
- UI components should depend on tokens and component rules.
- Feature modules should depend on shared primitives, not each other directly unless necessary.
- Data access should be isolated from presentation as much as possible.
- Cross-file references must be explicit in generated output.

## RESPONSIVE FEATURE ORGANIZATION
- Mobile-specific logic should not be scattered without reason.
- Prefer component composition and responsive props or class patterns.
- Keep search, filters, forms, and dashboards structured so they can reflow cleanly.

## OUTPUT REQUIREMENT
Whenever the AI generates frontend work, it must explain:
- Which folder the output belongs to.
- Which parts are reusable.
- Which parts are feature-specific.
- Which parts are shared.
- What dependencies must be read before implementation.


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

## Product Shell, Help, And Localization Structure Layer

Analyzing all repository sources for frontend project-structure patterns... Frontend structure must preserve product-level navigation and support assets, not only source folders. Any feature with routes, menus, dashboards, settings, onboarding, reports, or role-based screens must declare where its help anchors, localization namespace, permissions, analytics events, and feature flag live.

Required structural conventions:
- Every route entry must have `routeId`, `titleKey`, `helpAnchorId`, `permissionKey`, `featureFlagKey` when gated, and a declared state matrix from `../ux/states.md`.
- Help/manual content must not be buried inside component copy. Components reference stable help anchors; long-form explanations live in the docs/help or UX manual surface chosen by the project.
- Localization must be namespace-based. UI strings, validation strings, empty-state copy, error copy, email/deep-link copy, and help copy must be separated enough that translators do not need code knowledge to edit them.
- Product modules must avoid duplicate pages for the same capability. If a new route overlaps with an existing report, settings page, admin screen, or workflow, the prompt must rationalize ownership and preserve the older path through redirect, alias, or visible migration note.
- Header, sidebar, breadcrumb, command menu, language selector, org/workspace switcher, and help entry points are shell responsibilities. Feature screens may request slots, but they must not fork the shell.
- Static-host deployments must include a refresh-safe route fallback or explicitly choose hash routing; reset, invite, OAuth, and email links must be tested against that routing mode.

Route registration contract:
```ts
type ProductRouteRegistration = {
  routeId: string;
  path: string;
  titleKey: string;
  module: string;
  helpAnchorId: string;
  i18nNamespace: string;
  permissionKey?: string;
  featureFlagKey?: string;
  states: Array<"loading" | "empty" | "error" | "success" | "forbidden" | "offline">;
  nonRegression: {
    existingRouteOverlapReviewed: boolean;
    staticRefreshSafe: boolean;
    mobileDesktopShellVerified: boolean;
  };
};
```

Compatibility cross-links: before changing project structure, review `frontend-system.md`, `routing.md`, `state-management.md`, `../ux/design-system.md`, `../ux/messaging.md`, `../integration/auth-flows.md`, `../qa-and-checks/checklist.md`, and `../docs/prd-template.md`.
