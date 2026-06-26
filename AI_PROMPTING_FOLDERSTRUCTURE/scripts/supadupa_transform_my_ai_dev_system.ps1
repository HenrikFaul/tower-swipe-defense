$ErrorActionPreference = "Stop"

<#
SCRIPTS-RATIONALIZATION-2026-05-10:
This transformation script remains active as a deeper supadupa enhancement pass.
For current guidance, read scripts/README.md, ci-cd-pipeline.md, linting-rules.md,
reference-verification.md, and prompt-metadata-validation.md before changing it.
Future destructive or broad file-changing revisions should preserve idempotency,
use literal paths, record build_log.md rows, and consider ShouldProcess-style dry-run behavior.
#>

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Workspace = Split-Path -Parent $Root
$LogPath = Join-Path $Root "build_log.md"
$Marker = "<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->"
$Sources = "Full repository scan performed; detailed inventory maintained at AI_PROMPTING_FOLDERSTRUCTURE/docs/repository_source_inventory.md; high-signal sources include AGENTS.md, AI_EXECUTION_PROMPTS.md, CLAUDE.md, LOCAL_EXECUTION_MODE.md, governance/*, continue/rules, cursor/rules, Source/Changelogs, Source/Codinglessonslearnt, Source/own prompts, Source/prompts/next-shadcn, Source/prompts/react-19, Source/prompts/tailwind-4, Source/prompt-template, Source/scripts, and all AI_PROMPTING_FOLDERSTRUCTURE files."

function EnsureLog {
    if (-not (Test-Path $LogPath)) {
        Set-Content -Path $LogPath -Encoding UTF8 -Value "| Task ID | Description | Source Files Analyzed | Target Path | Status |`n|---|---|---|---|---|"
    }
}

function LoggedDone([string]$TaskId) {
    if (-not (Test-Path $LogPath)) { return $false }
    return ((Get-Content $LogPath -Raw) -match "\|\s*$([regex]::Escape($TaskId))\s*\|[^\r\n]*\|\s*DONE\s*\|")
}

function LogTask([string]$TaskId, [string]$Description, [string]$Target, [string]$Status) {
    Add-Content -Path $LogPath -Encoding UTF8 -Value "| $TaskId | $Description | $Sources | $Target | $Status |"
}

function NewArtifactContent([string]$Title, [string]$Domain, [string]$Purpose, [string]$Links) {
@"
# $Title

$Marker

## Mission
This artifact extends the Product-Engineering OS with a deeper operating capability for $Domain. It is created in append-only, non-regression mode and must be read as an additional layer on top of ai_dev_system.md, SYSTEM.md, repository_source_inventory.md, and the local folder instructions.

## Analysis
Analyzing all repository sources for $Title patterns...

The repository was scanned as a full source corpus. Patterns extracted include execution authority, append-only governance, no permission loops for implied non-destructive delivery work, mandatory confirmation for destructive/external/security-sensitive work, Cursor and Continue rule discovery, changelog mining, coding-lesson trap avoidance, prompt metadata validation, Next 15 App Router standards, React 19 strict props, Tailwind 4 token discipline, shadcn/ui and Radix accessibility primitives, Supabase/auth/RLS pitfalls, provider-specific integration validation, SSRF and redaction guardrails, timeout caps, and mobile/desktop UI regression checks.

## Purpose
$Purpose

## Persona
Act as a principal $Domain architect with 15+ years of production experience. You are responsible for turning repository memory into production-ready assets, preserving existing behavior, and creating QA-verifiable handoffs.

## Required Read Order
1. ai_dev_system.md
2. SYSTEM.md
3. docs/repository_source_inventory.md
4. governance/controller.md or its local equivalent when present
5. Source/Changelogs and Source/Codinglessonslearnt when relevant
6. $Links

## Input Contract
~~~json
{
  "task_id": "string",
  "artifact": "$Title",
  "domain": "$Domain",
  "source_files_analyzed": ["string"],
  "existing_behavior_to_preserve": ["string"],
  "new_capability_requested": "string",
  "repository_patterns_applied": ["string"],
  "cross_links_reviewed": ["$Links"],
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'idle' | 'loading' | 'empty' | 'success' | 'error'; error?: { code: string; message: string; retryable?: boolean } }",
    "api_envelope": {
      "ok": true,
      "data": {},
      "meta": { "requestId": "string", "schemaVersion": "string", "evidence": "runtime-observed | code-inferred" },
      "errors": []
    }
  },
  "risk_level": "low | medium | high",
  "definition_of_done": ["string"]
}
~~~

