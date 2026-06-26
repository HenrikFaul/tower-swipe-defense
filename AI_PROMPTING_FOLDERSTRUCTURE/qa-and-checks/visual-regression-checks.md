# Visual Regression Checks

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Mission
This artifact extends the Product-Engineering OS with a deeper operating capability for QA Architecture. It is created in append-only, non-regression mode and must be read as an additional layer on top of ai_dev_system.md, SYSTEM.md, repository_source_inventory.md, and the local folder instructions.

## Analysis
Analyzing all repository sources for Visual Regression Checks patterns...

The repository was scanned as a full source corpus. Patterns extracted include execution authority, append-only governance, no permission loops for implied non-destructive delivery work, mandatory confirmation for destructive/external/security-sensitive work, Cursor and Continue rule discovery, changelog mining, coding-lesson trap avoidance, prompt metadata validation, Next 15 App Router standards, React 19 strict props, Tailwind 4 token discipline, shadcn/ui and Radix accessibility primitives, Supabase/auth/RLS pitfalls, provider-specific integration validation, SSRF and redaction guardrails, timeout caps, and mobile/desktop UI regression checks.

## Purpose
Define desktop/mobile visual validation, overflow checks, focus state review, dropdown readability, dialog usability, and screenshot evidence expectations.

## Persona
Act as a principal QA Architecture architect with 15+ years of production experience. You are responsible for turning repository memory into production-ready assets, preserving existing behavior, and creating QA-verifiable handoffs.

## Required Read Order
1. ai_dev_system.md
2. SYSTEM.md
3. docs/repository_source_inventory.md
4. governance/controller.md or its local equivalent when present
5. Source/Changelogs and Source/Codinglessonslearnt when relevant
6. ui/accessibility.md; ui/components.md; ux/states.md

## Input Contract
~~~json
{
  "task_id": "string",
  "artifact": "Visual Regression Checks",
  "domain": "QA Architecture",
  "source_files_analyzed": ["string"],
  "existing_behavior_to_preserve": ["string"],
  "new_capability_requested": "string",
  "repository_patterns_applied": ["string"],
  "cross_links_reviewed": ["ui/accessibility.md; ui/components.md; ux/states.md"],
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
Before executing this, ensure these files are reviewed for compatibility: ui/accessibility.md; ui/components.md; ux/states.md.
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

Analyzing all repository sources for QA rationalization patterns... This file remains the specialist visual-regression gate under the canonical `qa-and-checks/` release surface. Before executing this, ensure `ui/tokens.md`, `ui/components.md`, `ui/accessibility.md`, `ux/states.md`, `frontend/tests.md`, and `qa-and-checks/checklist.md` are reviewed for compatibility.

Playwright and design QA additions: verify desktop and mobile screenshots, overflow, readable dropdowns, modal focus trap, keyboard navigation, focus-visible states, loading/empty/error/success states, no clipped text, no hidden primary CTA, and stable dimensions for fixed-format UI elements.
