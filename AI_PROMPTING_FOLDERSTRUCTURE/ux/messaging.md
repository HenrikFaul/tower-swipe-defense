# UX Messaging

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for UX Messaging patterns...

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
Define tone, information scent, system feedback, operator guidance, validation messages, and recovery language.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "UX",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["ux/microcopy_guide.md; UI Masterprompt.md"],
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
- Before executing this, ensure ux/microcopy_guide.md; UI Masterprompt.md is reviewed for compatibility.
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
- ux/microcopy_guide.md; UI Masterprompt.md

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ux/ux_messaging.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ux/ux_messaging.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# UX Messaging

## PURPOSE
This file defines the product voice and the language used to guide users through the experience.

## MESSAGING PRINCIPLES
- Be clear before being clever.
- Keep messages short when possible.
- Use language that helps the user act.
- Avoid vague system language.
- Make errors understandable and recoverable.
- Keep the tone consistent with the productâ€™s brand.

## COPY RULES
- Use action-oriented verbs for CTAs.
- Avoid overly long button text.
- Use helper text only when it adds clarity.
- Explain consequences for risky actions.
- Keep labels precise and familiar.
- Avoid jargon unless the audience is technical.

## ERROR MESSAGE RULES
- Say what happened.
- Say why if it is known and safe to say.
- Say what the user can do next.
- Keep the tone calm and respectful.

## SEARCH MESSAGING RULES
- Clarify what is being searched.
- Suggest broader or alternative terms when there are no matches.
- Encourage the next step instead of dead-ending the user.
- Use concise copy that supports quick scanning.

## RULE FOR AI
Whenever the AI creates copy, microcopy, CTA labels, helper text, empty states, or error messages, it must follow this file and keep the wording direct, useful, and consistent.

<!-- UX-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UX Rationalization Layer

Analyzing all repository sources for UX messaging patterns plus current public UX standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ux/README.md`, `ux/copy-rules.md`, `ux/states.md`, `ux/user-flows.md`, `ui/accessibility.md`, and `qa-and-checks/checklist.md`.

Messaging must follow plain-language structure: name the situation, explain impact only when it helps, give the next action, and avoid blame. For errors, use user-understandable language, precise problem diagnosis, and a constructive recovery action. For empty states, separate true empty, filtered empty, permission empty, first-use empty, and error-empty states. For confirmations, state the consequence before the action and preserve an undo/cancel path when the action is reversible.

Messaging contract:
```json
{
  "message_type": "cta | helper | empty | error | success | confirmation | warning",
  "audience": "user segment",
  "trigger": "state or event",
  "copy": "final user-facing string",
  "next_action": "primary recovery or continuation",
  "tone": "clear, calm, direct",
  "a11y_delivery": "inline | aria-live polite | aria-live assertive | dialog focus",
  "localization_notes": ["avoid idiom", "keep variables named", "preserve meaning"]
}
```

Rationalization rule: `ux/messaging.md` owns narrative and tone, while `ux/copy-rules.md` owns reusable copy patterns and field-level microcopy. If a prompt duplicates both, keep the conceptual guidance here and place exact reusable strings in `copy-rules.md`.

