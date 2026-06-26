# UX Canonical Map

<!-- UX-RATIONALIZATION-2026-05-10 -->

## Purpose

`ux/` owns product journeys, state behavior, messaging, copy rules, design-system-level UX decisions, wizard flows, search/discovery UX, and regression-safe redesign strategy for the Product-Engineering OS.

Use this folder when a task asks how an experience should behave, communicate, recover, guide, convert, or preserve user trust.

## Canonical Active Files

- `ai_instructions.md`: UX role, read order, context contract, and execution rules.
- `user-flows.md`: canonical journey and flow design guide. It now represents `ux_user_flows.md`, `user_journey_template.md`, and search/discovery enhancement patterns.
- `states.md`: canonical UX state model. It represents `ux_states.md`.
- `messaging.md`: canonical UX messaging and product voice guide. It represents `ux_messaging.md`.
- `copy-rules.md`: canonical CTA, label, confirmation, no-blame error, localization, and microcopy guide. It represents `microcopy_guide.md`.
- `design-system.md`: journey-level design system guidance.
- `wizard_flow_template.md`: specialist template for multi-step, branching, resumable, validated flows.
- `UX Masterprompt.md`: high-stakes redesign master prompt for full-product UX/UI transformation.

## Archived Variants

The following files are archived under `archive/2026-05-10-rationalized/` after their content is represented by canonical files:

- `ai_instructions2.md`
- `ux_ai_instructions.md`
- `ux_messaging.md`
- `ux_states.md`
- `ux_user_flows.md`
- `user_journey_template.md`
- `microcopy_guide.md`
- `ux_search_enhancement_patterns.md`

## Required Read Order

1. `../ai_dev_system.md`
2. `../SYSTEM.md`
3. `ai_instructions.md`
4. `design-system.md`
5. `user-flows.md`
6. `states.md`
7. `messaging.md`
8. `copy-rules.md`
9. `wizard_flow_template.md` when multi-step flow design is involved
10. `UX Masterprompt.md` when full redesign strategy is involved
11. `../ui/accessibility.md`, `../ui/components.md`, `../frontend/tests.md`, and `../qa-and-checks/checklist.md` before handoff

## External Standards Added In 2026-05-10 Pass

- Nielsen Norman Group usability heuristics: system status, real-world language, user control, consistency, error prevention, recognition, flexibility, minimalist focus, recovery, and help.
- Journey Mapping 101: capture actor, scenario, phases, actions, thoughts, emotions, pain points, and opportunities.
- WCAG 2.2: keyboard, focus, names/roles/values, error identification, target size, and accessible authentication.
- NN/G error-message guidance: say what happened, why if safe, and what the user can do next.
- Material Design state guidance: states must communicate interaction possibility and current condition without layout instability.
- Plain-language guidance: use familiar words, direct structure, and action-oriented copy.

## Non-Regression Rule

Never remove or simplify an existing user journey, state, permission path, shortcut, validation rule, or recovery behavior without naming the tradeoff and getting explicit approval. If a UX file is rationalized out of the active surface, archive it with a manifest and keep a lossless import in the canonical file.
