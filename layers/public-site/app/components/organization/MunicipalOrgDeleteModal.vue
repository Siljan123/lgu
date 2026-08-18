<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import type { MunicipalDepartmentNode } from '../../../types/organization'

const props = defineProps<{
  open: boolean
  node: MunicipalDepartmentNode | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', nodeId: string): void
}>()

function handleConfirm() {
  if (props.node) {
    emit('confirm', props.node.id)
  }
}
</script>

<template>
  <div
    v-if="open && node"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
      <div class="mx-auto size-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-3">
        <Trash2 class="size-6" />
      </div>
      <h3 class="text-base font-bold text-neutral-900 dark:text-white">
        Delete this node?
      </h3>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
        Are you sure you want to remove <strong>{{ node.title }}</strong>? All its attached child units will also be deleted.
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
          @click="handleConfirm"
          class="px-4 py-2 text-xs font-medium bg-destructive hover:bg-destructive/90 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
</template>
