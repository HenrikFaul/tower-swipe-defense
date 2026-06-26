# Integration Prompt Rationalization Map

<!-- INTEGRATION-RATIONALIZATION-2026-05-09 -->

## Purpose
This folder is the canonical integration prompt surface of the Product-Engineering OS. It keeps external API, auth, webhook, provider, and cross-service recovery guidance split by operational responsibility while preserving older prompt variants in an archive.

## Required Reading Order
1. `../ai_dev_system.md`
2. `../SYSTEM.md`
3. `../build_log.md`
4. `ai_instructions.md`
5. The task-specific canonical file below
6. Cross-folder dependencies named by that file, especially `../backend/error_handling.md`, `../backend/prompt_template_backend_api.md`, `../database/schema-rules.md`, `../frontend/state-management.md`, `../qa-and-checks/security-checks.md`, and `../qa-and-checks/integration-resilience-checks.md`

## Canonical Active Files
- `ai_instructions.md`: integration persona, read-order, production asset contract, risk model, and cross-folder authority.
- `api-contracts.md`: API contracts, schema-first integration design, typed API clients, request/response envelopes, versioning, retries, rate limits, and contract tests.
- `auth-flows.md`: SSO, OAuth, session exchange, token lifecycle, least privilege, expiry, and authorization failure handling.
- `webhook_handler.md`: webhook signature verification, raw-body handling, replay protection, idempotency, ordering, retry queues, and event observability.
- `third-party-services.md`: provider-specific adapters, endpoint constants, geospatial/provider validation, category maps, quotas, backoff, and sync strategy.
- `error-handling.md`: cross-service recovery, partial failure, provider outage, error taxonomy, redaction, fallback states, and escalation paths.

## Archived Variants
The following files were already imported into canonical files using `LOSSLESS-CONSOLIDATION-IMPORT` sections and were moved to `archive/2026-05-09-rationalized/`:
- `integration_ai_instructions.md` -> content represented in `ai_instructions.md`
- `integration_api_contracts.md` -> content represented in `api-contracts.md`
- `api_client_template.md` -> content represented in `api-contracts.md`
- `auth_protocols.md` -> content represented in `auth-flows.md`

## Current External Source Upgrades
The active integration prompt surface now treats these as current source anchors:
- OWASP API Security Top 10 2023: BOLA, broken authentication, broken property-level authorization, unrestricted resource consumption, SSRF, improper inventory, and unsafe API consumption.
- RFC 9700 OAuth 2.0 Security Best Current Practice: PKCE for authorization code flow, avoid implicit token exposure, exact origin/redirect handling, and sender-constrained token awareness.
- OpenAPI 3.1: language-agnostic API description, contract discoverability, and first-class `webhooks` support.
- RFC 9457 Problem Details for HTTP APIs: stable error contracts and resolvable problem type identities.
- Stripe and GitHub webhook verification guidance: raw payload signature verification, HMAC-SHA256 where applicable, secret storage, replay/timestamp defenses, and constant-time comparison.
- CloudEvents: common event data format for cross-provider event portability.
- RFC 9562 UUIDs: standard UUID representation for idempotency keys, event IDs, correlation IDs, and provider sync IDs where appropriate.
- IETF RateLimit header draft and provider-specific headers: read rate-limit, retry, and reset signals defensively; prefer `Retry-After` when present.

## Non-Regression Rule
Archiving is not deletion. Archived files remain available for audit and restore. Canonical files must not drop imported meaning unless a future pass proves section-by-section duplication and records that proof in `../build_log.md`.
