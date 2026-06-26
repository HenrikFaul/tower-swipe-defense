# UI Design Tokens — Master Source of Truth

> **Persona:** Senior Design Systems Engineer. Tokens are the only allowed source for visual values. Any hardcoded color, spacing, radius, shadow, animation, or z-index in component code is a production bug unless explicitly documented as a one-off migration exception.

Cross-reference: `ui/ai_instructions.md` | `ui/typography.md` | `ui/components.md` | `ui/accessibility.md` | `../frontend/frontend-system.md`

---

## 1. Purpose

This file defines the canonical token system for the UI layer. It merges foundational governance rules with concrete implementation tokens so components can be produced consistently across light mode, dark mode, responsive layouts, accessibility states, and interaction states.

Tokens must support:

- visual consistency across all UI assets;
- semantic component styling without raw values;
- accessible contrast and focus states;
- dark mode and theme overrides;
- responsive spacing and layout behavior;
- stable frontend implementation using CSS custom properties and Tailwind arbitrary values when needed.

---

## 2. Token Architecture

```text
Global palette tokens  →  Semantic intent tokens  →  Component-scoped tokens
--palette-blue-600        --color-primary             --button-bg-primary
--spacing-4               --spacing-component-md      --input-padding-x
--radius-lg               --radius-card               --card-radius
```

Rules:

1. Components must consume semantic or component-scoped tokens, not palette tokens directly.
2. Palette tokens may change during rebranding; semantic tokens preserve component intent.
3. Component tokens may alias semantic tokens where repeated mapping improves maintainability.
4. Dark mode must override semantic tokens, not every component class.
5. Token additions require consuming component list, migration note, and QA validation.

---

## 3. Required Token Contract

```json
{
  "owner": "ui",
  "asset_type": "design-token-system",
  "source_files_analyzed": ["ui/tokens.md", "ui_2/tokens.md"],
  "interfaces": {
    "css_custom_properties": true,
    "tailwind_mapping": true,
    "component_token_mapping": true
  },
  "required_states": ["default", "hover", "active", "focus", "disabled", "loading", "success", "warning", "error"],
  "verification": ["contrast", "dark-mode", "responsive", "visual-regression", "no-hardcoded-values"]
}
```

---

## 4. Color Tokens

### 4.1 Palette Tokens — Global, Do Not Use Directly in Components

```css
:root {
  /* Blue */
  --palette-blue-50:  #eff6ff;
  --palette-blue-100: #dbeafe;
  --palette-blue-400: #60a5fa;
  --palette-blue-500: #3b82f6;
  --palette-blue-600: #2563eb;
  --palette-blue-700: #1d4ed8;
  --palette-blue-900: #1e3a8a;

  /* Neutral */
  --palette-neutral-0:   #ffffff;
  --palette-neutral-50:  #f8fafc;
  --palette-neutral-100: #f1f5f9;
  --palette-neutral-200: #e2e8f0;
  --palette-neutral-300: #cbd5e1;
  --palette-neutral-400: #94a3b8;
  --palette-neutral-500: #64748b;
  --palette-neutral-700: #334155;
  --palette-neutral-900: #0f172a;
  --palette-neutral-950: #020617;

  /* Status */
  --palette-green-500:  #22c55e;
  --palette-green-600:  #16a34a;
  --palette-red-500:    #ef4444;
  --palette-red-600:    #dc2626;
  --palette-yellow-400: #facc15;
  --palette-yellow-500: #eab308;
  --palette-orange-500: #f97316;
}
```

### 4.2 Semantic Color Tokens — Use These in Components

