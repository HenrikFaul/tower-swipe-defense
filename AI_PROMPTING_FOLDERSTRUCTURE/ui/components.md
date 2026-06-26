# UI Component Catalog & Library Template — Master Specification

> **Persona:** Senior Design Systems Engineer. Components are contracts, not suggestions. Every component must expose a typed API, token mapping, lifecycle states, accessibility behavior, responsive behavior, and QA handoff. Deviation requires a documented architecture decision.

Cross-reference: `ui/ai_instructions.md` | `ui/tokens.md` | `ui/typography.md` | `ui/accessibility.md` | `../ux/states.md` | `../frontend/frontend-system.md`

---

## 1. Purpose

This file consolidates the component catalog and component-library template into one canonical UI component source. It defines how to design, document, generate, implement, and verify UI components without duplicating rules across separate catalog/template files.

A component is production-ready only when it includes:

- typed React props;
- tokenized variant and size mapping;
- complete visual and async states;
- keyboard and ARIA behavior;
- responsive and overflow rules;
- loading skeleton where applicable;
- error/empty/retry behavior where applicable;
- usage examples and QA checks.

---

## 2. Component Hierarchy

```text
Level 1: Native HTML / Radix primitives
  → Level 2: shadcn/ui defaults
    → Level 3: Product base components with semantic tokens
      → Level 4: Compound components assembled from base components
        → Level 5: Page sections and feature compositions
```

Rules:

- Never skip levels.
- Prefer semantic HTML, Radix primitives, and shadcn/ui before custom interaction logic.
- Product base components wrap lower-level primitives with tokens and project conventions.
- Compound components must document which base components they compose.
- Page sections must not redefine base-component behavior.

---

## 3. Required Input JSON Schema

```json
{
  "component_name": "string",
  "component_level": "base | compound | page-section",
  "user_problem": "string",
  "source_files_analyzed": ["string"],
  "current_behavior": "string",
  "target_behavior": "string",
  "non_regression_constraints": ["string"],
  "props_required": ["string"],
  "states_required": ["default", "hover", "active", "focus", "disabled", "loading", "empty", "success", "error"],
  "accessibility_requirements": ["string"],
  "responsive_requirements": ["string"],
  "acceptance_criteria": ["string"]
}
```

---

## 4. Required Output JSON Schema

```json
{
  "summary": "string",
  "component_name": "string",
  "asset_type": "component-contract | component-template | component-implementation | component-documentation",
  "source_files_analyzed": ["string"],
  "react_props": "type Props = ...",
  "variants": ["string"],
  "state_matrix": ["string"],
  "token_mapping": ["string"],
  "accessibility_contract": ["string"],
  "responsive_contract": ["string"],
  "edge_cases": ["empty", "loading", "error", "permission", "timeout", "partial-failure", "retry"],
  "verification": ["unit", "interaction", "keyboard", "axe", "visual-regression", "responsive"],
  "qa_handoff": ["string"]
}
```

---

## 5. Universal Component Props Pattern

```ts
type ComponentStatus = 'idle' | 'loading' | 'empty' | 'success' | 'error';

type ComponentError = {
  code: string;
  message: string;
  retryable?: boolean;
};

type BaseUIProps = {
  id?: string;
  className?: string;
  status?: ComponentStatus;
  error?: ComponentError;
  'aria-label'?: string;
  'aria-describedby'?: string;
  testId?: string;
};
```

Rules:

- Required IDs are mandatory when labels, descriptions, or errors must be linked.
- `className` may extend layout, but must not override core accessibility or token behavior.
- Status and error contracts must align with UX states and frontend data states.

---

## 6. Button Component

```ts
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}
```

Token mapping:

```ts
const buttonTokens = {
  primary: {
    bg: 'var(--color-primary)',
    bgHover: 'var(--color-primary-hover)',
    text: 'var(--color-text-on-primary)',
    border: 'transparent'
  },
  secondary: {
    bg: 'var(--color-surface-elevated)',
    text: 'var(--color-text-primary)',
    border: 'var(--color-border-default)'
  },
  destructive: {
    bg: 'var(--color-error)',
    text: 'var(--color-text-inverse)',
    border: 'transparent'
  }
};
```

