<script setup lang="ts">
import { Search, X, Filter } from '@lucide/vue'

interface Props {
  categories: string[]
  selectedCategory: string
  searchQuery: string
  totalCount: number
  filteredCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', category: string): void
  (e: 'update:searchQuery', query: string): void
}>()
</script>

<template>
  <div class="w-full space-y-6">
    <!-- Top Filter Row: Search & Count -->
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-lg">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707070] dark:text-[#a3a3a3]">
          <Search :size="18" />
        </div>
        <input 
          type="text"
          :value="searchQuery"
          placeholder="Search festival name, highlights, or venue..."
          class="w-full pl-10 pr-9 py-2.5 text-sm rounded-lg border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] text-[#171717] dark:text-[#ffffff] placeholder-[#9a9a9a] dark:placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444] transition-all"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
        <button 
          v-if="searchQuery" 
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9a9a9a] hover:text-[#171717] dark:hover:text-[#ffffff] cursor-pointer"
          @click="emit('update:searchQuery', '')"
        >
          <X :size="16" />
        </button>
      </div>

      <!-- Count Badge -->
      <div class="flex items-center gap-2 text-xs font-medium text-[#707070] dark:text-[#a3a3a3]">
        <Filter :size="14" class="text-[#85181a] dark:text-[#ef4444]" />
        <span>Showing <strong class="text-[#171717] dark:text-[#ffffff]">{{ filteredCount }}</strong> of {{ totalCount }} events</span>
      </div>
    </div>

    <!-- Category Pill Filters -->
    <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-[#ededed] dark:border-[#2a2a2a]">
      <span class="text-xs font-medium uppercase tracking-wider text-[#9a9a9a] dark:text-[#707070] mr-2 hidden sm:inline-block">
        Filter Category:
      </span>
      
      <button 
        v-for="cat in categories" 
        :key="cat"
        type="button"
        class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
        :class="[
          selectedCategory === cat 
            ? 'bg-[#85181a] text-[#ffffff] dark:bg-[#ef4444] dark:text-[#ffffff] shadow-sm font-semibold' 
            : 'bg-[#fafafa] dark:bg-[#202020] text-[#171717] dark:text-[#a3a3a3] border border-[#dfdfdf] dark:border-[#2e2e2e] hover:border-[#c7c7c7] dark:hover:border-[#404040] hover:text-[#171717] dark:hover:text-[#ffffff]'
        ]"
        @click="emit('update:selectedCategory', cat)"
      >
        {{ cat }}
      </button>
    </div>
  </div>
</template>
