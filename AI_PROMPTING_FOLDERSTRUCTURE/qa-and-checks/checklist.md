# Release Checklist

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Release Checklist patterns...

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
Act as a senior QA owner with 15+ years of production experience. You are accountable for business behavior, technical correctness, accessibility, security, performance, observability, and QA handoff.

## Purpose
Define feature release checklist covering source scan, regression matrix, mobile/desktop, auth, API, DB, and changelog updates.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "QA",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["qa-and-checks/qa-strategy.md; build_log.md"],
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
- Before executing this, ensure qa-and-checks/qa-strategy.md; build_log.md is reviewed for compatibility.
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
- qa-and-checks/qa-strategy.md; build_log.md

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Supadupa Enhancement Layer

### Analysis
Analyzing all repository sources for Release Checklist supadupa-enhancement patterns...

This enhancement layer deepens the existing QA artifact with the newest repository-wide operating memory. It preserves all prior content and adds stronger instructions for source ingestion, append-only governance, production-ready asset generation, and QA-verifiable delivery.

### Added Capability
Adds supadupa verification gates for source traceability, contracts, and new QA packs.

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
  "artifact": "Release Checklist",
  "source_files_analyzed": "all repository sources, with inventory reference",
  "non_regression": true,
  "append_only": true,
  "compatibility_links": ["docs/source-to-template-traceability.md; qa-and-checks/data-integrity-checks.md"],
  "verification_required": ["reference check", "schema/interface check", "edge-state check", "qa handoff check"]
}
~~~

Before executing this enhancement, ensure docs/source-to-template-traceability.md; qa-and-checks/data-integrity-checks.md are reviewed for compatibility.

<!-- QA-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## QA Rationalization And Verification Layer

Analyzing all repository sources for QA rationalization patterns... This file is the canonical release checklist. The previous `qa/qa_checklists.md` content is preserved below in a lossless consolidation import and the source file is archived under `qa/archive/2026-05-10-rationalized/`.

External standards added in this pass: Playwright best practices for user-visible checks, WCAG 2.2 for accessibility, Core Web Vitals for performance, OWASP ASVS and OWASP Top 10 for security, and test-pyramid practice for coverage balance.

Release gate minimum:
~~~json
{
  "required_before_release": ["source traceability", "unit_or_contract_coverage", "critical_flow_regression", "accessibility_gate", "security_gate", "performance_gate", "rollback_or_recovery_plan", "build_log_entry"],
  "evidence_mode": "runtime-observed | code-inferred | documented-assumption"
}
~~~


<!-- QA-CHECKLISTS-LOSSLESS-CONSOLIDATION-2026-05-10 -->

## Lossless Consolidation Import From qa/qa_checklists.md

The following section preserves the previous active QA checklist template content inside the canonical release checklist. The source file is archived after this import so the active QA surface has one release-gate checklist.

﻿# QA Checklists

## Purpose
This guide defines production-grade rules for release gates, regression matrices, accessibility checks, performance budgets, and cross-folder acceptance inside the Product-Engineering OS.

## Analysis
Analyzing all repository sources for QA Checklists patterns...

Source files analyzed:
AI_PROMPTING_FOLDERSTRUCTURE/ai_dev_system.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/error_handling.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/prompt_template_backend_api.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/service_layer_template.md; AI_PROMPTING_FOLDERSTRUCTURE/build_log.md; AI_PROMPTING_FOLDERSTRUCTURE/database/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/database/migration_template.md; AI_PROMPTING_FOLDERSTRUCTURE/database/performance_tuning.md; AI_PROMPTING_FOLDERSTRUCTURE/database/schema_template.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/arch_diagrams.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/prd_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/component_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/page_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/auth_protocols.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/webhook_handler.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ab_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/qa_checklists.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/unit_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/Refactoring masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_ai_prompting_structure.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_product_engineering_os.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/ci_cd_pipeline.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/linting_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/SYSTEM.md; AI_PROMPTING_FOLDERSTRUCTURE/UI Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/component_library_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens.md; AI_PROMPTING_FOLDERSTRUCTURE/UX Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/microcopy_guide.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/user_journey_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/wizard_flow_template.md

The current repository contributes these standards: high-stakes production quality, zero functional regression, accessibility, responsive states, behavior preservation, data stability, rollback planning, test-first safety, and complete cross-folder traceability.

Before executing this, ensure scripts/ci_cd_pipeline.md is reviewed for compatibility. Also read ../ai_dev_system.md and qa/ai_instructions.md.