```css
:root {
  /* Surfaces */
  --color-surface-base:       var(--palette-neutral-0);
  --color-surface-elevated:   var(--palette-neutral-50);
  --color-surface-sunken:     var(--palette-neutral-100);
  --color-surface-overlay:    rgba(15, 23, 42, 0.5);

  /* Text */
  --color-text-primary:       var(--palette-neutral-900);
  --color-text-secondary:     var(--palette-neutral-500);
  --color-text-tertiary:      var(--palette-neutral-400);
  --color-text-disabled:      var(--palette-neutral-300);
  --color-text-inverse:       var(--palette-neutral-0);
  --color-text-on-primary:    var(--palette-neutral-0);

  /* Interactive */
  --color-primary:            var(--palette-blue-600);
  --color-primary-hover:      var(--palette-blue-700);
  --color-primary-active:     var(--palette-blue-900);
  --color-primary-subtle:     var(--palette-blue-50);

  /* Borders */
  --color-border-default:     var(--palette-neutral-200);
  --color-border-strong:      var(--palette-neutral-300);
  --color-border-focus:       var(--palette-blue-500);
  --color-border-error:       var(--palette-red-500);

  /* Status */
  --color-success:            var(--palette-green-600);
  --color-success-subtle:     #f0fdf4;
  --color-error:              var(--palette-red-600);
  --color-error-subtle:       #fef2f2;
  --color-warning:            var(--palette-yellow-500);
  --color-warning-subtle:     #fefce8;
  --color-info:               var(--palette-blue-600);
  --color-info-subtle:        var(--palette-blue-50);
}

[data-theme="dark"] {
  --color-surface-base:       var(--palette-neutral-950);
  --color-surface-elevated:   var(--palette-neutral-900);
  --color-surface-sunken:     #010409;
  --color-surface-overlay:    rgba(0, 0, 0, 0.72);
  --color-text-primary:       var(--palette-neutral-50);
  --color-text-secondary:     var(--palette-neutral-400);
  --color-text-tertiary:      var(--palette-neutral-500);
  --color-text-disabled:      var(--palette-neutral-700);
  --color-border-default:     var(--palette-neutral-700);
  --color-border-strong:      var(--palette-neutral-500);
  --color-primary:            var(--palette-blue-400);
  --color-primary-hover:      var(--palette-blue-500);
  --color-primary-active:     var(--palette-blue-600);
}
```

---

## 5. Spacing Tokens

```css
:root {
  --spacing-px:  1px;
  --spacing-0:   0;
  --spacing-0-5: 0.125rem;  /* 2px */
  --spacing-1:   0.25rem;   /* 4px */
  --spacing-1-5: 0.375rem;  /* 6px */
  --spacing-2:   0.5rem;    /* 8px */
  --spacing-2-5: 0.625rem;  /* 10px */
  --spacing-3:   0.75rem;   /* 12px */
  --spacing-4:   1rem;      /* 16px */
  --spacing-5:   1.25rem;   /* 20px */
  --spacing-6:   1.5rem;    /* 24px */
  --spacing-8:   2rem;      /* 32px */
  --spacing-10:  2.5rem;    /* 40px */
  --spacing-12:  3rem;      /* 48px */
  --spacing-16:  4rem;      /* 64px */
  --spacing-20:  5rem;      /* 80px */
  --spacing-24:  6rem;      /* 96px */
  --spacing-32:  8rem;      /* 128px */

  --spacing-component-xs: var(--spacing-2);
  --spacing-component-sm: var(--spacing-3);
  --spacing-component-md: var(--spacing-4);
  --spacing-component-lg: var(--spacing-6);
  --spacing-component-xl: var(--spacing-8);

  --spacing-layout-section: var(--spacing-16);
  --spacing-layout-page:    var(--spacing-24);
}
```

Rules:

- Use smaller spacing for dense controls, not ad-hoc negative margins.
- Page and section spacing must use layout tokens.
- Components must expose padding variants only when they map to component spacing tokens.

---

## 6. Border Radius Tokens

```css
:root {
  --radius-none:   0;
  --radius-sm:     0.125rem;  /* 2px */
  --radius-md:     0.375rem;  /* 6px */
  --radius-lg:     0.5rem;    /* 8px */
  --radius-xl:     0.75rem;   /* 12px */
  --radius-2xl:    1rem;      /* 16px */
  --radius-full:   9999px;

  --radius-button:  var(--radius-md);
  --radius-card:    var(--radius-lg);
  --radius-modal:   var(--radius-xl);
  --radius-badge:   var(--radius-full);
  --radius-input:   var(--radius-md);
}
```

