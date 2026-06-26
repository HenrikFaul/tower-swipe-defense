# UI Accessibility — Master Standard

> **Persona:** Senior Accessibility Engineer / UI Owner. Accessibility is a production requirement, not a post-launch audit. Inaccessible UI is a defect. Every interactive asset must meet WCAG 2.2 AA minimum, preserve keyboard access, expose correct semantics, and provide testable assistive-technology behavior.

Cross-reference: `ui/ai_instructions.md` | `ui/tokens.md` | `ui/typography.md` | `ui/components.md` | `../ux/states.md` | `../qa-and-checks/accessibility-checks.md`

---

## 1. Purpose

This file consolidates accessibility governance, detailed implementation patterns, and verification rules for the UI layer. It covers focus, keyboard behavior, ARIA, contrast, reduced motion, touch targets, responsive overflow, live regions, and screen reader validation.

---

## 2. Required Accessibility Contract

```json
{
  "owner": "ui",
  "asset_type": "accessibility-standard",
  "source_files_analyzed": ["ui/accessibility.md", "ui/accessibility_rules.md", "ui_2/accessibility.md"],
  "minimum_standard": "WCAG 2.2 AA",
  "interfaces": {
    "react_props": "type Props = { id: string; status?: 'idle' | 'loading' | 'empty' | 'success' | 'error'; ariaLabel?: string; error?: { code: string; message: string; retryable?: boolean } }",
    "json_schema": {},
    "state_contract": ["default", "hover", "active", "focus", "disabled", "loading", "empty", "success", "error"]
  },
  "verification": ["keyboard", "screen-reader", "axe", "contrast", "reduced-motion", "responsive-overflow"]
}
```

---

## 3. WCAG 2.2 AA Baseline

| Criterion | Requirement | Token / Approach |
|---|---|---|
| 1.4.3 Contrast, normal text | ≥ 4.5:1 | `--color-text-primary` on `--color-surface-base` |
| 1.4.3 Contrast, large text | ≥ 3:1 | Large text ≥ 18pt or 14pt bold |
| 1.4.11 Non-text contrast | ≥ 3:1 | Borders, icons, focus rings, controls |
| 2.1.1 Keyboard | All interactive functionality operable by keyboard | Native controls or explicit handlers |
| 2.4.1 Bypass blocks | Skip link on every app shell/page | `#main-content` target |
| 2.4.3 Focus order | Logical and predictable | DOM order follows visual order |
| 2.4.7 Focus visible | Clearly visible focus state | `--shadow-focus` or 3px outline |
| 2.4.11 Focus appearance | At least 3px indicator or equivalent | offset focus ring |
| 3.2.2 On input | No unexpected context changes | user-initiated changes only |
| 3.3.1 Error identification | Errors are textually identified | field error + `aria-invalid` |
| 4.1.2 Name, role, value | Correct semantics for all controls | native HTML first, ARIA second |

---

## 4. Focus Management

### 4.1 Global Focus Style

```css
:focus-visible {
  outline: 3px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.focusable:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.focusable-error:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-error);
}
```

Rules:

- Never remove focus outlines without an equal or stronger replacement.
- Focus must remain visible against all surfaces and in dark mode.
- Disabled elements are not focusable unless the component pattern explicitly requires discoverable disabled state.
- Focus order must follow the meaningful reading and interaction order.

### 4.2 Focus Trap

Required for modal, dialog, drawer, dropdown menu, command palette, and blocking overlays.

```tsx
import { useFocusTrap } from '@/hooks/useFocusTrap';

const Modal = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  const trapRef = useFocusTrap(isOpen);

  return (
    <div ref={trapRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};
```

Focus trap rules:

1. On open, focus the first meaningful focusable element or the close button.
2. Tab and Shift+Tab cycle within the trapped region.
3. Escape closes the surface unless the action is intentionally blocking and documented.
4. On close, restore focus to the trigger.
5. Background content must be inert or unreachable.

