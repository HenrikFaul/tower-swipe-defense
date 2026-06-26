# Typography System — Master Specification

> **Persona:** Senior Design Systems Engineer. Typography is information hierarchy made visible. Every text decision must map to a defined scale, semantic role, accessibility requirement, and responsive behavior. No ad-hoc font sizes, line heights, weights, or letter spacing.

Cross-reference: `ui/tokens.md` | `ui/components.md` | `ui/accessibility.md` | `../ux/messaging.md`

---

## 1. Purpose

This file defines the canonical typography system for the UI layer: font stacks, type scale, semantic text styles, responsive behavior, loading skeleton alignment, and accessibility constraints.

Typography must support:

- quick scanning and strong visual hierarchy;
- readable body copy and UI labels;
- consistent component implementation;
- accessible contrast, line length, and heading order;
- stable skeleton states that match final layout dimensions;
- localization and content expansion without overflow.

---

## 2. Font Stack

```css
:root {
  /* Display / Heading — hero text, page titles, high-emphasis marketing surfaces */
  --font-display: 'Fraunces', 'Georgia', serif;

  /* Body — all product UI, paragraphs, form labels, navigation */
  --font-body: 'DM Sans', 'system-ui', '-apple-system', sans-serif;

  /* Monospace — code, IDs, technical values */
  --font-mono: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
}
```

Rationale:

- `Fraunces`: expressive optical-size-aware serif for high-emphasis display use.
- `DM Sans`: modern humanist/geometric sans with strong small-size readability.
- `Fira Code`: technical string readability and code-friendly glyphs.

Fallback rule: if project brand guidelines provide different fonts, replace the font aliases but preserve the semantic roles.

---

## 3. Type Scale

```css
:root {
  /* Minor Third scale */
  --text-xs:   0.75rem;    /* 12px — captions, metadata */
  --text-sm:   0.875rem;   /* 14px — labels, secondary content */
  --text-base: 1rem;       /* 16px — body text */
  --text-md:   1.125rem;   /* 18px — lead text */
  --text-lg:   1.25rem;    /* 20px — section headers, card titles */
  --text-xl:   1.5rem;     /* 24px — page subheadings */
  --text-2xl:  1.875rem;   /* 30px — page headings */
  --text-3xl:  2.25rem;    /* 36px — section display */
  --text-4xl:  3rem;       /* 48px — hero headings */
  --text-5xl:  3.75rem;    /* 60px — large display */
  --text-6xl:  4.5rem;     /* 72px — maximum display */

  --leading-tight:   1.25;
  --leading-snug:    1.375;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;
  --leading-loose:   2;

  --weight-light:    300;
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
  --weight-black:    900;

  --tracking-tight:  -0.025em;
  --tracking-normal:  0;
  --tracking-wide:    0.025em;
  --tracking-wider:   0.05em;
  --tracking-widest:  0.1em;
}
```

---

## 4. Semantic Type Styles

Apply predefined combinations. Do not mix arbitrary values.

```css
.type-display-lg {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  line-height: var(--leading-tight);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
}

.type-display-fluid {
  font-family: var(--font-display);
  font-size: clamp(var(--text-2xl), 5vw, var(--text-5xl));
  line-height: var(--leading-tight);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-tight);
}

.type-h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  line-height: var(--leading-tight);
  font-weight: var(--weight-bold);
}

.type-h2 {
  font-family: var(--font-body);
  font-size: var(--text-2xl);
  line-height: var(--leading-snug);
  font-weight: var(--weight-semibold);
}

.type-h3 {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  line-height: var(--leading-snug);
  font-weight: var(--weight-semibold);
}

.type-h4 {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  line-height: var(--leading-normal);
  font-weight: var(--weight-medium);
}

.type-body-lg {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: var(--leading-relaxed);
  font-weight: var(--weight-regular);
}

.type-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  font-weight: var(--weight-regular);
}

.type-body-sm {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  font-weight: var(--weight-regular);
}

.type-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-tight);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
}

.type-caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  line-height: var(--leading-normal);
  font-weight: var(--weight-regular);
  color: var(--color-text-secondary);
}

.type-overline {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
}

.type-code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}
```

---

## 5. Semantic Usage Matrix