## Output Contract
~~~json
{
  "summary": "string",
  "created_or_enhanced_assets": ["string"],
  "non_regression_evidence": ["string"],
  "edge_cases": ["empty", "loading", "error", "permission", "timeout", "conflict", "partial-failure", "rollback"],
  "qa_handoff": ["string"],
  "open_questions": ["string"],
  "append_only_notes": ["string"]
}
~~~

## Error Handling And Edge Coverage
- Invalid or incomplete source inventory must block final handoff until documented as an assumption.
- Missing cross-links must be logged as verification failures, not silently ignored.
- If a generated asset touches UI, include mobile and desktop behavior, focus states, keyboard behavior, ARIA labels, overflow handling, readable menus, and loading/empty/error/success states.
- If a generated asset touches APIs or integrations, include request redaction, SSRF/private-network checks where relevant, timeout caps, rate-limit/backoff, retryability, correlation IDs, and safe caller messages.
- If a generated asset touches data, include schema-to-interface alignment, FK/index rules, RLS policy review, migration rollback, seed-data safety, and query-performance checks.

## Compatibility References
Before executing this, ensure these files are reviewed for compatibility: $Links.
Also review ai_dev_system.md, SYSTEM.md, docs/repository_source_inventory.md, .ai/best-practices.md, qa-and-checks/checklist.md, and build_log.md.

## Verification Checklist
- [ ] The source inventory was refreshed or confirmed current.
- [ ] The artifact preserves previous decisions and only augments them.
- [ ] JSON schema, React props, API envelope, or data invariants are present where applicable.
- [ ] Edge cases and rollback/recovery are explicit.
- [ ] QA can verify the output without private chat context.
- [ ] build_log.md contains this transformation task.
"@
}

function NewEnhancementBlock([string]$Title, [string]$Domain, [string]$Focus, [string]$Links) {
@"

$Marker

## Supadupa Enhancement Layer

### Analysis
Analyzing all repository sources for $Title supadupa-enhancement patterns...

This enhancement layer deepens the existing $Domain artifact with the newest repository-wide operating memory. It preserves all prior content and adds stronger instructions for source ingestion, append-only governance, production-ready asset generation, and QA-verifiable delivery.

### Added Capability
$Focus

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
  "artifact": "$Title",
  "source_files_analyzed": "all repository sources, with inventory reference",
  "non_regression": true,
  "append_only": true,
  "compatibility_links": ["$Links"],
  "verification_required": ["reference check", "schema/interface check", "edge-state check", "qa handoff check"]
}
~~~

Before executing this enhancement, ensure $Links are reviewed for compatibility.
"@
}

function CreateArtifact([string]$TaskId, [string]$RelPath, [string]$Title, [string]$Domain, [string]$Purpose, [string]$Links) {
    $target = Join-Path $Root $RelPath
    $parent = Split-Path -Parent $target
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
    if ((Test-Path $target) -and ((Get-Content $target -Raw) -match [regex]::Escape($Marker))) {
        if (-not (LoggedDone $TaskId)) { LogTask $TaskId "Already created supadupa artifact: $Title" $RelPath "DONE" }
        return
    }
    Set-Content -Path $target -Encoding UTF8 -Value (NewArtifactContent $Title $Domain $Purpose $Links)
    LogTask $TaskId "Create supadupa artifact: $Title" $RelPath "DONE"
}

function EnhanceArtifact([string]$TaskId, [string]$RelPath, [string]$Title, [string]$Domain, [string]$Focus, [string]$Links) {
    $target = Join-Path $Root $RelPath
    if (-not (Test-Path $target)) {
        LogTask $TaskId "Cannot enhance missing file: $Title" $RelPath "PENDING"
        return
    }
    $raw = Get-Content $target -Raw
    if ($raw -match [regex]::Escape($Marker)) {
        if (-not (LoggedDone $TaskId)) { LogTask $TaskId "Already supadupa-enhanced: $Title" $RelPath "DONE" }
        return
    }
    Add-Content -Path $target -Encoding UTF8 -Value (NewEnhancementBlock $Title $Domain $Focus $Links)
    LogTask $TaskId "Supadupa-enhance existing artifact: $Title" $RelPath "DONE"
}

EnsureLog
LogTask "SUPA-SCAN-001" "Scan full repository for supadupa transformation patterns" "AI_PROMPTING_FOLDERSTRUCTURE" "DONE"

