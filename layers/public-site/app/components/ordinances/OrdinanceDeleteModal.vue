<script setup lang="ts">
import {
  Trash2,
  X,
  AlertTriangle,
} from '@lucide/vue'
import type { LegalDocument } from '../../../types/ordinance'

const props = defineProps<{
  open: boolean
  document: LegalDocument | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', id: string): void
}>()

function handleConfirm() {
  if (props.document?.id) {
    emit('confirm', props.document.id)
  }
}
</script>

<template>
  <div
    v-if="open && document"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-sm w-full max-w-md shadow-md overflow-hidden my-auto animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="px-5 py-4 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-xl bg-red-500/10 text-[#dc2626] dark:bg-red-500/20 shrink-0">
            <Trash2 class="size-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
              Delete Legal Document
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Confirm permanent deletion
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          aria-label="Close modal"
          class="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          <X class="size-5" />
        </button>
      </div>

      <div class="p-5 sm:p-6 space-y-4">
        <p class="text-sm text-neutral-700 dark:text-neutral-300">
          Are you sure to delete this?
          <span class="font-semibold text-neutral-900 dark:text-white">{{ document.document_number }}</span>
          — <span class="italic">{{ document.title }}</span>
        </p>
      </div>

      <div class="px-5 py-3.5 sm:px-6 border-t border-[#dfdfdf] dark:border-[#333333] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 bg-neutral-50/80 dark:bg-[#222222]/80">
        <button
          type="button"
          @click="emit('close')"
          class="w-full sm:w-auto px-4 py-1 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition cursor-pointer text-center"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleConfirm"
          class="w-full sm:w-auto px-4 py-1 text-xs sm:text-sm font-medium bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-md transition-colors shadow-xs cursor-pointer text-center"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
</template>