---

## 7. Shadow and Focus Tokens

```css
:root {
  --shadow-xs:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm:  0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  --shadow-focus:       0 0 0 3px var(--color-border-focus);
  --shadow-focus-error: 0 0 0 3px var(--color-border-error);

  --shadow-card:    var(--shadow-sm);
  --shadow-modal:   var(--shadow-xl);
  --shadow-popover: var(--shadow-lg);
  --shadow-button:  var(--shadow-xs);
}
```

Focus tokens are accessibility-critical. They may be restyled but must not be removed.

---

## 8. Z-Index Tokens

```css
:root {
  --z-below:   -1;
  --z-base:    0;
  --z-raised:  1;
  --z-sticky:  100;
  --z-overlay: 200;
  --z-modal:   300;
  --z-toast:   400;
  --z-tooltip: 500;
}
```

Rules:

- Do not invent `9999` z-index values.
- New overlay classes must declare which z-index token they consume.
- Toasts and tooltips must not hide modal actions unless deliberately layered.

---

## 9. Animation Tokens

```css
:root {
  --duration-instant: 0ms;
  --duration-fast:    100ms;
  --duration-normal:  200ms;
  --duration-slow:    300ms;
  --duration-slower:  500ms;

  --ease-default:     cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:          cubic-bezier(0.4, 0, 1, 1);
  --ease-out:         cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);

  --transition-button:    color var(--duration-fast) var(--ease-default),
                          background-color var(--duration-fast) var(--ease-default),
                          border-color var(--duration-fast) var(--ease-default);
  --transition-modal:     opacity var(--duration-normal) var(--ease-out),
                          transform var(--duration-normal) var(--ease-out);
  --transition-sidebar:   transform var(--duration-slow) var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
  }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. Breakpoint Tokens

```css
:root {
  --breakpoint-sm:  640px;
  --breakpoint-md:  768px;
  --breakpoint-lg:  1024px;
  --breakpoint-xl:  1280px;
  --breakpoint-2xl: 1536px;
}
```

Mobile-first implementation:

```text
base: small phones
sm: large phones
md: tablets
lg: laptops
xl: desktop
2xl: wide desktop
```

---

## 11. Component Token Examples

```css
:root {
  --button-bg-primary:        var(--color-primary);
  --button-bg-primary-hover:  var(--color-primary-hover);
  --button-text-primary:      var(--color-text-on-primary);
  --button-radius:            var(--radius-button);
  --button-shadow-focus:      var(--shadow-focus);

  --input-bg:                 var(--color-surface-base);
  --input-border:             var(--color-border-default);
  --input-border-focus:       var(--color-border-focus);
  --input-border-error:       var(--color-border-error);
  --input-radius:             var(--radius-input);

  --card-bg:                  var(--color-surface-elevated);
  --card-border:              var(--color-border-default);
  --card-radius:              var(--radius-card);
  --card-shadow:              var(--shadow-card);
}
```

---

## 12. React + Tailwind Usage Example

```tsx
<div className="
  bg-[var(--color-surface-elevated)]
  border border-[var(--color-border-default)]
  rounded-[var(--radius-card)]
  shadow-[var(--shadow-card)]
  p-[var(--spacing-component-lg)]
">
  <h2 className="type-h2 text-[var(--color-text-primary)]">Card Title</h2>
  <p className="type-body text-[var(--color-text-secondary)]">Card content</p>
