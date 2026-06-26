# Third-Party Services

<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->

## Mission
This file is part of the expanded my-ai-dev-system structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for Third-Party Services patterns...

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
Define provider-specific adapters, geospatial validation, category maps, rate-limit/backoff, and endpoint constants.

## Required Input Contract
`json
{
  "task_id": "string",
  "domain": "Integration",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["integration/api-contracts.md; Source/Codinglessonslearnt"],
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
- Before executing this, ensure integration/api-contracts.md; Source/Codinglessonslearnt is reviewed for compatibility.
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
- integration/api-contracts.md; Source/Codinglessonslearnt

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Supadupa Enhancement Layer

### Analysis
Analyzing all repository sources for Third Party Services supadupa-enhancement patterns...

This enhancement layer deepens the existing Integration artifact with the newest repository-wide operating memory. It preserves all prior content and adds stronger instructions for source ingestion, append-only governance, production-ready asset generation, and QA-verifiable delivery.

### Added Capability
Adds integration resilience checks for provider validation, rate limits, and redaction.

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
  "artifact": "Third Party Services",
  "source_files_analyzed": "all repository sources, with inventory reference",
  "non_regression": true,
  "append_only": true,
  "compatibility_links": ["qa-and-checks/integration-resilience-checks.md; docs/coding-lessons-digest.md"],
  "verification_required": ["reference check", "schema/interface check", "edge-state check", "qa handoff check"]
}
~~~

Before executing this enhancement, ensure qa-and-checks/integration-resilience-checks.md; docs/coding-lessons-digest.md are reviewed for compatibility.

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

<!-- SOURCE-WIDE-INGESTION-20260510 -->

## Payment, Storage, And Provider Lifecycle Layer

Analyzing all repository sources for third-party service patterns... Third-party prompts must treat external services as lifecycle systems, not isolated API calls. Every service integration must define configuration, credentials, environment separation, idempotency, webhook/event handling, local test mode, provider outage behavior, data ownership, and removal/rotation procedure.

Payment/subscription requirements:
- Payment provider assets must declare publishable key, secret key, webhook secret, price/product identifiers, environment mode, and safe configuration loading. Secrets must never be exposed to client bundles or logs.
- Checkout, billing portal, subscription creation, cancellation, renewal, trial conversion, failed payment, refund, and invoice events must map into a local subscription state model.
- Webhook processing must verify signature, persist provider event IDs, deduplicate replays, process events idempotently, and preserve a redacted audit trail.
- User-facing billing UI must distinguish pending checkout, active, trialing, past due, canceled, incomplete, and provider-degraded states.

Storage and backend-as-a-service requirements:
- File upload integrations must enforce size, MIME/content type, extension, virus/security policy if available, tenant path isolation, signed URL expiry, and cleanup of abandoned files.
- Realtime/subscription APIs must unsubscribe on teardown, debounce reconnection storms, and expose degraded state to the UI instead of silently stale data.
- Provider SDK wrappers must isolate vendor-specific code behind local adapters so UI and business logic consume stable internal contracts.

Provider lifecycle contract:
```ts
type ThirdPartyProviderLifecycle = {
  provider: string;
  capability: "payments" | "auth" | "storage" | "database" | "email" | "analytics" | "maps" | "ai" | "other";
  env: "local" | "preview" | "staging" | "production";
  secrets: Array<{ name: string; clientVisible: boolean; rotationPlan: string }>;
  events: Array<{ providerEvent: string; localStateChange: string; idempotencyKey: string }>;
  outageMode: "queue" | "degrade" | "disable" | "manual-review";
  verification: string[];
};
```

Compatibility cross-links: before adding or changing a third-party service, review `api-contracts.md`, `auth-flows.md`, `error-handling.md`, `webhook_handler.md`, `../database/schema-rules.md`, `../frontend/state-management.md`, `../ux/states.md`, and `../qa-and-checks/integration-resilience-checks.md`.
