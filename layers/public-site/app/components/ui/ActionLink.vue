<script setup lang="ts">
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { computed } from 'vue'
import { ArrowUpRight } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    label?: string
    to?: string | RouteLocationRaw
    href?: string
    target?: '_blank' | '_self' | '_parent' | '_top' | (string & {})
    external?: boolean
    rel?: string
    variant?: 'link' | 'button'
    icon?: Component | null
    iconClass?: string
  }>(),
  {
    variant: 'link',
    icon: () => ArrowUpRight,
    iconClass: 'size-4 opacity-70 group-hover:opacity-100',
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const isLink = computed(() => Boolean(props.to || props.href))
const linkTarget = computed(() => props.to || props.href)

const computedRel = computed(() => {
  if (props.rel) return props.rel
  if (props.target === '_blank') return 'noopener noreferrer'
  return undefined
})

const computedExternal = computed(() => {
  if (typeof props.external === 'boolean') return props.external
  if (props.target === '_blank') return true
  return undefined
})

function handleClick(event: MouseEvent) {
  emit('click', event)
}

const baseClasses =
  'group inline-flex items-center gap-2 font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const variantClasses = computed(() =>
  props.variant === 'button'
    ? 'px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs hover:shadow-sm active:scale-[0.98]'
    : 'text-xs text-foreground/80 hover:text-foreground hover:underline underline-offset-4'
)
</script>

<template>
  <NuxtLink
    v-if="isLink"
    :to="linkTarget!"
    :target="target"
    :external="computedExternal"
    :rel="computedRel"
    :class="[baseClasses, variantClasses]"
    @click="handleClick"
  >
    <slot>
      <span>{{ label }}</span>
    </slot>
    <component
      v-if="icon"
      :is="icon"
      :class="['shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5', iconClass]"
      aria-hidden="true"
    />
  </NuxtLink>

  <button
    v-else
    type="button"
    :class="[baseClasses, variantClasses]"
    @click="handleClick"
  >
    <slot>
      <span>{{ label }}</span>
    </slot>
    <component
      v-if="icon"
      :is="icon"
      :class="['shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5', iconClass]"
      aria-hidden="true"
    />
  </button>
</template>


