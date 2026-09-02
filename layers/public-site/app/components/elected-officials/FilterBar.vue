<script setup lang="ts">
import {
  Search,
  Plus,
  Network,
  LayoutGrid,
  X,
} from '@lucide/vue'

const searchQuery = defineModel<string>('searchQuery', { default: '' })
const activeViewMode = defineModel<'tree' | 'grid'>('activeViewMode', { default: 'tree' })

const props = withDefaults(
  defineProps<{
    isAdmin?: boolean
  }>(),
  {
    isAdmin: false,
  }
)

const emit = defineEmits<{
  (e: 'add'): void
}>()
</script>
<template>
  <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-md p-3 sm:p-4 grid grid-cols-4 gap-3">
    <div class="sm:col-span-3 col-span-4 relative rounded-sm">
      <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
      />
      <button
        v-if="searchQuery"
        type="button"
        @click="searchQuery = ''"
        aria-label="Clear search"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition cursor-pointer"
      >
        <X class="size-3.5" />
      </button>
    </div>

    <div class="flex left-0 flex-col-1 justify-between md:justify-end space-x-2.5 col-span-4 sm:col-span-1">
        <div class="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 justify-end left-0 rounded-md border border-neutral-200 dark:border-neutral-700">
            <button
                type="button"
                @click="activeViewMode = 'tree'"
                class="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
                :class="[
                    activeViewMode === 'tree'
                    ? 'bg-white dark:bg-[#1c1c1c] text-[#dc2626] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                ]"
            >
                <Network class="size-3.5" />
                <span class="hidden sm:inline">Hierarchy</span>
            </button>
            <button
                type="button"
                @click="activeViewMode = 'grid'"
                class="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
                :class="[
                    activeViewMode === 'grid'
                    ? 'bg-white dark:bg-[#1c1c1c] text-[#dc2626] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                ]"
                >
                <LayoutGrid class="size-3.5" />
                <span class="hidden sm:inline">Grid</span>
            </button>
         </div>
        <button
            v-if="isAdmin"
            type="button"
            @click="emit('add')"
            class="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-md shadow-xs transition-colors cursor-pointer"
        >
            <Plus class="size-4" />
        </button>
    </div>
  </div>
</template>