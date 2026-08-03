# Component generation conventions

Concrete guidance for Step 5 (generating the actual `.vue` files) once a candidate has cleared the value bar.

## File placement and naming

Nuxt auto-imports everything under `components/`, so new files don't need manual registration or import statements anywhere. Match whatever convention the existing `components/` directory already shows:

- Flat (`components/Button.vue`) vs. subfoldered (`components/ui/Button.vue`, `components/base/BaseButton.vue`) — mirror it exactly, don't introduce a new subfolder scheme.
- PascalCase filenames matching the component's intended tag name (`Button.vue` → `<Button />`, or `<UiButton />` if nested under `ui/` and the project uses Nuxt's folder-prefix convention).
- If the project has zero existing components to pattern-match against, default to a flat `components/` structure with plain PascalCase names — simplest thing that works.

## Script style

Detect and match:
- **Composition API with `<script setup>`** is the Nuxt 3 default and should be your default assumption unless the codebase clearly uses the Options API elsewhere.
- **TypeScript vs. JS**: check for `lang="ts"` on existing `<script>` blocks, or a `tsconfig.json` / `.ts` files in the project. Use `defineProps<{...}>()` with a TS interface when the project is TS; use `defineProps({...})` with runtime validation when it's JS.

## Props vs. slots

- **Props** for constrained variation — anything with a fixed, small set of valid values you actually observed (`variant: 'primary' | 'secondary' | 'danger'`, `size: 'sm' | 'md' | 'lg'`, boolean flags like `disabled`/`loading`).
- **Slots** for free-form content (button label, card body, modal footer actions). Don't turn content into a `label` prop if the original usages sometimes had icons or multi-element content inside — that needs a slot, not a string prop.
- Only add a prop value if you actually saw it in use. Don't pre-build a `danger` variant nobody uses yet just because it seems like a natural addition — that's speculative API surface the report should not claim credit for.

## Example shape (Tailwind + script setup + TS)

```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'rounded-md font-medium transition-colors',
      variant === 'primary' && 'bg-brand-500 text-white hover:bg-brand-600',
      variant === 'secondary' && 'bg-slate-100 text-slate-900 hover:bg-slate-200',
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-base',
      size === 'lg' && 'px-5 py-2.5 text-lg',
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
  >
    <slot />
  </button>
</template>
```

Every class in the array above should trace back to a token in design.md's map (color names, spacing scale, font sizes) — this example assumes `brand-500`/`brand-600` and the default Tailwind spacing/font scale are already what design.md documents. If design.md defines its own spacing or font scale instead of Tailwind's defaults, use those class names instead.

## Refactoring call sites (Step 6)

When swapping inline markup for the new component:
- Map old classes/attributes to the closest matching prop value; don't leave a stray `class="..."` on the component instance to patch over a gap — that's a sign the component's prop API is missing something and should be extended instead.
- Preserve `v-model`, event handlers (`@click`, etc.), `v-if`/`v-for`, and accessibility attributes exactly.
- If a call site has extra one-off styling that doesn't fit any prop and isn't worth generalizing, that's a signal this particular occurrence might not have been a true match for the pattern — leave it as-is rather than forcing it, and note the exception in the final report.