</div>
```

---

## 13. Verification Checklist

- [ ] No hardcoded visual values in component code.
- [ ] Component variants map to semantic or component tokens.
- [ ] Light and dark mode tokens preserve contrast.
- [ ] Focus tokens satisfy WCAG 2.2 AA focus appearance expectations.
- [ ] Status colors are not the only method of communicating state.
- [ ] Responsive spacing uses breakpoint and layout tokens.
- [ ] New tokens include source, owner, consuming components, and migration notes.
- [ ] Visual regression covers token changes.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens_2.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens_2.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# UI Tokens

## PURPOSE
This file defines the visual language of the product so the AI does not invent arbitrary visual values. Every screen should inherit these patterns unless a better system-level rule exists.

## DESIGN TOKEN RULES
- Use tokens for spacing, typography, color, radius, shadows, and motion.
- Avoid hardcoded ad hoc values when a token exists.
- Keep visual rhythm consistent across pages and components.
- Prefer semantic token names over visual descriptions when possible.
- Tokens should support both light and dark surfaces if the product uses them.
- Tokens must scale cleanly across responsive breakpoints.

## SPACING SCALE
Use a disciplined spacing scale such as:
- `4px` for tight relationships.
- `8px` for compact separation.
- `12px` for small grouped spacing.
- `16px` for base spacing.
- `24px` for section spacing.
- `32px` for large grouping.
- `48px+` for major layout separation.

Use spacing to create:
- Grouping.
- Hierarchy.
- Breathing room.
- Visual rhythm.
- Separation between primary and secondary content.

## TYPOGRAPHIC INTENT
Typography should support:
- Fast scanning.
- Clear content hierarchy.
- Strong headlines.
- Readable body text.
- Subtle supporting labels.
- Consistent line-height and letter spacing.

## COLOR SEMANTICS
Define colors as semantic roles instead of random aesthetics:
- Background.
- Surface.
- Surface elevated.
- Border.
- Primary text.
- Secondary text.
- Muted text.
- Primary action.
- Secondary action.
- Success.
- Warning.
- Error.
- Info.

Every semantic color must remain legible and accessible in all supported states.

## RADII AND SHADOWS
- Small radius for compact controls.
- Medium radius for cards and content containers.
- Large radius for prominent panels or modals if the product style supports it.
- Shadows should be subtle and functional, not decorative noise.
- Elevation should help hierarchy, not replace spacing.

## MOTION
- Motion must support meaning, not spectacle.
- Use motion for feedback, reveal, state transitions, and continuity.
- Keep transitions fast and calm.
- Respect reduced-motion preferences.
- Avoid distracting bounce or overshoot unless the brand explicitly uses that style.

## RESPONSIVE APPLICATION
Tokens must work across:
- Mobile.
- Tablet.
- Desktop.
- Large desktop.

Layout should preserve hierarchy even when spacing changes across breakpoints.

## USAGE RULE
Before inventing new visual values, read:
- `ui/ai_instructions.md`
- `ui/typography.md`
- `ui/components.md`
- `ux/states.md`
- `frontend/project-structure.md`

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_tokens.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_tokens.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# UI Tokens

## PURPOSE
This file defines the visual language of the product so the AI does not invent arbitrary visual values. Every screen should inherit these patterns unless a better system-level rule exists.

## DESIGN TOKEN RULES
- Use tokens for spacing, typography, color, radius, shadows, and motion.
- Avoid hardcoded ad hoc values when a token exists.
- Keep visual rhythm consistent across pages and components.
- Prefer semantic token names over visual descriptions when possible.
- Tokens should support both light and dark surfaces if the product uses them.
- Tokens must scale cleanly across responsive breakpoints.

## SPACING SCALE
Use a disciplined spacing scale such as:
- `4px` for tight relationships.
- `8px` for compact separation.
- `12px` for small grouped spacing.
- `16px` for base spacing.
- `24px` for section spacing.
- `32px` for large grouping.
- `48px+` for major layout separation.

Use spacing to create:
- Grouping.
- Hierarchy.
- Breathing room.
- Visual rhythm.
- Separation between primary and secondary content.

## TYPOGRAPHIC INTENT
Typography should support:
- Fast scanning.
- Clear content hierarchy.
- Strong headlines.
- Readable body text.
- Subtle supporting labels.
- Consistent line-height and letter spacing.

## COLOR SEMANTICS
Define colors as semantic roles instead of random aesthetics:
- Background.
- Surface.
- Surface elevated.
- Border.
- Primary text.
- Secondary text.
- Muted text.
- Primary action.
- Secondary action.
- Success.
- Warning.
- Error.
- Info.

Every semantic color must remain legible and accessible in all supported states.

## RADII AND SHADOWS
- Small radius for compact controls.
- Medium radius for cards and content containers.
- Large radius for prominent panels or modals if the product style supports it.
- Shadows should be subtle and functional, not decorative noise.
- Elevation should help hierarchy, not replace spacing.

## MOTION
- Motion must support meaning, not spectacle.
- Use motion for feedback, reveal, state transitions, and continuity.
- Keep transitions fast and calm.
- Respect reduced-motion preferences.
- Avoid distracting bounce or overshoot unless the brand explicitly uses that style.

## RESPONSIVE APPLICATION
Tokens must work across:
- Mobile.
- Tablet.
- Desktop.
- Large desktop.

Layout should preserve hierarchy even when spacing changes across breakpoints.

## USAGE RULE
Before inventing new visual values, read:
- `ui/ai_instructions.md`
- `ui/typography.md`
- `ui/components.md`
- `ux/states.md`
- `frontend/project-structure.md`

<!-- UI-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UI Rationalization Layer

Analyzing all repository sources for UI token patterns plus current public design-system standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ui/README.md`, `ui/ai_instructions.md`, `ui/components.md`, `ui/accessibility.md`, `ux/design-system.md`, and `frontend/project-structure.md`.

