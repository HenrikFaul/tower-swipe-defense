# Database Performance Tuning

## Purpose
This guide defines production-grade rules for query plans, indexes, lock behavior, cardinality, backfills, and regression-safe optimization inside the Product-Engineering OS.

## Analysis
Analyzing all repository sources for Database Performance Tuning patterns...

Source files analyzed:
AI_PROMPTING_FOLDERSTRUCTURE/ai_dev_system.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/error_handling.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/prompt_template_backend_api.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/service_layer_template.md; AI_PROMPTING_FOLDERSTRUCTURE/build_log.md; AI_PROMPTING_FOLDERSTRUCTURE/database/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/database/migration_template.md; AI_PROMPTING_FOLDERSTRUCTURE/database/performance_tuning.md; AI_PROMPTING_FOLDERSTRUCTURE/database/schema_template.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/arch_diagrams.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/prd_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/component_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/page_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/auth_protocols.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/webhook_handler.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ab_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/qa_checklists.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/unit_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/Refactoring masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_ai_prompting_structure.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_product_engineering_os.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/ci_cd_pipeline.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/linting_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/SYSTEM.md; AI_PROMPTING_FOLDERSTRUCTURE/UI Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/component_library_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens.md; AI_PROMPTING_FOLDERSTRUCTURE/UX Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/microcopy_guide.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/user_journey_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/wizard_flow_template.md

The current repository contributes these standards: high-stakes production quality, zero functional regression, accessibility, responsive states, behavior preservation, data stability, rollback planning, test-first safety, and complete cross-folder traceability.

Before executing this, ensure database/schema_template.md is reviewed for compatibility. Also read ../ai_dev_system.md and database/ai_instructions.md.

## Required Contract
~~~json
{
  "owner": "database",
  "focus": "query plans, indexes, lock behavior, cardinality, backfills, and regression-safe optimization",
  "source_files_analyzed": ["string"],
  "inputs": {},
  "outputs": {},
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'loading' | 'empty' | 'success' | 'error' }"
  },
  "edge_cases": ["string"],
  "verification": ["string"],
  "compatibility": ["../ai_dev_system.md", "database/ai_instructions.md", "database/schema_template.md"]
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
- database/ai_instructions.md
- database/schema_template.md

<!-- ENHANCEMENT-PASS-2026-05-05-NON-REGRESSION -->

## Recursive Enhancement Pass - Non-Regression Layer

### Self-Challenge Result
Analyzing all repository sources for database patterns revealed that the existing Product-Engineering OS was structurally strong but could be deepened with newly discovered governance, editor-rule, changelog, coding-lesson, and framework-specific standards. This section augments the existing file without deleting or reducing any prior content.

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

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Performance Tuning Upgrade

Performance tuning must be evidence-led. For each critical query, capture purpose, caller, expected cardinality, filters, joins, sort, pagination, index coverage, cache expectations, explain/analyze requirement, and failure mode if latency exceeds budget.

Require guardrails for geospatial queries, provider-throttled enrichment, large-table backfills, RLS policy cost, relation expansion, and user-controlled filters. Prefer stable cursor pagination for large or mutable lists. Add regression evidence when changing indexes, filters, joins, policies, or materialized/cache paths.

Cross-check before use: `database/performance.md`, `database/schema-rules.md`, `backend/services.md`, `qa-and-checks/performance-checks.md`, and `scripts/ci_cd_pipeline.md`.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: database/performance_tuning.repository-enhancement-20260506.md -->

## Lossless Consolidation Import From `database/performance_tuning.repository-enhancement-20260506.md`

This section preserves unique and potentially unique source content during the 2026-05-08 database-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

### Source Scope
Companion enhancement for `database/performance_tuning.md`.

### Source Analysis
Analyzing all repository sources for database-side tuning, ETL throughput, RLS cost, and Supabase operational limit patterns...

Performance tuning must be evidence-led. The repo specifically warns that moving work into one huge PostgreSQL function is not automatically safe; statement timeouts and lock budgets still matter.

### Source Required Tuning Template Sections
- Baseline: slow query, row counts, timeout, current indexes, current RLS policy, and current client behavior.
- Hypothesis: expected bottleneck and why.
- Change: index, query rewrite, chunking, materialized/read model, realtime change, or RLS helper adjustment.
- Safety: lock level, rollback, data integrity, RLS effect, and feature flag.
- Measurement: before/after plan, latency, rows scanned, statement duration, and provider/import parity.
- Monitoring: counters, logs, alert threshold, and owner.

### Source Contract
Before executing this, ensure `database/performance.md`, `backend/service_layer_template.md`, and `qa-and-checks/performance-checks.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "PerformanceTuningReport",
  "type": "object",
  "required": ["baseline", "hypothesis", "change", "safety", "measurement", "rollback"],
  "properties": {
    "baseline": { "type": "string" },
    "hypothesis": { "type": "string" },
    "change": { "type": "string" },
    "safety": { "type": "string" },
    "measurement": { "type": "array", "items": { "type": "string" } },
    "rollback": { "type": "string" }
  }
}
```

```ts
type PerformanceTuningReportProps = {
  baselineMs?: number;
  afterMs?: number;
  checks: Array<{ name: string; status: "pass" | "warn" | "fail" }>;
  errors: Array<{ code: string; message: string }>;
};
```

### Source Verification
Tuning is incomplete without before/after evidence, rollback path, and proof that data correctness did not regress.
