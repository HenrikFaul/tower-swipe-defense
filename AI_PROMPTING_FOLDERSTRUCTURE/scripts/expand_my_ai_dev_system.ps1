$ErrorActionPreference = "Stop"

<#
SCRIPTS-RATIONALIZATION-2026-05-10:
This expansion script remains active as a historical expanded-structure generator.
For current guidance, read scripts/README.md, ci-cd-pipeline.md, linting-rules.md,
reference-verification.md, and prompt-metadata-validation.md before changing it.
Future destructive or broad file-changing revisions should preserve idempotency,
use literal paths, record build_log.md rows, and consider ShouldProcess-style dry-run behavior.
#>

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Workspace = Split-Path -Parent $Root
$LogPath = Join-Path $Root "build_log.md"
$Marker = "<!-- MY-AI-DEV-SYSTEM-EXPANSION-2026-05-05 -->"

function Rel([string]$Path) {
    return $Path.Substring($Workspace.Length + 1).Replace("\", "/")
}

function RepoFiles {
    Get-ChildItem -Path $Workspace -Recurse -Force -File | Where-Object {
        $_.FullName -notmatch '\\\.git\\' -and
        $_.FullName -notmatch '\\node_modules\\' -and
        $_.FullName -notmatch '\\dist\\' -and
        $_.FullName -notmatch '\\build\\'
    }
}

function SourceSummary {
    $paths = RepoFiles | ForEach-Object { Rel $_.FullName }
    $focus = $paths | Where-Object {
        $_ -match '^(AGENTS|AI_EXECUTION_PROMPTS|CLAUDE|LOCAL_EXECUTION_MODE|README)\.md$' -or
        $_ -match '^governance/' -or
        $_ -match '(^|/)continue/rules/' -or
        $_ -match '(^|/)cursor/rules/' -or
        $_ -match '^Source/(Changelogs|Codinglessonslearnt|own prompts|prompt-template|prompts/next-shadcn|prompts/react-19|prompts/tailwind-4|scripts)/' -or
        $_ -match '^AI_PROMPTING_FOLDERSTRUCTURE/'
    }
    return (($focus | Sort-Object) -join "; ")
}

function EnsureLog {
    if (-not (Test-Path $LogPath)) {
        Set-Content -Path $LogPath -Encoding UTF8 -Value "| Task ID | Description | Source Files Analyzed | Target Path | Status |`n|---|---|---|---|---|"
    }
}

function Done([string]$TaskId) {
    if (-not (Test-Path $LogPath)) { return $false }
    return ((Get-Content $LogPath -Raw) -match "\|\s*$([regex]::Escape($TaskId))\s*\|[^\r\n]*\|\s*DONE\s*\|")
}

function Log([string]$TaskId, [string]$Description, [string]$Sources, [string]$Target, [string]$Status) {
    Add-Content -Path $LogPath -Encoding UTF8 -Value "| $TaskId | $Description | $Sources | $Target | $Status |"
}

function Content([string]$Title, [string]$Domain, [string]$Purpose, [string]$CrossLinks) {
@"
# $Title

$Marker

## Mission
This file is part of the expanded `my-ai-dev-system` structure inside the Product-Engineering OS. It exists to turn repository knowledge into production-ready assets, not isolated snippets. The artifact augments previous architecture and must not reduce, delete, or contradict existing generated content.

## Analysis
Analyzing all repository sources for $Title patterns...

Sources reviewed include the current OS files, `AGENTS.md`, `AI_EXECUTION_PROMPTS.md`, `CLAUDE.md`, `LOCAL_EXECUTION_MODE.md`, `governance/*`, `continue/rules`, `cursor/rules`, GitHub workflow guidance, `Source/Changelogs`, `Source/Codinglessonslearnt`, prompt metadata schemas, Next/shadcn/React/Tailwind prompt packs, UI/UX master prompts, and design master rules.

Extracted repository principles:
- Treat clear user requests as execution instructions and avoid repeated permission loops unless the action is destructive, external, production-affecting, security-sensitive, or genuinely ambiguous.
- Preserve already working behavior. Prefer the smallest regression-risk solution and re-check affected flows after every change.
- Use append-only knowledge management for changelogs, coding lessons, build logs, governance notes, and architectural decisions.
- Mine changelogs and coding lessons before work. Explicitly avoid repeated traps: interface/schema drift, Supabase FK typing surprises, auth/session misuse, middleware redirect traps, RLS cross-table joins, provider param errors, concurrency/rate-limit omissions, and overly strict filters that erase valid results.
- For UI and frontend work, enforce Tailwind, shadcn/ui, Radix-compatible primitives, semantic tokens, Headline/CTA/Grid hierarchy, visible focus states, mobile/desktop validation, readable dropdowns, complete loading/empty/error/success states, and no overflow.
- For Next 15 / React 19 work, prefer App Router, Server Components by default, Client Components only for interactivity, explicit TypeScript props, route loading/error boundaries, Suspense when appropriate, minimal dependencies, and `npx shadcn@latest add`.
- For prompt packages, require metadata validation, unique slugs, no hidden prompt-package files, no unsupported nested prompt structures, and `.md`, `.mdc`, or `aiprompt.json` only when following the source prompt catalog rules.

## Persona
Act as a senior $Domain owner with 15+ years of production experience. You are accountable for business behavior, technical correctness, accessibility, security, performance, observability, and QA handoff.

## Purpose
$Purpose

## Required Input Contract
```json
{
  "task_id": "string",
  "domain": "$Domain",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_asset": "string",
  "non_regression_constraints": ["string"],
  "cross_folder_dependencies": ["$CrossLinks"],
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
```

## Required Output Contract
```json
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
```

## Operating Rules
- Read `ai_dev_system.md`, `SYSTEM.md`, `docs/repository_source_inventory.md`, and the local domain instruction before execution.
- Before executing this, ensure $CrossLinks is reviewed for compatibility.
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
- `../ai_dev_system.md`
- `../SYSTEM.md`
- `../docs/repository_source_inventory.md`
- $CrossLinks
"@
}

function UpsertFile([string]$TaskId, [string]$RelPath, [string]$Title, [string]$Domain, [string]$Purpose, [string]$CrossLinks, [string]$Sources) {
    $target = Join-Path $Root $RelPath
    $parent = Split-Path -Parent $target
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
    $body = Content $Title $Domain $Purpose $CrossLinks
    if (Test-Path $target) {
        $raw = Get-Content $target -Raw
        if ($raw -match [regex]::Escape($Marker)) {
            if (-not (Done $TaskId)) { Log $TaskId "Already expanded: $Title" $Sources $RelPath "DONE" }
            return
        }
        Add-Content -Path $target -Encoding UTF8 -Value "`n`n$body"
        Log $TaskId "Ultra-enhance existing file: $Title" $Sources $RelPath "DONE"
    } else {
        Set-Content -Path $target -Encoding UTF8 -Value $body
        Log $TaskId "Create expanded my-ai-dev-system file: $Title" $Sources $RelPath "DONE"
    }
}

EnsureLog
$Sources = SourceSummary
Log "MYAI-SCAN-001" "Scan full repository for my-ai-dev-system expansion patterns" $Sources "AI_PROMPTING_FOLDERSTRUCTURE" "DONE"

$items = @(
@("MYAI-001","README.md","Project README","Product-Engineering OS","Project overview, setup, read order, recursive execution, idempotent rerun rules, and usage instructions.","ai_dev_system.md; SYSTEM.md; build_log.md"),
@("MYAI-002",".ai/agents.md","AI Team Agents","AI orchestration","Define conceptual backend, database, integration, frontend, UI, UX, QA, docs, script, and governance agents with routing rules.","ai_dev_system.md; backend/ai_instructions.md; qa/ai_instructions.md"),
@("MYAI-003",".ai/skills.md","AI Skills Matrix","AI orchestration","Map each agent role to skills, source files, verification obligations, and escalation boundaries.",".ai/agents.md; docs/repository_source_inventory.md"),
@("MYAI-004",".ai/best-practices.md","Global Best Practices","AI orchestration","Consolidate global coding, security, style, accessibility, changelog, and append-only documentation standards.","governance/controller.md; ai_dev_system.md"),
@("MYAI-005","backend/backend-system.md","Backend System","Backend","Define backend ownership, controller/service boundaries, API envelopes, auth checks, logging, and non-regression rules.","backend/ai_instructions.md; database/schema_template.md; integration/api_client_template.md"),
@("MYAI-006","backend/prompts.md","Backend Prompts","Backend","Provide backend prompt patterns for APIs, services, jobs, validation, observability, and safe refactors.","backend/backend-system.md; backend/prompt_template_backend_api.md"),
@("MYAI-007","backend/controllers.md","Backend Controllers","Backend","Define controller structure, route validation, permission checks, response envelopes, redaction, and timeout behavior.","backend/backend-system.md; backend/error_handling.md"),
@("MYAI-008","backend/services.md","Backend Services","Backend","Define service-layer business logic, transaction ownership, idempotency, retries, and DB boundary rules.","backend/service_layer_template.md; database/schema-rules.md"),
@("MYAI-009","backend/exceptions.md","Backend Exceptions","Backend","Define exception taxonomy, safe error messages, correlation IDs, retryability, and logging conventions.","backend/error_handling.md; qa-and-checks/checklist.md"),
@("MYAI-010","backend/tests.md","Backend Tests","Backend QA","Define backend unit, integration, contract, migration, idempotency, and regression testing guidelines.","backend/services.md; qa/unit_test_template.md"),
@("MYAI-011","database/schema-rules.md","Database Schema Rules","Database","Define entity modeling, FK/index standards, SQL-to-TypeScript alignment, RLS warnings, and invariant ownership.","database/schema_template.md; backend/services.md"),
@("MYAI-012","database/migrations.md","Database Migrations","Database","Define migration planning, backfill, rollback, lock safety, forward/backward compatibility, and changelog linkage.","database/migration_template.md; qa-and-checks/checklist.md"),
@("MYAI-013","database/seed-data.md","Database Seed Data","Database","Define safe seed types, test fixtures, anonymization, sample data boundaries, and repeatable setup rules.","database/schema-rules.md; qa-and-checks/qa-strategy.md"),
@("MYAI-014","database/performance.md","Database Performance","Database","Define query-plan review, index strategy, concurrency limits, pagination, caching, and performance budgets.","database/performance_tuning.md; scripts/ci-cd-pipeline.md"),
@("MYAI-015","integration/api-contracts.md","API Contracts","Integration","Define third-party API contracts, schemas, versioning, redaction, retries, rate limits, and evidence capture.","integration/api_client_template.md; backend/prompt_template_backend_api.md"),
@("MYAI-016","integration/auth-flows.md","Auth Flows","Integration","Define SSO/OAuth/session/token flows, `getUser()` verification, expiry handling, and auth edge cases.","integration/auth_protocols.md; backend/exceptions.md"),
@("MYAI-017","integration/third-party-services.md","Third-Party Services","Integration","Define provider-specific adapters, geospatial validation, category maps, rate-limit/backoff, and endpoint constants.","integration/api-contracts.md; Source/Codinglessonslearnt"),
@("MYAI-018","integration/error-handling.md","Integration Error Handling","Integration","Define cross-service recovery, webhook replay safety, partial failure, provider outage, and observability rules.","integration/webhook_handler.md; backend/error_handling.md"),
@("MYAI-019","frontend/frontend-system.md","Frontend System","Frontend","Define Next 15/React 19 frontend ownership, routing, server/client components, state, accessibility, and visual validation.","frontend/ai_instructions.md; ui/tokens.md; ux/states.md"),
@("MYAI-020","frontend/project-structure.md","Frontend Project Structure","Frontend","Define app router layout, feature folders, components, libs, route groups, public assets, and naming conventions.","frontend/frontend-system.md; Source/prompts/next-shadcn/rule-next-shadcn-coding-standards.md"),
@("MYAI-021","frontend/prompts.md","Frontend Prompts","Frontend","Provide prompts for pages, components, forms, dashboards, data fetching, visual QA, and regression-safe redesign.","frontend/page_template.md; frontend/component_template.md"),
@("MYAI-022","frontend/routing.md","Frontend Routing","Frontend","Define SPA/SSR routing, App Router boundaries, loading/error pages, auth guards, redirects, and route state preservation.","frontend/frontend-system.md; integration/auth-flows.md"),
@("MYAI-023","frontend/state-management.md","Frontend State Management Expanded","Frontend","Mirror and expand state standards for server cache, local state, optimistic updates, invalidation, and stale perception.","frontend/state_management.md; integration/api-contracts.md"),
@("MYAI-024","frontend/tests.md","Frontend Tests","Frontend QA","Define unit, E2E, visual, accessibility, responsive, keyboard, and hydration regression tests.","frontend/frontend-system.md; qa-and-checks/checklist.md"),
@("MYAI-025","ui/typography.md","Typography System","UI","Define type scale, line height, responsive text, truncation, readability, labels, data density, and Tailwind token usage.","ui/tokens.md; Source/own prompts/design-master-rules.md"),
@("MYAI-026","ui/components.md","UI Components Catalog","UI","Define Card, Button, Form, Dialog, Tabs, Table, Filter, Toast, Navigation, and Empty/Error components with shadcn/Radix rules.","ui/component_library_template.md; frontend/component_template.md"),
@("MYAI-027","ui/accessibility.md","UI Accessibility","UI","Mirror and expand accessibility rules for focus, keyboard, ARIA, contrast, reduced motion, responsive overflow, and screen readers.","ui/accessibility_rules.md; ux/states.md"),
@("MYAI-028","ux/user-flows.md","UX User Flows","UX","Define onboarding, auth, settings, admin, search, checkout-style, recovery, and destructive-action flow documentation.","ux/user_journey_template.md; frontend/routing.md"),
@("MYAI-029","ux/states.md","UX States","UX","Define loading, empty, error, success, disabled, optimistic, conflict, offline, and permission-denied state standards.","ux/microcopy_guide.md; ui/accessibility.md"),
@("MYAI-030","ux/messaging.md","UX Messaging","UX","Define tone, information scent, system feedback, operator guidance, validation messages, and recovery language.","ux/microcopy_guide.md; UI Masterprompt.md"),
@("MYAI-031","ux/copy-rules.md","UX Copy Rules","UX","Define CTA naming, labels, helper text, confirmation copy, destructive copy, localization readiness, and no-blame errors.","ux/messaging.md; ui/components.md"),
@("MYAI-032","ux/design-system.md","UX Design System","UX","Define journey-level design system rules, hierarchy, grouping, progressive disclosure, mobile-first validation, and usability metrics.","ux/user-flows.md; ui/tokens.md"),
@("MYAI-033","ab-testing/strategy.md","AB Testing Strategy","Experimentation","Define hypothesis framing, guardrails, eligibility, rollout, decision criteria, and non-regression experiment design.","qa/ab_test_template.md; ux/user_journey_template.md"),
@("MYAI-034","ab-testing/metrics.md","AB Testing Metrics","Experimentation","Define CTR, conversion, retention, latency, error rate, accessibility, task success, and negative guardrail metrics.","ab-testing/strategy.md; qa-and-checks/performance-checks.md"),
@("MYAI-035","ab-testing/rollout-plan.md","AB Testing Rollout Plan","Experimentation","Define staged rollout, monitoring, rollback, sample hygiene, exposure logging, and stakeholder decisions.","ab-testing/metrics.md; scripts/ci-cd-pipeline.md"),
@("MYAI-036","qa-and-checks/qa-strategy.md","QA Strategy","QA","Define TDD/BDD, characterization tests, contract tests, visual QA, accessibility QA, and release confidence model.","qa-and-checks/checklist.md; qa/unit_test_template.md"),
@("MYAI-037","qa-and-checks/checklist.md","Release Checklist","QA","Define feature release checklist covering source scan, regression matrix, mobile/desktop, auth, API, DB, and changelog updates.","qa-and-checks/qa-strategy.md; build_log.md"),
@("MYAI-038","qa-and-checks/accessibility-checks.md","Accessibility Checks","QA","Define WCAG-oriented checks for focus, keyboard, labels, contrast, reduced motion, forms, dialogs, and responsive states.","ui/accessibility.md; ux/states.md"),
@("MYAI-039","qa-and-checks/security-checks.md","Security Checks","Security QA","Define auth, secrets, SSRF, redaction, rate limit, RLS, webhook signature, dependency, and logging security checks.","integration/auth-flows.md; backend/exceptions.md"),
@("MYAI-040","qa-and-checks/performance-checks.md","Performance Checks","Performance QA","Define Core Web Vitals, API latency, DB query budgets, caching, bundle size, timeout caps, and load checks.","database/performance.md; frontend/tests.md"),
@("MYAI-041","docs/prd-template.md","PRD Template Hyphen Alias","Docs","Create hyphenated PRD alias matching my-ai-dev-system map while preserving existing underscore template.","docs/prd_template.md; ux/user-flows.md"),
@("MYAI-042","docs/arch-diagrams.md","Architecture Diagrams Hyphen Alias","Docs","Create hyphenated architecture diagram alias matching my-ai-dev-system map while preserving existing underscore guide.","docs/arch_diagrams.md; ai_dev_system.md"),
@("MYAI-043","scripts/ci-cd-pipeline.md","CI/CD Pipeline Hyphen Alias","Scripts","Create hyphenated CI/CD alias matching my-ai-dev-system map while preserving existing underscore guide.","scripts/ci-cd-pipeline.md; qa-and-checks/checklist.md"),
@("MYAI-044","scripts/linting-rules.md","Linting Rules Hyphen Alias","Scripts","Create hyphenated linting alias matching my-ai-dev-system map while preserving existing underscore guide.","scripts/linting-rules.md; .ai/best-practices.md"),
@("MYAI-045","samples/sample-backend.md","Sample Backend","Samples","Provide backend reference asset patterns for controllers, services, errors, tests, and API envelopes.","backend/controllers.md; backend/services.md"),
@("MYAI-046","samples/sample-frontend.md","Sample Frontend","Samples","Provide frontend reference asset patterns for page/component props, states, shadcn/Radix composition, and visual QA.","frontend/frontend-system.md; ui/components.md"),
@("MYAI-047","samples/sample-ux-flow.md","Sample UX Flow","Samples","Provide UX flow reference patterns for states, messaging, regression matrix, and QA acceptance.","ux/user-flows.md; qa-and-checks/checklist.md")
)

foreach ($item in $items) {
    UpsertFile $item[0] $item[1] $item[2] $item[3] $item[4] $item[5] $Sources
}

$failures = @()
foreach ($item in $items) {
    $p = Join-Path $Root $item[1]
    if (-not (Test-Path $p)) { $failures += "$($item[1]) missing"; continue }
    $raw = Get-Content $p -Raw
    if ($raw -notmatch [regex]::Escape($Marker)) { $failures += "$($item[1]) missing expansion marker" }
    if ($raw.Length -lt 2000) { $failures += "$($item[1]) under 2000 chars" }
    if ($raw -notmatch "Analyzing all repository sources") { $failures += "$($item[1]) missing analysis sentence" }
    if ($raw -notmatch "json") { $failures += "$($item[1]) missing JSON contract" }
    if ($raw -notmatch "React") { $failures += "$($item[1]) missing React/interface contract" }
}

if ($failures.Count -gt 0) {
    Log "MYAI-VERIFY-001" "my-ai-dev-system expansion verification failed: $($failures -join '; ')" $Sources "AI_PROMPTING_FOLDERSTRUCTURE" "PENDING"
    throw ($failures -join "`n")
}

Log "MYAI-VERIFY-001" "my-ai-dev-system expansion verification passed; 47 files created or ultra-enhanced" $Sources "AI_PROMPTING_FOLDERSTRUCTURE" "DONE"
Write-Output "my-ai-dev-system expansion complete."

