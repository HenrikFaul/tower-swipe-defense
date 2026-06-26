# Migration Template

## Mission
This template turns zero-downtime migrations, backfills, lock safety, rollback, and verification into a production-ready asset within the Product-Engineering OS. It is not a snippet prompt. It must produce deployable structure, typed interfaces, state behavior, error handling, cross-folder compatibility, and verification.

## Persona
Act as a Senior Database Reliability Engineer with 15+ years of production experience.

## Analysis
Analyzing all repository sources for Migration Template patterns...

Source files analyzed:
AI_PROMPTING_FOLDERSTRUCTURE/ai_dev_system.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/error_handling.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/prompt_template_backend_api.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/service_layer_template.md; AI_PROMPTING_FOLDERSTRUCTURE/build_log.md; AI_PROMPTING_FOLDERSTRUCTURE/database/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/database/migration_template.md; AI_PROMPTING_FOLDERSTRUCTURE/database/performance_tuning.md; AI_PROMPTING_FOLDERSTRUCTURE/database/schema_template.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/arch_diagrams.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/prd_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/component_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/page_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/auth_protocols.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/webhook_handler.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ab_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/qa_checklists.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/unit_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/Refactoring masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_ai_prompting_structure.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_product_engineering_os.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/ci_cd_pipeline.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/linting_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/SYSTEM.md; AI_PROMPTING_FOLDERSTRUCTURE/UI Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/component_library_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens.md; AI_PROMPTING_FOLDERSTRUCTURE/UX Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/microcopy_guide.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/user_journey_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/wizard_flow_template.md

Patterns extracted and enforced:
- From UI/UX prompts: preserve every existing feature, avoid cosmetic-only redesign, use clear hierarchy, semantic color, consistent spacing, accessible contrast, visible focus states, keyboard navigation, responsive layouts, and explicit loading/error/empty/success states.
- From refactoring prompt: discover before changing, preserve external contracts, mine changelogs and lessons when present, protect data correctness, plan rollback, add tests before risky changes, and document behavior preservation.
- From ultimate mission: outperform generic builders by producing productized assets using Tailwind, shadcn/ui, Radix, Headline/CTA/Grid hierarchy, advanced UX heuristics, and self-validation.

Before executing this, ensure database/schema_template.md is reviewed for compatibility. This template requires ../ai_dev_system.md and database/ai_instructions.md.

## Required Input JSON Schema
~~~json
{
  "": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["taskId", "assetGoal", "sourceFilesAnalyzed", "acceptanceCriteria", "compatibility"],
  "properties": {
    "taskId": { "type": "string" },
    "assetGoal": { "type": "string" },
    "sourceFilesAnalyzed": { "type": "array", "items": { "type": "string" } },
    "existingPatterns": { "type": "array", "items": { "type": "string" } },
    "interfaces": {
      "type": "object",
      "properties": {
        "jsonSchema": { "type": "object" },
        "reactProps": { "type": "string" },
        "apiEnvelope": { "type": "object" }
      }
    },
    "compatibility": {
      "type": "object",
      "required": ["global", "local", "upstream", "downstream"],
      "properties": {
        "global": { "const": "../ai_dev_system.md" },
        "local": { "const": "database/ai_instructions.md" },
        "upstream": { "type": "array", "items": { "type": "string" } },
        "downstream": { "type": "array", "items": { "type": "string" } }
      }
    },
    "acceptanceCriteria": { "type": "array", "minItems": 3, "items": { "type": "string" } }
  }
}
~~~

## Required Output JSON Schema
~~~json
{
  "": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["summary", "asset", "interfaces", "states", "errorHandling", "verification"],
  "properties": {
    "summary": { "type": "string" },
    "asset": {
      "type": "object",
      "required": ["name", "owner", "productionReady"],
      "properties": {
        "name": { "type": "string" },
        "owner": { "const": "database" },
        "productionReady": { "type": "boolean" },
        "crossLinks": { "type": "array", "items": { "type": "string" } }
      }
    },
    "interfaces": { "type": "object" },
    "states": { "type": "array", "items": { "enum": ["idle", "loading", "empty", "success", "error", "disabled", "pending", "optimistic", "conflict"] } },
    "errorHandling": { "type": "array", "items": { "type": "string" } },
    "verification": { "type": "array", "items": { "type": "string" } }
  }
}
~~~

## React Props Contract
When UI or frontend is touched, include:
~~~ts
type AssetProps = {
  id: string;
  title?: string;
  status: "idle" | "loading" | "empty" | "success" | "error" | "disabled";
  data?: unknown;
  error?: { code: string; message: string; retryable?: boolean };
  onPrimaryAction?: () => void;
  onRetry?: () => void;
  className?: string;
  "aria-label"?: string;
};
~~~

