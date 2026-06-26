# UX Design System

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for UX Design System patterns...

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
Define journey-level design system rules, hierarchy, grouping, progressive disclosure, mobile-first validation, and usability metrics.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "UX",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["ux/user-flows.md; ui/tokens.md"],
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
- Before executing this, ensure ux/user-flows.md; ui/tokens.md is reviewed for compatibility.
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
- ux/user-flows.md; ui/tokens.md

<!-- UX-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UX Rationalization Layer

Analyzing all repository sources for UX design-system patterns plus current public UX standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ux/README.md`, `ui/tokens.md`, `ui/components.md`, `ui/accessibility.md`, `frontend/project-structure.md`, `ux/states.md`, and `qa-and-checks/checklist.md`.

The UX design system must define behavior, not just visual style. Every reusable pattern must specify user goal, anatomy, variants, state matrix, responsive behavior, keyboard interaction, focus management, content slots, empty/error/loading behavior, analytics events, and QA checks. Design superiority requires visible hierarchy, predictable scan paths, no nested-card clutter, no layout shifts from dynamic content, and stateful controls that remain understandable on mobile and desktop.

Design-system contract:
```json
{
  "pattern": "string",
  "user_goal": "string",
  "anatomy": ["region", "control", "feedback", "content"],
  "variants": ["default", "compact", "dense", "readonly"],
  "states": ["default", "hover", "focus", "selected", "disabled", "loading", "error", "empty"],
  "responsive_rules": ["mobile", "tablet", "desktop"],
  "accessibility": ["role", "label", "keyboard", "focus_visible", "announcement"],
  "verification": ["visual", "interaction", "a11y", "performance"]
}
```

Rationalization rule: `ux/design-system.md` owns UX-level pattern behavior. Visual primitives remain in `ui/tokens.md` and `ui/components.md`; journey sequencing remains in `ux/user-flows.md`.

<!-- SOURCE-WIDE-INGESTION-20260510 -->

## Enterprise Product UX Layer

Analyzing all repository sources for enterprise UX patterns... Product UX must treat navigation, help, localization, permissions, and operational states as first-class design-system behavior. A screen is not complete if it only looks finished; it must explain where the user is, what they can do, what is unavailable, how to recover, and how the experience behaves across roles and locales.

Enterprise UX requirements:
- Header and sidebar patterns must support workspace/org switching, language selection, help/manual access, account/session actions, breadcrumbs or location cues, and compact/mobile collapse behavior.
- Permission-restricted actions must show deliberate disabled, hidden, or request-access behavior. The choice must be consistent across modules and documented in the pattern.
- Contextual help must be linked through stable anchors. Help content explains concepts and process; inline microcopy helps complete the current action.
- Localization-aware layouts must allow longer translated labels without overflow, clipped buttons, hidden controls, or layout shift. No prompt may assume English copy length.
- Empty/error/loading states must be specific to the workflow: initial empty, filtered empty, permission empty, integration degraded, offline, partial data, validation error, and recoverable system error are different states.
- Product workflows must avoid duplicate “almost same” screens. If two paths solve the same user job, the UX layer must define canonical entry, secondary shortcut, and migration path.

UX pattern acceptance contract:
```json
{
  "enterprise_ux_pattern": {
    "navigation_context_visible": true,
    "help_anchor_attached": true,
    "localization_overflow_checked": true,
    "permission_behavior_defined": true,
    "state_matrix_workflow_specific": true,
    "duplicate_flow_rationalized": true,
    "mobile_desktop_keyboard_verified": true
  }
}
```

Compatibility cross-links: before changing enterprise UX patterns, review `../frontend/project-structure.md`, `user-flows.md`, `states.md`, `messaging.md`, `copy-rules.md`, `../ui/accessibility.md`, and `../qa-and-checks/accessibility-checks.md`.