Required states: default, hover, active, focus-visible, disabled, loading.

Accessibility:

- Icon-only buttons require `aria-label`.
- Loading buttons use `aria-busy="true"`, remain dimensionally stable, and prevent double-submit.
- Destructive buttons require clear copy and, when high impact, confirmation or undo pattern.

---

## 7. Input / Form Field

```ts
interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadonly?: boolean;
  value: string;
  onChange: (value: string) => void;
}
```

Required ARIA:

- `label htmlFor` linked to `input id`;
- `aria-describedby` for hint and error;
- `aria-invalid="true"` when error exists;
- `aria-required="true"` when required.

Token references:

```text
border default: --color-border-default
border focus:   --color-border-focus
border error:   --color-border-error
shadow focus:   --shadow-focus
shadow error:   --shadow-focus-error
radius:         --radius-input
```

Required states: default, focused, error, disabled, readonly, loading/validating.

---

## 8. Card

```ts
interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  isInteractive?: boolean;
  href?: string;
  children: React.ReactNode;
}
```

Token references:

```text
background: --color-surface-elevated | --color-surface-base
border:     --color-border-default
shadow:     --shadow-card
radius:     --radius-card
padding:    --spacing-component-sm/md/lg
```

Rules:

- Interactive cards must be keyboard reachable and expose link/button semantics.
- Do not nest conflicting interactive controls inside a clickable card unless the pattern is explicitly designed and tested.
- Hover lift may use tokenized duration and must respect reduced motion.

---

## 9. Modal / Dialog

```ts
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOutsideClick?: boolean;
}
```

Accessibility requirements:

- `role="dialog"`;
- `aria-modal="true"`;
- `aria-labelledby={titleId}`;
- `aria-describedby={descriptionId}` when description exists;
- focus trap on open;
- focus restore on close;
- Escape closes unless documented otherwise;
- background content inert or unreachable.

Animation:

```text
backdrop: opacity 0 → 1 using --duration-normal and --ease-out
panel: opacity 0 + scale(0.95) → opacity 1 + scale(1)
reduced motion: no transform animation
```

---

## 10. Table / Data Table

```ts
interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  error?: { code: string; message: string; retryable?: boolean };
  emptyMessage?: string;
  onRetry?: () => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  selectedRows?: string[];
  onRowSelect?: (id: string) => void;
  pagination?: PaginationConfig;
}
```

States:

- Loading: 3–5 skeleton rows matching column structure.
- Empty: clear empty-state message and optional CTA.
- Error: inline error with retry if retryable.
- Default: readable row density, hover highlight, sortable headers if supported.
- Partial: render successful rows and a non-blocking warning if some data failed.

Accessibility:

- Native table markup for tabular data.
- `scope="col"` on headers.
- `aria-sort` on sortable columns.
- `aria-selected` for selectable rows.
- Keyboard access to sort and row actions.

---

## 11. Toast / Notification

```ts
interface ToastProps {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  onDismiss: (id: string) => void;
}
```

Rules:

- Success/info: `role="status"`, `aria-live="polite"`.
- Error/warning: `role="alert"`, `aria-live="assertive"`.
- `aria-atomic="true"` for complete announcement.
- Desktop position: bottom-right. Mobile: bottom-center.
- Maximum 3 visible toasts; queue the rest.
- Auto-dismiss pauses on hover/focus.
- Persistent errors require manual dismiss or recovery CTA.

---

## 12. Badge / Chip

```ts
interface BadgeProps {
  variant: 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  label: string;
  dot?: boolean;
  onRemove?: () => void;
}
```

Token references:

```text
success: bg --color-success-subtle, text --color-success, border --color-success
error:   bg --color-error-subtle,   text --color-error,   border --color-error
warning: bg --color-warning-subtle, text --color-warning, border --color-warning
info:    bg --color-info-subtle,    text --color-info,    border --color-info
```

