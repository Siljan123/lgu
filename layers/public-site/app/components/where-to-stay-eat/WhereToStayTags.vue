<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Establishment } from '../../composables/useWhereToStayEat'
import { 
  Search, 
  X, 
  Hotel, 
  Utensils, 
  Layers,
  Bed,
  Coffee,
  Store,
  Home,
  Palmtree,
  ChefHat,
  Compass
} from '@lucide/vue'

interface Props {
  categories?: string[]
  mainCategories?: string[]
  selectedMainCategory?: string
  selectedSubCategory?: string
  selectedCategory?: string
  categoryCounts?: Record<string, number>
  mainCategoryCounts?: Record<string, number>
  selectedBarangay: string
  barangays: string[]
  searchQuery: string
  establishments: Establishment[]
  filteredCount: number
  totalCount: number
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  mainCategories: () => ['All', 'Where to Stay', 'Where to Eat'],
  selectedMainCategory: 'All',
  selectedSubCategory: 'All',
  selectedCategory: 'All',
  categoryCounts: () => ({}),
  mainCategoryCounts: () => ({})
})

const emit = defineEmits<{
  (e: 'update:selectedMainCategory', mainCat: string): void
  (e: 'update:selectedSubCategory', subCat: string): void
  (e: 'update:selectedCategory', category: string): void
  (e: 'update:selectedBarangay', barangay: string): void
  (e: 'update:searchQuery', query: string): void
  (e: 'selectEstablishment', establishment: Establishment): void
}>()

const isDropdownOpen = ref(false)

const searchDropdownResults = computed(() => {
  const query = props.searchQuery.toLowerCase().trim()
  if (!query) return []
  return props.establishments.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.address.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    (item.subCategory && item.subCategory.toLowerCase().includes(query)) ||
    (item.mainCategory && item.mainCategory.toLowerCase().includes(query))
  ).slice(0, 8)
})

const activeMainCategory = computed(() => {
  if (props.selectedMainCategory && props.selectedMainCategory !== 'All') {
    return props.selectedMainCategory
  }
  if (props.selectedCategory === 'Where to Stay' || props.selectedCategory === 'Where to Eat') {
    return props.selectedCategory
  }
  return 'All'
})

const onInputSearch = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  emit('update:searchQuery', val)
  isDropdownOpen.value = true
}

const selectSearchResult = (item: Establishment) => {
  emit('selectEstablishment', item)
  emit('update:searchQuery', item.name)
  isDropdownOpen.value = false
}

const clearSearch = () => {
  emit('update:searchQuery', '')
  isDropdownOpen.value = false
}

const selectMainCategory = (mainCat: string) => {
  emit('update:selectedMainCategory', mainCat)
  emit('update:selectedCategory', mainCat)
  emit('update:selectedSubCategory', 'All')
}

const selectSubCategory = (subCat: string) => {
  emit('update:selectedSubCategory', subCat)
  emit('update:selectedCategory', subCat)
}
</script>

<template>
  <div class="w-full space-x-0 space-y-4">
    
    <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
      
      <!-- Search Input -->
      <div class="relative flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85181a] dark:text-[#ef4444]">
            <Search :size="18" />
          </div>
          <input 
            type="text"
            :value="searchQuery"
            placeholder="search..."
            class="w-full pl-10 pr-10 py-3 text-sm rounded-sm border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] placeholder-[#9a9a9a] dark:placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444] transition-all font-medium shadow-2xs"
            @input="onInputSearch"
            @focus="isDropdownOpen = true"
          />
          <button 
            v-if="searchQuery" 
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9a9a9a] hover:text-[#171717] dark:hover:text-[#ffffff]"
            @click="clearSearch"
          >
            <X :size="18" />
          </button>
        </div>

        <div 
          v-if="isDropdownOpen && searchQuery.trim() && searchDropdownResults.length > 0"
          class="absolute left-0 right-0 top-full mt-2 z-50 bg-[#ffffff] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] rounded-sm  overflow-hidden max-h-80 overflow-y-auto divide-y divide-[#ededed] dark:divide-[#2e2e2e]"
        >
          <div class="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9a9a9a] bg-[#fafafa] dark:bg-[#1a1a1a]">
            Matching Places ({{ searchDropdownResults.length }})
          </div>

          <div
            v-for="item in searchDropdownResults"
            :key="item.id"
            class="p-3 hover:bg-[#fafafa] dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors flex items-center justify-between gap-3 group"
            @mousedown.prevent="selectSearchResult(item)"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="p-2 rounded-sm bg-[#fafafa] dark:bg-[#1a1a1a] text-[#85181a] dark:text-[#ef4444] shrink-0 border border-[#dfdfdf] dark:border-[#333333]">
                <Hotel v-if="item.mainCategory === 'Where to Stay'" :size="16" />
                <Utensils v-else :size="16" />
              </div>
              <div class="min-w-0">
                <div class="font-bold text-sm text-[#171717] dark:text-[#ffffff] group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] truncate">
                  {{ item.name }}
                </div>
                <div class="text-xs text-[#707070] dark:text-[#a3a3a3] truncate">
                  {{ item.subCategory || item.category }} • {{ item.address }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <div class="md:w-64 shrink-0">
        <select 
          :value="selectedSubCategory !== 'All' ? selectedSubCategory : (selectedCategory !== 'All' && selectedCategory !== 'Where to Stay' && selectedCategory !== 'Where to Eat' ? selectedCategory : 'All')" 
          class="w-full py-3 px-3.5 text-sm rounded-sm border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444] transition-all cursor-pointer font-semibold shadow-2xs"
          @change="selectSubCategory(($event.target as HTMLSelectElement).value)"
        >
          <option value="All">All categories</option>
          <option 
            v-for="cat in categories" 
            :key="cat" 
            :value="cat"
          >
            {{ cat }} {{ categoryCounts[cat] ? `(${categoryCounts[cat]})` : '' }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
