<script setup lang="ts">
import { computed } from 'vue'
import {
  Search,
  RotateCcw,
  Scale,
  ShieldAlert,
  Award,
  FileText,
  Plus,
  Filter,
  ChevronDown,
  Check,
} from '@lucide/vue'
import type { DocumentType, DocumentStatus, LegalDocumentStats } from '../../../types/ordinance'


const props = withDefaults(
  defineProps<{
    searchQuery: string
    selectedType: DocumentType | 'all'
    selectedStatus: DocumentStatus | 'all'
    selectedYear: string
    selectedTag: string
    availableYears: string[]
    availableTags: string[]
    stats: LegalDocumentStats
    activeFiltersCount: number
    isAdmin?: boolean
  }>(),
  {
    isAdmin: false,
  }
)

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:selectedType', val: DocumentType | 'all'): void
  (e: 'update:selectedStatus', val: DocumentStatus | 'all'): void
  (e: 'update:selectedYear', val: string): void
  (e: 'update:selectedTag', val: string): void
  (e: 'resetFilters'): void
  (e: 'openAddModal'): void
}>()

interface TypeOption {
  value: DocumentType | 'all'
  label: string
  shortLabel: string
  count: number
  icon: any
}

const typeOptions = computed<TypeOption[]>(() => [
  {
    value: 'all',
    label: 'All Types',
    shortLabel: 'All Types',
    count: props.stats.total,
    icon: FileText,
  },
  {
    value: 'ordinance',
    label: 'Ordinances',
    shortLabel: 'Ordinances',
    count: props.stats.ordinances,
    icon: Scale,
  },
  {
    value: 'executive_order',
    label: 'Executive Orders',
    shortLabel: 'Executive Orders',
    count: props.stats.executiveOrders,
    icon: ShieldAlert,
  },
  {
    value: 'resolution',
    label: 'Resolutions',
    shortLabel: 'Resolutions',
    count: props.stats.resolutions,
    icon: Award,
  },
])

const currentTypeLabel = computed<string>(() => {
  switch (props.selectedType) {
    case 'ordinance':
      return 'Ordinances'
    case 'executive_order':
      return 'Executive Orders'
    case 'resolution':
      return 'Resolutions'
    case 'all':
    default:
      return 'All Types'
  }
})

const currentTypeCount = computed<number>(() => {
  switch (props.selectedType) {
    case 'ordinance':
      return props.stats.ordinances
    case 'executive_order':
      return props.stats.executiveOrders
    case 'resolution':
      return props.stats.resolutions
    case 'all':
    default:
      return props.stats.total
  }
})
</script>

<template>
  <div class="border-b mb-4 p-3 sm:p-4 transition-colors">
    <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
        <input
          type="text"
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          placeholder="Search by number, title, or keywords..."
          class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <DropdownMenu :modal="false">
          <DropdownMenuTrigger as-child>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 border rounded-lg text-neutral-800 dark:text-neutral-200 transition cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-600 focus:outline-hidden focus:ring-2 focus:ring-[#dc2626]/10"
              :class="[
                selectedType !== 'all'
                  ? 'border-[#dc2626]/40 bg-[#dc2626]/5 text-[#dc2626] dark:text-[#f87171] font-semibold'
                  : 'border-neutral-200 dark:border-neutral-700'
              ]"
            >
              <Filter class="size-3.5 text-[#dc2626]" />
              <span>{{ currentTypeLabel }}</span>
              <span
                class="px-1.5 py-0.2 rounded-full text-[10px] tabular-nums font-semibold"
                :class="[
                  selectedType !== 'all'
                    ? 'bg-[#dc2626]/15 text-[#dc2626] dark:text-[#f87171]'
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                ]"
              >
                {{ currentTypeCount }}
              </span>
              <ChevronDown class="size-3 text-neutral-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            class="w-56 rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-white dark:bg-[#1c1c1c] p-1.5 shadow-lg z-50 text-xs"
          >
            <DropdownMenuLabel class="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500 px-2 py-1">
              Filter by Document Type
            </DropdownMenuLabel>
            
            <DropdownMenuItem
              v-for="opt in typeOptions"
              :key="opt.value"
              class="cursor-pointer gap-2 px-2.5 py-2 text-xs rounded-md transition-colors flex items-center justify-between"
              :class="[
                selectedType === opt.value
                  ? 'bg-[#dc2626]/10 text-[#dc2626] dark:text-[#f87171] font-semibold'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              ]"
              @click="emit('update:selectedType', opt.value)"
            >
              <div class="flex items-center gap-2">
                <component :is="opt.icon" class="size-3.5 shrink-0" />
                <span>{{ opt.label }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 tabular-nums font-medium">
                  {{ opt.count }}
                </span>
                <Check v-if="selectedType === opt.value" class="size-3.5 text-[#dc2626]" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Year Filter -->
        <select
          :value="selectedYear"
          @change="emit('update:selectedYear', ($event.target as HTMLSelectElement).value)"
          class="px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-[#dc2626] cursor-pointer"
        >
          <option value="all">Year: All</option>
          <option v-for="y in availableYears.filter(yr => yr !== 'all')" :key="y" :value="y">
            {{ y }}
          </option>
        </select>

        <button
          v-if="activeFiltersCount > 0"
          type="button"
          @click="emit('resetFilters')"
          class="inline-flex items-center space-x-1 px-2.5 py-2 text-xs text-[#dc2626] hover:bg-[#dc2626]/10 rounded-lg transition-colors cursor-pointer"
          title="Reset all active filters"
        >
          <RotateCcw class="size-3.5" />
          <span class="hidden sm:inline">Reset</span>
        </button>

        <!-- New Document Action Button -->
        <button
          v-if="isAdmin"
          type="button"
          @click="emit('openAddModal')"
          class="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-[#b91c1c] text-white rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 ml-auto"
        >
          <Plus class="size-4" />
          <span>New Document</span>
        </button>

      </div>
    </div>
  </div>
</template>