### 4.3 Skip Links

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-toast)] focus:bg-[var(--color-primary)] focus:text-[var(--color-text-on-primary)] focus:px-4 focus:py-2 focus:rounded-[var(--radius-md)]"
>
  Skip to main content
</a>
<main id="main-content">...</main>
```

Every page shell must provide a skip link before repeated navigation.

---

## 5. ARIA Patterns by Component

### 5.1 Buttons

```tsx
<button type="button" aria-label="Close sidebar">
  <XIcon aria-hidden="true" />
</button>

<button type="button" aria-pressed={isExpanded} aria-expanded={isExpanded}>
  {isExpanded ? 'Collapse' : 'Expand'}
</button>

<button type="button" aria-busy="true" aria-disabled="true" disabled>
  <Spinner aria-hidden="true" />
  <span>Saving...</span>
</button>
```

Rules:

- Icon-only buttons require `aria-label`.
- Toggle buttons require `aria-pressed` or `aria-expanded` according to behavior.
- Loading buttons preserve dimensions and announce status through visible text or live region.

### 5.2 Form Fields

```tsx
<div>
  <label htmlFor="email-input" className="type-label">
    Email address <span aria-hidden="true" className="text-[var(--color-error)]">*</span>
  </label>
  <input
    id="email-input"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-hint email-error"
    aria-invalid={hasError}
    value={value}
    onChange={handleChange}
  />
  <span id="email-hint" className="type-caption">We'll never share your email.</span>
  {hasError && (
    <span id="email-error" role="alert" className="type-caption text-[var(--color-error)]">
      Please enter a valid email address.
    </span>
  )}
</div>
```

Rules:

- Every input needs a programmatically linked label.
- Helper and error text must be referenced through `aria-describedby`.
- Error states require `aria-invalid` and visible non-color-only indication.

### 5.3 Navigation

```tsx
<nav aria-label="Primary navigation">
  <ul role="list">
    <li>
      <a href="/dashboard" aria-current={isActive ? 'page' : undefined}>Dashboard</a>
    </li>
  </ul>
</nav>
```

Use landmarks and distinct labels for repeated navigation regions.

### 5.4 Data Tables

```tsx
<table role="table" aria-label="User accounts">
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">
        <button type="button">Name <ArrowUpIcon aria-hidden="true" /></button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Alice Johnson</td></tr>
  </tbody>
</table>
```

Rules:

- Use native table markup for tabular data.
- Every sortable header exposes `aria-sort`.
- Row selection uses `aria-selected` and keyboard-accessible controls.

### 5.5 Live Regions

```tsx
<div role="status" aria-live="polite" aria-atomic="true">{statusMessage}</div>
<div role="alert" aria-live="assertive" aria-atomic="true">{errorMessage}</div>
<div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Upload progress: ${progress}%`} />
```

Use polite live regions for success/status updates and assertive regions for urgent errors.

---

## 6. Keyboard Navigation Matrix

| Component | Keys | Behavior |
|---|---|---|
| Button | Enter, Space | Activate |
| Link | Enter | Navigate |
| Dropdown/Menu | Enter/Space, Arrow Up/Down, Escape | Open, navigate, select, close |
| Date picker | Arrow keys, Enter, Escape | Navigate dates, select, close |
| Tabs | Arrow Left/Right, Home/End | Switch or focus tabs according to pattern |
| Accordion | Enter/Space, Arrow Up/Down | Toggle and navigate items |
| Dialog | Escape, Tab, Shift+Tab | Close where allowed; trap focus |
| Combobox | Type, Arrow Up/Down, Enter, Escape | Filter, navigate, select, close |
| Table with selection | Tab, Space, Shift+click equivalent | Reach controls and select rows |

---

## 7. Reduced Motion and Animation

