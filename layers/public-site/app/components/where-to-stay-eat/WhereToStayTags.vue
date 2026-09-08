<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { Establishment } from '../../composables/useWhereToStayEat'
import { 
  Search, 
  X, 
  Hotel, 
  Utensils, 
  Filter,
  ChevronDown,
  Check,
  Building,
  Building2,
  Home,
  Coffee,
  Store,
  Layers
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

const searchContainerRef = ref<HTMLElement | null>(null)
const isDropdownOpen = ref(false)

onClickOutside(searchContainerRef, () => {
  isDropdownOpen.value = false
})

const currentActiveCategory = computed(() => {
  if (props.selectedSubCategory && props.selectedSubCategory !== 'All') {
    return props.selectedSubCategory
  }
  if (
    props.selectedCategory &&
    props.selectedCategory !== 'All' &&
    props.selectedCategory !== 'Where to Stay' &&
    props.selectedCategory !== 'Where to Eat'
  ) {
    return props.selectedCategory
  }
  return 'All'
})

const currentCategoryCount = computed(() => {
  const active = currentActiveCategory.value
  if (active === 'All') {
    return props.categoryCounts['All'] !== undefined ? props.categoryCounts['All'] : props.totalCount
  }
  return props.categoryCounts[active] || 0
})

const currentCategoryLabel = computed(() => {
  const active = currentActiveCategory.value
  if (active === 'All') {
    return 'All Categories'
  }
  return active
})

const availableCategories = computed(() => {
  const list = props.categories.filter(c => c !== 'All')
  return ['All', ...list]
})

const getCategoryIcon = (cat: string) => {
  const lower = (cat || '').toLowerCase()
  if (lower === 'all') return Layers
  if (lower.includes('hotel')) return Hotel
  if (lower.includes('inn') || lower.includes('lodge') || lower.includes('mabuhay')) return Building
  if (lower.includes('homestay')) return Home
  if (lower.includes('resort')) return Building2
  if (lower.includes('restaurant')) return Utensils
  if (lower.includes('cafe') || lower.includes('coffee')) return Coffee
  if (lower.includes('stall') || lower.includes('kiosk')) return Store
  return Utensils
}

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

const selectSubCategory = (subCat: string) => {
  emit('update:selectedSubCategory', subCat)
  emit('update:selectedCategory', subCat)
}
</script>

<template>
  <div class="w-full space-y-4">
    <div class="flex flex-row items-center gap-2 sm:gap-3 w-full">
      <div ref="searchContainerRef" class="relative grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 w-full">
        <div class="relative col-span-4">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85181a] dark:text-[#ef4444]">
            <Search :size="18" />
          </div>
          <input 
            type="text"
            :value="searchQuery"
            placeholder="Search places…"
            class="w-full pl-10 pr-9 py-3 text-sm rounded-sm border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] placeholder-[#9a9a9a] dark:placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-[#85181a] dark:focus:ring-[#ef4444] transition-all font-medium shadow-2xs truncate"
            @input="onInputSearch"
            @focus="isDropdownOpen = true"
          />
          <button 
            v-if="searchQuery" 
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9a9a9a] hover:text-[#171717] dark:hover:text-[#ffffff] cursor-pointer"
            title="Clear search"
            @click="clearSearch"
          >
            <X :size="18" />
          </button>
        </div>
        <div 
          v-if="isDropdownOpen && searchQuery.trim() && searchDropdownResults.length > 0"
          class="absolute left-0 w-[calc(100vw-2rem)] max-w-sm sm:w-full sm:max-w-none top-full mt-2 z-50 bg-[#ffffff] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] rounded-sm overflow-hidden max-h-80 overflow-y-auto divide-y divide-[#ededed] dark:divide-[#2e2e2e] shadow-xl"
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
      <div class="sm:col-span-2">
        <DropdownMenu :modal="false">
          <DropdownMenuTrigger as-child>
            <button
              type="button"
              class="flex-1 min-w-0 sm:flex-initial sm:w-auto sm:min-w-56 inline-flex items-center justify-center sm:justify-between gap-2 px-3 sm:px-4 py-3 text-sm font-semibold rounded-sm border transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              :class="[
                currentActiveCategory !== 'All'
                  ? 'border-[#85181a]/40 bg-[#85181a]/10 dark:bg-[#ef4444]/15 text-[#85181a] dark:text-[#ef4444] font-bold focus:ring-2 focus:ring-[#85181a]/20'
                  : 'border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] hover:border-neutral-300 dark:hover:border-neutral-700'
              ]"
              :title="currentCategoryLabel"
            >
              <div class="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                <Filter class="size-4 text-[#85181a] dark:text-[#ef4444] shrink-0" />
                <span v-if="currentActiveCategory !== 'All'" class="sm:hidden size-1.5 rounded-full bg-[#85181a] dark:bg-[#ef4444] shrink-0" title="Filter active"></span>
                <span class="hidden sm:inline truncate">{{ currentCategoryLabel }}</span>
              </div>
              <div class="hidden sm:flex items-center gap-1.5 ml-auto pl-2">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums"
                  :class="[
                    currentActiveCategory !== 'All'
                      ? 'bg-[#85181a]/20 text-[#85181a] dark:text-[#ef4444]'
                      : 'bg-[#dfdfdf] dark:bg-[#333333] text-[#525252] dark:text-[#cbd5e1]'
                  ]"
                >
                  {{ currentCategoryCount }}
                </span>
                <ChevronDown class="size-3.5 text-[#9a9a9a] dark:text-[#707070] shrink-0" />
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            class="w-64 sm:w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-white dark:bg-[#1c1c1c] p-1.5 shadow-xl z-50 text-xs"
          >
            <DropdownMenuLabel class="text-[10px] uppercase font-bold tracking-wider text-[#9a9a9a] dark:text-[#707070] px-2.5 py-1.5">
              Filter by Category
            </DropdownMenuLabel>
            
            <DropdownMenuItem
              v-for="cat in availableCategories"
              :key="cat"
              class="cursor-pointer gap-2 px-2.5 py-2 text-xs rounded-lg transition-colors flex items-center justify-between font-medium outline-none"
              :class="[
                currentActiveCategory === cat
                  ? 'bg-[#85181a]/10 text-[#85181a] dark:text-[#ef4444] font-bold'
                  : 'text-[#171717] dark:text-[#e5e5e5] hover:bg-[#fafafa] dark:hover:bg-[#262626]'
              ]"
              @click="selectSubCategory(cat)"
            >
              <div class="flex items-center gap-2 min-w-0">
                <component :is="getCategoryIcon(cat)" class="size-4 shrink-0 text-[#85181a] dark:text-[#ef4444]" />
                <span class="truncate">{{ cat === 'All' ? 'All Categories' : cat }}</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span 
                  class="px-1.5 py-0.5 rounded-full text-[10px] tabular-nums font-bold"
                  :class="[
                    currentActiveCategory === cat
                      ? 'bg-[#85181a]/20 text-[#85181a] dark:text-[#ef4444]'
                      : 'bg-[#ededed] dark:bg-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3]'
                  ]"
                >
                  {{ cat === 'All' ? (categoryCounts['All'] ?? totalCount) : (categoryCounts[cat] || 0) }}
                </span>
                <Check v-if="currentActiveCategory === cat" class="size-3.5 text-[#85181a] dark:text-[#ef4444] shrink-0" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- Hidden accessible select for screen readers and unit tests -->
    <select
      class="sr-only"
      aria-label="Filter by Category"
      :value="currentActiveCategory"
      @change="selectSubCategory(($event.target as HTMLSelectElement).value)"
    >
      <option v-for="cat in availableCategories" :key="cat" :value="cat">
        {{ cat === 'All' ? 'All categories' : cat }}
      </option>
    </select>
  </div>
</template>
