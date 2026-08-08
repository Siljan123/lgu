<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div 
    v-if="totalPages > 1" 
    class="pt-6 border-t border-[#ededed] dark:border-[#2e2e2e] flex flex-col sm:flex-row items-center justify-between gap-4"
  >
    <!-- Item Count Summary -->
    <div class="text-xs text-[#707070] dark:text-[#a3a3a3]">
      Showing <strong class="text-[#171717] dark:text-[#ffffff]">{{ startItem }}</strong> to 
      <strong class="text-[#171717] dark:text-[#ffffff]">{{ endItem }}</strong> of 
      <strong class="text-[#171717] dark:text-[#ffffff]">{{ totalItems }}</strong> scheduled events
    </div>

    <!-- Page Controls -->
    <div class="flex items-center gap-1.5">
      <!-- Previous Page -->
      <button
        type="button"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        :disabled="currentPage === 1"
        aria-label="Previous Page"
        @click="goToPage(currentPage - 1)"
      >
        <ChevronLeft :size="16" />
      </button>

      <!-- Page Numbers -->
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        :class="page === currentPage 
          ? 'bg-[#85181a] dark:bg-[#ef4444] text-[#ffffff] shadow-sm' 
          : 'border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a]'"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <!-- Next Page -->
      <button
        type="button"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] text-[#171717] dark:text-[#ffffff] hover:bg-[#fafafa] dark:hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        :disabled="currentPage === totalPages"
        aria-label="Next Page"
        @click="goToPage(currentPage + 1)"
      >
        <ChevronRight :size="16" />
      </button>
    </div>
  </div>
</template>