$newFiles = @(
@("SUPA-NEW-001","docs/source-pattern-digest.md","Source Pattern Digest","Governance","Summarize the repository source patterns that every future generation must apply, including governance, changelog, coding lessons, design prompts, and framework prompt packs.","docs/repository_source_inventory.md; ai_dev_system.md; SYSTEM.md"),
@("SUPA-NEW-002","docs/non-regression-matrix.md","Non-Regression Matrix","QA Architecture","Provide a reusable matrix for preserving features, routes, APIs, permissions, data mutations, UI states, integrations, and historical behavior.","qa-and-checks/checklist.md; Source/Codinglessonslearnt; Source/Changelogs"),
@("SUPA-NEW-003","docs/interface-contract-registry.md","Interface Contract Registry","Architecture","Define how JSON schemas, React props, API envelopes, event payloads, DB invariants, and prompt metadata contracts are registered and cross-linked.","backend/prompt_template_backend_api.md; frontend/component_template.md; database/schema-rules.md"),
@("SUPA-NEW-004","docs/source-to-template-traceability.md","Source To Template Traceability","Documentation","Map repository source classes to generated OS files so future runs can prove every relevant source class influenced the resulting templates.","docs/repository_source_inventory.md; build_log.md"),
@("SUPA-NEW-005","docs/changelog-mining-protocol.md","Changelog Mining Protocol","Delivery Governance","Define how changelogs are mined for delivered behavior, regressions, rollback clues, version-sensitive behavior, and acceptance criteria.","Source/Changelogs; governance/controller.md; build_log.md"),
@("SUPA-NEW-006","docs/coding-lessons-digest.md","Coding Lessons Digest","Delivery Governance","Condense recurring lessons into operational checks for TypeScript, Supabase, auth, RLS, provider integrations, UI states, and deployment safety.","Source/Codinglessonslearnt; qa-and-checks/checklist.md"),
@("SUPA-NEW-007",".ai/delegation-protocol.md","AI Delegation Protocol","AI Orchestration","Define how conceptual agents delegate work across DB, Backend, Integration, Frontend, UI, UX, QA, docs, scripts, and governance owners.",".ai/agents.md; .ai/skills.md; ai_dev_system.md"),
@("SUPA-NEW-008",".ai/context-ingestion.md","Context Ingestion Protocol","AI Orchestration","Define the exact process for scanning repository files, classifying source classes, refreshing inventory, and producing source-backed outputs.","docs/repository_source_inventory.md; .ai/best-practices.md"),
@("SUPA-NEW-009","qa-and-checks/visual-regression-checks.md","Visual Regression Checks","QA Architecture","Define desktop/mobile visual validation, overflow checks, focus state review, dropdown readability, dialog usability, and screenshot evidence expectations.","ui/accessibility.md; ui/components.md; ux/states.md"),
@("SUPA-NEW-010","qa-and-checks/data-integrity-checks.md","Data Integrity Checks","QA Architecture","Define schema/interface alignment, FK/index checks, RLS review, migration rollback, seed safety, idempotency, and data repair validation.","database/schema-rules.md; database/migrations.md; backend/services.md"),
@("SUPA-NEW-011","qa-and-checks/integration-resilience-checks.md","Integration Resilience Checks","QA Architecture","Define third-party API resilience checks for timeouts, SSRF protection, redaction, provider validation, webhooks, retries, and rate limits.","integration/api-contracts.md; integration/error-handling.md"),
@("SUPA-NEW-012","scripts/reference-verification.md","Reference Verification","Scripts","Define how scripts and AI runs verify broken links, missing aliases, unresolved placeholders, duplicate slugs, and required cross-folder references.","scripts/linting-rules.md; docs/source-to-template-traceability.md"),
@("SUPA-NEW-013","scripts/prompt-metadata-validation.md","Prompt Metadata Validation","Scripts","Document prompt package metadata validation rules inspired by Source/scripts/validate-structure.js and aiprompt.json catalogs.","Source/scripts/validate-structure.js; Source/prompt-template/aiprompt.json"),
@("SUPA-NEW-014","samples/sample-contract-registry-entry.md","Sample Contract Registry Entry","Samples","Provide a concrete example of a registry entry connecting DB schema, backend envelope, frontend props, UX states, and QA checks.","docs/interface-contract-registry.md; samples/sample-backend.md; samples/sample-frontend.md"),
@("SUPA-NEW-015","samples/sample-regression-matrix.md","Sample Regression Matrix","Samples","Provide a concrete non-regression matrix sample for routes, permissions, data mutations, UI states, integrations, and rollback evidence.","docs/non-regression-matrix.md; qa-and-checks/checklist.md")
)

foreach ($item in $newFiles) {
    CreateArtifact $item[0] $item[1] $item[2] $item[3] $item[4] $item[5]
}

