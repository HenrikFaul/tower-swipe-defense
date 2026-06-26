# AI Development System

## Entry Point Status

This file is **not** the first file to give to an external coding AI.

The single bootstrap entry point is `SYSTEM.md`. If this file is opened directly at the start of a task, stop and read `SYSTEM.md` first. `SYSTEM.md` will instruct the AI to return here as the global Product-Engineering OS rulebook, then continue into the relevant domain files, compatibility links, checklists, and templates.

## System Goal
Establish a high-fidelity **AI-as-a-Team Product-Engineering OS** that converts intent into production-ready assets, not isolated snippets. Every artifact must be modular, typed, accessible, performant, observable, regression-aware, and compatible with the full repository hierarchy.

## Repository Pattern Extraction
When starting any task, the AI must analyze all available repository sources for the relevant product-engineering patterns.

Required opening statement:

> Analyzing all repository sources for [Topic] patterns...

### Source Corpus to Review
Use the local repository as the source of truth. The current corpus includes, but is not limited to:

- `ai_dev_system.md`
- `SYSTEM.md`
- `.ai/agents.md`
- `.ai/skills.md`
- `.ai/best-practices.md`
- backend instructions, prompt templates, controllers, services, exceptions, and tests
- database schema, migration, seed, and performance rules
- integration API contracts, auth flows, third-party services, and error-handling rules
- frontend project structure, routing, state management, prompts, and tests
- UI tokens, typography, component, and accessibility rules
- UX flows, states, messaging, copy, and design-system rules
- A/B testing strategy, metrics, and rollout guidance
- QA strategy, release checklist, accessibility, security, and performance checks
- sample backend, frontend, and UX-flow examples
- build logs, changelogs, coding lessons, manifests, CI/CD rules, and linting rules when present

### Extracted Paradigms
- The OS must be self-referential and runnable without hidden external docs.
- UI and UX work must support production-grade redesign: zero functional regression, measurable usability gains, explicit loading/error/empty states, visible focus states, responsive behavior, preserved power-user workflows, and implementation-aware guidance.
- Refactoring must begin with repository discovery, business-behavior reconstruction, changelog and coding-lesson mining, data-integrity review, behavior-preservation matrices, regression traps, transaction safety, idempotency, rollback planning, and tests before risky changes.
- Future workspace-level files such as `.cursor`, `.continue`, manifests, changelogs, or `coding_lessons` must be integrated into scripts, CI/CD, linting, and QA checks.
- `SYSTEM.md` is the global controller and must be treated as local architecture input.
- Every folder owns interfaces, states, verification, resilience, and compatibility.
- Productized AI means the AI reads the global controller and local instructions, follows dependency order, logs work, and validates output against architectural constraints.

## Repository Structure

