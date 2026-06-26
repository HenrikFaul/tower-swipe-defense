# UI States

## PURPOSE
This file defines the interaction states every meaningful UI surface must support.

## MANDATORY STATES
- Loading.
- Empty.
- Error.
- Success.
- Disabled.
- Partial content if applicable.
- Retry / recovery.
- Optimistic update when appropriate.

## LOADING STATE RULES
- Preserve layout stability.
- Use skeletons for content-heavy surfaces.
- Show progress only when meaningful.
- Avoid making users wonder whether the UI is broken.
- Loading should feel intentional and calm.

## EMPTY STATE RULES
- Empty should guide the next action.
- Do not leave the user with a dead end.
- Explain why the state exists if needed.
- Offer a clear next step.
- Use supportive visuals or copy only when they help understanding.

## ERROR STATE RULES
- Explain the problem clearly.
- Avoid technical jargon unless the audience expects it.
- Offer a recovery action.
- Keep the layout intact if possible.
- Distinguish validation errors from system errors.

## SUCCESS STATE RULES
- Confirm that the action succeeded.
- Do not overcomplicate the confirmation.
- Use success feedback in a way that does not interrupt the flow unnecessarily.
- Preserve momentum toward the next step.

## SEARCH-SPECIFIC STATES
When building search or selection interfaces, always define:
- Typing state.
- Loading suggestions state.
- No results state.
- Error state.
- Selected state.
- Clear state.

## RULE FOR AI
No screen or component is complete unless its states are described explicitly.
<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_states.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_states.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# UI States

## PURPOSE
This file defines the interaction states every meaningful UI surface must support.

## MANDATORY STATES
- Loading.
- Empty.
- Error.
- Success.
- Disabled.
- Partial data if applicable.
- Retry / recovery behavior.
- Optimistic or delayed update behavior if relevant.

## LOADING STATE RULES
- Preserve layout stability.
- Use skeletons for content-heavy surfaces.
- Show progress only when meaningful.
- Avoid making users wonder whether the UI is broken.
- Loading should feel intentional and calm.

## EMPTY STATE RULES
- Empty should guide the next action.
- Do not leave the user with a dead end.
- Explain why the state exists if needed.
- Offer a clear next step.
- Use supportive visuals or copy only when they help understanding.

## ERROR STATE RULES
- Explain the problem clearly.
- Avoid technical jargon unless the audience expects it.
- Offer a recovery action.
- Keep the layout intact if possible.
- Distinguish validation errors from system errors.

## SUCCESS STATE RULES
- Confirm that the action succeeded.
- Do not overcomplicate the confirmation.
- Use success feedback in a way that does not interrupt the flow unnecessarily.
- Preserve momentum toward the next step.

## SEARCH-SPECIFIC STATES
When building search or selection interfaces, always define:
- Typing state.
- Loading suggestions state.
- No results state.
- Error state.
- Selected state.
- Clear state.

## RULE FOR AI
No screen or component is complete unless its states are described explicitly.

<!-- UI-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UI Rationalization Layer

Analyzing all repository sources for UI state patterns plus current public interaction-state standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ui/README.md`, `ui/tokens.md`, `ui/components.md`, `ui/accessibility.md`, `ux/states.md`, and `qa-and-checks/checklist.md`.

Every component must declare visual, behavioral, and assistive feedback for each state. State styling must not rely only on color; pair color with iconography, text, shape, motion, or position where needed. Reserve dimensions for dynamic content so loading, validation, and error feedback do not shift critical layout.

State contract:
```json
{
  "component": "string",
  "states": {
    "default": "base affordance",
    "hover": "pointer affordance",
    "focus_visible": "keyboard-visible outline or ring",
    "active": "pressed feedback",
    "selected": "persistent selected marker",
    "disabled": "non-interactive semantics and style",
    "loading": "progress without layout shift",
    "empty": "calm no-content guidance",
    "error": "visible problem and recovery",
    "success": "confirmation without blocking"
  },
  "accessibility": ["aria-disabled_when_needed", "aria-busy_when_needed", "aria-live_for_async_feedback"],
  "verification": ["keyboard", "pointer", "touch", "screen_reader", "visual_regression"]
}
```

Rationalization rule: `states.md` is the canonical UI state owner. UX-level flow states remain in `ux/states.md`; component state visuals and semantics live here.

