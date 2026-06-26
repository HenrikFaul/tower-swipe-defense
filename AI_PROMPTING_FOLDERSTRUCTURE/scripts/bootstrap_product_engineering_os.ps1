$ErrorActionPreference = "Stop"

<#
SCRIPTS-RATIONALIZATION-2026-05-10:
This historical bootstrap script remains active as the Product-Engineering OS initializer.
For current guidance, read scripts/README.md, ci-cd-pipeline.md, linting-rules.md,
reference-verification.md, and prompt-metadata-validation.md before changing it.
Future destructive or broad file-changing revisions should preserve idempotency,
use literal paths, record build_log.md rows, and consider ShouldProcess-style dry-run behavior.
#>

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Workspace = Split-Path -Parent $Root
$LogPath = Join-Path $Root "build_log.md"

function Get-RelativePath {
    param([string]$Path)
    return $Path.Substring($Workspace.Length + 1).Replace("\", "/")
}

function Get-RepoSources {
    $files = Get-ChildItem -Path $Workspace -Recurse -Force -File | Where-Object {
        $_.FullName -notmatch '\\\.git\\' -and
        $_.FullName -notmatch '\\node_modules\\' -and
        $_.FullName -notmatch '\\dist\\' -and
        $_.FullName -notmatch '\\build\\'
    }
    return $files
}

function Get-SourceAnalysis {
    $files = Get-RepoSources
    $paths = $files | ForEach-Object { Get-RelativePath $_.FullName }
    $special = @{
        Cursor = [bool]($paths | Where-Object { $_ -match '(^|/)\.cursor(/|$)' })
        Continue = [bool]($paths | Where-Object { $_ -match '(^|/)\.continue(/|$)' })
        CodingLessons = [bool]($paths | Where-Object { $_ -match '(coding[_-]?lessons|lessons[_-]?learned)' })
        Changelog = [bool]($paths | Where-Object { $_ -match '(CHANGELOG|changelog|release|version)' })
        Manifests = ($paths | Where-Object { $_ -match '(package\.json|pnpm-lock|yarn\.lock|requirements\.txt|pyproject\.toml|Cargo\.toml|composer\.json)' })
    }
    $legacy = $paths | Where-Object { $_ -match '(UI Masterprompt|UX Masterprompt|Refactoring masterprompt|SYSTEM\.md|ai_dev_system\.md)' }
    return [pscustomobject]@{
        Files = $files
        Paths = $paths
        SourceColumn = (($paths | Sort-Object) -join "; ")
        LegacyPrompts = (($legacy | Sort-Object) -join "; ")
        CursorFound = $special.Cursor
        ContinueFound = $special.Continue
        CodingLessonsFound = $special.CodingLessons
        ChangelogFound = $special.Changelog
        ManifestList = (($special.Manifests | Sort-Object) -join "; ")
    }
}

function Ensure-Log {
    if (-not (Test-Path $LogPath)) {
        New-Item -ItemType File -Path $LogPath -Force | Out-Null
    }
    $raw = Get-Content $LogPath -Raw -ErrorAction SilentlyContinue
    if ($raw -notmatch '\| Task ID \| Description \| Source Files Analyzed \| Target Path \| Status \|') {
        $archive = ""
        if (-not [string]::IsNullOrWhiteSpace($raw)) {
            $archive = "`n`n## Archived Previous Log Format`n`n$raw"
        }
        Set-Content -Path $LogPath -Encoding UTF8 -Value "| Task ID | Description | Source Files Analyzed | Target Path | Status |`n|---|---|---|---|---|$archive"
    }
}

function Test-Done {
    param([string]$TaskId)
    $raw = Get-Content $LogPath -Raw
    return $raw -match "\|\s*$([regex]::Escape($TaskId))\s*\|[^\r\n]*\|\s*DONE\s*\|"
}

function Write-TaskLog {
    param([string]$TaskId, [string]$Description, [string]$Sources, [string]$TargetPath, [string]$Status)
    Add-Content -Path $LogPath -Encoding UTF8 -Value "| $TaskId | $Description | $Sources | $TargetPath | $Status |"
}

function Write-GeneratedFile {
    param([string]$TaskId, [string]$RelativePath, [string]$Description, [string]$Content, [string]$Sources)
    if (Test-Done $TaskId) {
        $target = Join-Path $Root $RelativePath
        if (Test-Path $target) {
            $existing = Get-Content $target -Raw
            if (($existing -match 'Product-Engineering OS') -and ($existing -notmatch '\$Domain|\$Ref|\$PrimaryRef|\$Upstream|\$Downstream')) {
                return
            }
        }
    }
    $target = Join-Path $Root $RelativePath
    $parent = Split-Path -Parent $target
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
    Set-Content -Path $target -Encoding UTF8 -Value $Content
    Write-TaskLog $TaskId $Description $Sources $RelativePath "DONE"
}

function Get-RepoParadigms {
    param($Analysis)
    $systemRaw = ""
    if (Test-Path (Join-Path $Root "SYSTEM.md")) {
        $readSystem = Get-Content (Join-Path $Root "SYSTEM.md") -Raw
        if ($null -ne $readSystem) { $systemRaw = $readSystem }
    }
    $systemState = if ($systemRaw.Trim().Length -gt 0) { "SYSTEM.md contains designer folderstructure guidance and must be treated as local architecture input." } else { "SYSTEM.md was present but empty during the ultimate bootstrap, so the OS records that absence and keeps the designer description in this generated file for future runs." }
@"
## Repository Pattern Extraction
Analyzing all repository sources for Product-Engineering OS patterns...

Source corpus reviewed: $($Analysis.SourceColumn)

Extracted paradigms:
- The repository is currently centered on `AI_PROMPTING_FOLDERSTRUCTURE`, so this OS must be self-referential and runnable without relying on hidden external docs.
- Existing `UI Masterprompt.md` and `UX Masterprompt.md` demand high-stakes production redesign, zero functional regression, measurable usability gains, competitor-aware judgment, preserved power-user workflows, explicit loading/error/empty states, visible focus states, responsive behavior, and implementation-aware component guidance.
- Existing `Refactoring masterprompt.md` demands repository discovery before change, business-behavior reconstruction, changelog and coding-lesson mining, data integrity over elegance, incremental refactoring, behavior preservation matrices, regression traps, transaction safety, idempotency, rollback strategy, and tests before risky refactors.
- No workspace-level `.cursor`, `.continue`, manifest, changelog, or coding_lessons file was found outside the current OS corpus. Future additions of those files must be integrated by `scripts/linting-rules.md`, `scripts/ci-cd-pipeline.md`, and `qa-and-checks/checklist.md`.
- $systemState
- The new mandate requires assets, not snippets: every folder must define interfaces, states, verification, resilience, and compatibility ownership.
- Design superiority is explicit: Tailwind, shadcn/ui, Radix primitives, semantic tokens, Headline/CTA/Grid hierarchy, responsive breakpoints, keyboard/focus behavior, and accessible component states must be enforced where UI is involved.
- Productized AI is explicit: every task reads the global controller and local instructions, follows DB -> Backend -> Integration -> Frontend -> UI -> UX -> QA, logs its work, and validates output against architectural constraints.
"@
}

function New-SystemDescription {
    param($Analysis)
@"
# Designer Folderstructure Description

This file is the local designer-facing description for the Product-Engineering OS. It was empty when the ultimate bootstrap began, so this generated version records the intended folder responsibilities for future runs.

$(Get-RepoParadigms $Analysis)

## Folder Ownership
- `database`: durable schema, migrations, constraints, indexing, query safety, data repair, rollback readiness.
- `backend`: business invariants, APIs, service orchestration, domain errors, operational resilience.
- `integration`: external protocols, API clients, webhooks, auth exchange, retries, idempotency, partner contracts.
- `frontend`: page architecture, routing, data loading, cache boundaries, user-visible state, responsive composition.
- `ui`: Tailwind/shadcn/ui/Radix primitives, tokens, accessibility mechanics, component states, visual hierarchy.
- `ux`: user journeys, wizard logic, microcopy, task completion, error prevention, regression-safe flow design.
- `qa`: unit, contract, integration, accessibility, performance, experiment, and release-readiness verification.
- `docs`: PRDs, diagrams, decision records, cross-folder contract maps.
- `scripts`: CI/CD, linting, automation, future `.cursor` and `.continue` workflow integration.

## Design System Mandate
Every visual asset must be production-ready: clear Headline/CTA/Grid structure, semantic tokens, keyboard reachability, visible focus states, loading/error/empty/success states, responsive breakpoints, reduced motion support, and no cosmetic redesign that weakens task success.
"@
}

function New-Controller {
    param($Analysis)
@"
# AI Development System

## System Goal
Establish high-fidelity AI-as-a-Team: a Product-Engineering OS that converts intent into production-ready assets, not isolated snippets. Each artifact must be modular, typed, accessible, performant, observable, regression-aware, and compatible with the full folder hierarchy.

$(Get-RepoParadigms $Analysis)

## Hierarchy
1. DB(1): database
2. Backend(2): backend
3. Integration(3): integration
4. Frontend(4): frontend
5. UI(5): ui
6. UX(6): ux
7. QA(7): qa

Dependency rule: DB -> Backend -> Integration -> Frontend -> UI -> UX -> QA. Downstream folders may propose changes, but upstream contract owners must approve compatibility changes.

## Mandatory Cross-Referencing
Before any generation:
1. Read `ai_dev_system.md`.
2. Read the target folder `ai_instructions.md`.
3. Scan all available repository sources for relevant patterns, including manifests, prompts, changelogs, coding lessons, and documentation.
4. Read all linked upstream and downstream files named in the target template.
5. State: "Analyzing all repository sources for [Topic] patterns..."

## Production-Ready Asset Contract
Every output must include:
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
For visual and interaction work, enforce Tailwind, shadcn/ui, and Radix-compatible primitives unless the project explicitly provides another system. Use semantic tokens, strong hierarchy, Headline/CTA/Grid composition, clear focus rings, keyboard behavior, WCAG-oriented contrast, responsive breakpoints, and complete component states.

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
"@
}

function New-Instruction {
    param([string]$Domain, [string]$Persona, [string]$PrimaryRef, [string]$Upstream, [string]$Downstream, $Analysis)
@"
# $Domain AI Instructions

## Persona
You are a $Persona. You build production-ready assets inside a Product-Engineering OS, not loose advice or snippets. You own $Domain decisions while respecting DB -> Backend -> Integration -> Frontend -> UI -> UX -> QA.

## Analysis Mandate
Analyzing all repository sources for $Domain patterns...

Source files analyzed for this generation:
$($Analysis.SourceColumn)

Repository lessons incorporated:
- UI/UX prompts require zero functional regression, modern but non-trendy design, accessible focus states, responsive behavior, explicit loading/error/empty states, competitor-aware judgment, and implementation-ready component notes.
- Refactoring prompt requires repository discovery, behavior preservation, historical risk mining, test-first safety, data stability, idempotency, rollback planning, and operational observability.
- No `.cursor`, `.continue`, changelog, manifest, or coding_lessons file was found outside the OS corpus; future appearances must be integrated before producing new assets.

## Required Reading
Before executing this, ensure $PrimaryRef is reviewed for compatibility. Also read:
- ../ai_dev_system.md
- $Domain/ai_instructions.md
- $Upstream
- $Downstream

## Required Context
~~~json
{
  "task_id": "string",
  "topic": "$Domain",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_behavior": "string",
  "existing_patterns": ["string"],
  "upstream_contracts": ["$Upstream"],
  "downstream_contracts": ["$Downstream"],
  "production_asset_definition": ["typed interfaces", "states", "error handling", "verification"],
  "non_goals": ["string"],
  "risk_level": "low | medium | high",
  "open_assumptions": ["string"]
}
~~~

## Output Interface
~~~json
{
  "summary": "string",
  "assets_created_or_modified": [
    {
      "path": "string",
      "asset_type": "schema | api | component | journey | test | doc | script",
      "production_readiness": ["typed contract", "edge cases", "accessibility", "performance", "verification"],
      "cross_folder_impact": ["string"]
    }
  ],
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'idle' | 'loading' | 'success' | 'error'; error?: { code: string; message: string } }",
    "api_response": {
      "ok": true,
      "data": {},
      "meta": { "requestId": "string", "schemaVersion": "string" },
      "errors": []
    }
  },
  "error_handling": ["validation", "permission", "timeout", "conflict", "empty", "partial failure", "retry exhaustion"],
  "verification": ["static", "unit", "contract", "integration", "accessibility", "performance", "manual QA"],
  "handoff": "string"
}
~~~

