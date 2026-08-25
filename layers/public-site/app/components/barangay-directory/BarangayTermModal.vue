<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { CalendarRange, X, Check, Save } from '@lucide/vue'
import type { BarangayTerm } from '../../composables/useBarangayDirectory'

const props = withDefaults(
  defineProps<{
    open: boolean
    term?: BarangayTerm | null
  }>(),
  {
    term: null
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: Partial<BarangayTerm>, id?: string): void
}>()

const isEdit = computed(() => !!props.term?.id)

const form = ref({
  label: '',
  start_date: '',
  end_date: '',
  is_current: false
})

const canSubmit = computed(() => !!form.value.label.trim())

// (Re)initialise the form each time the modal opens, from the term being edited
// or as a blank new term.
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    const t = props.term
    form.value = {
      label: t?.label || '',
      start_date: (t?.start_date || '').slice(0, 10),
      end_date: (t?.end_date || '').slice(0, 10),
      is_current: !!t?.is_current
    }
  }
)

function handleSubmit() {
  if (!form.value.label.trim()) return
  emit(
    'submit',
    {
      label: form.value.label.trim(),
      start_date: form.value.start_date || null,
      end_date: form.value.end_date || null,
      is_current: form.value.is_current
    },
    props.term?.id
  )
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="size-9 rounded-sm bg-[#dc2626]/10 text-[#dc2626] dark:text-[#f87171] flex items-center justify-center">
            <CalendarRange class="size-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#171717] dark:text-white leading-tight">
              {{ isEdit ? 'Edit Term' : 'Add Term' }}
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Terms are shared across every barangay.
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          <X class="size-5" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Label -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Term Label <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.label"
            type="text"
            required
            placeholder="e.g. 2023-2026"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Start Date
            </label>
            <input
              v-model="form.start_date"
              type="date"
              class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              End Date
            </label>
            <input
              v-model="form.end_date"
              type="date"
              class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
            />
          </div>
        </div>

        <!-- Current flag -->
        <label
          class="flex items-start space-x-2.5 rounded-xl border p-3 cursor-pointer transition"
          :class="form.is_current
            ? 'border-[#dc2626] bg-[#dc2626]/5 dark:bg-[#dc2626]/10'
            : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'"
        >
          <input
            type="checkbox"
            v-model="form.is_current"
            class="mt-0.5 accent-[#dc2626]"
          />
          <span class="min-w-0">
            <span class="block text-xs font-semibold text-neutral-900 dark:text-white">
              Set as current term
            </span>
            <span class="block text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">
              The current term is shown to visitors by default. Only one term can be current.
            </span>
          </span>
        </label>

        <!-- Action Buttons -->
        <div class="pt-4 border-t border-[#dfdfdf] dark:border-[#333333] flex items-center justify-end space-x-2.5">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!canSubmit"
            class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <component :is="isEdit ? Save : Check" class="size-3.5" />
            <span>{{ isEdit ? 'Save Changes' : 'Add Term' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
