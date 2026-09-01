<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { MedicalFacility } from '../../composables/useEmergency'
import { 
  Search, 
  X, 
  Building2, 
  HeartPulse, 
  Pill, 
  Cross, 
  MapPin,
  Filter,
  ChevronDown,
  Check
} from '@lucide/vue'

interface Props {
  categories?: string[]
  selectedCategory?: string
  categoryCounts?: Record<string, number>
  selectedBarangay?: string
  barangays?: string[]
  searchQuery?: string
  facilities?: MedicalFacility[]
  filteredCount?: number
  totalCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => ['All', 'Hospitals', 'Clinics', 'Pharmacies'],
  selectedCategory: 'All',
  categoryCounts: () => ({}),
  selectedBarangay: 'All',
  barangays: () => ['All'],
  searchQuery: '',
  facilities: () => [],
  filteredCount: 0,
  totalCount: 0
})

const emit = defineEmits<{
  (e: 'update:selectedCategory', category: string): void
  (e: 'update:selectedBarangay', barangay: string): void
  (e: 'update:searchQuery', query: string): void
  (e: 'selectFacility', facility: MedicalFacility): void
}>()

const searchContainerRef = ref<HTMLElement | null>(null)
const isDropdownOpen = ref(false)

onClickOutside(searchContainerRef, () => {
  isDropdownOpen.value = false
})

const searchDropdownResults = computed(() => {
  const query = props.searchQuery.toLowerCase().trim()
  if (!query) return []
  return props.facilities.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.address.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    item.subCategory.toLowerCase().includes(query) ||
    item.mainCategory.toLowerCase().includes(query)
  ).slice(0, 8)
})

const onInputSearch = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  emit('update:searchQuery', val)
  isDropdownOpen.value = true
}

const selectSearchResult = (item: MedicalFacility) => {
  emit('selectFacility', item)
  emit('update:searchQuery', item.name)
  isDropdownOpen.value = false
}

const clearSearch = () => {
  emit('update:searchQuery', '')
  isDropdownOpen.value = false
}

const selectCategory = (cat: string) => {
  emit('update:selectedCategory', cat)
}

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'Hospitals':
      return HeartPulse
    case 'Clinics':
      return Building2
    case 'Pharmacies':
      return Pill
    default:
      return Cross
  }
}

const currentCategoryCount = computed(() => {
  if (props.selectedCategory === 'All') {
    return props.categoryCounts['All'] !== undefined ? props.categoryCounts['All'] : props.totalCount
  }
  return props.categoryCounts[props.selectedCategory] || 0
})

const currentCategoryLabel = computed(() => {
  if (props.selectedCategory === 'All') {
    return 'All Categories'
  }
  return props.selectedCategory
})
</script>

