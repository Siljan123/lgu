<script setup lang="ts">
import { X, Plus, Edit3 } from '@lucide/vue'
import type { MunicipalDepartmentNode } from '../../../types/organization'

defineProps<{
  open: boolean
  node: MunicipalDepartmentNode | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-sub-node', node: MunicipalDepartmentNode): void
  (e: 'edit', node: MunicipalDepartmentNode): void
}>()
</script>

<template>
  <div
    v-if="open && node"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-2">
            <span
              v-if="node.acronym"
              class="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#dc2626] text-white"
            >
              {{ node.acronym }}
            </span>
            <span class="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              {{ node.category || 'Department' }}
            </span>
          </div>
          <button
            type="button"
            @click="emit('close')"
            class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X class="size-5" />
          </button>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-bold text-neutral-900 dark:text-white mt-3">
          {{ node.title }}
        </h3>

        <!-- Key Information Card -->
        <div class="mt-4 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-neutral-500 dark:text-neutral-400">Head / Officer:</span>
            <span class="font-semibold text-neutral-800 dark:text-neutral-200">
              {{ node.member?.[0]?.name || 'N/A' }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-neutral-500 dark:text-neutral-400">Position:</span>
            <span class="font-medium text-neutral-700 dark:text-neutral-300">
              {{ node.member?.[0]?.position || node.member?.[0]?.role || 'Department Head' }}
            </span>
          </div>
          <div v-if="node.member?.[0]?.contact" class="flex items-center justify-between text-xs">
            <span class="text-neutral-500 dark:text-neutral-400">Contact:</span>
            <span class="font-medium text-neutral-700 dark:text-neutral-300">
              {{ node.member[0].contact }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-neutral-500 dark:text-neutral-400">Sub-Units:</span>
            <span class="font-bold text-[#dc2626]">
              {{ node.children?.length ?? 0 }} child units
            </span>
          </div>
        </div>

        <!-- Description -->
        <div v-if="node.description" class="mt-4">
          <h4 class="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Description & Functions:
          </h4>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed bg-neutral-50 dark:bg-neutral-900/40 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
            {{ node.description }}
          </p>
        </div>
      
      </div>
    </div>
  </div>
</template>
