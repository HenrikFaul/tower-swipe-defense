# Frontend Prompt Rationalization Map

<!-- FRONTEND-RATIONALIZATION-2026-05-09 -->

## Purpose
This folder is the canonical frontend prompt surface of the Product-Engineering OS. It keeps production frontend guidance split by responsibility, while archived files preserve historical prompt variants without keeping duplicate guidance in the active surface.

## Required Reading Order
1. `../ai_dev_system.md`
2. `../SYSTEM.md`
3. `../build_log.md`
4. `ai_instructions.md`
5. `frontend-system.md`
6. The task-specific canonical file below
7. Cross-folder dependencies named by that file, especially `../ui/tokens.md`, `../ui/accessibility.md`, `../ux/states.md`, `../integration/api-contracts.md`, and `../qa-and-checks/checklist.md`

## Canonical Active Files
- `ai_instructions.md`: frontend persona, read-order, production asset contract, and cross-folder authority.
- `frontend-system.md`: global frontend architecture, framework posture, server/client boundaries, visual validation, and QA gates.
- `project-structure.md`: route, feature, component, hook, utility, type, asset, and file-placement rules.
- `prompts.md`: reusable frontend generation prompts for dashboards, search pages, forms, data grids, and user-facing assets.
- `routing.md`: App Router, route groups, layouts, loading/error/not-found behavior, search params, auth redirects, and responsive navigation.
- `state-management.md`: server cache, URL state, local UI state, form state, optimistic state, invalidation, and stale-perception rules.
- `page_template.md`: production page asset template with route contracts, loading/error/empty/success states, API envelope, and visual QA.
- `component_template.md`: production component asset template with typed props, variants, accessibility, tokens, and interaction states.
- `tests.md`: frontend unit, integration, E2E, visual, accessibility, and performance verification guidance.

## Archived Variants
The following files were already imported into canonical files using `LOSSLESS-CONSOLIDATION-IMPORT` sections and were moved to `archive/2026-05-09-rationalized/`:
- `frontend_project_structure.md` -> content represented in `project-structure.md`
- `frontend_prompts.md` -> content represented in `prompts.md`
- `frontend_routing.md` -> content represented in `routing.md`
- `frontend_state_management.md` -> content represented in `state-management.md`
- `state_management.md` -> content represented in `state-management.md`

## Current External Source Upgrades
The active frontend prompt surface now treats these as current source anchors:
- Next.js App Router docs, latest observed docs version 16.2.2 on 2026-05-09.
- React Server Components and Server Functions docs for server/client boundaries and mutation security.
- Tailwind CSS v4 CSS-first theme variables and runtime CSS variable token usage.
- shadcn/ui Tailwind v4 guidance for React 19, `data-slot`, `sonner`, `new-york`, and OKLCH token modernization.
- Radix Primitives accessibility guidance for WAI-ARIA semantics, accessible labels, and keyboard behavior.
- WCAG 2.2 criteria for focus visibility/not-obscured, target size, dragging alternatives, and accessible authentication.
- web.dev Core Web Vitals thresholds for LCP, INP, and CLS.

## Non-Regression Rule
Archiving is not deletion. Archived files remain available for audit and restore. Canonical files must not drop imported meaning unless a future pass proves section-by-section duplication and records that proof in `../build_log.md`.