<template>
  <div class="w-full border-t pt-4">
    
    <div class="flex flex-row items-stretch sm:items-center gap-3">
      <!-- Search Input -->
      <div ref="searchContainerRef" class="relative flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-600 dark:text-red-400">
            <Search :size="18" />
          </div>
          <input 
            type="text"
            :value="searchQuery"
            placeholder="Search hospital, clinic, pharmacy, RHU, doctor, dental, lab..."
            class="w-full pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] placeholder-[#9a9a9a] dark:placeholder-[#707070] focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all font-medium shadow-2xs"
            @input="onInputSearch"
            @focus="isDropdownOpen = true"
          />
          <button 
            v-if="searchQuery" 
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9a9a9a] hover:text-[#171717] dark:hover:text-[#ffffff] cursor-pointer"
            @click="clearSearch"
          >
            <X :size="18" />
          </button>
        </div>

        <div 
          v-if="isDropdownOpen && searchQuery.trim() && searchDropdownResults.length > 0"
          class="absolute left-0 right-0 top-full mt-2 z-50 bg-[#ffffff] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] rounded-xl shadow-xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-[#ededed] dark:divide-[#2e2e2e]"
        >
          <div class="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9a9a9a] bg-[#fafafa] dark:bg-[#1a1a1a]">
            Matching Medical Places ({{ searchDropdownResults.length }})
          </div>

          <div
            v-for="item in searchDropdownResults"
            :key="item.id"
            class="p-3 hover:bg-[#fafafa] dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors flex items-center justify-between gap-3 group"
            @mousedown.prevent="selectSearchResult(item)"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 shrink-0 border border-red-500/20">
                <HeartPulse v-if="item.mainCategory === 'Hospitals'" :size="16" />
                <Pill v-else-if="item.mainCategory === 'Pharmacies'" :size="16" />
                <Building2 v-else :size="16" />
              </div>
              <div class="min-w-0">
                <div class="font-bold text-sm text-[#171717] dark:text-[#ffffff] group-hover:text-red-600 dark:group-hover:text-red-400 truncate">
                  {{ item.name }}
                </div>
                <div class="text-xs text-[#707070] dark:text-[#a3a3a3] truncate">
                  {{ item.subCategory || item.category }} • {{ item.address }}
                </div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider shrink-0 bg-gray-500/10 text-gray-700 dark:text-gray-300">
              {{ item.mainCategory }}
            </span>
          </div>
        </div>
      </div>

      <!-- Category Filter Dropdown at Right of Search Bar -->
      <DropdownMenu :modal="false">
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="inline-flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-md border transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            :class="[
              selectedCategory !== 'All'
                ? 'border-red-600/40 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold focus:ring-2 focus:ring-red-500/20'
                : 'border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1a1a1a] text-[#171717] dark:text-[#ffffff] hover:border-neutral-300 dark:hover:border-neutral-700'
            ]"
          >
            <div class="flex items-center gap-2">
              <Filter class="size-4 text-red-600  dark:text-red-400 shrink-0" />
              <span class="hidden sm:flex" >{{ currentCategoryLabel }}</span>
            </div>
            <div class="flex items-center gap-1.5 ml-auto sm:ml-2">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums"
                :class="[
                  selectedCategory !== 'All'
                    ? 'bg-red-600/15 text-red-600 dark:text-red-400'
                    : 'bg-[#dfdfdf] dark:bg-[#333333] text-[#525252] dark:text-[#cbd5e1]'
                ]"
              >
                {{ currentCategoryCount }}
              </span>
              <ChevronDown class="size-3.5 text-[#9a9a9a] dark:text-[#707070]" />
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          class="w-56 rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-white dark:bg-[#1c1c1c] p-1.5 shadow-xl z-50 text-xs"
        >
          <DropdownMenuLabel class="text-[10px] uppercase font-bold tracking-wider text-[#9a9a9a] dark:text-[#707070] px-2.5 py-1.5">
            Filter by Category
          </DropdownMenuLabel>
          
          <DropdownMenuItem
            v-for="cat in categories"
            :key="cat"
            class="cursor-pointer gap-2 px-2.5 py-2 text-xs rounded-lg transition-colors flex items-center justify-between font-medium outline-none"
            :class="[
              selectedCategory === cat
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-bold'
                : 'text-[#171717] dark:text-[#e5e5e5] hover:bg-[#fafafa] dark:hover:bg-[#262626]'
            ]"
            @click="selectCategory(cat)"
          >
            <div class="flex items-center gap-2 min-w-0">
              <component :is="getCategoryIcon(cat)" class="size-4 shrink-0 text-red-600 dark:text-red-400" />
              <span class="truncate">{{ cat === 'All' ? 'All Categories' : cat }}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span 
                class="px-1.5 py-0.5 rounded-full text-[10px] tabular-nums font-bold"
                :class="[
                  selectedCategory === cat
                    ? 'bg-red-600/20 text-red-600 dark:text-red-400'
                    : 'bg-[#ededed] dark:bg-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3]'
                ]"
              >
                {{ cat === 'All' ? (categoryCounts['All'] ?? totalCount) : (categoryCounts[cat] || 0) }}
              </span>
              <Check v-if="selectedCategory === cat" class="size-3.5 text-red-600 dark:text-red-400 shrink-0" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>

  </div>
</template>