- Respect `prefers-reduced-motion` globally.
- Avoid essential information conveyed only through motion.
- Do not animate focus movement in a way that hides current focus.
- Keep non-essential motion short and tokenized.
- Skeleton shimmer must be replaceable with static loading for reduced-motion users.

---

## 8. Touch Targets and Responsive Overflow

- Interactive target size should be at least 44×44 px where practical.
- Dense enterprise tables may use smaller visible controls only if the actual hit target remains accessible.
- Components must not require horizontal scrolling unless data structure makes it unavoidable and documented.
- Popovers, dropdowns, and tooltips must fit small screens and stay readable.
- Text must wrap without clipping at 200% zoom.

---

## 9. Screen Reader Testing Matrix

| Screen Reader | Browser / Platform | Priority |
|---|---|---|
| NVDA | Chrome / Windows | High |
| JAWS | Chrome / Windows | High |
| VoiceOver | Safari / macOS and iOS | High |
| TalkBack | Android | Medium |

Key scenarios:

1. Complete a form keyboard-only and screen-reader-only.
2. Navigate a data table and hear row/column context.
3. Open, navigate, and dismiss a modal.
4. Navigate a dropdown or combobox.
5. Receive and dismiss a toast notification.
6. Recover from validation errors without losing entered data.

---

## 10. Automated Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

CI should fail on new axe violations unless the exception is documented, temporary, and owned.

---

## 11. Verification Checklist

- [ ] Keyboard-only operation covers all interactive paths.
- [ ] Focus order and focus restore are correct.
- [ ] Visible focus passes contrast in light and dark mode.
- [ ] All icon-only controls have accessible names.
- [ ] Form errors are linked and announced.
- [ ] Loading, empty, error, success, timeout, retry, and permission states are covered.
- [ ] Motion respects reduced-motion settings.
- [ ] Screen reader scenarios were tested or specified.
- [ ] `axe` or equivalent automated accessibility test passes.
- [ ] No accessibility behavior was regressed during refactor.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Accessibility Rules

## Purpose
This guide defines production-grade rules for keyboard flow, focus order, accessible names, contrast, reduced motion, touch targets, and assistive technology states inside the Product-Engineering OS.

## Analysis
Analyzing all repository sources for Accessibility Rules patterns...

Source files analyzed:
AI_PROMPTING_FOLDERSTRUCTURE/ai_dev_system.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/error_handling.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/prompt_template_backend_api.md; AI_PROMPTING_FOLDERSTRUCTURE/backend/service_layer_template.md; AI_PROMPTING_FOLDERSTRUCTURE/build_log.md; AI_PROMPTING_FOLDERSTRUCTURE/database/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/database/migration_template.md; AI_PROMPTING_FOLDERSTRUCTURE/database/performance_tuning.md; AI_PROMPTING_FOLDERSTRUCTURE/database/schema_template.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/arch_diagrams.md; AI_PROMPTING_FOLDERSTRUCTURE/docs/prd_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/component_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/page_template.md; AI_PROMPTING_FOLDERSTRUCTURE/frontend/state_management.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/api_client_template.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/auth_protocols.md; AI_PROMPTING_FOLDERSTRUCTURE/integration/webhook_handler.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ab_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/qa_checklists.md; AI_PROMPTING_FOLDERSTRUCTURE/qa/unit_test_template.md; AI_PROMPTING_FOLDERSTRUCTURE/Refactoring masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_ai_prompting_structure.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/bootstrap_product_engineering_os.ps1; AI_PROMPTING_FOLDERSTRUCTURE/scripts/ci_cd_pipeline.md; AI_PROMPTING_FOLDERSTRUCTURE/scripts/linting_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/SYSTEM.md; AI_PROMPTING_FOLDERSTRUCTURE/UI Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/accessibility_rules.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/component_library_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ui/tokens.md; AI_PROMPTING_FOLDERSTRUCTURE/UX Masterprompt.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/ai_instructions.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/microcopy_guide.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/user_journey_template.md; AI_PROMPTING_FOLDERSTRUCTURE/ux/wizard_flow_template.md

