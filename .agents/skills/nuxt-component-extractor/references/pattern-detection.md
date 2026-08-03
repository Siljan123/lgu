# Pattern detection strategies

Concrete ways to find each of the four categories from SKILL.md Step 3. Use `grep`/`rg` across the scoped directories rather than reading every file top to bottom — the goal is to find candidates fast, then read the surrounding context for the ones that look promising.

## 1. Repeated components

There's no single regex for "this looks like a button used five different places" — it's a structural match, not a text match. Practical approach:

- Grep for the tag + class combinations that tend to mark UI primitives: `<button`, `class="[^"]*rounded`, `class="[^"]*shadow`, `class="[^"]*px-`, role/aria attributes (`role="dialog"`, `role="alert"`).
- For each hit, extract the class string and compare it against other hits. Near-identical class sets (even with 1-2 classes different, e.g. a different color) are strong evidence of the same component appearing with drift, which also feeds the "inconsistent variations" search.
- Look at plain `<div>` blocks with a consistent shape (e.g. always `rounded-lg shadow p-4` wrapping a heading + body) — that shape recurring across files is a card pattern even without a shared class name.
- Count occurrences per pattern as you go; you'll need this for the Step 4 value assessment.

```bash
rg -n --type vue "class=\"[^\"]*rounded" components/ pages/ layouts/
rg -n "role=\"(dialog|alert|status)\"" --type vue
```

## 2. Hard-coded values

These are mostly regex-findable directly.

**Tailwind arbitrary values** (the `[...]` bracket syntax bypasses the design system entirely):
```bash
rg -n "\b(bg|text|border|shadow|w|h|p|m|gap)-\[[^\]]+\]" --type vue
```

**Raw hex/rgb colors** in inline styles or `<style>` blocks:
```bash
rg -n "#[0-9a-fA-F]{3,8}\b" --type vue
rg -n "rgba?\(" --type vue
```

**Inline `style` attributes** (almost always a sign something should be a class from the token set instead):
```bash
rg -n "style=\"" --type vue
```

**Magic pixel/rem numbers inside `<style>` blocks** — harder to regex cleanly; when you find a `<style>` block, scan it by eye for numeric literals in `padding`, `margin`, `font-size`, `gap`, `border-radius` that aren't `0` and don't obviously come from a CSS variable.

For every hit, check it against the design.md token map from Step 1 before deciding it's actually "hard-coded" — a value that happens to equal a token's value but is written literally still counts (it should be using the token class), but a value that has no equivalent in design.md at all is the more interesting finding to flag in the final report.

## 3. Inconsistent variations

This is a diffing exercise, not a search:

- Group the "repeated component" hits from category 1 by apparent semantic role (e.g. everything that looks like it's meant to be a primary action button).
- Within a group, compare the class strings. Different implementations of the same role usually differ in exactly the properties that matter (background color, padding, font-weight, border-radius) while sharing enough structure to reveal they're meant to be the same thing.
- These are usually the highest-priority extractions since they represent active, visible inconsistency rather than just DRY-ness — call them out distinctly in the report rather than folding them into "repeated components."

## 4. Reusable patterns beyond single components

- **Layout wrappers**: check `pages/*.vue` files for a shared opening/closing structure (same header markup, same content-area wrapper classes) repeated near-verbatim across many pages.
- **Composition patterns**: look for a shell (often a `<div>` with consistent card/panel classes) that always wraps a `<slot />` with different content per usage — this is evidence a slot-based component already exists conceptually in the markup, just not extracted.
- **Interaction patterns**: search for repeated conditional blocks handling the same concern in multiple forms/components — loading spinners tied to a boolean, disabled-state styling, error message rendering tied to a validation object.

```bash
rg -n "<slot" --type vue
rg -n "v-if=\"(loading|isLoading|pending)\"" --type vue
```