```text
my-ai-dev-system/
├── README.md                   # Project overview, setup, and usage instructions
├── SYSTEM.md                   # AI Master Controller (navigation, rule hierarchy)
├── ai_dev_system.md            # Global Product-Engineering OS rules & principles
├── build_log.md                # Execution log (must read on restart for idempotency)
├── .ai/
│   ├── agents.md               # Team roles (e.g., Backend, Frontend, QA agents)
│   ├── skills.md               # AI skill-set mappings per role
│   └── best-practices.md       # Global coding, style, and security guidelines
├── backend/
│   ├── backend-system.md       # Backend domain rules and architectural scope
│   ├── ai_instructions.md      # Backend-specific persona and rules
│   ├── prompts.md              # Backend-specific prompt templates
│   ├── controllers.md          # Controller logic and API structure standards
│   ├── services.md             # Service layer rules (business logic vs. DB)
│   ├── exceptions.md           # Error handling and logging conventions
│   └── tests.md                # Backend testing guidelines (unit/integration)
├── database/
│   ├── ai_instructions.md      # Database-specific persona and rules
│   ├── schema-rules.md         # Data modeling, indexing, and FK standards
│   ├── migrations.md           # Migration process and rollback protocols
│   ├── seed-data.md            # Database seeding types and sample data
│   └── performance.md          # Query optimization and indexing strategies
├── integration/
│   ├── ai_instructions.md      # Integration-specific persona and rules
│   ├── api-contracts.md        # Third-party API contracts and definitions
│   ├── auth-flows.md           # Authentication/SSO/OAuth flows
│   ├── third-party-services.md # External service integration patterns
│   └── error-handling.md       # Cross-service error recovery strategies
├── frontend/
│   ├── frontend-system.md      # Frontend framework rules and scope
│   ├── ai_instructions.md      # Frontend-specific persona and rules
│   ├── project-structure.md    # Source structure and component hierarchy
│   ├── prompts.md              # Frontend-specific prompt templates
│   ├── routing.md              # Routing strategy (SPA/SSR)
│   ├── state-management.md     # Global state management standards
│   └── tests.md                # Frontend testing (unit/E2E/Visual)
├── ui/
│   ├── ai_instructions.md      # UI-specific persona and rules
│   ├── tokens.md               # Design tokens (colors, spacing, radius, shadows)
│   ├── typography.md           # Typography system and scale standards
│   ├── components.md           # Component catalog guidelines (Card, Button, Form)
│   └── accessibility.md        # A11y standards and focus state management
├── ux/
│   ├── ai_instructions.md      # UX-specific persona and rules
│   ├── user-flows.md           # Primary user flows (onboarding, checkout)
│   ├── states.md               # UI state definitions (loading, empty, error)
│   ├── messaging.md            # UI messaging and tone-of-voice guidelines
│   ├── copy-rules.md           # Micro-copy and CTA naming conventions
│   └── design-system.md        # UX design system documentation
├── ab-testing/
│   ├── strategy.md             # A/B testing and experimentation strategy
│   ├── metrics.md              # Key metrics (CTR, conversion, retention, latency)
│   └── rollout-plan.md         # Staging to production rollout workflows
├── qa-and-checks/
│   ├── qa-strategy.md          # Overall QA strategy (TDD, BDD, automation)
│   ├── checklist.md            # Release validation and feature checklists
│   ├── accessibility-checks.md # Accessibility compliance checklists
│   ├── security-checks.md      # Security auditing and penetration testing
│   └── performance-checks.md   # Performance budget and audit guidelines
├── docs/
│   ├── prd-template.md         # Product requirements template
│   └── arch-diagrams.md        # Architecture diagram definitions
├── scripts/
│   ├── bootstrap-ai-prompting-structure.ps1
│   ├── bootstrap-product-engineering-os.ps1
│   ├── ci-cd-pipeline.md       # CI/CD orchestration guidelines
│   └── linting-rules.md        # Linting and quality control standards
└── samples/
    ├── sample-backend.md       # Backend reference implementation snippets
    ├── sample-frontend.md      # Frontend reference component snippets
    └── sample-ux-flow.md       # UX flow implementation examples
```

## Hierarchy and Ownership

1. **DB (1):** `database/`
2. **Backend (2):** `backend/`
3. **Integration (3):** `integration/`
4. **Frontend (4):** `frontend/`
5. **UI (5):** `ui/`
6. **UX (6):** `ux/`
7. **QA (7):** `qa-and-checks/`

QA rationalization note, 2026-05-10:

- Use `qa-and-checks/` as the canonical QA ownership layer for release strategy, release checklists, regression gates, accessibility, security, performance, data integrity, integration resilience, and visual regression.
- Use `qa/` as a specialist test-template library for generating unit tests, characterization tests, contract tests, and A/B experiment QA assets.
- Do not recreate `qa/qa_checklists.md` as an active release checklist. Its content is consolidated into `qa-and-checks/checklist.md` and preserved in `qa/archive/2026-05-10-rationalized/`.
- Any test-generation prompt in `qa/` must read `qa-and-checks/qa-strategy.md` and `qa-and-checks/checklist.md` before output.

Scripts rationalization note, 2026-05-10:

- Use `scripts/ci-cd-pipeline.md` and `scripts/linting-rules.md` as canonical documentation names.
- Treat `scripts/ci_cd_pipeline.md` and `scripts/linting_rules.md` as archived aliases after their lossless imports are present in the canonical files.
- Keep the PowerShell bootstrap and enhancement scripts active as historical automation assets until a future wrapper or runbook fully represents their behavior.
- Any automation-affecting prompt must read `scripts/README.md`, `scripts/reference-verification.md`, `scripts/prompt-metadata-validation.md`, and `qa-and-checks/checklist.md`.

Dependency rule:

```text
DB -> Backend -> Integration -> Frontend -> UI -> UX -> QA
```