## Required Contract
~~~json
{
  "owner": "qa",
  "focus": "release gates, regression matrices, accessibility checks, performance budgets, and cross-folder acceptance",
  "source_files_analyzed": ["string"],
  "inputs": {},
  "outputs": {},
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'loading' | 'empty' | 'success' | 'error' }"
  },
  "edge_cases": ["string"],
  "verification": ["string"],
  "compatibility": ["../ai_dev_system.md", "qa/ai_instructions.md", "scripts/ci_cd_pipeline.md"]
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
- qa/ai_instructions.md
- scripts/ci_cd_pipeline.md

<!-- ENHANCEMENT-PASS-2026-05-05-NON-REGRESSION -->

## Recursive Enhancement Pass - Non-Regression Layer

### Self-Challenge Result
Analyzing all repository sources for qa patterns revealed that the existing Product-Engineering OS was structurally strong but could be deepened with newly discovered governance, editor-rule, changelog, coding-lesson, and framework-specific standards. This section augments the existing file without deleting or reducing any prior content.

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

<!-- CODING-LESSONS-20260510-INGESTION -->

## Coding Lessons Ingestion - Release Checklist Addendum

Source reviewed: `C:/Users/Lenovo/Downloads/codingLessonsLearnt (2).md`.

Add these checks to any feature touching frontend, UI, routing, database, integrations, or release packaging:

- [ ] Hooks are declared before early returns and no child effect depends directly on an unstable inline parent callback.
- [ ] Rapid navigation/search/date-change requests are debounced and non-critical parallel calls use `Promise.allSettled` with typed fallbacks.
- [ ] Static-host routing is refresh-safe: rewrite fallback verified or `HashRouter` chosen; OAuth/invite/reset/email links match the router mode.
- [ ] Every new import target exists and every newly introduced supporting file is included in the patch/delivery set.
- [ ] TS/TSX parser, type, or build check ran for modified frontend files; Lucide imports were verified against the installed version or safe list.
- [ ] Radix components avoid known crash patterns, especially empty `SelectItem value`, broken tab value mapping, and missing focus/keyboard semantics.
- [ ] UI shell/sidebar roots preserve full-width layout where required and existing navigation contracts are hidden with `sr-only`, not deleted, when needed for regression safety.
- [ ] Complex boards use single-scroll sticky layout and in-container overlays; diagrams use transform pan/zoom and suppress click-after-drag.
- [ ] Density tokens are opt-in and cannot silently change legacy spacing unless the component explicitly consumes density variables.
- [ ] Graph/dependency data models have database-level cycle prevention; catalog RLS policies expose the intended visibility model.
- [ ] Webhook HMAC skip/fail behavior is explicitly documented, production-safe, redacted in logs, and tested.

<!-- SOURCE-WIDE-INGESTION-20260510 -->

## Source-Wide Product-Engineering Release Gates

Analyzing all repository sources for QA release-gate patterns... Add these checks when a delivery touches product shell, frontend framework behavior, authentication, third-party providers, canonical data, seed catalogs, prompt packages, or release documentation.

- [ ] Framework adapter declared: runtime, router mode, rendering model, state owners, loading/error boundaries, and static refresh behavior.
- [ ] Product shell preserved: header, sidebar, breadcrumbs/location cue, help entry, language selector, account/session actions, and workspace/org switcher remain coherent on mobile and desktop.
- [ ] Auth provider matrix verified: callback URLs, token/session storage, backend authorization, database/RLS policy, tenant switching, revocation, webhooks, logout, and recovery paths.
- [ ] Third-party lifecycle verified: secrets not exposed, local/test mode works, webhook signature/idempotency exists, provider outage/degraded UI state exists, and logs are redacted.
- [ ] Payment/subscription changes cover checkout, portal, trialing, active, past-due, canceled, refund, failed payment, replayed webhook, and provider test mode.
- [ ] Canonical/provider data models preserve source records, confidence bands, review queue, immutable audit, and no forced ambiguous merge.
- [ ] Seed catalogs are rerun-safe, duplicate-safe, RLS-visible as intended, and unknown values are not guessed.
- [ ] Localization and help are wired through stable namespaces/anchors; translated copy length and contextual help behavior are checked.
- [ ] Prompt package changes pass metadata validation, slug uniqueness, file existence, frontmatter parsing, and index generation expectations.
- [ ] Release documentation includes capability inventory, non-regression inventory, feature flags, rollout/rollback, and reconstructability evidence.

Release gate contract:
```json
{
  "source_wide_release_gate": {
    "framework_adapter_checked": true,
    "auth_provider_matrix_checked": true,
    "third_party_lifecycle_checked": true,
    "canonical_data_checked": true,
    "seed_catalog_checked": true,
    "help_localization_checked": true,
    "prompt_package_checked": true,
    "release_reconstructability_checked": true
  }
}
```
