# Webhook Handler

## Purpose
This guide defines production-grade rules for signature verification, replay protection, idempotency, ordering, retries, and observability inside the Product-Engineering OS.

## Analysis
Analyzing all repository sources for Webhook Handler patterns...

Source files analyzed:
AI_PROMPTING_FOLDERSTRUCTURE/ai_dev_system.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/error_handling.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/prompt_template_backend_api.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/service_layer_template.md; AI_PROMPTING_FOLDERSTRUCTURE/build_log.md; AI_PROMPTING_FOLDERSTRUCTURE/database/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/database/migration_template.md; AI_PROMPTING_FOLDERSTRUCTURE/database/performance_tuning.md; AI_PROMPTING_FOLDERSTRUCTURE/database/schema_template.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/arch_diagrams.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/prd_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/component_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/page_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/auth_protocols.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/webhook_handler.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ab_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/qa_checklists.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/unit_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/Refactoring masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_ai_prompting_structure.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_product_engineering_os.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/ci_cd_pipeline.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/linting_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/SYSTEM.md; AI_PROMPTING_FOLDERSTRUCTURE/UI Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/component_library_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens.md; AI_PROMPTING_FOLDERSTRUCTURE/UX Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/microcopy_guide.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/user_journey_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/wizard_flow_template.md

The current repository contributes these standards: high-stakes production quality, zero functional regression, accessibility, responsive states, behavior preservation, data stability, rollback planning, test-first safety, and complete cross-folder traceability.

Before executing this, ensure backend/error_handling.md is reviewed for compatibility. Also read ../ai_dev_system.md and integration/ai_instructions.md.

## Required Contract
~~~json
{
  "owner": "integration",
  "focus": "signature verification, replay protection, idempotency, ordering, retries, and observability",
  "source_files_analyzed": ["string"],
  "inputs": {},
  "outputs": {},
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'loading' | 'empty' | 'success' | 'error' }"
  },
  "edge_cases": ["string"],
  "verification": ["string"],
  "compatibility": ["../ai_dev_system.md", "integration/ai_instructions.md", "backend/error_handling.md"]
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
- integration/ai_instructions.md
- backend/error_handling.md

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

### guide Application Rule
For this guide artifact, every future generated asset must explicitly state which newly discovered repository standards apply, which do not apply, and why. If a source class is absent in a future run, record that absence instead of silently assuming it does not matter.

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

<!-- CODING-LESSONS-20260510-INGESTION -->

## Coding Lessons Ingestion - Webhook And Provider Resilience

Source reviewed: `C:/Users/Lenovo/Downloads/codingLessonsLearnt (2).md`.

New integration lessons to enforce:
- Webhook HMAC verification may be optional only when the provider secret is explicitly unconfigured and the endpoint is documented as non-production, low-risk, or provider-limited. Production endpoints must fail closed when a configured secret is missing or verification fails.
- Signature checks must make the skip/fail behavior observable: log a redacted structured event with `secret_configured`, `verification_required`, `verification_result`, provider, event ID, and correlation ID.
- Provider APIs may require endpoint cascades because project key, numeric project ID, account ID, or cloud-specific paths differ by endpoint. Integration prompts must define fallback order, stop conditions, and normalized error mapping.
- Provider rich text payloads such as Atlassian Document Format must be normalized at the boundary. Do not push provider-specific rich document formats into generic UI copy or database text fields without a conversion contract.
- Deno Edge Functions must pin SDK import style and runtime globals explicitly. Code intended for Deno should not be pulled into Next.js root TypeScript checks unless types and boundaries are configured.

Webhook resilience contract:
```json
{
  "hmac": {
    "secret_configured": "boolean",
    "verification_required": "production true unless explicitly documented",
    "skip_allowed_only_when": ["non_production", "provider_limited", "low_risk_documented"],
    "raw_body_preserved": true
  },
  "provider_cascade": {
    "fallback_order": ["endpoint_or_identifier_strategy"],
    "stop_conditions": ["success", "non_retryable_auth", "not_found_after_all"],
    "normalized_errors": true
  },
  "runtime_boundary": {
    "deno_edge_isolated_from_next_build": true,
    "sdk_version_compatibility_documented": true
  }
}
```