Downstream folders may propose changes, but upstream contract owners must approve compatibility changes.

## Mandatory Cross-Referencing
Before any generation:

1. Confirm the task started from `SYSTEM.md`.
2. Confirm `SYSTEM.md` delegated the AI to `build_log.md`, this `ai_dev_system.md`, and the relevant domain entry file.
3. Read the target folder’s local instruction file, for example `ai_instructions.md`, `backend-system.md`, or `frontend-system.md`.
4. Scan all available repository sources for relevant patterns, including manifests, prompts, changelogs, coding lessons, and documentation.
5. Read all linked upstream and downstream files named in the target template.
6. State: `Analyzing all repository sources for [Topic] patterns...`

## Production-Ready Asset Contract
Every output must include, where applicable:

- persona and ownership,
- source files analyzed,
- JSON schema interfaces,
- React prop or component contracts where UI/frontend is touched,
- API envelopes where backend/integration is touched,
- data invariants where database is touched,
- error, empty, loading, timeout, conflict, retry, and permission behavior,
- accessibility and responsive requirements when user-facing,
- verification steps and QA handoff,
- broken-reference checks.

## Design Superiority Rules
For visual and interaction work:

- Use Tailwind, shadcn/ui, and Radix-compatible primitives unless the project explicitly provides another system.
- Use semantic tokens instead of hard-coded visual values.
- Apply strong hierarchy through headline, CTA, and grid composition.
- Provide clear focus rings and keyboard behavior.
- Follow WCAG-oriented contrast and accessibility expectations.
- Define responsive behavior across breakpoints.
- Include complete component states: default, hover, focus, active, disabled, loading, empty, error, and success.

## Productized AI Rules
The AI must operate as a structured builder:

- delegate conceptually by folder ownership,
- preserve existing behavior unless a deliberate migration is approved,
- log actions in `build_log.md`,
- validate contracts before handoff,
- prefer safe incremental changes over sweeping rewrites,
- protect data correctness over aesthetic or code elegance.

## Build Log Format
`build_log.md` uses:

| Task ID | Description | Source Files Analyzed | Target Path | Status |
|---|---|---|---|---|

Re-runs must read the log first and resume only missing or incomplete `ULT-*` tasks.

## Folder Responsibilities

### `.ai/`
Owns global agent roles, skill routing, and cross-cutting best practices. It defines which conceptual AI role should handle a task and which local instruction files must be loaded.

### `database/`
Owns schema correctness, migrations, seed data, query performance, indexing, data invariants, transactions, rollback safety, and data integrity.

### `backend/`
Owns server-side business logic, controllers, service boundaries, API behavior, exceptions, validation, authorization checks, observability, and backend tests.

### `integration/`
Owns API contracts, third-party protocols, authentication flows, webhooks, retries, idempotency, timeout handling, and integration-level error behavior.

### `frontend/`
Owns application structure, routes, state management, component integration, frontend contracts, data-fetching behavior, and unit/E2E test strategy.

### `ui/`
Owns design tokens, typography, components, variants, visual states, accessibility rules, focus behavior, and implementation-ready UI specifications.

### `ux/`
Owns user journeys, flows, copy rules, microcopy, information architecture, interaction states, onboarding, settings, and usability validation.

### `ab-testing/`
Owns experiment design, hypothesis framing, metrics, guardrails, rollout plans, and interpretation rules.

### `docs/`
Owns documentation governance, PRD structure, architecture-diagram rules, source mining, traceability, interface contract registries, and non-regression documentation gates. Use `docs/README.md` as the routing layer. When full repository documentation must be generated, delegate to `../doc creation/SYSTEM.md` if that pack exists; generated target-repository docs belong in repository-root `docs/`, not inside `AI_PROMPTING_FOLDERSTRUCTURE/docs/`.

### `qa-and-checks/`
Owns release-readiness checks, regression testing, accessibility verification, security checks, performance checks, and QA handoff.

### `samples/`
Provides concrete examples that future AI tasks can use as reference patterns for backend, frontend, and UX output quality.

## Operational Workflow

For every task:

