# API Contracts

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for API Contracts patterns...

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
Act as a senior Integration owner with 15+ years of production experience. You are accountable for business behavior, technical correctness, accessibility, security, performance, observability, and QA handoff.

## Purpose
Define third-party API contracts, schemas, versioning, redaction, retries, rate limits, and evidence capture.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Integration",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["integration/api_client_template.md; backend/prompt_template_backend_api.md"],
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
- Before executing this, ensure integration/api_client_template.md; backend/prompt_template_backend_api.md is reviewed for compatibility.
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
- integration/api_client_template.md; backend/prompt_template_backend_api.md

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/integration/integration_api_contracts.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/integration/integration_api_contracts.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# API Contracts

## PURPOSE
This file defines how integrations should be specified so the AI can produce typed, predictable, and maintainable communication with external systems.

## CONTRACT RULES
- Define request and response shapes explicitly.
- Define required and optional fields.
- Define error shapes where possible.
- Define authentication requirements.
- Define rate limit expectations if known.
- Define versioning behavior if the integration is sensitive to change.

## CONTRACT DESIGN
A good contract should specify:
- Endpoint purpose.
- Method.
- Headers.
- Query parameters.
- Body schema.
- Response schema.
- Error schema.
- Timeouts.
- Retry policy.
- Idempotency expectations if relevant.

## WEBHOOK CONTRACT RULES
- Define verification method.
- Define expected event types.
- Define replay safety if needed.
- Define retry behavior.
- Define logging rules.
- Define what to do on partial failure.

## OUTPUT REQUIREMENT
Whenever the AI creates an integration, it must produce:
1. Contract summary.
2. Request schema.
3. Response schema.
4. Error behavior.
5. Security concerns.
6. Files to update.


<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# API Client Template

## Mission
This template turns typed API clients, retries, auth, error mapping, rate limits, and backend envelope compatibility into a production-ready asset within the Product-Engineering OS. It is not a snippet prompt. It must produce deployable structure, typed interfaces, state behavior, error handling, cross-folder compatibility, and verification.

## Persona
Act as a Senior Integration Engineer with 15+ years of production experience.

## Analysis
Analyzing all repository sources for API Client Template patterns...

Source files analyzed:
AI_PROMPTING_FOLDERSTRUCTURE/ai_dev_system.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/error_handling.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/prompt_template_backend_api.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/service_layer_template.md; AI_PROMPTING_FOLDERSTRUCTURE/build_log.md; AI_PROMPTING_FOLDERSTRUCTURE/database/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/database/migration_template.md; AI_PROMPTING_FOLDERSTRUCTURE/database/performance_tuning.md; AI_PROMPTING_FOLDERSTRUCTURE/database/schema_template.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/arch_diagrams.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/prd_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/component_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/page_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/auth_protocols.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/webhook_handler.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ab_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/qa_checklists.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/unit_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/Refactoring masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_ai_prompting_structure.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_product_engineering_os.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/ci_cd_pipeline.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/linting_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/SYSTEM.md; AI_PROMPTING_FOLDERSTRUCTURE/UI Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/component_library_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens.md; AI_PROMPTING_FOLDERSTRUCTURE/UX Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/microcopy_guide.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/user_journey_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/wizard_flow_template.md

Patterns extracted and enforced:
- From UI/UX prompts: preserve every existing feature, avoid cosmetic-only redesign, use clear hierarchy, semantic color, consistent spacing, accessible contrast, visible focus states, keyboard navigation, responsive layouts, and explicit loading/error/empty/success states.
- From refactoring prompt: discover before changing, preserve external contracts, mine changelogs and lessons when present, protect data correctness, plan rollback, add tests before risky changes, and document behavior preservation.
- From ultimate mission: outperform generic builders by producing productized assets using Tailwind, shadcn/ui, Radix, Headline/CTA/Grid hierarchy, advanced UX heuristics, and self-validation.

Before executing this, ensure backend/prompt_template_backend_api.md is reviewed for compatibility. This template requires ../ai_dev_system.md and integration/ai_instructions.md.

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
        "local": { "const": "integration/ai_instructions.md" },
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
        "owner": { "const": "integration" },
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
- integration/ai_instructions.md
- backend/prompt_template_backend_api.md

