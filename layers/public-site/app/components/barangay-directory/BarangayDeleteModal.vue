<script setup lang="ts">
import { Trash2, AlertTriangle, X } from '@lucide/vue'
import type { BarangayItem } from '../../composables/useBarangayDirectory'

defineProps<{
  open: boolean
  barangay: BarangayItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', barangayId: string): void
}>()
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
      <div class="p-6 text-center">
        <div class="size-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle class="size-6" />
        </div>

        <h3 class="text-base font-bold text-[#171717] dark:text-white">
          Delete Barangay {{ barangay?.name }}?
        </h3>

        <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
          Are you sure you want to permanently delete <strong class="text-neutral-900 dark:text-white">Brgy. {{ barangay?.name }}</strong> and all its associated officials and landmarks? This action is irreversible.
        </p>

        <div class="mt-6 flex items-center justify-center space-x-3">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="barangay?.id && emit('confirm', barangay.id)"
            class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            <Trash2 class="size-3.5" />
            <span>Delete Barangay</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