Rules:

- Status must not rely on color alone when meaning is critical.
- Removable chips expose a keyboard-accessible remove button with an accessible label.

---

## 13. Skeleton Loader

Every async component must have a skeleton matching its visual footprint unless a different loading state is explicitly better.

```tsx
interface SkeletonProps {
  variant: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = ({ variant, width, height, lines = 1 }: SkeletonProps) => (
  <div
    role="status"
    aria-label="Loading..."
    className="animate-pulse bg-[var(--color-surface-sunken)] rounded-[var(--radius-sm)]"
    style={{ width, height }}
  />
);
```

Reduced-motion users must receive a non-animated or minimally animated skeleton.

---

## 14. Empty, Error, Permission, Timeout, and Retry Pattern

```ts
type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'empty'; message: string; action?: { label: string; onClick: () => void } }
  | { status: 'error'; error: { code: string; message: string; retryable?: boolean }; onRetry?: () => void }
  | { status: 'success'; data: T };
```

Rules:

- Empty states should explain what is missing and how to proceed.
- Error states should identify the problem in user language and offer recovery.
- Permission states should say what access is missing without exposing sensitive policy internals.
- Timeout states should allow retry and preserve user input.
- Retry states should avoid duplicate destructive actions.

---

## 15. Design and UX Rules

- Use semantic tokens for all visual values.
- Use type classes from `typography.md`.
- Provide visible hierarchy: headline, supporting copy, primary CTA, secondary action, content grid/list.
- Preserve power-user workflows and existing shortcuts during redesign.
- Validate mobile and desktop behavior.
- Avoid overflow, clipped dropdowns, unreadable popovers, and layout shift.
- Use concise microcopy from UX guidance for states and errors.

---

## 16. Verification Checklist Before PR

```text
[ ] Props interface defined in TypeScript
[ ] Variants and sizes map to tokens
[ ] All mandatory states implemented
[ ] Loading skeleton matches final footprint
[ ] Error/empty/permission/timeout/retry behavior defined where applicable
[ ] Focus visible state uses --shadow-focus or equivalent
[ ] ARIA attributes match component type
[ ] Keyboard navigation works
[ ] Responsive behavior validated at sm/md/lg/xl
[ ] Dark mode tokens applied if supported
[ ] Unit tests cover variants and states
[ ] Interaction tests cover keyboard and focus behavior
[ ] axe test passes
[ ] Visual regression or Storybook snapshot exists when applicable
```

<!-- SUPADUPA-TRANSFORMATION-2026-05-05 -->

## Supadupa Enhancement Layer

### Analysis
Analyzing all repository sources for UI Components supadupa-enhancement patterns...

This enhancement layer deepens the existing UI artifact with the newest repository-wide operating memory. It preserves all prior content and adds stronger instructions for source ingestion, append-only governance, production-ready asset generation, and QA-verifiable delivery.

### Added Capability
Adds component contract registry and visual regression gates.

### Mandatory Source Patterns To Apply
- Read governance and execution authority before implementation when present.
- Treat clear requests as execution instructions; avoid extra permission loops for non-destructive implied work.
- Ask before destructive deletion, irreversible overwrite, production deployment, external publishing, external messages, security-sensitive operations, or access-control-sensitive operations.
- Mine changelogs and coding lessons before changing templates or production assets.
- Preserve working behavior; compare at least two solution options when risk is non-trivial.
- Keep changelogs, build logs, lessons, and architectural notes append-only.
- Enforce Tailwind, shadcn/ui, Radix, Headline/CTA/Grid hierarchy, responsive breakpoints, focus states, and loading/empty/error/success states for user-facing assets.
- Require JSON schemas, React props, API envelopes, data invariants, and QA handoff where relevant.