Tokens are the contract between visual intent and implementation. Tailwind v4 theme variables, shadcn/ui CSS variables, and local semantic tokens must agree before any component class is generated. Tokens must define semantic purpose, allowed values, light/dark behavior, contrast intent, state usage, density rules, and forbidden ad-hoc replacements.

Token contract:
```json
{
  "token": "string",
  "category": "color | spacing | radius | shadow | typography | motion | z-index | density",
  "semantic_role": "string",
  "tailwind_mapping": "string",
  "css_variable": "--example-token",
  "states": ["default", "hover", "focus", "active", "disabled"],
  "themes": ["light", "dark", "high_contrast"],
  "accessibility_checks": ["contrast", "focus_visible", "reduced_motion"],
  "usage_examples": ["component or surface"],
  "do_not_use_for": ["string"]
}
```

Rationalization rule: `tokens.md` is the only active root file for token governance. Historical `tokens_2.md` and `ui_tokens.md` belong in the archive after their lossless imports are verified.

<!-- CODING-LESSONS-20260510-INGESTION -->

## Coding Lessons Ingestion - Density And Shell Tokens

Source reviewed: `C:/Users/Lenovo/Downloads/codingLessonsLearnt (2).md`.

New token lessons to enforce:
- Enterprise shells should support density tiers such as `compact`, `comfortable`, and `expansive`, plus an `auto` preference that resolves to a concrete tier before it touches the DOM.
- Density must be opt-in through explicit variables such as `--density-row-h`, `--density-pad-x`, `--density-pad-y`, `--density-gap`, `--density-card-pad`, `--density-section-gap`, and `--density-page-pad-x/y`; introducing density tokens must not silently change legacy Tailwind classes.
- Persisted density preferences should be scoped to the workspace or product context when density meaning differs per workspace. Global fallback is acceptable, but workspace-specific preference wins.
- Root shell primitives must not impose arbitrary `max-width` on operational dashboards. Use constrained reading widths only where reading comprehension is the goal, and use full-bleed workflow grids for dashboard/enterprise surfaces.

Density token contract:
```json
{
  "density_modes": ["compact", "comfortable", "expansive", "auto"],
  "dom_value": "never auto; resolve to concrete mode",
  "tokens": ["--density-row-h", "--density-pad-x", "--density-pad-y", "--density-gap", "--density-card-pad", "--density-section-gap"],
  "scope": "workspace_or_global_fallback",
  "legacy_regression_guard": "only components using var(--density-*) change"
}
```

