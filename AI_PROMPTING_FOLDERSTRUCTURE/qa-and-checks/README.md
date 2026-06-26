# QA & Checks Canonical Map

<!-- QA-RATIONALIZATION-2026-05-10 -->

## Purpose

`qa-and-checks/` is the canonical release-confidence and verification gate for the Product-Engineering OS. It owns the release checklist, regression gates, accessibility checks, security checks, performance checks, data integrity checks, integration resilience checks, and visual regression checks.

Use this folder when the task asks whether a product asset is safe to ship, whether cross-folder contracts are verified, or whether a change has enough evidence for release.

## Relationship To `qa/`

Keep both folders, but with clearer ownership:

- `qa-and-checks/` is the canonical QA governance and release-gate surface.
- `qa/` is the specialized prompt/template surface for generating test assets, such as unit tests, characterization tests, and experiment QA templates.

The old `qa/qa_checklists.md` release-gate content is consolidated into `qa-and-checks/checklist.md` and archived under `qa/archive/2026-05-10-rationalized/`.

## Required Read Order

1. `../ai_dev_system.md`
2. `../SYSTEM.md`
3. `qa-strategy.md`
4. `checklist.md`
5. Relevant specialist gate:
   - `accessibility-checks.md`
   - `security-checks.md`
   - `performance-checks.md`
   - `data-integrity-checks.md`
   - `integration-resilience-checks.md`
   - `visual-regression-checks.md`
6. Relevant generation template in `../qa/` when tests must be produced.

## External Standards Added In 2026-05-10 Pass

- Playwright resilient E2E practices: user-visible behavior, isolation, role/text locators, web-first assertions, trace evidence, CI sharding.
- WCAG 2.2: accessibility gates must cover keyboard, focus, names/roles/values, contrast, target size, reduced motion, and error identification.
- Core Web Vitals: performance gates must identify LCP, INP, CLS, TTFB, bundle, API, and database-query budgets.
- OWASP ASVS and OWASP Top 10: security gates must cover authentication, authorization, validation, SSRF, secrets, logging, dependency risk, and unsafe consumption of APIs.
- Test pyramid discipline: broad unit and contract coverage, meaningful integration tests, and targeted E2E tests for user-critical flows.

## Non-Regression Rule

Do not delete historical QA content. If a file is rationalized out of the active surface, preserve it in a dated archive and add a build-log row explaining which active file now represents it.

## Runtime Evidence Automation

Use `../qa-automation/` when release confidence needs browser-run evidence: screenshots, click-through coverage, tab/menu behavior, console errors, page errors, and failed network requests. The specialist checklist is `smart-site-autopilot-checks.md`.
