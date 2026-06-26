# QA Template Library

<!-- QA-RATIONALIZATION-2026-05-10 -->

## Purpose

`qa/` is the specialized test-generation prompt library. It should be used when an AI agent must produce or enhance concrete test assets: unit tests, characterization tests, contract tests, regression cases, and A/B experiment validation.

This folder is not the primary release gate. For release readiness, read `../qa-and-checks/README.md`, then `../qa-and-checks/qa-strategy.md` and `../qa-and-checks/checklist.md`.

## Active Files

- `ai_instructions.md`: role, persona, and execution contract for QA test-generation work.
- `unit_test_template.md`: unit, characterization, edge-case, and contract-preservation template.
- `ab_test_template.md`: experiment QA template; must cross-check `../ab-testing/strategy.md`, `../ab-testing/metrics.md`, and `../ab-testing/rollout-plan.md`.

## Consolidated File

`qa_checklists.md` has been consolidated into `../qa-and-checks/checklist.md` and archived under `archive/2026-05-10-rationalized/`. Do not recreate a second active checklist in this folder. Instead, link to the canonical release checklist.

## Required Read Order For Test Generation

1. `../ai_dev_system.md`
2. `../SYSTEM.md`
3. `ai_instructions.md`
4. `../qa-and-checks/qa-strategy.md`
5. `../qa-and-checks/checklist.md`
6. The relevant local test template.

## Quality Floor

Generated tests must verify user-visible behavior where applicable, preserve contracts, isolate data, avoid brittle selectors, cover known repository traps, and produce handoff evidence that QA can rerun without private chat context.

## Runtime Browser Automation

For exploratory click-through, screenshot evidence, console-error capture, and interaction smoke testing, use `../qa-automation/`. Promote repeated failures discovered by the automation into stable test assets in this folder.