The current repository contributes these standards: high-stakes production quality, zero functional regression, accessibility, responsive states, behavior preservation, data stability, rollback planning, test-first safety, and complete cross-folder traceability.

Before executing this, ensure ux/user_journey_template.md is reviewed for compatibility. Also read ../ai_dev_system.md and ui/ai_instructions.md.

## Required Contract
~~~json
{
  "owner": "ui",
  "focus": "keyboard flow, focus order, accessible names, contrast, reduced motion, touch targets, and assistive technology states",
  "source_files_analyzed": ["string"],
  "inputs": {},
  "outputs": {},
  "interfaces": {
    "json_schema": {},
    "react_props": "type Props = { id: string; status: 'loading' | 'empty' | 'success' | 'error' }"
  },
  "edge_cases": ["string"],
  "verification": ["string"],
  "compatibility": ["../ai_dev_system.md", "ui/ai_instructions.md", "ux/user_journey_template.md"]
}
~~~

## Production Rules
- Produce assets with complete lifecycle states, not partial notes.
- Preserve behavior unless a migration is named, justified, tested, and rollback-ready.
- Use typed interfaces for data, APIs, components, events, jobs, or docs.
- Where UI is involved, enforce Tailwind, shadcn/ui, Radix primitives, semantic tokens, accessible labels, focus states, responsive breakpoints, and loading/error/empty/success states.
- Where data or backend behavior is involved, enforce transactions, idempotency, validation, observability, retry semantics, and rollback strategy.
- Where QA is involved, convert requirements into executable checks and regression matrices.

## Error Handling
Cover validation failure, missing dependencies, unauthorized access, stale state, duplicate operations, timeouts, rate limits, partial writes, rollback failures, malformed external data, empty states, and user-visible recovery.

## Verification
Check references, schemas, prop contracts, accessibility, performance, regression coverage, and release readiness. A guide output is complete only if QA can verify it without private explanation.

## Compatibility References
- ../ai_dev_system.md
- ui/ai_instructions.md
- ux/user_journey_template.md

<!-- ENHANCEMENT-PASS-2026-05-05-NON-REGRESSION -->

## Recursive Enhancement Pass - Non-Regression Layer

### Self-Challenge Result
Analyzing all repository sources for ui patterns revealed that the existing Product-Engineering OS was structurally strong but could be deepened with newly discovered governance, editor-rule, changelog, coding-lesson, and framework-specific standards. This section augments the existing file without deleting or reducing any prior content.

### Newly Integrated Repository Paradigms
- Execution authority: treat clear user requests as execution instructions. Do not create permission loops for non-destructive governance, changelog, documentation, GitHub/Jira-supporting, or delivery-supporting artifacts when those actions are naturally implied.
- Mandatory confirmation boundary: ask before destructive deletion, irreversible overwrite, production deployment, external publishing, external messaging, security-sensitive changes, or access-control-sensitive work.
- Canonical read order: read governance/controller, execution authority rules, coding lessons, UI/UX rules when UI is affected, changelogs, latest versioning artifacts, the global OS controller, SYSTEM.md, and the local target instructions.
- Append-only knowledge: changelogs, coding lessons, build logs, governance history, and design/system decisions must be augmented rather than replaced. Never overwrite delivery history to make a clean narrative.
- Cursor/Continue integration: when .cursor, cursor/rules, .continue, or continue/rules are present, treat them as editor-enforced local governance. Mirror their standards into scripts/linting_rules.md and QA checks before changing generated assets.
- Prompt package discipline: prompt collections must include validated metadata such as name, description, type, slug, files, author, development process, categories, tags, tech stack, model, editor, and version. Slugs must be unique, hidden prompt-package files are invalid, and prompt packages should avoid nested structures unless explicitly supported.
- Framework standards: Next 15 and React 19 work should prefer App Router, Server Components by default, Client Components only for interaction, strict TypeScript, explicit props, route-level loading/error boundaries, Suspense where appropriate, minimal dependencies, and shadcn/ui components installed with the current 
px shadcn@latest add command.
- Design standards: preserve every working entrypoint, validate mobile and desktop layouts, prevent overflow and broken focus states, keep dropdowns readable, maintain usable CTAs/filters/dialogs/navigation, and make hierarchy follow business priority.
- Operational risk standards: compare at least two solution options when risk is non-trivial, choose the smallest regression-risk path, re-check previously working flows, update governance/changelog artifacts when naturally implied, and provide QA handoff.
- Changelog-derived lessons: use modular feature registries instead of single-purpose app shells, add SSRF/private-network guardrails for request tools, redact sensitive headers, cap timeouts, use cache: no-store when stale perception is harmful, and distinguish runtime-observed evidence from code-inferred evidence.
- Coding-lesson traps: align TypeScript interfaces with SQL columns, handle Supabase FK relation typing deliberately, prefer getUser() over trusting getSession() for auth-critical checks, avoid middleware redirect traps, avoid RLS policies that join across protected tables, validate provider-specific geospatial params, never mix bbox and point-radius casually, apply provider throttling/backoff, and avoid hard filters that zero out valid results.

