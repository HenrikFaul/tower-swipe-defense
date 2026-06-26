# Responsive Rules

## PURPOSE
This file tells the AI exactly how to adapt layouts and components across devices so the product feels intentionally designed everywhere.

## RESPONSIVE PRINCIPLES
- Mobile-first by default.
- Do not merely shrink desktop layouts.
- Recompose layout when necessary.
- Preserve readability at every size.
- Keep the primary action prominent.
- Keep interactions touch-friendly.
- Prevent overflow, clipping, and horizontal scrolling.
- Maintain visual hierarchy after reflow.

## MOBILE RULES
- Use a stacked layout when space is limited.
- Avoid dense multi-column content.
- Keep controls large enough for fingers.
- Keep search and filters accessible.
- Reduce visual noise.
- Keep essential content visible without excessive scrolling.

## TABLET RULES
- Use two-column patterns when they improve scanning.
- Keep navigation stable and easy to reach.
- Maintain enough white space to avoid a cramped feeling.
- Allow forms and cards to expand without breaking rhythm.

## DESKTOP RULES
- Use available width to improve scanning, not to create emptiness.
- Cap reading line lengths for readability.
- Use grids with clear hierarchy.
- Use sidebars, panels, and columns only if they improve workflow.
- Preserve a calm and balanced composition.

## SHEET / DRAWER / MODAL RULES ON SMALL SCREENS
- Prefer drawer or sheet when a modal becomes too cramped.
- Ensure scroll areas remain usable.
- Keep the close action obvious.
- Preserve context in the background when helpful.

## SEARCH AND FILTER RESPONSIVE RULES
- On mobile, filters may collapse into a drawer or bottom sheet.
- Search should remain visible or easily accessible.
- Autocomplete lists must fit the viewport.
- Results should reflow rather than overflow.
- Empty and no-result states must remain understandable.

## RULE FOR AI
Whenever you generate a page or component, explicitly state how it behaves on:
- Mobile.
- Tablet.
- Desktop.
- Very large screens if relevant.
<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_responsive_rules.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_responsive_rules.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Responsive Rules

## PURPOSE
This file tells the AI exactly how to adapt layouts and components across devices so the product feels intentionally designed everywhere.

## RESPONSIVE PRINCIPLES
- Mobile-first by default.
- Do not merely shrink desktop layouts.
- Recompose layout when necessary.
- Preserve readability at every size.
- Keep the primary action prominent.
- Keep interactions touch-friendly.
- Prevent overflow, clipping, and horizontal scrolling.
- Maintain visual hierarchy after reflow.

## MOBILE RULES
- Use a stacked layout when space is limited.
- Avoid dense multi-column content.
- Keep controls large enough for fingers.
- Keep search and filters accessible.
- Reduce visual noise.
- Keep essential content visible without excessive scrolling.

## TABLET RULES
- Use two-column patterns when they improve scanning.
- Keep navigation stable and easy to reach.
- Maintain enough white space to avoid a cramped feeling.
- Allow forms and cards to expand without breaking rhythm.

## DESKTOP RULES
- Use available width to improve scanning, not to create emptiness.
- Cap reading line lengths for readability.
- Use grids with clear hierarchy.
- Use sidebars, panels, and columns only if they improve workflow.
- Preserve a calm and balanced composition.

## SHEET / DRAWER / MODAL RULES ON SMALL SCREENS
- Prefer drawer or sheet when a modal becomes too cramped.
- Ensure scroll areas remain usable.
- Keep the close action obvious.
- Preserve context in the background when helpful.

## SEARCH AND FILTER RESPONSIVE RULES
- On mobile, filters may collapse into a drawer or bottom sheet.
- Search should remain visible or easily accessible.
- Autocomplete lists must fit the viewport.
- Results should reflow rather than overflow.
- Empty and no-result states must remain understandable.

## RULE FOR AI
Whenever you generate a page or component, explicitly state how it behaves on:
- Mobile.
- Tablet.
- Desktop.
- Very large screens if relevant.

<!-- UI-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UI Rationalization Layer

Analyzing all repository sources for responsive UI patterns plus current public responsive-system standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ui/README.md`, `ui/tokens.md`, `ui/components.md`, `ui/states.md`, `frontend/page_template.md`, and `ux/user-flows.md`.

Responsive design is composition, not shrinkage. Use mobile-first Tailwind responsive variants, stable container constraints, explicit grid tracks, touch-friendly target sizes, safe-area awareness, scroll containment, and mobile-specific overlays when desktop patterns would become cramped. Large screens must improve scanning and workflow density without creating empty decorative layouts.

Responsive contract:
```json
{
  "surface": "string",
  "breakpoints": {
    "mobile": "single column or task-first layout",
    "tablet": "two-column only when scan value improves",
    "desktop": "workflow-oriented composition",
    "wide": "constrained content or intentional multi-panel layout"
  },
  "overflow_prevention": ["no_horizontal_scroll", "stable_min_widths", "wrap_long_words", "viewport_fit_popovers"],
  "touch_rules": ["target_size", "spacing", "reachable_primary_action"],
  "verification": ["mobile", "tablet", "desktop", "wide", "zoom_200"]
}
```

Rationalization rule: `responsive-rules.md` owns layout reflow. Component-level responsive notes stay in `components.md`, while user-journey impact belongs in `ux/user-flows.md`.

