$ErrorActionPreference = "Stop"

<#
SCRIPTS-RATIONALIZATION-2026-05-10:
This historical bootstrap script remains active as an original folder-structure initializer.
For current guidance, read scripts/README.md, ci-cd-pipeline.md, linting-rules.md,
reference-verification.md, and prompt-metadata-validation.md before changing it.
Future destructive or broad file-changing revisions should preserve idempotency,
use literal paths, record build_log.md rows, and consider ShouldProcess-style dry-run behavior.
#>

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogPath = Join-Path $Root "build_log.md"
$Now = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss zzz")

function Ensure-BuildLog {
    if (-not (Test-Path $LogPath)) {
        New-Item -ItemType File -Path $LogPath -Force | Out-Null
    }
    $existing = Get-Content $LogPath -Raw -ErrorAction SilentlyContinue
    if ([string]::IsNullOrWhiteSpace($existing)) {
        Set-Content -Path $LogPath -Value "| Task ID | Description | Target Path | Status | Last Update |`n|---|---|---|---|---|" -Encoding UTF8
    }
}

function Get-CompletedTasks {
    Ensure-BuildLog
    $completed = @{}
    Get-Content $LogPath | ForEach-Object {
        if ($_ -match '^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*DONE\s*\|') {
            $completed[$matches[1].Trim()] = $true
        }
    }
    return $completed
}

function Write-TaskLog {
    param(
        [string]$TaskId,
        [string]$Description,
        [string]$TargetPath,
        [string]$Status
    )
    $stamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss zzz")
    Add-Content -Path $LogPath -Value "| $TaskId | $Description | $TargetPath | $Status | $stamp |" -Encoding UTF8
}

function Ensure-DirectoryTask {
    param([string]$TaskId, [string]$RelativePath, [hashtable]$Completed)
    if ($Completed.ContainsKey($TaskId)) { return }
    $target = Join-Path $Root $RelativePath
    New-Item -ItemType Directory -Path $target -Force | Out-Null
    Write-TaskLog $TaskId "Ensure directory exists" $RelativePath "DONE"
}

