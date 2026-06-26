# Sample Contract Registry Entry

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Mission
This artifact extends the Product-Engineering OS with a deeper operating capability for Samples. It is created in append-only, non-regression mode and must be read as an additional layer on top of ai_dev_system.md, SYSTEM.md, repository_source_inventory.md, and the local folder instructions.

## Analysis
Analyzing all repository sources for Sample Contract Registry Entry patterns...

The repository was scanned as a full source corpus. Patterns extracted include execution authority, append-only governance, no permission loops for implied non-destructive delivery work, mandatory confirmation for destructive/external/security-sensitive work, Cursor and Continue rule discovery, changelog mining, coding-lesson trap avoidance, prompt metadata validation, Next 15 App Router standards, React 19 strict props, Tailwind 4 token discipline, shadcn/ui and Radix accessibility primitives, Supabase/auth/RLS pitfalls, provider-specific integration validation, SSRF and redaction guardrails, timeout caps, and mobile/desktop UI regression checks.

## Purpose
Provide a concrete example of a registry entry connecting DB schema, backend envelope, frontend props, UX states, and QA checks.

## Persona
Act as a principal Samples architect with 15+ years of production experience. You are responsible for turning repository memory into production-ready assets, preserving existing behavior, and creating QA-verifiable handoffs.

## Required Read Order
1. ai_dev_system.md
2. SYSTEM.md
3. docs/repository_source_inventory.md
4. governance/controller.md or its local equivalent when present
5. Source/Changelogs and Source/Codinglessonslearnt when relevant
6. docs/interface-contract-registry.md; samples/sample-backend.md; samples/sample-frontend.md

## Input Contract
~~~json
{
  "task_id": "string",
  "artifact": "Sample Contract Registry Entry",
  "domain": "Samples",
  "source_files_analyzed": ["string"],
  "existing_behavior_to_preserve": ["string"],
  "new_capability_requested": "string",
  "repository_patterns_applied": ["string"],
  "cross_links_reviewed": ["docs/interface-contract-registry.md; samples/sample-backend.md; samples/sample-frontend.md"],
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
Before executing this, ensure these files are reviewed for compatibility: docs/interface-contract-registry.md; samples/sample-backend.md; samples/sample-frontend.md.
Also review ai_dev_system.md, SYSTEM.md, docs/repository_source_inventory.md, .ai/best-practices.md, qa-and-checks/checklist.md, and build_log.md.

## Verification Checklist
- [ ] The source inventory was refreshed or confirmed current.
- [ ] The artifact preserves previous decisions and only augments them.
- [ ] JSON schema, React props, API envelope, or data invariants are present where applicable.
- [ ] Edge cases and rollback/recovery are explicit.
- [ ] QA can verify the output without private chat context.
- [ ] build_log.md contains this transformation task.
