---
name: org-chart-vue3
description: Use when building, editing, styling, or animating any organizational structure chart (elected officials, department/office hierarchy, barangay officials, or any other org chart) with the organization-chart-vue3 package in a Nuxt/Vue project — covers composable-based data fetching, centering, the global-CSS override pattern, collapse/expand animation, entrance animation, and connector-line/arrow styling.
allowed-tools: Read, Write, Edit, Bash
---

# organization-chart-vue3 in Nuxt

This applies to any org chart instance built with this library — an elected officials chart, a department/office structure chart (e.g. "Organizational Structure of the Municipality of San Francisco"), a barangay officials chart, etc. The patterns below are the same regardless of what the tree represents.

## How the library actually renders

- The whole tree is a real `<table>` (nested one level deeper per generation), **not** flex/divs. This matters for two things:
  - Tables shrink-wrap to content width — a `w-full` wrapper does **not** center it.
  - `:nth-child`/nesting-depth selectors work reliably for per-level styling, since each generation is genuinely nested one `.org-node` deeper.
- Each node = `.org-node > .org-container` containing `.org-title` (header bar) + `.org-content` (the person/detail card).
- **Collapse/expand does not use `v-if` or `display:none`.** It toggles an inline `style="visibility: hidden/visible"` on the children `<tr>`, and adds/removes a `.org-extend` class on the toggle button's parent `<td>`. Two consequences:
  - The row's layout space stays reserved either way — collapsing never causes a height jump in siblings.
  - You can hook animations off `.org-extend` with `:has()`; you don't need to patch the component or listen for a `toggle` event.

## Data fetching — composable required once real/dynamic data exists

The chart component itself stays presentational: it takes `treeRoot` / `pending` / `error` as props and never calls `useAsyncData`, Supabase, or fetch directly — that's true whether it's showing elected officials, a department structure, barangay officials, or any other org chart instance.

- **No real backend yet?** Static placeholder data can live directly in the composable's return — that's fine as a starting point.
- **Real/dynamic data available (a Supabase table, an API)?** The fetch must go through the composable's `useAsyncData` call. Never fetch inline in the component, never fetch inline in the page and pass raw data down — the composable is the one place that knows where the data comes from.

```ts
export function useOrganizationalStructure() {
  return useAsyncData('organizational-structure', async (): Promise<OrganizationChartNode> => {
    // static placeholder — fine until a real table exists
    return { title: 'Municipal Mayor', member: [...], children: [...] }

    // real/dynamic data — uncomment once available
    // const supabase = useSupabaseClient()
    // const { data, error } = await supabase.from('org_units').select('*')
    // if (error) throw error
    // return buildOrgTree(data)
  })
}
```

Page/component just consumes it:

```vue
<script setup lang="ts">
const { data: treeRoot, pending, error } = await useOrganizationalStructure()
</script>
```

Copy `reference/useOrganizationalStructure.example.ts` and rename per instance (e.g. `useElectedOfficials`, `useDepartmentStructure`, `useBarangayOfficials`) rather than writing a new fetch from scratch each time.

## Centering

`w-full` on the wrapper does nothing (see above). Use flex + a scroll container instead, since wide trees (many siblings) will overflow on smaller screens:

```vue
<div class="flex justify-center overflow-x-auto">
  <OrganizationChart :data="treeRoot" @select="handleSelect">
    <template #member="{ member }">...</template>
  </OrganizationChart>
</div>
```

## Styling: never edit node_modules, never use `:deep()` for this

`organization-chart-vue3/style.css` is global, unscoped CSS — there's no CSS-module collision to pierce, so `:deep()` in a scoped SFC just adds unnecessary specificity. Instead:

1. Keep a project-owned override stylesheet — see `reference/org-chart-overrides.css` in this skill for a complete, commented, ready-to-copy version covering everything below.
2. Load it **after** the library's own stylesheet so it wins on equal specificity:

```ts
// nuxt.config.ts
css: [
  'organization-chart-vue3/style.css',
  '~/assets/css/org-chart-overrides.css'
]
```

3. When overriding a rule that already has a `transform` (the connector-line pseudo-elements do, for positioning), **combine** it with any transform you animate rather than replacing it — e.g. `transform: translate(-1px) scaleY(0)`, not just `scaleY(0)`. Overwriting drops the positioning offset and misaligns the lines.

## Collapse/expand animation (pure CSS, no component changes)

Cross-fade + scale, keyed off the `.org-extend` class via `:has()`, with `@starting-style` so the inline `visibility` toggle itself can animate instead of snapping:

```css
@media (prefers-reduced-motion: no-preference) {
  .org-table > tbody > tr + tr {
    transform-origin: top center;
    transition: opacity .3s ease, transform .3s cubic-bezier(.4,0,.2,1),
      visibility .3s ease allow-discrete;
    transition-behavior: allow-discrete;
  }
  .org-table > tbody > tr:not(:has(> td.org-extend)) + tr {
    opacity: 0; transform: scale(.85);
  }
  .org-table > tbody > tr:has(> td.org-extend) + tr {
    opacity: 1; transform: scale(1);
  }
  @starting-style {
    .org-table > tbody > tr:has(> td.org-extend) + tr {
      opacity: 0; transform: scale(.85);
    }
  }
}
```

Needs Chrome/Edge 117+, Safari 17.4+, Firefox 129+ for `:has()` + `@starting-style`. Older browsers just fall back to the instant toggle — no breakage, just no animation.

## Entrance animation (stagger by tree depth)

No depth prop is exposed, so stagger via nesting-depth selector specificity instead — each level down matches a more specific (and thus winning) rule:

```css
.org-node { animation: org-fade-in-up .45s ease-out both; animation-delay: .05s; }
.org-node .org-node { animation-delay: .25s; }
.org-node .org-node .org-node { animation-delay: .45s; }
```

Add one more `.org-node .org-node .org-node .org-node` tier (delay ~.65s) if a chart ever grows a 4th generation.

## Toggle arrow sizing

Default glyph is a 10px box with a 2px border-corner trick (`border-color: X X transparent transparent; transform: rotate(...)`) — reads as a faint diagonal sliver at normal zoom, not a clear caret. Bump both size and border together, and **recompute the centering `translate()` offset**: it must equal `-(width/2 + padding)` or the arrow drifts off the connector line. See `reference/org-chart-overrides.css` section 6 for known-good values (16px glyph, 3px border, `translate(-18px)`).

## Reference files

- `reference/org-chart-overrides.css` — the complete, working stylesheet: base styles reorganized into readable sections, plus centering, entrance animation, collapse/expand animation, and arrow sizing all wired up and commented. Copy it in wholesale for any org chart instance and adjust colors/timing to taste rather than rebuilding from scratch.
- `reference/useOrganizationalStructure.example.ts` — the composable data-fetching pattern above, generic (not tied to any one org's data). Copy and rename per chart instance.