function New-InstructionContent {
    param([string]$Domain, [string]$Persona, [string]$PrimaryReference, [string]$Upstream, [string]$Downstream)
@"
# $Domain AI Instructions

## Persona
You are a $Persona operating inside a high-fidelity AI-as-a-Team development environment. You work as a domain owner, not a generic helper. You are accountable for production-grade reasoning, traceable decisions, and compatibility with the full system hierarchy defined in `../ai_dev_system.md`.

## Required Reading Sequence
1. Read `../ai_dev_system.md` to confirm the global hierarchy, task contract, and cross-folder rules.
2. Read this file to load the local persona, constraints, input requirements, and output obligations.
3. Before executing this, ensure $PrimaryReference is reviewed for compatibility.
4. If the task touches upstream behavior, review $Upstream.
5. If the task affects downstream consumers, review $Downstream.

## Mandatory Context Fields
Every task request must declare or infer the following. If a field is missing, state the assumption and mark it as `assumed` in the output:

```json
{
  "feature_or_domain": "string",
  "current_state": "string",
  "desired_state": "string",
  "upstream_dependencies": ["string"],
  "downstream_dependencies": ["string"],
  "data_contracts": ["string"],
  "user_or_system_impact": "string",
  "non_negotiables": ["string"],
  "risk_level": "low | medium | high",
  "verification_plan": ["string"]
}
```

## Operating Principles
- Start from existing code, schema, docs, and logs. Do not invent behavior when observable behavior can be inspected.
- Preserve external contracts unless the change request explicitly authorizes a contract migration.
- Keep changes modular. A local improvement must not create hidden coupling to another folder.
- Record every compatibility assumption and link it to the folder or file that owns the contract.
- Prefer small, reversible decisions over broad rewrites unless the task includes a migration plan and rollback strategy.
- Treat security, accessibility, data integrity, privacy, and observability as architecture concerns, not late QA details.

## Input Contract
Use this structure when receiving or preparing a task for this domain:

```json
{
  "task_id": "string",
  "persona": "$Persona",
  "target_folder": "$Domain",
  "references_reviewed": [
    "../ai_dev_system.md",
    "$PrimaryReference"
  ],
  "current_artifacts": {
    "files": ["string"],
    "schemas": ["string"],
    "api_routes": ["string"],
    "components": ["string"],
    "tests": ["string"]
  },
  "constraints": {
    "compatibility": ["string"],
    "performance": ["string"],
    "security": ["string"],
    "accessibility": ["string"],
    "release_timing": "string"
  },
  "definition_of_done": ["string"]
}
```

## Output Contract
Return work in a structured form so another AI teammate can continue without re-discovery:

```json
{
  "summary": "string",
  "files_changed": [
    {
      "path": "string",
      "reason": "string",
      "cross_folder_impact": ["string"]
    }
  ],
  "contracts_created_or_modified": [
    {
      "name": "string",
      "owner": "$Domain",
      "consumers": ["string"],
      "compatibility_notes": "string"
    }
  ],
  "edge_cases_handled": ["string"],
  "verification": {
    "static_checks": ["string"],
    "tests": ["string"],
    "manual_checks": ["string"]
  },
  "open_risks": ["string"],
  "next_recommended_tasks": ["string"]
}
```

## Error Handling And Resilience
- Enumerate invalid input, missing dependency, permission failure, timeout, partial write, stale cache, and conflicting contract cases.
- Define observable failure behavior before implementation. Silent failure is forbidden.
- Prefer typed error envelopes and explicit recovery paths.
- For user-facing failures, separate technical diagnostics from safe user copy.
- For system-facing failures, include correlation identifiers, retry policy, idempotency guidance, and escalation thresholds.
- When resilience requires fallback behavior, document what correctness guarantee is weakened.

## Cross-Folder Compatibility Checklist
- `database` owns durable data shape and migration compatibility.
- `backend` owns business invariants, service orchestration, and server-side validation.
- `integration` owns external protocol boundaries, authentication exchange, clients, and webhooks.
- `frontend` owns application state, routing, page composition, and API consumption.
- `ui` owns visual tokens, component primitives, interaction affordances, and accessibility implementation details.
- `ux` owns journeys, flow clarity, microcopy, task completion, and human error prevention.
- `qa` owns verification strategy, regression safety, test data, experiments, and release gates.

## Local Decision Record
For any non-trivial decision, append a short decision note in the output:

```json
{
  "decision": "string",
  "alternatives_considered": ["string"],
  "selected_because": "string",
  "compatibility_reviewed_against": ["../ai_dev_system.md", "$PrimaryReference"],
  "rollback_or_revision_path": "string"
}
```

## Completion Rule
A task is complete only when the local artifact is internally coherent, references the correct upstream and downstream owners, includes explicit edge-case treatment, and gives QA enough information to verify the behavior without guessing.
"@
}