### Supadupa Contract
~~~json
{
  "artifact": "UI Components",
  "source_files_analyzed": "all repository sources, with inventory reference",
  "non_regression": true,
  "append_only": true,
  "compatibility_links": ["docs/interface-contract-registry.md; qa-and-checks/visual-regression-checks.md"],
  "verification_required": ["reference check", "schema/interface check", "edge-state check", "qa handoff check"]
}
~~~

Before executing this enhancement, ensure docs/interface-contract-registry.md; qa-and-checks/visual-regression-checks.md are reviewed for compatibility.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/components2.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/components2.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Component Library Rules

## PURPOSE
This file defines the reusable component system so the AI builds consistent, predictable, and scalable UI instead of one-off visual fragments.

## CORE COMPONENT PHILOSOPHY
- Reuse before inventing.
- Composition over duplication.
- Predictable variants over special cases.
- Clean interfaces over overloaded components.
- Accessibility is part of the component, not an afterthought.

## STANDARD COMPONENT CATEGORIES
- Buttons.
- Inputs.
- Textareas.
- Selects.
- Comboboxes.
- Tabs.
- Cards.
- Tables.
- Forms.
- Dialogs.
- Drawers / Sheets.
- Navigation menus.
- Command palettes.
- Toasts / notifications.
- Badges / chips.
- Empty state blocks.
- Skeletons / loaders.
- Charts / dashboards if needed.

## COMPONENT BEHAVIOR REQUIREMENTS
Every component must define:
- Purpose.
- Variants.
- Default state.
- Disabled state.
- Loading state if relevant.
- Error state if relevant.
- Responsive behavior.
- Keyboard interaction.
- Accessibility label or semantic usage.
- Composition rules.
- When not to use it.

## SEARCH AND DISCOVERY COMPONENTS
For any searchable control, define:
- Input behavior.
- Debounce or submit mode.
- Suggestions rendering.
- Keyboard navigation.
- No-results behavior.
- Recent searches if relevant.
- Empty query behavior.
- Loading state.
- Retry or fallback behavior.
- Mobile adaptation.

Typical discovery components include:
- Search input.
- Combobox.
- Command menu.
- Filter chips.
- Faceted filter panels.
- Sort controls.
- Result count indicators.

## TABLE AND DATA DISPLAY COMPONENTS
For structured data views:
- Use tables when scanning and comparison matter.
- Provide sort, filter, and pagination behavior when needed.
- Define mobile fallback behavior.
- Consider collapsible rows, cards, or stacked rows on narrow screens.
- Use inline actions carefully.
- Avoid cluttered controls.

## FORM COMPONENT REQUIREMENTS
Forms must:
- Be easy to understand.
- Use labels and helper text.
- Validate clearly.
- Support error recovery.
- Work via keyboard.
- Preserve spacing rhythm.
- Avoid unnecessary friction.

## RULE FOR AI
When defining a component, always explain:
1. Why the component exists.
2. How it behaves.
3. Which states it supports.
4. How it adapts on mobile.
5. What tokens it uses.
6. Which other files it depends on.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_components.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_components.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Component Library Rules

## PURPOSE
This file defines the reusable component system so the AI builds consistent, predictable, and scalable UI instead of one-off visual fragments.

## CORE COMPONENT PHILOSOPHY
- Reuse before inventing.
- Composition over duplication.
- Predictable variants over special cases.
- Clean interfaces over overloaded components.
- Accessibility is part of the component, not an afterthought.

## STANDARD COMPONENT CATEGORIES
- Buttons.
- Inputs.
- Textareas.
- Selects.
- Comboboxes.
- Tabs.
- Cards.
- Tables.
- Forms.
- Dialogs.
- Drawers / Sheets.
- Navigation menus.
- Command palettes.
- Toasts / notifications.
- Badges / chips.
- Empty state blocks.
- Skeletons / loaders.
- Charts / dashboards if needed.

## COMPONENT BEHAVIOR REQUIREMENTS
Every component must define:
- Purpose.
- Variants.
- Default state.
- Disabled state.
- Loading state if relevant.
- Error state if relevant.
- Responsive behavior.
- Keyboard interaction.
- Accessibility label or semantic usage.
- Composition rules.
- When not to use it.