| Role | Use For | Required Style | Notes |
|---|---|---|---|
| Display | Hero and campaign surfaces | `.type-display-lg` or `.type-display-fluid` | Avoid in dense app views. |
| H1 | Page title | `.type-h1` | One visible H1 per page unless app shell requires exception. |
| H2 | Major section | `.type-h2` | Preserve document outline. |
| H3/H4 | Subsections and card groups | `.type-h3`, `.type-h4` | Do not skip heading levels for visual size. |
| Body | Main readable copy | `.type-body` | 16px minimum. |
| Body small | Secondary supporting copy | `.type-body-sm` | Avoid for long paragraphs. |
| Label | Form labels and field names | `.type-label` | Must be linked to control. |
| Caption | Metadata, hints, helper text | `.type-caption` | Must remain contrast-compliant. |
| Overline | Short category labels | `.type-overline` | Not for paragraphs or body text. |
| Code | Code, tokens, IDs | `.type-code` | Allow wrapping for long strings. |

---

## 6. Accessibility Requirements

- Minimum body text size is `16px / 1rem`.
- Normal text contrast must be at least 4.5:1.
- Large text contrast must be at least 3:1.
- Recommended line length is 45–75 characters; use `max-width: 65ch` for prose.
- Do not justify text.
- Avoid all-caps body text; use `.type-overline` only for short labels.
- Do not skip heading hierarchy for styling. Use CSS classes to adjust visual size while preserving semantic headings.
- Error text must be programmatically associated with the relevant control.
- Text must support zoom to 200% without clipping or loss of content.

---

## 7. Responsive Typography

```css
.type-display-fluid {
  font-size: clamp(var(--text-2xl), 5vw, var(--text-5xl));
}
```

Implementation guidance:

```tsx
<h1 className="type-display-fluid text-[var(--color-text-primary)]">
  Product headline
</h1>
```

Responsive rules:

- Prefer fluid display text for marketing sections.
- Use fixed semantic classes for dense application surfaces.
- At mobile widths, verify no orphaned headings, horizontal overflow, or clipped controls.
- Account for localization expansion of 30–50%.

---

## 8. Loading State Typography

Skeletons must match the eventual type hierarchy to prevent layout shift.

```tsx
<div className="animate-pulse" role="status" aria-label="Loading content">
  <div className="h-[var(--text-2xl)] bg-[var(--color-surface-sunken)] rounded-[var(--radius-sm)] w-2/3 mb-[var(--spacing-4)]" />
  <div className="h-[var(--text-base)] bg-[var(--color-surface-sunken)] rounded-[var(--radius-sm)] w-full mb-[var(--spacing-2)]" />
  <div className="h-[var(--text-base)] bg-[var(--color-surface-sunken)] rounded-[var(--radius-sm)] w-5/6" />
</div>
```

---

## 9. Copy and Messaging Alignment

Typography must reinforce UX messaging:

- High-emphasis copy receives hierarchy, not arbitrary color hacks.
- Error and warning copy must be concise and action-oriented.
- Helper text should explain constraints before validation fails.
- CTA labels must be scannable and verb-led.
- Long empty-state text should use body styles and a clear CTA hierarchy.

---

## 10. Verification Checklist

- [ ] All text uses semantic type styles or mapped design tokens.
- [ ] Heading order is valid in DOM and visual hierarchy.
- [ ] Body copy is at least 16px.
- [ ] Captions and helper text pass contrast.
- [ ] Long strings wrap safely.
- [ ] UI supports 200% zoom.
- [ ] Loading skeletons match final typographic footprint.
- [ ] Responsive typography checked at mobile, tablet, desktop, and wide desktop.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/typography2.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/typography2.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Typography System

## PURPOSE
This file defines how text should behave so the product stays readable, polished, and structurally clear.

## TYPOGRAPHIC GOALS
- Headlines must express the main idea quickly.
- Subheadlines must support the main idea without competing.
- Body text must be easy to scan and comfortable to read.
- Labels and helper text must be subtle but legible.
- Error and status messages must be concise and actionable.

## TYPOGRAPHY RULES
- Use a clear hierarchy with a limited number of text levels.
- Do not overuse font weight changes.
- Use line-height deliberately for readability.
- Keep paragraph widths readable on large screens.
- Avoid small text that becomes illegible on mobile.
- Make headings short when possible.
- Use sentence case where it improves clarity.
- Use emphasis sparingly and intentionally.

## TEXT LEVELS
Define a small set of text roles such as:
- Display.
- Page title.
- Section title.
- Card title.
- Body.
- Secondary body.
- Caption.
- Helper text.
- Label.
- Error text.
- Microcopy.

