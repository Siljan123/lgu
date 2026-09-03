<script setup lang="ts">
import { computed } from 'vue'
import { CalendarRange, Plus, Pencil, Trash2, Star, Filter } from '@lucide/vue'
import type { BarangayTerm } from '../../composables/useBarangayDirectory'

const props = withDefaults(
  defineProps<{
    terms?: BarangayTerm[]
    selectedTermId?: string
    isAdmin?: boolean
  }>(),
  {
    terms: () => [],
    selectedTermId: '',
    isAdmin: false
  }
)

const emit = defineEmits<{
  (e: 'select', termId: string): void
  (e: 'add'): void
  (e: 'edit', term: BarangayTerm): void
  (e: 'delete', term: BarangayTerm): void
}>()

const selectedTerm = computed<BarangayTerm | undefined>(
  () => props.terms.find(t => t.id === props.selectedTermId) || props.terms[0]
)

const dateRange = computed(() => {
  const t = selectedTerm.value
  if (!t) return ''
  const fmt = (d?: string | null) => {
    if (!d) return null
    const dt = new Date(d)
    return Number.isNaN(dt.getTime())
      ? null
      : dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  const start = fmt(t.start_date)
  const end = fmt(t.end_date)
  if (start && end) return `${start} – ${end}`
  return start || end || ''
})

const canDelete = computed(() => props.terms.length > 1)

function onSelect(e: Event) {
  const value = (e.target as HTMLSelectElement).value
  if (value) emit('select', value)
}
</script>

<template>
  <div
    class="sm:px-4 flex flex-col sm:gap-4"
  >
    <!-- Term selector -->
    <div class="flex items-center gap-3 flex-1">
      <div class="flex-1">
        <label class="block text-sm text-primary font-sans font-semibold uppercase tracking-wide dark:text-neutral-400">
          Term
        </label>
        <div class="flex items-center gap-1">
          <Filter class="text-red-500" :size="20"/>
          <div class="relative min-w-0">
            <select
              :value="selectedTerm?.id || ''"
              @change="onSelect"
              class="max-w-full appearance-none pl-3 pr-8 py-1 text-sm font-bold bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white focus:outline-hidden  transition cursor-pointer"
            >
              <option v-for="t in terms" :key="t.id" :value="t.id">
                {{ t.label }}{{ t.is_current ? ' ' : '' }}
              </option>
            </select>
            <svg
              class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400"
              viewBox="0 0 20 20" fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </div>
         
        </div>
       
      </div>
    </div>
    <div
      v-if="isAdmin"
      class="flex items-center gap-2 shrink-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800 pt-3 sm:pt-0"
    >
      <button
        type="button"
        @click="emit('add')"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm shadow-xs transition cursor-pointer"
      >
        <Plus class="size-3.5" />
        <span>Add Term</span>
      </button>
      <button
        v-if="selectedTerm"
        type="button"
        @click="emit('edit', selectedTerm)"
        title="Edit this term"
        class="inline-flex items-center justify-center size-8 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition cursor-pointer"
      >
        <Pencil class="size-3.5" />
      </button>
      <button
        v-if="selectedTerm && canDelete"
        type="button"
        @click="emit('delete', selectedTerm)"
        title="Delete this term"
        class="inline-flex items-center justify-center size-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer"
      >
        <Trash2 class="size-3.5" />
      </button>
    </div>
  </div>
</template>
