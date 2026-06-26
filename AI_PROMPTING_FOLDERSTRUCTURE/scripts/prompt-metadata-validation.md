# Prompt Metadata Validation

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Mission
This artifact extends the Product-Engineering OS with a deeper operating capability for Scripts. It is created in append-only, non-regression mode and must be read as an additional layer on top of ai_dev_system.md, SYSTEM.md, repository_source_inventory.md, and the local folder instructions.

## Analysis
Analyzing all repository sources for Prompt Metadata Validation patterns...

The repository was scanned as a full source corpus. Patterns extracted include execution authority, append-only governance, no permission loops for implied non-destructive delivery work, mandatory confirmation for destructive/external/security-sensitive work, Cursor and Continue rule discovery, changelog mining, coding-lesson trap avoidance, prompt metadata validation, Next 15 App Router standards, React 19 strict props, Tailwind 4 token discipline, shadcn/ui and Radix accessibility primitives, Supabase/auth/RLS pitfalls, provider-specific integration validation, SSRF and redaction guardrails, timeout caps, and mobile/desktop UI regression checks.

## Purpose
Document prompt package metadata validation rules inspired by Source/scripts/validate-structure.js and aiprompt.json catalogs.

## Persona
Act as a principal Scripts architect with 15+ years of production experience. You are responsible for turning repository memory into production-ready assets, preserving existing behavior, and creating QA-verifiable handoffs.

## Required Read Order
1. ai_dev_system.md
2. SYSTEM.md
3. docs/repository_source_inventory.md
4. governance/controller.md or its local equivalent when present
5. Source/Changelogs and Source/Codinglessonslearnt when relevant
6. Source/scripts/validate-structure.js; Source/prompt-template/aiprompt.json

## Input Contract
~~~json
{
  "task_id": "string",
  "artifact": "Prompt Metadata Validation",
  "domain": "Scripts",
  "source_files_analyzed": ["string"],
  "existing_behavior_to_preserve": ["string"],
  "new_capability_requested": "string",
  "repository_patterns_applied": ["string"],
  "cross_links_reviewed": ["Source/scripts/validate-structure.js; Source/prompt-template/aiprompt.json"],
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
Before executing this, ensure these files are reviewed for compatibility: Source/scripts/validate-structure.js; Source/prompt-template/aiprompt.json.
Also review ai_dev_system.md, SYSTEM.md, docs/repository_source_inventory.md, .ai/best-practices.md, qa-and-checks/checklist.md, and build_log.md.

## Verification Checklist
- [ ] The source inventory was refreshed or confirmed current.
- [ ] The artifact preserves previous decisions and only augments them.
- [ ] JSON schema, React props, API envelope, or data invariants are present where applicable.
- [ ] Edge cases and rollback/recovery are explicit.
- [ ] QA can verify the output without private chat context.
- [ ] build_log.md contains this transformation task.

<!-- SCRIPTS-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Scripts Rationalization And Metadata Validation Layer

Analyzing all repository sources for Scripts rationalization patterns... This file remains a specialist active guide under the canonical `scripts/` surface. Before executing this, ensure `scripts/README.md`, `scripts/linting-rules.md`, `scripts/reference-verification.md`, `Source/scripts/validate-structure.js`, and `Source/prompt-template/aiprompt.json` are reviewed for compatibility.

Added validation gates: unique slug, stable package name, explicit prompt type, allowed file extensions, no hidden prompt package files, no unsupported nested prompt structures, author/version metadata, model/editor metadata where required, semver-compatible versioning, and build-log traceability for generated prompt packages.

<!-- SOURCE-WIDE-INGESTION-20260510 -->

## Prompt Package Index Build Layer

Analyzing all repository sources for prompt metadata and index generation patterns... Prompt packages must be validated as buildable assets, not merely readable markdown. Metadata and markdown frontmatter must be strict enough for an index builder to generate deterministic prompt catalogs without manual cleanup.

Prompt package requirements:
- A prompt package directory must declare metadata in `aiprompt.json` or the project-approved equivalent. Metadata may be an object or array only when the builder explicitly supports that shape.
- Prompt package metadata must include stable `name`, `description`, `type`, `slug`, `files`, `published`, `author`, `version`, and relevant technology classification when applicable.
- Accepted prompt types are governed by the local catalog. Unknown types require an explicit catalog update rather than ad hoc labels.
- Markdown command/rule files may include frontmatter, but frontmatter must parse cleanly and must not hide the required body content.
- The `files` list must match existing files, and prompt content generation must preserve file order deterministically.
- Hidden files, hidden folders, unsupported nested structures, duplicate slugs, missing files, malformed JSON, and stale archived references are blocking failures.
- Index generation must normalize framework/service/library tags and must not drop service/library arrays when combining metadata into searchable records.

Index build contract:
```ts
type PromptPackageIndexRecord = {
  slug: string;
  name: string;
  description: string;
  type: "agent" | "feature" | "rule" | "setup" | "starter" | string;
  files: string[];
  techStack?: {
    framework?: string | string[];
    service?: string | string[];
    library?: string | string[];
  };
  promptContent: Array<{ file: string; body: string; frontmatter?: Record<string, string> }>;
  validation: {
    filesExist: boolean;
    noHiddenFiles: boolean;
    noUnsupportedNestedDirs: boolean;
    slugUnique: boolean;
    metadataShapeValid: boolean;
  };
};
```

Compatibility cross-links: before generating or validating prompt packages, review `linting-rules.md`, `reference-verification.md`, `ci-cd-pipeline.md`, `../docs/repository_source_inventory.md`, and `../qa-and-checks/checklist.md`.