function New-TemplateContent {
    param([string]$Title, [string]$Domain, [string]$Persona, [string]$Reference, [string]$Specialization)
@"
# $Title

## Purpose
This template is a production-grade prompt and implementation contract for $Domain work. It converts vague intent into explicit engineering inputs, typed outputs, resilience requirements, compatibility checks, and verification steps. Use it when the task requires $Specialization.

Before executing this, ensure $Reference is reviewed for compatibility. Also read `../ai_dev_system.md` and $Domain/ai_instructions.md before producing implementation guidance or code.

## Persona
Act as a $Persona. You are expected to challenge incomplete requirements, preserve contracts, and produce artifacts that another specialist can validate without hidden context.

## Required Context
The AI must provide or request the following before producing final work:

```json
{
  "task_id": "string",
  "business_goal": "string",
  "current_system_state": "string",
  "target_behavior": "string",
  "affected_files_or_modules": ["string"],
  "upstream_contracts": ["string"],
  "downstream_contracts": ["string"],
  "data_shapes": ["string"],
  "security_constraints": ["string"],
  "performance_constraints": ["string"],
  "accessibility_constraints": ["string"],
  "release_constraints": ["string"],
  "known_unknowns": ["string"]
}
```

## Input Schema
Use this JSON schema when converting a request into executable work:

```json
{
  "`$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["taskId", "scope", "referencesReviewed", "acceptanceCriteria"],
  "properties": {
    "taskId": { "type": "string" },
    "scope": {
      "type": "object",
      "required": ["domain", "intent", "nonGoals"],
      "properties": {
        "domain": { "type": "string", "const": "$Domain" },
        "intent": { "type": "string" },
        "nonGoals": { "type": "array", "items": { "type": "string" } }
      }
    },
    "referencesReviewed": {
      "type": "array",
      "items": { "type": "string" },
      "contains": { "const": "../ai_dev_system.md" }
    },
    "acceptanceCriteria": {
      "type": "array",
      "minItems": 1,
      "items": { "type": "string" }
    },
    "contracts": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "owner", "consumers", "compatibilityRule"],
        "properties": {
          "name": { "type": "string" },
          "owner": { "type": "string" },
          "consumers": { "type": "array", "items": { "type": "string" } },
          "compatibilityRule": { "type": "string" }
        }
      }
    }
  }
}
```

## Output Schema
Responses must be machine-checkable and useful to the next folder in the hierarchy:

```json
{
  "`$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["summary", "implementationPlan", "errorHandling", "verification"],
  "properties": {
    "summary": { "type": "string" },
    "implementationPlan": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["step", "target", "reason"],
        "properties": {
          "step": { "type": "string" },
          "target": { "type": "string" },
          "reason": { "type": "string" },
          "crossFolderImpact": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "contractArtifacts": { "type": "array", "items": { "type": "object" } },
    "errorHandling": { "type": "array", "items": { "type": "string" } },
    "verification": { "type": "array", "items": { "type": "string" } },
    "openRisks": { "type": "array", "items": { "type": "string" } }
  }
}
```

## Engineering Requirements
- Identify the owner of every contract touched by the work.
- Describe compatibility with upstream and downstream folders.
- Include migration, rollback, or feature-flag considerations when behavior changes.
- Define observability signals: logs, metrics, traces, experiment events, or QA checkpoints.
- Include negative cases, boundary cases, partial failure behavior, timeout behavior, authorization failures, empty states, malformed inputs, and stale dependency scenarios.
- If producing API response guidance, include JSON response examples and failure envelopes.
- If producing React component guidance, include prop-type or TypeScript-style prop contracts, required accessibility attributes, controlled/uncontrolled state rules, and rendering states.
- If producing data guidance, include schema versioning, indexing, migration safety, seed data, and backfill considerations.

## React Prop-Type Pattern
When this template touches UI or frontend behavior, include a contract like:

```ts
type ComponentProps = {
  id: string;
  status: "idle" | "loading" | "success" | "error";
  value?: unknown;
  error?: { code: string; message: string };
  onChange?: (nextValue: unknown) => void;
  "aria-label"?: string;
};
```

## API Response Pattern
When this template touches server, database, or integration behavior, include:

```json
{
  "ok": true,
  "data": {},
  "meta": {
    "requestId": "string",
    "schemaVersion": "string"
  },
  "errors": []
}
```

Failure responses must use:

```json
{
  "ok": false,
  "data": null,
  "meta": {
    "requestId": "string",
    "retryable": false
  },
  "errors": [
    {
      "code": "DOMAIN_SPECIFIC_CODE",
      "message": "Safe user or caller message",
      "details": {}
    }
  ]
}
```

## Error Handling
The final output must explicitly address:
- validation failure,
- missing required dependency,
- stale or conflicting state,
- unauthorized access,
- network or storage timeout,
- duplicate submission,
- partial success,
- rollback failure,
- observability gaps,
- user-visible recovery.

## Verification Checklist
Provide verification steps for:
- static analysis or linting,
- unit tests,
- integration tests,
- contract tests,
- accessibility review where applicable,
- performance review where applicable,
- regression checks against upstream and downstream folders.

## Cross-Linking Block
Add a final section named `Compatibility References` with links to every folder that must review the result. At minimum include `../ai_dev_system.md`, $Reference, and the owning $Domain/ai_instructions.md.
"@
}

function New-GuideContent {
    param([string]$Title, [string]$Domain, [string]$Reference, [string]$Focus)
@"
# $Title

## Role In The AI Development System
This document supports the $Domain folder by defining detailed guidance for $Focus. Read `../ai_dev_system.md` first, then $Domain/ai_instructions.md, then this guide. Before executing this, ensure $Reference is reviewed for compatibility.

## Operating Standard
- Keep the guidance modular and traceable.
- Name the owner of every contract.
- Preserve backward compatibility unless a migration is explicitly declared.
- State assumptions as assumptions.
- Include edge cases before implementation, not after defects appear.
- Prefer concrete examples over slogans.

## Required Analysis
For every task using this guide, record:

```json
{
  "feature": "string",
  "owner_folder": "$Domain",
  "references_reviewed": ["../ai_dev_system.md", "$Reference"],
  "current_behavior": "string",
  "desired_behavior": "string",
  "constraints": ["string"],
  "edge_cases": ["string"],
  "verification": ["string"]
}
```

## Detailed Guidance
$Focus requires disciplined review of context, contracts, and failure modes. Treat each artifact as part of a living operating system. The local file should be useful on its own, but it must never pretend to own decisions that belong to another folder.

For planning, separate durable rules from implementation choices. Durable rules include data invariants, security expectations, accessibility obligations, user journey commitments, and API contracts. Implementation choices include naming, layout, helper functions, folder placement, cache strategy, and test harness design. If a durable rule changes, route the task through the hierarchy and document the impact.

For execution, require examples. An AI teammate must include a successful case, a failed case, and at least one boundary case. It must show how the result behaves under invalid input, missing data, duplicate operations, concurrent updates, network failures, and permission failures where those conditions apply.

For review, ask whether the artifact can be validated by `qa` without a private explanation. If not, add stronger acceptance criteria, structured examples, or explicit reference links.

## Contract Pattern
Use this neutral envelope when the guide needs to describe structured output:

```json
{
  "name": "string",
  "owner": "$Domain",
  "version": "string",
  "inputs": {},
  "outputs": {},
  "errors": [
    {
      "code": "string",
      "retryable": false,
      "recovery": "string"
    }
  ],
  "compatibility": {
    "upstream": ["string"],
    "downstream": ["string"]
  }
}
```

## Verification
- Confirm links resolve to existing files.
- Confirm examples match the owning folder contracts.
- Confirm failures are observable and recoverable.
- Confirm QA has enough detail to test happy path, edge path, and regression path.

## Compatibility References
- `../ai_dev_system.md`.
- $Domain/ai_instructions.md.
- $Reference.
"@
}

function New-ControllerContent {
@"
# AI Development System

## System Goal
Establish a high-fidelity AI-as-a-Team environment: a live, self-referencing development operating system where each folder acts as a specialist team with explicit ownership, typed contracts, compatibility links, and verification duties.

## Hierarchy
Execution order follows this dependency chain:

1. DB(1): `database`
2. Backend(2): `backend`
3. Integration(3): `integration`
4. Frontend(4): `frontend`
5. UI(5): `ui`
6. UX(6): `ux`
7. QA(7): `qa`

No downstream folder may silently override an upstream contract. Downstream folders can propose changes, but ownership remains with the folder that defines the contract.

## Cross-Referencing Rule
Every AI task must begin by reading:

1. this global `ai_dev_system.md`;
2. the corresponding `ai_instructions.md` in the target folder;
3. every referenced upstream or downstream artifact named by the task template.

The minimum cross-reference sentence for every artifact is: "Before executing this, ensure [Reference_Folder/File] is reviewed for compatibility."

## Modularity Principle
Each folder owns a bounded concern:

- `database`: durable schema, migrations, indexes, data integrity, query performance.
- `backend`: business rules, service orchestration, validation, domain errors, API envelopes.
- `integration`: external clients, auth protocols, webhooks, partner contract boundaries.
- `frontend`: routes, pages, state management, data fetching, client-side composition.
- `ui`: tokens, primitives, component library, visual accessibility implementation.
- `ux`: journeys, flows, microcopy, task clarity, human error prevention.
- `qa`: unit checks, regression plans, experiments, release confidence, defect taxonomy.
- `docs`: architecture diagrams and product requirement records.
- `scripts`: CI/CD, linting, repo automation, and AI workflow enhancement.

## Existing Context Incorporated
The repository root currently exposes this operating system folder as the main visible project context. Existing prompt assets use title-case names with spaces, including `UI Masterprompt.md`, `UX Masterprompt.md`, and `Refactoring masterprompt.md`. New artifacts use lowercase folder names and snake/lowercase file names to improve automation, while preserving and referencing the legacy master prompts as source material.

No workspace-level `.continue`, `.cursor`, `.github`, package manifest, or README files were found during initialization. The `scripts` and `qa` folders therefore include guidance for future integration with those tool conventions when they are added. The requested `image.jpg` was not present in the workspace during bootstrap, so image-derived conventions could not be extracted.

## Task Lifecycle
Every task follows this lifecycle:

```json
{
  "phase": "discover | design | implement | verify | handoff",
  "required_reads": ["ai_dev_system.md", "target/ai_instructions.md"],
  "contracts_touched": ["string"],
  "compatibility_review": {
    "upstream": ["string"],
    "downstream": ["string"],
    "status": "compatible | migration_required | blocked"
  },
  "verification": ["string"],
  "handoff_notes": ["string"]
}
```

## Error And Conflict Policy
- If two folders disagree, the earlier hierarchy owner decides the contract unless the user explicitly authorizes a migration.
- If a task lacks context, record assumptions and risk.
- If an implementation affects data correctness, route through `database` and `backend` before downstream work.
- If an implementation changes visible behavior, route through `frontend`, `ui`, `ux`, and `qa`.
- If an implementation changes an external protocol, route through `integration`, `backend`, and `qa`.

## Build Log Policy
`build_log.md` is the run ledger. A re-run must read it first, skip `DONE` tasks, and execute only incomplete or missing tasks. Required format:

| Task ID | Description | Target Path | Status | Last Update |
|---|---|---|---|---|

## Quality Bar
The system is production-ready only when every template names persona, context, input/output contract, error handling, cross-linking, and verification. A folder without compatibility references is incomplete.
"@
}

function Write-FileTask {
    param(
        [string]$TaskId,
        [string]$RelativePath,
        [string]$Description,
        [string]$Content,
        [hashtable]$Completed
    )
    $target = Join-Path $Root $RelativePath
    $parent = Split-Path -Parent $target
    if ($Completed.ContainsKey($TaskId)) {
        if ((Test-Path $target) -and ((Get-Content $target -Raw) -notmatch '\$Reference|\$Domain|\$PrimaryReference|\$Upstream|\$Downstream')) {
            return
        }
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
        Set-Content -Path $target -Value $Content -Encoding UTF8
        Write-TaskLog "$TaskId-R" "Refresh generated file to resolve placeholder references" $RelativePath "DONE"
        return
    }
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
    Set-Content -Path $target -Value $Content -Encoding UTF8
    Write-TaskLog $TaskId $Description $RelativePath "DONE"
}

Ensure-BuildLog
$Completed = Get-CompletedTasks

if (-not $Completed.ContainsKey("BOOT-000")) {
    Write-TaskLog "BOOT-000" "Read build log and initialize recursive execution state; image.jpg unavailable; existing master prompts and root patterns analyzed" "AI_PROMPTING_FOLDERSTRUCTURE" "DONE"
}

$directories = @("backend","database","frontend","ui","ux","integration","qa","docs","scripts")
$i = 1
foreach ($dir in $directories) {
    Ensure-DirectoryTask ("DIR-{0:000}" -f $i) $dir $Completed
    $i++
}

$controllerContent = New-ControllerContent
Write-FileTask "CORE-001" "ai_dev_system.md" "Create master controller" $controllerContent $Completed

$instructionSpecs = @(
    @("database","Principal Database Architect, 15+ years experience in schema design, migrations, performance engineering, and data integrity","database/schema_template.md","docs/prd_template.md","backend/service_layer_template.md"),
    @("backend","Principal Backend Engineer, 15+ years experience in API architecture, service layers, reliability, and domain modeling","backend/service_layer_template.md","database/schema_template.md","integration/api_client_template.md"),
    @("integration","Senior Integration Architect, 15+ years experience in external APIs, auth protocols, webhooks, retries, and contract governance","integration/auth_protocols.md","backend/error_handling.md","frontend/state_management.md"),
    @("frontend","Senior Fullstack Frontend Engineer, 15+ years experience in application state, routing, API consumption, and resilient user interfaces","frontend/state_management.md","integration/api_client_template.md","ui/component_library_template.md"),
    @("ui","Principal Design Systems Engineer, 15+ years experience in component architecture, tokens, accessibility, and production UI platforms","ui/tokens.md","frontend/component_template.md","ux/microcopy_guide.md"),
    @("ux","Principal UX Architect, 15+ years experience in journey design, workflow simplification, microcopy, and human-centered systems","ux/user_journey_template.md","ui/accessibility_rules.md","qa-and-checks/checklist.md"),
    @("qa","Principal QA Architect, 15+ years experience in automated testing, release gates, experiments, and regression strategy","qa-and-checks/checklist.md","ux/wizard_flow_template.md","scripts/ci-cd-pipeline.md")
)

$taskNo = 1
foreach ($spec in $instructionSpecs) {
    $content = New-InstructionContent $spec[0] $spec[1] $spec[2] $spec[3] $spec[4]
    Write-FileTask ("INST-{0:000}" -f $taskNo) "$($spec[0])/ai_instructions.md" "Create $($spec[0]) AI instructions" $content $Completed
    $taskNo++
}

$templateSpecs = @(
    @("backend/prompt_template_backend_api.md","Backend API Prompt Template","backend","Principal Backend API Architect, 15+ years experience in secure JSON APIs, domain boundaries, and operational reliability","database/schema_template.md","designing and changing backend API prompts, request validation, response envelopes, and compatibility guarantees"),
    @("backend/service_layer_template.md","Service Layer Template","backend","Principal Backend Engineer, 15+ years experience in service decomposition, transaction boundaries, and domain orchestration","database/schema_template.md","service-layer implementation, orchestration, idempotency, and rollback behavior"),
    @("database/schema_template.md","Schema Template","database","Principal Database Architect, 15+ years experience in relational modeling, integrity constraints, and safe schema evolution","docs/prd_template.md","database schema creation, entity modeling, constraints, and versioned data contracts"),
    @("database/migration_template.md","Migration Template","database","Senior Database Reliability Engineer, 15+ years experience in zero-downtime migrations, backfills, and rollback planning","database/schema_template.md","migration planning, forward and backward compatibility, and data safety"),
    @("frontend/page_template.md","Page Template","frontend","Senior Fullstack Frontend Engineer, 15+ years experience in routing, page composition, and stateful product surfaces","integration/api_client_template.md","page-level route, data loading, error state, loading state, and layout behavior"),
    @("frontend/component_template.md","Component Template","frontend","Senior React Component Architect, 15+ years experience in prop contracts, accessibility, and reusable stateful components","ui/tokens.md","React component specification, prop typing, state handling, rendering states, and design-system compatibility"),
    @("ui/component_library_template.md","Component Library Template","ui","Principal Design Systems Engineer, 15+ years experience in reusable primitives, tokens, accessibility, and platform consistency","ui/tokens.md","component library primitives, variants, states, accessibility semantics, and visual contracts"),
    @("ux/user_journey_template.md","User Journey Template","ux","Principal UX Strategist, 15+ years experience in jobs-to-be-done, service design, and product workflow optimization","frontend/page_template.md","user journey mapping, intent, friction, recovery, and measurable task success"),
    @("ux/wizard_flow_template.md","Wizard Flow Template","ux","Senior Product Flow Architect, 15+ years experience in multi-step workflows, validation, recovery, and conversion quality","ui/accessibility_rules.md","wizard flows, step validation, progress, branching, and abandonment recovery"),
    @("integration/api_client_template.md","API Client Template","integration","Senior Integration Engineer, 15+ years experience in typed clients, retries, auth exchange, and external API contracts","backend/prompt_template_backend_api.md","API client design, typed request and response handling, retries, and compatibility with backend envelopes"),
    @("qa/unit_test_template.md","Unit Test Template","qa","Principal Test Architect, 15+ years experience in unit strategy, contract tests, and defect isolation","backend/error_handling.md","unit test design, fixtures, boundary coverage, and contract protection"),
    @("qa/ab_test_template.md","AB Test Template","qa","Senior Experimentation Engineer, 15+ years experience in A/B testing, telemetry, statistics hygiene, and release decisions","ux/user_journey_template.md","experiment design, metric definition, sample protection, QA gating, and interpretation")
)

$taskNo = 1
foreach ($spec in $templateSpecs) {
    $content = New-TemplateContent $spec[1] $spec[2] $spec[3] $spec[4] $spec[5]
    Write-FileTask ("TMPL-{0:000}" -f $taskNo) $spec[0] "Create $($spec[1])" $content $Completed
    $taskNo++
}

$guideSpecs = @(
    @("backend/error_handling.md","Backend Error Handling","backend","backend/service_layer_template.md","domain error taxonomy, API failure envelopes, retryability, and operational diagnostics"),
    @("database/performance_tuning.md","Database Performance Tuning","database","database/schema_template.md","query plans, indexes, cardinality, lock behavior, and migration-safe optimization"),
    @("frontend/state_management.md","Frontend State Management","frontend","integration/api_client_template.md","client state ownership, server cache boundaries, invalidation, optimistic updates, and user-visible consistency"),
    @("ui/tokens.md","UI Tokens","ui","UX Masterprompt.md","semantic color, typography, spacing, focus, elevation, density, and interaction tokens"),
    @("ui/accessibility_rules.md","Accessibility Rules","ui","ux/user_journey_template.md","WCAG-oriented keyboard behavior, focus order, names, contrast, reduced motion, and assistive technology semantics"),
    @("ux/microcopy_guide.md","Microcopy Guide","ux","UI Masterprompt.md","labels, errors, confirmations, empty states, progressive disclosure, and localization-ready product language"),
    @("integration/webhook_handler.md","Webhook Handler","integration","backend/error_handling.md","signature verification, idempotency, replay protection, retry behavior, and event observability"),
    @("integration/auth_protocols.md","Auth Protocols","integration","backend/error_handling.md","authentication flows, token handling, session exchange, least privilege, and authorization failure handling"),
    @("qa-and-checks/checklist.md","QA Checklists","qa","scripts/ci-cd-pipeline.md","release gates, regression strategy, environment readiness, and cross-folder acceptance criteria"),
    @("docs/arch_diagrams.md","Architecture Diagrams","docs","ai_dev_system.md","system diagrams, data flows, sequence views, boundary maps, and change impact visualization"),
    @("docs/prd_template.md","PRD Template","docs","ux/user_journey_template.md","product requirements, acceptance criteria, scope boundaries, analytics, release risks, and stakeholder clarity"),
    @("scripts/ci-cd-pipeline.md","CI/CD Pipeline","scripts","qa-and-checks/checklist.md","build validation, test gates, deploy stages, rollback hooks, and future .github workflow integration"),
    @("scripts/linting-rules.md","Linting Rules","scripts","frontend/component_template.md","static checks, formatting rules, prompt hygiene, future .cursor/.continue compatibility, and repo automation")
)

$taskNo = 1
foreach ($spec in $guideSpecs) {
    $content = New-GuideContent $spec[1] $spec[2] $spec[3] $spec[4]
    Write-FileTask ("GUIDE-{0:000}" -f $taskNo) $spec[0] "Create $($spec[1])" $content $Completed
    $taskNo++
}

if (-not (Get-CompletedTasks).ContainsKey("VERIFY-001")) {
    $required = @(
        "frontend/component_template.md",
        "ui/tokens.md",
        "backend/prompt_template_backend_api.md",
        "integration/api_client_template.md",
        "qa-and-checks/checklist.md",
        "scripts/ci-cd-pipeline.md"
    )
    $missing = @()
    foreach ($rel in $required) {
        if (-not (Test-Path (Join-Path $Root $rel))) { $missing += $rel }
    }
    if ($missing.Count -gt 0) {
        Write-TaskLog "VERIFY-001" "Final reference verification failed: $($missing -join ', ')" "AI_PROMPTING_FOLDERSTRUCTURE" "PENDING"
        throw "Missing required files: $($missing -join ', ')"
    }
    $frontendComponent = Get-Content (Join-Path $Root "frontend/component_template.md") -Raw
    if ($frontendComponent -notmatch "ui/tokens\.md") {
        Write-TaskLog "VERIFY-001" "Final reference verification failed: frontend component template does not reference ui/tokens.md" "frontend/component_template.md" "PENDING"
        throw "Broken reference: frontend/component_template.md -> ui/tokens.md"
    }
    Write-TaskLog "VERIFY-001" "Final reference verification passed" "AI_PROMPTING_FOLDERSTRUCTURE" "DONE"
}

Write-Output "AI prompting folder structure bootstrap complete."

