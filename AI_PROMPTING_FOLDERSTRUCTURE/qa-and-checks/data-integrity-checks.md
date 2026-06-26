# Data Integrity Checks

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Mission
This artifact extends the Product-Engineering OS with a deeper operating capability for QA Architecture. It is created in append-only, non-regression mode and must be read as an additional layer on top of ai_dev_system.md, SYSTEM.md, repository_source_inventory.md, and the local folder instructions.

## Analysis
Analyzing all repository sources for Data Integrity Checks patterns...

The repository was scanned as a full source corpus. Patterns extracted include execution authority, append-only governance, no permission loops for implied non-destructive delivery work, mandatory confirmation for destructive/external/security-sensitive work, Cursor and Continue rule discovery, changelog mining, coding-lesson trap avoidance, prompt metadata validation, Next 15 App Router standards, React 19 strict props, Tailwind 4 token discipline, shadcn/ui and Radix accessibility primitives, Supabase/auth/RLS pitfalls, provider-specific integration validation, SSRF and redaction guardrails, timeout caps, and mobile/desktop UI regression checks.

## Purpose
Define schema/interface alignment, FK/index checks, RLS review, migration rollback, seed safety, idempotency, and data repair validation.

## Persona
Act as a principal QA Architecture architect with 15+ years of production experience. You are responsible for turning repository memory into production-ready assets, preserving existing behavior, and creating QA-verifiable handoffs.

## Required Read Order
1. ai_dev_system.md
2. SYSTEM.md
3. docs/repository_source_inventory.md
4. governance/controller.md or its local equivalent when present
5. Source/Changelogs and Source/Codinglessonslearnt when relevant
6. database/schema-rules.md; database/migrations.md; backend/services.md

## Input Contract
~~~json
{
  "task_id": "string",
  "artifact": "Data Integrity Checks",
  "domain": "QA Architecture",
  "source_files_analyzed": ["string"],
  "existing_behavior_to_preserve": ["string"],
  "new_capability_requested": "string",
  "repository_patterns_applied": ["string"],
  "cross_links_reviewed": ["database/schema-rules.md; database/migrations.md; backend/services.md"],
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
Before executing this, ensure these files are reviewed for compatibility: database/schema-rules.md; database/migrations.md; backend/services.md.
Also review ai_dev_system.md, SYSTEM.md, docs/repository_source_inventory.md, .ai/best-practices.md, qa-and-checks/checklist.md, and build_log.md.

## Verification Checklist
- [ ] The source inventory was refreshed or confirmed current.
- [ ] The artifact preserves previous decisions and only augments them.
- [ ] JSON schema, React props, API envelope, or data invariants are present where applicable.
- [ ] Edge cases and rollback/recovery are explicit.
- [ ] QA can verify the output without private chat context.
- [ ] build_log.md contains this transformation task.

<!-- QA-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## QA Rationalization And Verification Layer

Analyzing all repository sources for QA rationalization patterns... This file remains the specialist data-integrity gate under the canonical `qa-and-checks/` release surface. Before executing this, ensure `database/schema-rules.md`, `database/migrations.md`, `database/performance.md`, `backend/services.md`, `qa-and-checks/checklist.md`, and `qa/README.md` are reviewed for compatibility.

Added gate: every data-affecting change must verify schema-to-interface parity, migration expand/contract safety, seed determinism, rollback evidence, RLS/auth policy impact, idempotency, duplicate protection, nullability, FK/index impact, and query-performance evidence.

<!-- SOURCE-WIDE-INGESTION-20260510 -->

## Canonical Data And Catalog Integrity Gates

Analyzing all repository sources for data-integrity patterns... Data QA must verify the full chain from upstream provider record to canonical entity, tenant-visible read model, API response, and UI state. Integrity is incomplete if the database is correct but source lineage, reviewability, or consumer contracts are missing.

Canonical entity checks:
- [ ] Provider registry exists for every upstream source and records trust tier, refresh cadence, ownership, and import status.
- [ ] Provider source records are immutable or append-tracked enough to explain upstream changes.
- [ ] Canonical links store confidence, method, evidence, active state, and review/audit metadata.
- [ ] Match thresholds are documented, conservative, and tested with conflict cases.
- [ ] Ambiguous matches enter review instead of auto-merging.
- [ ] Merge, split, relink, unlink, and override operations are audited.
- [ ] Read models preserve canonical ID and evidence pointers.

Catalog seed checks:
- [ ] Global catalog rows are stable and system-owned.
- [ ] Tenant/workspace imports preserve source catalog lineage.
- [ ] Unknown values remain null or explicit unknowns.
- [ ] Reruns do not duplicate records.
- [ ] Public/authenticated/tenant/service visibility is intentional and tested.

Data integrity contract:
```json
{
  "canonical_data_integrity": {
    "provider_registry_checked": true,
    "source_record_lineage_checked": true,
    "confidence_bands_checked": true,
    "ambiguous_merge_prevented": true,
    "review_queue_checked": true,
    "audit_log_checked": true,
    "consumer_read_model_checked": true
  },
  "catalog_integrity": {
    "global_catalog_system_owned": true,
    "workspace_import_lineage": true,
    "unknown_values_not_guessed": true,
    "rerun_safe": true,
    "rls_visibility_checked": true
  }
}
```