## SEARCH AND DISCOVERY COMPONENTS
For any searchable control, define:
- Input behavior.
- Debounce or submit mode.
- Suggestions rendering.
- Keyboard navigation.
- No-results behavior.
- Recent searches if relevant.
- Empty query behavior.
- Loading state.
- Retry or fallback behavior.
- Mobile adaptation.

Typical discovery components include:
- Search input.
- Combobox.
- Command menu.
- Filter chips.
- Faceted filter panels.
- Sort controls.
- Result count indicators.

## TABLE AND DATA DISPLAY COMPONENTS
For structured data views:
- Use tables when scanning and comparison matter.
- Provide sort, filter, and pagination behavior when needed.
- Define mobile fallback behavior.
- Consider collapsible rows, cards, or stacked rows on narrow screens.
- Use inline actions carefully.
- Avoid cluttered controls.

## FORM COMPONENT REQUIREMENTS
Forms must:
- Be easy to understand.
- Use labels and helper text.
- Validate clearly.
- Support error recovery.
- Work via keyboard.
- Preserve spacing rhythm.
- Avoid unnecessary friction.

## RULE FOR AI
When defining a component, always explain:
1. Why the component exists.
2. How it behaves.
3. Which states it supports.
4. How it adapts on mobile.
5. What tokens it uses.
6. Which other files it depends on.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_search_patterns.md -->

## Lossless Consolidation Import From AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_search_patterns.md

This imported source preserves search, filtering, discovery, and suggestion behavior inside the canonical UI component catalog. Search-specific UI generation should now enhance `components.md` rather than recreating a standalone search prompt.

# Search Patterns

## PURPOSE
This file defines how search, filtering, discovery, and suggestion-based interactions should work in a modern interface.

## SEARCH GOALS
- Help users find content quickly.
- Reduce friction in large datasets or feature-rich apps.
- Support keyboard-first discovery.
- Guide users when the result set is empty or unclear.

## CORE SEARCH PATTERNS

### 1. Global Search
Use global search when users need to discover across multiple categories or surfaces.
- Place it in a predictable, visible location.
- Keep it fast and responsive.
- Support recent searches if they improve efficiency.
- Provide suggestions while typing.
- Show clear empty or no-match behavior.

### 2. Contextual Search
Use contextual search inside a specific module, list, or page.
- Narrow the scope.
- Make the search purpose obvious.
- Keep filters close to the result set.
- Ensure search and filter states are easy to reset.

### 3. Combobox Search
Use comboboxes when the user must select from a searchable list.
- Show the input, options, and empty state clearly.
- Support keyboard navigation.
- Support loading suggestions.
- Support retry behavior when the source fails.
- Use helper text if the list is large or ambiguous.

### 4. Filtered Search
Use filter chips or faceted filters when narrowing is important.
- Make active filters visible.
- Make reset easy.
- Keep the number of filter interactions manageable.
- On mobile, collapse complex filters into a drawer or sheet.

## SEARCH DISCOVERY TEMPLATE RULES
When generating a search UI, the AI must explicitly define:
1. Search scope.
2. Search trigger behavior.
3. Suggestion behavior.
4. Filter behavior.
5. No-result behavior.
6. Loading behavior.
7. Error behavior.
8. Mobile adaptation.
9. Keyboard interaction.
10. Related components and tokens.

## NO-RESULT GUIDANCE
No-result states must not feel broken. They should confirm nothing matched, suggest alternate terms, offer related categories, offer clear next actions, and remain visually calm and easy to understand.

## PERFORMANCE GUIDANCE
If search can become large:
- Consider debounce.
- Consider virtualization.
- Consider pagination or infinite scroll.
- Consider cached recent searches.
- Consider query cancellation for fast typing.

## RULE FOR AI
Whenever the product includes search, discovery, or selection, this file must be read and its patterns applied explicitly through the canonical component catalog.