### Required Enhancement Checklist
`json
{
  "repository_sources_analyzed": "all files listed in docs/repository_source_inventory.md",
  "non_regression": {
    "existing_content_preserved": true,
    "append_only_change": true,
    "working_features_rechecked": "required before handoff"
  },
  "execution_authority": {
    "execute_clear_requests": true,
    "ask_only_for_real_ambiguity_or_mandatory_confirmation": true,
    "update_related_governance_and_delivery_artifacts_when_implied": true
  },
  "interfaces": {
    "json_schema_required": true,
    "react_props_required_when_user_facing": true,
    "api_envelope_required_when_server_or_integration": true,
    "data_invariants_required_when_database": true
  },
  "qa": {
    "mobile_desktop_validation": true,
    "accessibility_focus_validation": true,
    "regression_matrix_required": true,
    "changelog_or_build_log_update_required": true
  }
}
`

### guide Application Rule
For this guide artifact, every future generated asset must explicitly state which newly discovered repository standards apply, which do not apply, and why. If a source class is absent in a future run, record that absence instead of silently assuming it does not matter.

<!-- UI-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UI Rationalization Layer

Analyzing all repository sources for UI accessibility patterns plus current public accessibility standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ui/README.md`, `ui/components.md`, `ui/states.md`, `ui/responsive-rules.md`, `ux/states.md`, and `qa-and-checks/accessibility-checks.md`.

Accessibility is a release gate. Follow WCAG 2.2, WAI-ARIA APG, and Radix accessibility expectations. Native elements are preferred; ARIA supplements semantics only when native HTML cannot express the pattern. Every custom interaction must define accessible name, role, value, keyboard model, focus entry/exit, escape behavior, pointer and touch behavior, announcement strategy, and high-contrast/reduced-motion behavior.

Accessibility contract:
```json
{
  "pattern": "string",
  "native_element_first": true,
  "role_name_value": "string",
  "keyboard_model": ["tab", "shift+tab", "enter", "space", "escape", "arrow_keys_if_applicable"],
  "focus_management": {
    "on_open": "string",
    "on_close": "string",
    "trap_required": false
  },
  "wcag_checks": ["keyboard", "focus_visible", "focus_not_obscured", "contrast", "target_size", "error_identification", "name_role_value"],
  "assistive_tech_notes": ["screen_reader", "voice_control"],
  "verification": ["manual_keyboard", "automated_a11y", "screen_reader_smoke"]
}
```

Rationalization rule: `accessibility.md` is the canonical accessibility owner. Legacy `accessibility_rules.md` is archive-only once its import marker is verified.

