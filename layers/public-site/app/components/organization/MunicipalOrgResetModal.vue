<script setup lang="ts">
import { RotateCcw } from '@lucide/vue'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
      <div class="mx-auto size-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-3">
        <RotateCcw class="size-6" />
      </div>
      <h3 class="text-base font-bold text-neutral-900 dark:text-white">
        Reset to Default Structure?
      </h3>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
        This will restore the original hierarchy with the Municipal Mayor and the standard 17 municipal departments. Any custom-added sub-nodes will be cleared.
      </p>

      <div class="mt-6 flex items-center justify-center space-x-2">
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-2 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="emit('confirm')"
          class="px-4 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          Reset Structure
        </button>
      </div>
    </div>
  </div>
</template>