<!-- ENHANCEMENT-PASS-2026-05-05-NON-REGRESSION -->

## Recursive Enhancement Pass - Non-Regression Layer

### Self-Challenge Result
Analyzing all repository sources for integration patterns revealed that the existing Product-Engineering OS was structurally strong but could be deepened with newly discovered governance, editor-rule, changelog, coding-lesson, and framework-specific standards. This section augments the existing file without deleting or reducing any prior content.

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

<!-- INTEGRATION-INTERNET-TUNED-RATIONALIZATION-2026-05-09 -->
## 2026-05-09 Internet-Tuned Rationalization Layer

### Analysis
Analyzing all repository sources for integration rationalization patterns, then upgrading this canonical integration prompt with current external guidance from OWASP API Security Top 10 2023, RFC 9700 OAuth 2.0 Security BCP, OpenAPI 3.1, RFC 9457 Problem Details, Stripe and GitHub webhook verification docs, CloudEvents, RFC 9562 UUIDs, and IETF RateLimit draft guidance.

### Current Source Anchors
- OWASP API Security Top 10 2023 makes object-level authorization, broken authentication, property-level authorization, unrestricted resource consumption, SSRF, improper API inventory, and unsafe API consumption first-class integration risks.
- RFC 9700 requires PKCE for public OAuth clients, recommends it for confidential clients, discourages implicit token exposure, and requires transaction-specific PKCE or nonce values.
- OpenAPI 3.1 establishes contract-first API description for paths, components, security schemes, callbacks, and webhooks.
- RFC 9457 Problem Details requires stable, safe, machine-readable error shapes without stack traces.
- Stripe and GitHub webhook guidance require raw-payload signature verification before processing, secure secret storage, replay/timestamp defenses where available, HMAC-SHA256 where applicable, and timing-safe comparison.
- CloudEvents provides a common event envelope for cross-provider portability. RFC 9562 UUIDs can support idempotency keys, event IDs, correlation IDs, and sync run IDs when provider-native IDs are insufficient.

### Rationalized Integration Rules
- Treat every external system as untrusted until validated. Verify object ownership, function authorization, request schema, response schema, provider identity, and field-level permission.
- Contract-first is mandatory: every external API, proxy, webhook, and provider sync must define request schema, response schema, error schema, auth scheme, rate-limit policy, timeout budget, idempotency behavior, versioning, and fixtures.
- API clients centralize base URL, endpoint constants, auth injection, timeout, retries, backoff, stop conditions, idempotency key behavior, redaction, and normalized error mapping.
- Webhooks reject missing signatures, stale timestamps, bad algorithms, duplicate event IDs, replayed delivery IDs, and modified raw bodies before side effects.
- Separate HTTP transport success from business success; a 2xx may still contain provider errors, partial failures, queued states, stale data, or schema drift.
- Never log API keys, bearer tokens, cookies, webhook secrets, OAuth codes, refresh tokens, raw PII payloads, or complete signed webhook bodies.
- User-facing status must distinguish `reachable`, `authenticated`, `authorized`, `rateLimited`, `schemaMismatch`, `partial`, `degraded`, `queued`, and `failed`.

### Contract Addendum
~~~json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "IntegrationAssetRationalizedContract",
  "required": ["sourceEvidence", "contract", "security", "resilience", "observability", "verification"]
}
~~~

~~~ts
type IntegrationStatusPanelProps = {
  status: "idle" | "checking" | "reachable" | "authenticated" | "authorized" | "rateLimited" | "partial" | "degraded" | "failed";
  provider: string;
  errors: Array<{ code: string; message: string; retryable?: boolean; providerCode?: string }>;
  evidence: Array<{ source: string; claim: string; redacted: boolean }>;
  onRetry?: () => void;
};
~~~

### Compatibility Gate
Before executing this rationalized integration guidance, review `README.md`, `ai_instructions.md`, the task-specific integration file, `../backend/error_handling.md`, `../backend/prompt_template_backend_api.md`, `../database/schema-rules.md`, `../frontend/state-management.md`, `../qa-and-checks/security-checks.md`, and `../qa-and-checks/integration-resilience-checks.md`.