## API Envelope
When backend or integration is touched, include:
~~~json
{
  "ok": true,
  "data": {},
  "meta": {
    "requestId": "string",
    "schemaVersion": "string",
    "durationMs": 0
  },
  "errors": []
}
~~~

Failure:
~~~json
{
  "ok": false,
  "data": null,
  "meta": {
    "requestId": "string",
    "retryable": false
  },
  "errors": [
    {
      "code": "SPECIFIC_CODE",
      "message": "safe caller-facing message",
      "details": {}
    }
  ]
}
~~~

## Error And Edge Cases
Explicitly cover invalid input, missing records, permission denial, expired auth, rate limits, duplicate submission, network timeout, stale cache, concurrent update, partial success, rollback failure, empty data, loading delay, offline mode, accessibility failure, and responsive overflow.

## Design And UX Rules
If user-facing, enforce Tailwind semantic tokens, shadcn/ui composition, Radix accessibility primitives, Headline/CTA/Grid hierarchy, predictable controls, clear affordances, visible focus rings, keyboard support, touch targets, responsive breakpoints, skeleton/empty/error states, and microcopy that helps recovery without blaming the user.

## Verification
The final asset must include static checks, unit tests, contract tests, integration tests where relevant, accessibility review, responsive review, performance budget check, regression matrix, and QA handoff. Mark it incomplete if it cannot be tested.

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

### template Application Rule
For this template artifact, every future generated asset must explicitly state which newly discovered repository standards apply, which do not apply, and why. If a source class is absent in a future run, record that absence instead of silently assuming it does not matter.

<!-- ENHANCEMENT-PASS-2026-05-07-BACKEND-DATABASE-NO-NEW-FILES -->

## 2026-05-07 Migration Template Upgrade

The migration template must require: intent, risk level, affected tables/views/functions/policies, preflight SQL, forward SQL, rollback or forward-fix SQL, lock-risk notes, backfill batching, verification SQL, generated type refresh, seed/fixture updates, API/service compatibility, and QA matrix.

For destructive or irreversible work, stop for confirmation before execution. For policy changes, include allowed/denied context tests. For data migrations, include idempotency, resume safety, partial failure handling, and audit evidence. For performance-sensitive migrations, include index creation strategy and explain/plan expectations.

Cross-check before use: `database/migrations.md`, `database/schema-rules.md`, `database/performance_tuning.md`, `backend/tests.md`, and `qa-and-checks/data-integrity-checks.md`.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: database/migration_template.repository-enhancement-20260506.md -->

## Lossless Consolidation Import From `database/migration_template.repository-enhancement-20260506.md`

This section preserves unique and potentially unique source content during the 2026-05-08 database-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

### Source Scope
Companion enhancement for `database/migration_template.md`.

### Source Analysis
Analyzing all repository sources for Supabase migration generation with RLS, indexes, functions, triggers, seed compatibility, and rollback patterns...

Migration templates must now encode the observed Supabase realities: schema cache lag, verify_jwt configuration, generated type impact, RLS regression risk, and provider import idempotency.

### Source Required Template Sections
- Header: timestamp, purpose, source evidence, affected schemas, risk level.
- Preflight SQL: information_schema checks, existing constraints, existing defaults, dependent views, duplicate keys, row counts.
- DDL: tables, columns, comments, constraints, generated columns, triggers, functions, policies, and indexes.
- Data movement: chunk strategy, source session, current-run verification, and duplicate source handling.
- RLS: enablement, helper functions, positive test, negative test, and policy comments.
- Type impact: generated Supabase types or handwritten interface updates.
- Rollback: exact SQL where reversible, mitigation where not reversible.

### Source Contract
Before executing this, ensure `database/migrations.md`, `database/schema_template.md`, and `backend/service_layer_template.md` are reviewed for compatibility.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "MigrationTemplateOutput",
  "type": "object",
  "required": ["header", "preflight_sql", "ddl_sql", "rls_sql", "validation_sql", "rollback_sql"],
  "properties": {
    "header": { "type": "string" },
    "preflight_sql": { "type": "string" },
    "ddl_sql": { "type": "string" },
    "rls_sql": { "type": "string" },
    "validation_sql": { "type": "string" },
    "rollback_sql": { "type": "string" }
  }
}
```

```ts
type MigrationTemplatePreviewProps = {
  sqlSections: Array<{ name: string; content: string }>;
  errors: Array<{ code: string; message: string }>;
};
```

### Source Verification
The template must reject migrations that lack preflight, rollback, RLS tests, comments, index strategy, or generated-type impact.