<!-- UI-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UI Rationalization Layer

Analyzing all repository sources for UI component patterns plus current public component-system standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ui/README.md`, `ui/tokens.md`, `ui/typography.md`, `ui/accessibility.md`, `ui/states.md`, `ui/responsive-rules.md`, `frontend/component_template.md`, and `ux/states.md`.

Components must be production assets, not visual fragments. Use shadcn/ui and Radix primitives when they cover the interaction pattern; own the generated source code, preserve typed APIs, and avoid modifying primitive semantics in ways that break keyboard or assistive-technology behavior. Every component must define anatomy, slots, variants, sizes, states, responsive behavior, accessible labels, controlled/uncontrolled rules, composition constraints, and test hooks.

Component contract:
```json
{
  "component": "string",
  "primitive": "button | input | dialog | popover | select | tabs | table | custom",
  "react_props": "type Props = { variant?: 'default' | 'secondary'; size?: 'sm' | 'md' | 'lg'; disabled?: boolean }",
  "tokens": ["string"],
  "states": ["default", "hover", "focus-visible", "active", "selected", "disabled", "loading", "error", "empty"],
  "a11y": {
    "semantic_element": "string",
    "accessible_name": "string",
    "keyboard": ["string"],
    "focus_management": "string"
  },
  "responsive": ["mobile", "tablet", "desktop"],
  "verification": ["unit", "interaction", "visual", "a11y"]
}
```

Rationalization rule: `components.md` owns component catalog guidance and now includes search/discovery patterns. Use `component_library_template.md` only when a prompt needs a full generation schema.

<!-- CODING-LESSONS-20260510-INGESTION -->

## Coding Lessons Ingestion - Complex UI Component Patterns

Source reviewed: `C:/Users/Lenovo/Downloads/codingLessonsLearnt (2).md`.

New UI component lessons to enforce:
- Radix `SelectItem` must not use an empty string as `value`; use a sentinel value such as `__all__`, `none`, or `unassigned`, then map it back to domain meaning at the boundary.
- When replacing a Radix `TabsList` with sidebar navigation, do not delete the existing tab triggers if the Tabs value mapping depends on them. Preserve them with `sr-only` when needed, and drive the same `value` contract from the new navigation.
- shadcn sidebar layouts must use a full-width root such as `min-h-screen flex w-full`; missing `w-full` can collapse layouts in Tailwind 4/sidebar compositions.
- Split-pane boards such as Gantt, timeline, spreadsheet, and schedule grids should prefer a single scroll container with sticky left cells, sticky top header, and a sticky top-left intersection cell over dual-container JavaScript scroll synchronization.
- Cross-row overlays such as dependency lines, today markers, and highlight bands should be one absolutely positioned SVG/div inside the scroll container, not fixed positioning and not one overlay per row.
- Diagrams, org charts, flowcharts, and mind maps should prefer a transform-based pan/zoom layer when infinite-canvas semantics are needed: outer `overflow: hidden`, inner `translate(x, y) scale(s)`, single pan/zoom state, and explicit zoom controls.
- Any draggable canvas with clickable children must distinguish drag from click with a small pixel threshold and capture-phase click suppression after drag.
- Complex visualizations need a `containerHeight` or viewport escape hatch from the start. Reuse the same component in a Radix Dialog for near-fullscreen mode instead of creating a separate fullscreen implementation.
- Premium or flagship nav items may use `data-[state=active]` variant classes for branded active state, but the styling must remain token-compatible and must not override global tab behavior.

Component-pattern contract:
```json
{
  "radix_constraints": {
    "select_item_empty_value_forbidden": true,
    "tabs_value_mapping_preserved": true
  },
  "layout_constraints": {
    "sidebar_root_full_width": true,
    "single_scroll_container_for_split_panes": true,
    "overlay_inside_scroll_container": true
  },
  "diagram_constraints": {
    "transform_pan_zoom": true,
    "drag_click_threshold_px": 6,
    "fullscreen_dialog_reuses_component": true
  }
}
```