1. Identify the target folder and owner.
2. Start from `SYSTEM.md`, then load global rules from this `ai_dev_system.md` as delegated by `SYSTEM.md`.
3. Load target-folder instructions and relevant upstream/downstream files.
4. Reconstruct existing behavior before proposing changes.
5. Define contracts and invariants before implementation.
6. Generate production-ready assets, not isolated snippets.
7. Validate against dependency order and folder ownership.
8. Document verification steps and QA handoff.
9. Update `build_log.md`.
10. Check for broken references and missing linked files.

## Regression and Safety Rules

- Preserve existing behavior unless a deliberate migration is explicitly approved.
- Prefer incremental refactoring over sweeping rewrites.
- Prioritize data correctness over code elegance.
- Identify regression traps before changing behavior.
- Require rollback strategy for risky DB, backend, integration, or migration work.
- Require tests before risky refactors.
- Treat permissions, retries, conflicts, timeouts, and partial failures as first-class behavior.

## Output Quality Bar

A valid AI-generated asset is complete only when it is:

- compatible with the repository hierarchy,
- tied to source files analyzed,
- typed or schema-backed where appropriate,
- accessible when user-facing,
- resilient to failure states,
- observable or testable,
- regression-aware,
- ready for QA handoff,
- free from broken references.

<!-- ENHANCEMENT-PASS-2026-05-05-NON-REGRESSION -->

## Recursive Enhancement Pass - Non-Regression Layer

### Self-Challenge Result
Analyzing all repository sources for core patterns revealed that the existing Product-Engineering OS was structurally strong but could be deepened with newly discovered governance, editor-rule, changelog, coding-lesson, and framework-specific standards. This section augments the existing file without deleting or reducing any prior content.

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

### controller Application Rule
For this controller artifact, every future generated asset must explicitly state which newly discovered repository standards apply, which do not apply, and why. If a source class is absent in a future run, record that absence instead of silently assuming it does not matter.

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Supadupa Enhancement Layer

### Analysis
Analyzing all repository sources for AI Development System supadupa-enhancement patterns...

This enhancement layer deepens the existing Core artifact with the newest repository-wide operating memory. It preserves all prior content and adds stronger instructions for source ingestion, append-only governance, production-ready asset generation, and QA-verifiable delivery.

### Added Capability
Adds mandatory source-to-template traceability and contract registry usage.

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
  "artifact": "AI Development System",
  "source_files_analyzed": "all repository sources, with inventory reference",
  "non_regression": true,
  "append_only": true,
  "compatibility_links": ["docs/source-to-template-traceability.md; docs/interface-contract-registry.md"],
  "verification_required": ["reference check", "schema/interface check", "edge-state check", "qa handoff check"]
}
~~~

Before executing this enhancement, ensure docs/source-to-template-traceability.md; docs/interface-contract-registry.md are reviewed for compatibility.

<!-- UX-RATIONALIZATION-2026-05-10 -->

## UX Canonical Prompt Ownership

UX now uses `ux/README.md` as its routing layer. Keep `ux/ai_instructions.md` for role/persona, `ux/user-flows.md` for journeys and search/discovery flows, `ux/states.md` for state matrices, `ux/messaging.md` for narrative/tone, `ux/copy-rules.md` for reusable microcopy, `ux/design-system.md` for UX behavior patterns, `ux/wizard_flow_template.md` for multi-step flows, and `ux/UX Masterprompt.md` for orchestration.

Do not regenerate archived UX variants in the active folder. Use the archive manifest for provenance only, and write new guidance into the canonical owner file. Every UX output must include actor/scenario, journey phases, state matrix, copy contract, accessibility checks, responsive behavior, and regression verification.

<!-- UI-RATIONALIZATION-2026-05-10 -->

## UI Canonical Prompt Ownership

UI now uses `ui/README.md` as its routing layer. Keep `ui/ai_instructions.md` for persona and execution rules, `ui/tokens.md` for semantic design tokens, `ui/typography.md` for type system behavior, `ui/components.md` for component catalog and search/discovery patterns, `ui/component_library_template.md` for schema-heavy component generation, `ui/accessibility.md` for WCAG/WAI-ARIA/Radix behavior, `ui/responsive-rules.md` for layout reflow, `ui/states.md` for component state semantics, and `ui/UI Masterprompt.md` for orchestration.

Do not regenerate archived UI variants in the active folder. Use the archive manifest for provenance only, and write new guidance into the canonical owner file. Every UI output must include token mapping, typed React props where relevant, component anatomy, state matrix, responsive behavior, accessibility proof, and regression verification.