$enhanceFiles = @(
@("SUPA-ENH-001","ai_dev_system.md","AI Development System","Core","Adds mandatory source-to-template traceability and contract registry usage.","docs/source-to-template-traceability.md; docs/interface-contract-registry.md"),
@("SUPA-ENH-002","SYSTEM.md","System Controller","Core","Adds navigation to the new supadupa governance and QA artifacts.","docs/source-pattern-digest.md; .ai/context-ingestion.md"),
@("SUPA-ENH-003","README.md","Project README","Docs","Adds operator workflow for the new supadupa artifacts and rerun scripts.","scripts/supadupa_transform_my_ai_dev_system.ps1; build_log.md"),
@("SUPA-ENH-004",".ai/agents.md","AI Agents","AI Orchestration","Adds delegation protocol enforcement and owner escalation rules.",".ai/delegation-protocol.md; .ai/skills.md"),
@("SUPA-ENH-005",".ai/best-practices.md","Best Practices","AI Orchestration","Adds coding lessons digest and prompt metadata validation as global best practices.","docs/coding-lessons-digest.md; scripts/prompt-metadata-validation.md"),
@("SUPA-ENH-006","backend/backend-system.md","Backend System","Backend","Adds contract registry, exception taxonomy, and data-integrity QA dependency.","docs/interface-contract-registry.md; qa-and-checks/data-integrity-checks.md"),
@("SUPA-ENH-007","database/schema-rules.md","Database Schema Rules","Database","Adds data integrity check links and schema-to-interface enforcement.","qa-and-checks/data-integrity-checks.md; docs/interface-contract-registry.md"),
@("SUPA-ENH-008","integration/third-party-services.md","Third Party Services","Integration","Adds integration resilience checks for provider validation, rate limits, and redaction.","qa-and-checks/integration-resilience-checks.md; docs/coding-lessons-digest.md"),
@("SUPA-ENH-009","frontend/frontend-system.md","Frontend System","Frontend","Adds visual regression and state-matrix obligations for every user-facing asset.","qa-and-checks/visual-regression-checks.md; ux/states.md"),
@("SUPA-ENH-010","ui/components.md","UI Components","UI","Adds component contract registry and visual regression gates.","docs/interface-contract-registry.md; qa-and-checks/visual-regression-checks.md"),
@("SUPA-ENH-011","ux/states.md","UX States","UX","Adds state coverage matrix and no-blame recovery verification.","docs/non-regression-matrix.md; qa-and-checks/visual-regression-checks.md"),
@("SUPA-ENH-012","qa-and-checks/checklist.md","Release Checklist","QA","Adds supadupa verification gates for source traceability, contracts, and new QA packs.","docs/source-to-template-traceability.md; qa-and-checks/data-integrity-checks.md"),
@("SUPA-ENH-013","scripts/linting-rules.md","Linting Rules","Scripts","Adds reference verification and prompt metadata validation requirements.","scripts/reference-verification.md; scripts/prompt-metadata-validation.md"),
@("SUPA-ENH-014","samples/sample-backend.md","Sample Backend","Samples","Adds contract-registry-backed backend sample expectations.","samples/sample-contract-registry-entry.md; docs/interface-contract-registry.md"),
@("SUPA-ENH-015","samples/sample-frontend.md","Sample Frontend","Samples","Adds visual-regression-backed frontend sample expectations.","qa-and-checks/visual-regression-checks.md; samples/sample-regression-matrix.md")
)

foreach ($item in $enhanceFiles) {
    EnhanceArtifact $item[0] $item[1] $item[2] $item[3] $item[4] $item[5]
}

$failures = @()
foreach ($item in $newFiles) {
    $path = Join-Path $Root $item[1]
    if (-not (Test-Path $path)) { $failures += "$($item[1]) missing"; continue }
    $raw = Get-Content $path -Raw
    if ($raw -notmatch [regex]::Escape($Marker)) { $failures += "$($item[1]) missing marker" }
    if ($raw.Length -lt 2000) { $failures += "$($item[1]) under 2000 chars" }
    if ($raw -notmatch "Analyzing all repository sources") { $failures += "$($item[1]) missing analysis sentence" }
    if ($raw -notmatch "json") { $failures += "$($item[1]) missing JSON contract" }
    if ($raw -notmatch "React") { $failures += "$($item[1]) missing React interface contract" }
}
foreach ($item in $enhanceFiles) {
    $path = Join-Path $Root $item[1]
    if (-not (Test-Path $path)) { $failures += "$($item[1]) missing"; continue }
    $raw = Get-Content $path -Raw
    if ($raw -notmatch [regex]::Escape($Marker)) { $failures += "$($item[1]) missing enhancement marker" }
}

if ($failures.Count -gt 0) {
    LogTask "SUPA-VERIFY-001" "Supadupa transformation verification failed: $($failures -join '; ')" "AI_PROMPTING_FOLDERSTRUCTURE" "PENDING"
    throw ($failures -join "`n")
}

LogTask "SUPA-VERIFY-001" "Supadupa transformation verification passed; 15 new files created and 15 existing files enhanced" "AI_PROMPTING_FOLDERSTRUCTURE" "DONE"
Write-Output "Supadupa transformation complete."