## RESPONSIVE TYPOGRAPHY
- Scale type gracefully across breakpoints.
- Prevent text from dominating small layouts.
- Prevent text from becoming too sparse on large screens.
- Preserve balance between headline, supporting copy, and CTA blocks.
- Keep labels and helper text readable on touch devices.

## WRITING IMPACT INTO UI
Typography should help the interface feel:
- Clear.
- Calm.
- Premium.
- Trustworthy.
- Fast to understand.
- Easy to use on first interaction.

## RULE FOR AI
When generating pages or components, always specify:
- Which text levels are used.
- Why each level exists.
- How text behaves on mobile and desktop.
- How copy supports hierarchy and conversion.

<!-- LOSSLESS-CONSOLIDATION-IMPORT: AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_typography.md -->

## Lossless Consolidation Import From `AI_PROMPTING_FOLDERSTRUCTURE/ui/ui_typography.md`

This section preserves unique and potentially unique source content during the 2026-05-08 folder-by-folder consolidation pass. It was imported append-only so no instruction, edge case, example, table row, code block, warning, implementation note, or nuance is lost. Exact duplication can be removed only after a section-by-section proof confirms no unique meaning remains.

# Typography System

## PURPOSE
This file defines how text should behave so the product stays readable, polished, and structurally clear.

## TYPOGRAPHIC GOALS
- Headlines must express the main idea quickly.
- Subheadlines must support the main idea without competing.
- Body text must be easy to scan and comfortable to read.
- Labels and helper text must be subtle but legible.
- Error and status messages must be concise and actionable.

## TYPOGRAPHY RULES
- Use a clear hierarchy with a limited number of text levels.
- Do not overuse font weight changes.
- Use line-height deliberately for readability.
- Keep paragraph widths readable on large screens.
- Avoid small text that becomes illegible on mobile.
- Make headings short when possible.
- Use sentence case where it improves clarity.
- Use emphasis sparingly and intentionally.

## TEXT LEVELS
Define a small set of text roles such as:
- Display.
- Page title.
- Section title.
- Card title.
- Body.
- Secondary body.
- Caption.
- Helper text.
- Label.
- Error text.
- Microcopy.

## RESPONSIVE TYPOGRAPHY
- Scale type gracefully across breakpoints.
- Prevent text from dominating small layouts.
- Prevent text from becoming too sparse on large screens.
- Preserve balance between headline, supporting copy, and CTA blocks.
- Keep labels and helper text readable on touch devices.

## WRITING IMPACT INTO UI
Typography should help the interface feel:
- Clear.
- Calm.
- Premium.
- Trustworthy.
- Fast to understand.
- Easy to use on first interaction.

## RULE FOR AI
When generating pages or components, always specify:
- Which text levels are used.
- Why each level exists.
- How text behaves on mobile and desktop.
- How copy supports hierarchy and conversion.

<!-- UI-INTERNET-TUNED-RATIONALIZATION-2026-05-10 -->

## Internet-Tuned UI Rationalization Layer

Analyzing all repository sources for UI typography patterns plus current public UI standards. Before executing this file, review `../ai_dev_system.md`, `../SYSTEM.md`, `ui/README.md`, `ui/tokens.md`, `ui/components.md`, `ux/copy-rules.md`, `ux/messaging.md`, and `qa-and-checks/accessibility-checks.md`.

Typography must support comprehension before style. Define semantic type roles, not isolated font sizes. Each role must specify token mapping, line-height, weight, allowed usage, wrapping behavior, truncation rules, responsive behavior, skeleton/loading behavior, localization risk, and contrast expectations. Do not use viewport-scaled font sizes or negative letter spacing unless a verified brand system requires it and accessibility remains intact.

Typography contract:
```json
{
  "role": "display | h1 | h2 | h3 | body | small | label | helper | code | metric",
  "token_mapping": "string",
  "line_height": "string",
  "weight": "string",
  "max_line_length": "string",
  "responsive_behavior": "string",
  "overflow_strategy": "wrap | clamp | truncate_with_tooltip | resize_container",
  "accessibility": ["contrast", "zoom_200", "no_overlap", "readable_line_height"],
  "usage": ["allowed surfaces"],
  "anti_patterns": ["string"]
}
```

Rationalization rule: `typography.md` is the only active root file for type scale and text rendering behavior. Copy intent belongs in `ux/copy-rules.md`; visual text styling belongs here.

