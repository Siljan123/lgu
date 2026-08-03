---
name: nuxt-component-extractor
description: Audit a Nuxt/Vue codebase for repeated UI markup, hard-coded Tailwind values, and inconsistent variations of the same UI concept, then generate real, production-ready .vue component files that use the project's design.md as a fixed, read-only source of truth for tokens. Use whenever the user wants to clean up duplicated component markup, turn repeated button/card/input/modal patterns into shared components, reconcile 2-3 different implementations of "the same" UI element, or systematize hard-coded colors/spacing/typography into an existing design system. Trigger on phrases like "my components are getting messy", "we have like 3 different button styles", "find what should be a shared component", "audit my Nuxt app for reusable components", or any request to extract, systematize, or de-duplicate Vue/Nuxt UI code — even without the word "extract". Do NOT use this to create a design.md from scratch or redesign the visual language; design.md is fixed input, never output.
---

# Nuxt Component Extractor

## What this skill does

Scans an existing Nuxt/Vue project, finds UI patterns worth systematizing, and generates the actual `.vue` component files for them — then refactors the places that duplicated the pattern to use the new component instead. It's a code-generation and refactoring skill, not a documentation skill.

**The one rule that overrides everything else: `design.md` is read-only.** It's the project's existing, already-decided source of truth for colors, spacing, typography, and shadows. This skill reads it constantly and never edits it, adds to it, or "fixes" it — even if you spot something in the codebase that arguably should become a new token. If a value doesn't map to anything in design.md, that's a finding to report, not a license to invent a token yourself.

## Step 1: Find and read design.md

Look in the project root first, then `docs/`, `design/`, and `.design/`. If it's genuinely missing, stop and ask the user where it lives — don't guess at tokens and don't create the file yourself. That would defeat the point of having a fixed source of truth.

Read it in full and build a working map before touching any code:
- Color tokens → their Tailwind class names (e.g. design.md says primary is `#3B82F6` mapped to `brand-500`, so the Tailwind class is `bg-brand-500` / `text-brand-500`)
- Spacing scale → matching Tailwind spacing utilities
- Typography scale (font sizes, weights, line-heights) → matching Tailwind classes
- Shadow/elevation tokens → matching Tailwind shadow classes
- Any component variants or naming conventions design.md already documents (sizes like `sm/md/lg`, variants like `primary/secondary/danger`)

Everything downstream depends on this map. A "hard-coded value" only counts as one if it fails to match something in this map — so get the map right first.

## Step 2: Scope the scan

Default to `components/`, `pages/`, and `layouts/` (Nuxt's convention), excluding `node_modules`, `.nuxt`, `.output`, `dist`, and `.git`. If the user names specific directories or pages, scan those instead. If the project is large, it's fine to do a first pass across everything and go deeper on the areas that show the most duplication.

Before generating anything, look at the existing `components/` directory (if one has real content already) to pick up the project's own conventions: `<script setup>` vs Options API, TypeScript vs plain JS (check for `.ts`/`lang="ts"` usage or a `tsconfig.json`), naming style (`BaseButton.vue` vs `Button.vue`), and whether components live flat or in subfolders (`components/ui/`, `components/base/`). New components should look like they belong, not like they were dropped in from a different codebase.

## Step 3: Find patterns

Work through all four categories — they catch different things and a pattern often shows up in more than one:

1. **Repeated components** — the same visual/structural element (button, card, badge, input+label group, modal overlay, avatar, empty state) rendered inline with near-identical markup in multiple files, instead of being its own component.
2. **Hard-coded values** — colors, spacing, font sizes, or shadows written as literal values instead of design.md's tokens: Tailwind arbitrary-value syntax (`bg-[#3B82F6]`, `text-[14px]`, `w-[220px]`), raw hex/rgb in `style="..."` attributes or `<style>` blocks, magic pixel numbers.
3. **Inconsistent variations** — multiple different implementations of what is semantically the same thing (three different class strings all being used as "the primary action button"). These are usually the highest-value finds because they're actively causing visual inconsistency right now.
4. **Reusable patterns beyond single components** — layout wrappers (page header + content area used on every page), composition patterns (a slot-based card shell used with different inner content), interaction patterns (the same loading/disabled/error-state handling copy-pasted around forms).

See `references/pattern-detection.md` for concrete grep patterns and search strategies for each category — read it before you start scanning rather than improvising regexes on the fly.

## Step 4: Assess value

Not every match is worth extracting. For each candidate, weigh:

| Question | Extract if... |
|---|---|
| Frequency | Used 3+ times, OR it's a fundamental UI primitive (button, input) likely to be reused even if only seen twice so far |
| Consistency win | Multiple current implementations would visually converge into one — this is real value, not just tidiness |
| Generality | It's a general-purpose pattern, not a one-off layout specific to a single page that will never recur |
| Maintenance cost vs. benefit | The abstraction is simpler than the duplication it replaces — don't wrap a single `<div class="mt-4">` in a component just because it repeats |

Drop anything that fails this bar rather than extracting it defensively. A shortlist of genuinely valuable extractions is more useful than a pile of components nobody will use. Keep a running note of what you rejected and why — it goes in the final report.

## Step 5: Generate the components

For each candidate that clears the bar, using `references/component-conventions.md` for the concrete SFC patterns:

- Name and place the file consistently with what you found in Step 2 (e.g. `components/ui/Button.vue` if that's the existing convention, `components/Button.vue` if the project is flat).
- Build props/slots from the *actual variation* you found — a `variant` prop with the values you actually saw in use, not a speculative full design-system API. Use slots for content that varies freely (button label, card body) and props for constrained variation (size, variant, disabled/loading state).
- Every color, spacing, typography, and shadow class in the new component must come from the design.md token map from Step 1. If a hard-coded value you're replacing doesn't cleanly match any token, don't silently pick the closest one and don't invent a new class — use the literal value as a last resort, add a short comment flagging it, and call it out clearly in the final report so the user can decide whether it belongs in their design system.
- Match the project's existing style (script setup vs options, TS vs JS, naming) rather than your own default preference.

## Step 6: Refactor the call sites

Extracting a component only pays off if the duplicated markup actually gets replaced. For every occurrence you identified in Step 3, swap the inline markup for the new component, mapping the old variable bits to props/slots and preserving all existing behavior — event handlers, `v-model` bindings, `v-if`/`v-for`, accessibility attributes. If one occurrence needs something the new component doesn't support yet, extend the component's prop API to cover it properly rather than leaving that one call site un-refactored or hacking around the component.

Because this touches multiple existing files, mention up front (once, not per-file) that the user should review the diff before committing — this skill assumes it's working in a project under version control.

## Step 7: Report

Close with a concise summary, not a wall of text:
- Which design.md tokens got used (confirms the read-only contract held)
- New component files created, with a one-line reason each
- Existing files modified and how many call sites were refactored in each
- Candidates you considered but rejected, with the one-line reason (frequency too low, too context-specific, etc.)
- Any hard-coded values that had no matching design.md token, flagged for the user's attention

## Guardrails

- Never write to design.md. Read-only, full stop, even if you're confident a value "should" become a new token.
- Never invent a design token that isn't already in design.md to paper over a mismatch — flag it instead.
- Don't extract something just because it's technically repeated twice if it's trivial or clearly context-specific; the value table in Step 4 exists to keep the output useful rather than exhaustive.
- Match existing project conventions over personal defaults — a new component that looks foreign to the rest of the codebase is a worse outcome than slightly duplicated markup.
