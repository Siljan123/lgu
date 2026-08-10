<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Search, LayoutGrid, MapPin, ChevronDown, Tag } from '@lucide/vue'

interface Props {
  categories: string[]
  selectedCategory: string
  searchQuery: string
  totalCount: number
  filteredCount: number
  viewMode?: 'grid' | 'map'
  searchSuggestions?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
  searchSuggestions: () => [
    'Mt. Magdiwata',
    'Toog Tree of Alegria',
    'Agusan Marsh Wildlife Sanctuary',
    'Irosin Stone Crafts',
    'Carson Waterside Mountain Resort',
    'Green Nature Resort',
    'Horsea\'s Resort',
    'Villa Lademora Inland Resort',
    'Sacred Heart of Jesus Parish',
    'Brgy. Alegria',
    'Brgy. Karaos',
    'Brgy. San Isidro'
  ]
})

const emit = defineEmits<{
  (e: 'update:selectedCategory', category: string): void
  (e: 'update:searchQuery', query: string): void
  (e: 'update:viewMode', mode: 'grid' | 'map'): void
}>()

const isSearchFocused = ref(false)
const isCategoryDropdownOpen = ref(false)
const filterContainerRef = ref<HTMLElement | null>(null)

const filteredSuggestions = computed(() => {
  const q = props.searchQuery.toLowerCase().trim()
  if (!q) return props.searchSuggestions.slice(0, 8)
  return props.searchSuggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 8)
})

const selectSuggestion = (suggestion: string) => {
  // Strip 'Brgy. ' prefix if present for clean search query
  const clean = suggestion.startsWith('Brgy. ') ? suggestion.replace('Brgy. ', '') : suggestion
  emit('update:searchQuery', clean)
  isSearchFocused.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (filterContainerRef.value && !filterContainerRef.value.contains(e.target as Node)) {
    isSearchFocused.value = false
    isCategoryDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div 
    ref="filterContainerRef"
    class="w-full space-y-5 bg-[#fafafa] dark:bg-[#181818] p-5 md:p-6 rounded-xl border border-[#e5e5e5] dark:border-[#282828] shadow-xs relative z-30"
  >
    <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      
      <div class="relative flex-1 max-w-lg">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#707070] dark:text-[#a3a3a3]">
          <Search :size="18"/>
        </div>
        
        <input 
          type="text"
          :value="searchQuery"
          placeholder="Search destinations, landmarks, or barangays…"
          class="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] text-[#171717] dark:text-[#ffffff] placeholder-[#9a9a9a] dark:placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444] transition-all"
          @focus="isSearchFocused = true"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value); isSearchFocused = true"
        />
        
        <button 
          v-if="searchQuery" 
          type="button"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9a9a9a] hover:text-[#171717] dark:hover:text-[#ffffff]"
          @click="emit('update:searchQuery', ''); isSearchFocused = false"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div 
          v-if="isSearchFocused && filteredSuggestions.length > 0"
          class="absolute top-full left-0 right-0 mt-2 py-2 bg-[#ffffff] dark:bg-[#202020] rounded-xl border border-[#dfdfdf] dark:border-[#303030] shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-[#f0f0f0] dark:divide-[#2a2a2a]"
        >
          <div class="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#888888] dark:text-[#777777]">
            Suggested Tags & Landmarks
          </div>
          <button
            v-for="(suggestion, i) in filteredSuggestions"
            :key="i"
            type="button"
            class="w-full text-left px-4 py-2.5 text-xs font-medium text-[#171717] dark:text-[#e0e0e0] hover:bg-[#fafafa] dark:hover:bg-[#282828] hover:text-[#85181a] dark:hover:text-[#ef4444] flex items-center gap-2 transition-colors"
            @mousedown.prevent="selectSuggestion(suggestion)"
          >
            <Tag :size="13" class="text-[#85181a] dark:text-[#ef4444] shrink-0" />
            <span class="truncate">{{ suggestion }}</span>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between md:justify-end gap-3">
        
        <div class="relative">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#dfdfdf] dark:border-[#303030] bg-[#ffffff] dark:bg-[#202020] text-xs font-semibold text-[#171717] dark:text-[#ffffff] hover:border-[#85181a] dark:hover:border-[#ef4444] shadow-xs transition-all"
            @click="isCategoryDropdownOpen = !isCategoryDropdownOpen"
          >
            <span>Category: <strong>{{ selectedCategory }}</strong></span>
            <ChevronDown :size="14" class="transition-transform duration-200" :class="{ 'rotate-180': isCategoryDropdownOpen }" />
          </button>

          <div
            v-if="isCategoryDropdownOpen"
            class="absolute right-0 mt-2 w-56 py-2 bg-[#ffffff] dark:bg-[#202020] rounded-xl border border-[#dfdfdf] dark:border-[#303030] shadow-xl z-50 divide-y divide-[#f0f0f0] dark:divide-[#2a2a2a]"
          >
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="w-full text-left px-4 py-2 text-xs font-medium transition-colors flex items-center justify-between"
              :class="[
                selectedCategory === cat
                  ? 'bg-[#85181a]/10 dark:bg-[#ef4444]/10 text-[#85181a] dark:text-[#ef4444] font-semibold'
                  : 'text-[#171717] dark:text-[#d4d4d4] hover:bg-[#fafafa] dark:hover:bg-[#282828]'
              ]"
              @click="emit('update:selectedCategory', cat); isCategoryDropdownOpen = false"
            >
              <span>{{ cat }}</span>
              <svg v-if="selectedCategory === cat" class="w-3.5 h-3.5 text-[#85181a] dark:text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="inline-flex items-center p-1 rounded-xl bg-[#ededed] dark:bg-[#242424] border border-[#dfdfdf] dark:border-[#303030]">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            :class="[
              viewMode === 'grid'
                ? 'bg-[#ffffff] text-[#171717] dark:bg-[#171717] dark:text-[#ffffff] shadow-sm'
                : 'text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff]'
            ]"
            @click="emit('update:viewMode', 'grid')"
          >
            <LayoutGrid :size="15" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            :class="[
              viewMode === 'map'
                ? 'bg-[#85181a] text-[#ffffff] dark:bg-[#ef4444] dark:text-[#ffffff] shadow-sm'
                : 'text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-[#ffffff]'
            ]"
            @click="emit('update:viewMode', 'map')"
          >
            <MapPin :size="15" />
            <span>Map Explorer</span>
          </button>
        </div>

        <!-- Count Badge -->
        <div class="text-xs font-medium text-[#707070] dark:text-[#a3a3a3] shrink-0">
          Showing <strong class="text-[#171717] dark:text-[#ffffff]">{{ filteredCount }}</strong> of {{ totalCount }}
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-[#ededed] dark:border-[#282828]">
   
    </div>
  </div>
</template>


