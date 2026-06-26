# UI Prompt Routing Map

<!-- UI-RATIONALIZATION-2026-05-10 -->

## Purpose
This file is the canonical routing map for the UI prompt surface. It prevents duplicate prompt growth while preserving every historical instruction through lossless imports and archive manifests.

## Required Read Order
1. `../ai_dev_system.md`
2. `../SYSTEM.md`
3. `ui/README.md`
4. `ui/ai_instructions.md`
5. The canonical owner file for the requested UI topic.
6. Cross-folder dependencies from `frontend/`, `ux/`, and `qa-and-checks/`.

## Canonical Active Files

| File | Ownership |
| --- | --- |
| `ai_instructions.md` | UI persona, operating rules, production asset standards, and cross-folder read gates. |
| `tokens.md` | Semantic design tokens: colors, spacing, radius, shadows, density, motion, and theme variables. |
| `typography.md` | Type scale, hierarchy, responsive reading rules, truncation, skeleton text, and accessibility constraints. |
| `components.md` | Component catalog rules, variants, state matrix, composition rules, tables, forms, search/discovery components, and design-system behavior. |
| `component_library_template.md` | Deep component-generation template with JSON schema, React prop contracts, and production verification. Kept active because it is a structured template, not just a duplicate component overview. |
| `accessibility.md` | WCAG, WAI-ARIA, Radix accessibility, labels, keyboard, focus, contrast, and assistive-technology rules. |
| `responsive-rules.md` | Mobile/tablet/desktop/large-screen layout rules, reflow behavior, overflow prevention, and modal/sheet adaptation. |
| `states.md` | UI interaction states and component state matrix: default, hover, focus, active, selected, disabled, loading, empty, error, and success. |
| `UI Masterprompt.md` | Orchestration prompt for UI redesign and production-ready interface generation. |

## Archived Or Imported Variants

The following files are represented by canonical owners and should not be recreated in the active UI root after rationalization:

- `accessibility_rules.md` -> `accessibility.md`
- `ai_instructions_2.md` -> `ai_instructions.md`
- `ui_ai_instructions.md` -> `ai_instructions.md`
- `components2.md` -> `components.md`
- `ui_components.md` -> `components.md`
- `tokens_2.md` -> `tokens.md`
- `ui_tokens.md` -> `tokens.md`
- `typography2.md` -> `typography.md`
- `ui_typography.md` -> `typography.md`
- `ui_responsive_rules.md` -> `responsive-rules.md`
- `ui_states.md` -> `states.md`
- `ui_search_patterns.md` -> `components.md`
- `source_inventory.md` -> archive manifest and this routing map

## External Standards Integrated
- Tailwind CSS v4: utility-first styling, theme variables, responsive variants, state variants, dark mode, and constrained arbitrary values.
- shadcn/ui: local code ownership, CLI-generated components, CSS variables, theming, Radix/Base UI backed primitives, and component registry conventions.
- Radix Primitives: accessible behavior, ARIA semantics, keyboard navigation, labels, and focus management.
- WAI-ARIA APG: pattern-specific keyboard and semantics guidance for dialogs, tabs, menus, comboboxes, tables, and disclosure controls.
- WCAG 2.2: keyboard access, focus visible and not obscured, contrast, target size, labels, error identification, and robust name-role-value behavior.

## Non-Regression Rule
Never remove a token, variant, component behavior, accessibility rule, responsive rule, or state definition without proving it is represented in a canonical owner. If a prompt is rationalized out of the active surface, archive it with a manifest and keep a lossless import where its content is not already represented.