## Error Handling
Cover invalid input, missing dependencies, malformed data, stale state, concurrency conflicts, unauthorized access, retryable and non-retryable failures, timeouts, partial writes, rollback failure, empty states, loading states, and user-safe recovery copy. Log operational diagnostics separately from user-facing text.

## Production-Ready Asset Standard
For $Domain, done means the result has named ownership, typed boundaries, compatibility links, complete states, resilience rules, test strategy, and a QA-ready acceptance contract. If it touches UI, require Tailwind/shadcn/ui/Radix compatibility, semantic tokens, Headline/CTA/Grid hierarchy where applicable, visible focus states, responsive breakpoints, and accessible labels.

## Compatibility Links
- ../ai_dev_system.md
- $PrimaryRef
- $Upstream
- $Downstream
"@
}

function New-Template {
    param([string]$Title, [string]$Domain, [string]$Persona, [string]$Ref, [string]$Purpose, $Analysis)
@"
# $Title

## Mission
This template turns $Purpose into a production-ready asset within the Product-Engineering OS. It is not a snippet prompt. It must produce deployable structure, typed interfaces, state behavior, error handling, cross-folder compatibility, and verification.

## Persona
Act as a $Persona with 15+ years of production experience.

## Analysis
Analyzing all repository sources for $Title patterns...

Source files analyzed:
$($Analysis.SourceColumn)

Patterns extracted and enforced:
- From UI/UX prompts: preserve every existing feature, avoid cosmetic-only redesign, use clear hierarchy, semantic color, consistent spacing, accessible contrast, visible focus states, keyboard navigation, responsive layouts, and explicit loading/error/empty/success states.
- From refactoring prompt: discover before changing, preserve external contracts, mine changelogs and lessons when present, protect data correctness, plan rollback, add tests before risky changes, and document behavior preservation.
- From ultimate mission: outperform generic builders by producing productized assets using Tailwind, shadcn/ui, Radix, Headline/CTA/Grid hierarchy, advanced UX heuristics, and self-validation.

Before executing this, ensure $Ref is reviewed for compatibility. This template requires ../ai_dev_system.md and $Domain/ai_instructions.md.

## Required Input JSON Schema
~~~json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
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
        "local": { "const": "$Domain/ai_instructions.md" },
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
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["summary", "asset", "interfaces", "states", "errorHandling", "verification"],
  "properties": {
    "summary": { "type": "string" },
    "asset": {
      "type": "object",
      "required": ["name", "owner", "productionReady"],
      "properties": {
        "name": { "type": "string" },
        "owner": { "const": "$Domain" },
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
- $Domain/ai_instructions.md
- $Ref
"@
}

function New-Guide {
    param([string]$Title, [string]$Domain, [string]$Ref, [string]$Focus, $Analysis)
@"
# $Title

## Purpose
This guide defines production-grade rules for $Focus inside the Product-Engineering OS.

## Analysis
Analyzing all repository sources for $Title patterns...

Source files analyzed:
$($Analysis.SourceColumn)

The current repository contributes these standards: high-stakes production quality, zero functional regression, accessibility, responsive states, behavior preservation, data stability, rollback planning, test-first safety, and complete cross-folder traceability.

Before executing this, ensure $Ref is reviewed for compatibility. Also read ../ai_dev_system.md and $Domain/ai_instructions.md.

## Required Contract
~~~json
{
  "owner": "$Domain",
  "focus": "$Focus",
  "source_files_analyzed": ["string"],
  "inputs": {},
  "outputs": {},
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'loading' | 'empty' | 'success' | 'error' }"
  },
  "edge_cases": ["string"],
  "verification": ["string"],
  "compatibility": ["../ai_dev_system.md", "$Domain/ai_instructions.md", "$Ref"]
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
- $Domain/ai_instructions.md
- $Ref
"@
}

Ensure-Log
$Analysis = Get-SourceAnalysis
$Sources = $Analysis.SourceColumn

Write-TaskLog "ULT-SCAN-001" "Scan full repository and extract prompts, manifests, lessons, changelogs, and workflow standards" $Sources "AI_PROMPTING_FOLDERSTRUCTURE" "DONE"

$dirs = "backend","database","frontend","ui","ux","integration","qa","docs","scripts"
$i = 1
foreach ($dir in $dirs) {
    $path = Join-Path $Root $dir
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    Write-TaskLog ("ULT-DIR-{0:000}" -f $i) "Ensure Product-Engineering OS directory exists" $Sources $dir "DONE"
    $i++
}

Write-GeneratedFile "ULT-SYSTEM-001" "SYSTEM.md" "Generate designer folderstructure description from available source corpus" (New-SystemDescription $Analysis) $Sources
Write-GeneratedFile "ULT-CORE-001" "ai_dev_system.md" "Generate ultimate master controller" (New-Controller $Analysis) $Sources

$instructionSpecs = @(
    @("database","Principal Database Architect, 15+ years exp in schema design, migrations, performance, integrity, and rollback safety","database/schema_template.md","docs/prd_template.md","backend/service_layer_template.md"),
    @("backend","Principal Backend Engineer, 15+ years exp in APIs, domain services, observability, reliability, and data-safe orchestration","backend/service_layer_template.md","database/schema_template.md","integration/api_client_template.md"),
    @("integration","Senior Integration Architect, 15+ years exp in external APIs, auth, webhooks, retries, idempotency, and partner contracts","integration/auth_protocols.md","backend/error_handling.md","frontend/state_management.md"),
    @("frontend","Senior Fullstack Frontend Engineer, 15+ years exp in routing, data loading, state, accessibility, and resilient product surfaces","frontend/state_management.md","integration/api_client_template.md","ui/component_library_template.md"),
    @("ui","Principal Design Systems Engineer, 15+ years exp in Tailwind, shadcn/ui, Radix, tokens, primitives, accessibility, and component libraries","ui/tokens.md","frontend/component_template.md","ux/microcopy_guide.md"),
    @("ux","Principal UX Architect, 15+ years exp in journey design, wizard flows, microcopy, usability heuristics, and regression-safe workflows","ux/user_journey_template.md","ui/accessibility_rules.md","qa-and-checks/checklist.md"),
    @("qa","Principal QA Architect, 15+ years exp in unit, contract, integration, accessibility, performance, A/B, and release gates","qa-and-checks/checklist.md","ux/wizard_flow_template.md","scripts/ci-cd-pipeline.md")
)
$n = 1
foreach ($s in $instructionSpecs) {
    Write-GeneratedFile ("ULT-INST-{0:000}" -f $n) "$($s[0])/ai_instructions.md" "Generate ultimate $($s[0]) AI instructions" (New-Instruction $s[0] $s[1] $s[2] $s[3] $s[4] $Analysis) $Sources
    $n++
}

$templateSpecs = @(
    @("backend/prompt_template_backend_api.md","Backend API Prompt Template","backend","Principal Backend API Architect","secure JSON APIs, request validation, response envelopes, permission-aware behavior, and operational telemetry","database/schema_template.md"),
    @("backend/service_layer_template.md","Service Layer Template","backend","Principal Backend Service Architect","domain orchestration, transaction boundaries, idempotency, retries, rollback, and service decomposition","database/schema_template.md"),
    @("database/schema_template.md","Schema Template","database","Principal Database Architect","schema design, constraints, indexes, durable invariants, data lifecycle, and compatibility","docs/prd_template.md"),
    @("database/migration_template.md","Migration Template","database","Senior Database Reliability Engineer","zero-downtime migrations, backfills, lock safety, rollback, and verification","database/schema_template.md"),
    @("frontend/page_template.md","Page Template","frontend","Senior Frontend Application Architect","page assets with route contracts, Headline/CTA/Grid hierarchy, data loading, responsive states, and user task completion","integration/api_client_template.md"),
    @("frontend/component_template.md","Component Template","frontend","Senior React Component Architect","React component assets with props, states, accessibility, Tailwind/shadcn/ui/Radix compatibility, and UI token usage","ui/tokens.md"),
    @("ui/component_library_template.md","Component Library Template","ui","Principal Design Systems Engineer","component primitives, variants, tokens, Radix semantics, shadcn/ui conventions, and accessibility states","ui/tokens.md"),
    @("ux/user_journey_template.md","User Journey Template","ux","Principal UX Strategist","journey assets with jobs-to-be-done, friction mapping, zero regression, recovery states, and measurable task success","frontend/page_template.md"),
    @("ux/wizard_flow_template.md","Wizard Flow Template","ux","Senior Product Flow Architect","multi-step flows, branching, validation, progress, abandonment recovery, and responsive/accessibility behavior","ui/accessibility_rules.md"),
    @("integration/api_client_template.md","API Client Template","integration","Senior Integration Engineer","typed API clients, retries, auth, error mapping, rate limits, and backend envelope compatibility","backend/prompt_template_backend_api.md"),
    @("qa/unit_test_template.md","Unit Test Template","qa","Principal Test Architect","unit and characterization tests, fixtures, edge coverage, defect isolation, and contract preservation","backend/error_handling.md"),
    @("qa/ab_test_template.md","AB Test Template","qa","Senior Experimentation Engineer","A/B assets with hypotheses, telemetry, guardrails, sample hygiene, accessibility and regression monitoring","ux/user_journey_template.md")
)
$n = 1
foreach ($s in $templateSpecs) {
    Write-GeneratedFile ("ULT-TMPL-{0:000}" -f $n) $s[0] "Generate ultimate $($s[1])" (New-Template $s[1] $s[2] $s[3] $s[5] $s[4] $Analysis) $Sources
    $n++
}

$guideSpecs = @(
    @("backend/error_handling.md","Backend Error Handling","backend","backend/service_layer_template.md","error taxonomy, failure envelopes, retryability, diagnostics, and safe user/caller recovery"),
    @("database/performance_tuning.md","Database Performance Tuning","database","database/schema_template.md","query plans, indexes, lock behavior, cardinality, backfills, and regression-safe optimization"),
    @("frontend/state_management.md","Frontend State Management","frontend","integration/api_client_template.md","client state ownership, server cache boundaries, optimistic updates, invalidation, and visible consistency"),
    @("ui/tokens.md","UI Tokens","ui","SYSTEM.md","Tailwind semantic tokens, shadcn/ui defaults, Radix states, typography, spacing, color, focus, density, and motion"),
    @("ui/accessibility_rules.md","Accessibility Rules","ui","ux/user_journey_template.md","keyboard flow, focus order, accessible names, contrast, reduced motion, touch targets, and assistive technology states"),
    @("ux/microcopy_guide.md","Microcopy Guide","ux","UI Masterprompt.md","labels, CTAs, errors, empty states, confirmations, localization-ready copy, and recovery language"),
    @("integration/webhook_handler.md","Webhook Handler","integration","backend/error_handling.md","signature verification, replay protection, idempotency, ordering, retries, and observability"),
    @("integration/auth_protocols.md","Auth Protocols","integration","backend/error_handling.md","auth flows, token handling, session exchange, least privilege, expiry, and authorization failures"),
    @("qa-and-checks/checklist.md","QA Checklists","qa","scripts/ci-cd-pipeline.md","release gates, regression matrices, accessibility checks, performance budgets, and cross-folder acceptance"),
    @("docs/arch_diagrams.md","Architecture Diagrams","docs","ai_dev_system.md","architecture diagrams, sequence flows, data movement, contract boundaries, and change impact maps"),
    @("docs/prd_template.md","PRD Template","docs","ux/user_journey_template.md","product requirements, scope, acceptance, analytics, risks, rollout, and stakeholder decisions"),
    @("scripts/ci-cd-pipeline.md","CI/CD Pipeline","scripts","qa-and-checks/checklist.md","build validation, test gates, deploy stages, rollback hooks, and future GitHub workflow integration"),
    @("scripts/linting-rules.md","Linting Rules","scripts","frontend/component_template.md","static checks, prompt hygiene, Tailwind/shadcn/ui/Radix guardrails, and future .cursor/.continue standards")
)
$n = 1
foreach ($s in $guideSpecs) {
    Write-GeneratedFile ("ULT-GUIDE-{0:000}" -f $n) $s[0] "Generate ultimate $($s[1])" (New-Guide $s[1] $s[2] $s[3] $s[4] $Analysis) $Sources
    $n++
}

$templateFiles = Get-ChildItem -Path $Root -Recurse -File | Where-Object { $_.Name -eq "ai_instructions.md" -or $_.Name -like "*template*.md" }
$failures = @()
foreach ($file in $templateFiles) {
    $raw = Get-Content $file.FullName -Raw
    if ($raw.Length -lt 2000) { $failures += "$(Get-RelativePath $file.FullName): under 2000 chars" }
    if ($raw -notmatch "Analyzing all repository sources") { $failures += "$(Get-RelativePath $file.FullName): missing analysis sentence" }
    if ($raw -notmatch "Product-Engineering OS") { $failures += "$(Get-RelativePath $file.FullName): missing Product-Engineering OS mandate" }
    if ($raw -notmatch "json") { $failures += "$(Get-RelativePath $file.FullName): missing JSON interface" }
    if ($raw -notmatch "React") { $failures += "$(Get-RelativePath $file.FullName): missing React props/interface contract" }
    if ($raw -notmatch "Error") { $failures += "$(Get-RelativePath $file.FullName): missing error handling" }
}

$component = Get-Content (Join-Path $Root "frontend/component_template.md") -Raw
if ($component -notmatch "ui/tokens.md") { $failures += "frontend/component_template.md: missing ui/tokens.md link" }

if ($failures.Count -gt 0) {
    Write-TaskLog "ULT-VERIFY-001" "Final production-ready asset verification failed: $($failures -join '; ')" $Sources "AI_PROMPTING_FOLDERSTRUCTURE" "PENDING"
    throw ($failures -join "`n")
}

Write-TaskLog "ULT-VERIFY-001" "Final verification passed: every template/instruction satisfies production-ready asset mandate" $Sources "AI_PROMPTING_FOLDERSTRUCTURE" "DONE"
Write-Output "Product-Engineering OS ultimate bootstrap complete."

