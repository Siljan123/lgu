<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useBarangayDirectory } from '../../composables/useBarangayDirectory'
import { Search, X, MapPin, Building, Users, Check, Plus, ChevronDown, Filter } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    isAdmin?: boolean
  }>(),
  {
    isAdmin: false
  }
)

const {
  searchQuery,
  selectedClassification,
  selectedBarangayId,
  selectedBarangay,
  filteredBarangays,
  selectBarangay,
  setSearchQuery,
  setClassification
} = useBarangayDirectory()

const emit = defineEmits<{
  (e: 'add-barangay'): void
}>()

const isMobileDropdownOpen = ref(false)
const mobileDropdownRef = ref<HTMLElement | null>(null)

onClickOutside(mobileDropdownRef, () => {
  isMobileDropdownOpen.value = false
})

function handleSelectBarangay(id: string) {
  selectBarangay(id)
  isMobileDropdownOpen.value = false
}
</script>

<template>
  <div class="w-full">
    <!-- MOBILE VIEW: Filter Dropdown (lg:hidden) -->
    <div ref="mobileDropdownRef" class="relative block lg:hidden w-full mb-4">
      <div class="flex items-center gap-2">
        <!-- Main Dropdown Trigger Button -->
        <button
          type="button"
          @click="isMobileDropdownOpen = !isMobileDropdownOpen"
          class="flex-1 flex items-center justify-between p-3 rounded-md border border-[#dfdfdf] dark:border-[#333333] bg-white dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] shadow-xs hover:border-[#dc2626] dark:hover:border-[#dc2626] transition-all cursor-pointer text-left"
          aria-haspopup="listbox"
          :aria-expanded="isMobileDropdownOpen"
          data-testid="mobile-filter-trigger"
        >
          <div class="flex items-center space-x-2.5 min-w-0 pr-2">
            <div class="p-1.5 rounded-lg bg-[#dc2626]/10 text-[#dc2626] dark:text-[#f87171] shrink-0">
              <MapPin class="size-4" />
            </div>
            <div class="min-w-0">
              <span class="block text-[10px] font-semibold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3]">
                Selected Barangay ({{ filteredBarangays.length }})
              </span>
              <span class="block text-xs sm:text-sm font-bold truncate text-[#171717] dark:text-[#ffffff]">
                {{ selectedBarangay?.name || 'Select Barangay' }}
              </span>
            </div>
          </div>

          <div class="flex items-center space-x-2 shrink-0">
            <span
              v-if="selectedBarangay"
              class="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium"
              :class="[
                selectedBarangay.classification === 'Urban'
                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              ]"
            >
              {{ selectedBarangay.classification }}
            </span>
            <ChevronDown
              class="size-4 text-[#707070] dark:text-[#a3a3a3] transition-transform duration-200"
              :class="{ 'rotate-180': isMobileDropdownOpen }"
            />
          </div>
        </button>

        <!-- Quick Add Barangay Action Button -->
        <button
          v-if="isAdmin"
          type="button"
          @click="emit('add-barangay')"
          class="p-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center shrink-0"
          title="Add New Barangay"
          aria-label="Add New Barangay"
        >
          <Plus class="size-5" />
        </button>
      </div>

      <!-- Dropdown Menu Popover -->
      <div
        v-if="isMobileDropdownOpen"
        class="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-xl shadow-xl overflow-hidden p-3 space-y-3"
        data-testid="mobile-filter-dropdown"
      >
        <!-- Search Input -->
        <div class="relative">
          <input
            :value="searchQuery"
            @input="e => setSearchQuery((e.target as HTMLInputElement).value)"
            type="text"
            placeholder="Search barangay..."
            class="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa] dark:bg-[#181818] text-[#171717] dark:text-[#ffffff] placeholder-[#707070] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#dc2626] transition-colors"
            autofocus
          />
          <Search class="size-4 text-[#707070] dark:text-[#a3a3a3] absolute left-2.5 top-2.5" aria-hidden="true" />
          <button
            v-if="searchQuery"
            type="button"
            @click="setSearchQuery('')"
            class="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#171717] dark:hover:text-[#ffffff] transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X class="size-4" />
          </button>
        </div>

        <!-- Classification Filter Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button
            v-for="cat in (['All', 'Urban', 'Rural'] as const)"
            :key="cat"
            type="button"
            @click="setClassification(cat)"
            :class="[
              'px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer',
              selectedClassification === cat
                ? 'bg-[#dc2626] text-white'
                : 'bg-[#fafafa] dark:bg-[#181818] text-[#707070] dark:text-[#a3a3a3] border border-[#dfdfdf] dark:border-[#333333] hover:text-[#171717] dark:hover:text-[#ffffff]'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Barangay Items List -->
        <div class="space-y-1.5 max-h-64 overflow-y-auto pr-0.5 divide-y divide-[#f0f0f0] dark:divide-[#2a2a2a]">
          <div v-if="filteredBarangays.length === 0" class="p-4 text-center text-xs text-[#707070] dark:text-[#a3a3a3]">
            No barangays found matching "{{ searchQuery }}"
          </div>

          <button
            v-for="brgy in filteredBarangays"
            :key="brgy.id"
            :data-barangay-id="brgy.id"
            :data-mobile-barangay-id="brgy.id"
            type="button"
            @click="handleSelectBarangay(brgy.id)"
            :class="[
              'w-full text-left p-2.5 rounded-lg border transition-all duration-150 flex items-center justify-between group cursor-pointer mt-1 first:mt-0',
              selectedBarangayId === brgy.id
                ? 'bg-[#dc2626]/5 dark:bg-[#dc2626]/20 border-[#dc2626] text-[#dc2626] dark:text-[#f87171]'
                : 'bg-[#fafafa] dark:bg-[#181818] border-transparent hover:border-[#dfdfdf] dark:hover:border-[#333333] text-[#171717] dark:text-[#ffffff]'
            ]"
          >
            <div class="space-y-0.5 min-w-0 pr-2">
              <div class="flex items-center space-x-1.5">
                <MapPin
                  class="size-3.5 shrink-0"
                  :class="selectedBarangayId === brgy.id ? 'text-[#dc2626] dark:text-[#f87171]' : 'text-[#707070] dark:text-[#a3a3a3] group-hover:text-[#171717] dark:group-hover:text-[#ffffff]'"
                />
                <span class="text-xs font-semibold truncate">
                  {{ brgy.name }}
                </span>
                <span
                  class="px-1.5 py-0.2 text-[9px] font-medium rounded-full"
                  :class="[
                    brgy.classification === 'Urban'
                      ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  ]"
                >
                  {{ brgy.classification }}
                </span>
              </div>
              
              <div class="flex items-center space-x-2 text-[10px] text-[#707070] dark:text-[#a3a3a3] pl-5">
                <span class="inline-flex items-center space-x-1">
                  <Users class="size-3 shrink-0" />
                  <span>{{ brgy.population.toLocaleString() }} population</span>
                </span>
              </div>
            </div>

            <Check
              v-if="selectedBarangayId === brgy.id"
              class="size-4 text-[#dc2626] dark:text-[#f87171] shrink-0"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- DESKTOP VIEW: Full Sidebar Card (hidden lg:block) -->
    <Card class="hidden lg:block">
      <!-- Title & Counter Header -->
      <CardHeader>
        <div class="flex items-center justify-between border-b border-[#dfdfdf] dark:border-[#333333] pb-3">
          <div class="flex items-center space-x-2">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-[#171717] dark:text-[#ffffff]">
              List of Barangays
            </h2>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#fafafa] dark:bg-[#1c1c1c] text-[#707070] dark:text-[#a3a3a3] border border-[#dfdfdf] dark:border-[#333333]">
              {{ filteredBarangays.length }}
            </span>
          </div>

          <button
            v-if="isAdmin"
            type="button"
            @click="emit('add-barangay')"
            class="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-md shadow-xs transition cursor-pointer"
            title="Add New Barangay"
          >
            <Plus class="size-3" />
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative mt-4">
          <input
            :value="searchQuery"
            @input="e => setSearchQuery((e.target as HTMLInputElement).value)"
            type="text"
            placeholder="Search barangay..."
            class="w-full pl-9 pr-8 py-2 text-xs rounded-md border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] placeholder-[#707070] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#dc2626] transition-colors"
          />
          <Search class="size-4 text-[#707070] dark:text-[#a3a3a3] absolute left-2.5 top-2.5" aria-hidden="true" />
          <button
            v-if="searchQuery"
            type="button"
            @click="setSearchQuery('')"
            class="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#171717] dark:hover:text-[#ffffff] transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X class="size-4" />
          </button>
        </div>

        <!-- Classification Filter Tabs -->
        <div class="flex items-center gap-1 mt-3 overflow-x-auto no-scrollbar pb-1">
          <button
            v-for="cat in (['All', 'Urban', 'Rural'] as const)"
            :key="cat"
            type="button"
            @click="setClassification(cat)"
            :class="[
              'px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer',
              selectedClassification === cat
                ? 'bg-[#dc2626] text-white'
                : 'bg-[#fafafa] dark:bg-[#1c1c1c] text-[#707070] dark:text-[#a3a3a3] border border-[#dfdfdf] dark:border-[#333333] hover:text-[#171717] dark:hover:text-[#ffffff]'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </CardHeader>
     
      <CardContent>
        <div class="space-y-2 max-h-135 overflow-y-auto pr-1 pb-4">
          <div v-if="filteredBarangays.length === 0" class="p-6 text-center text-xs text-[#707070] dark:text-[#a3a3a3]">
            No barangays found matching "{{ searchQuery }}"
          </div>

          <button
            v-for="brgy in filteredBarangays"
            :key="brgy.id"
            :data-barangay-id="brgy.id"
            type="button"
            @click="selectBarangay(brgy.id)"
            :class="[
              'w-full text-left p-3 rounded-lg border transition-all duration-150 flex items-center justify-between group cursor-pointer',
              selectedBarangayId === brgy.id
                ? 'bg-[#dc2626]/5 dark:bg-[#dc2626]/20 border-[#dc2626] text-[#dc2626] dark:text-[#f87171]'
                : 'bg-[#ffffff] dark:bg-[#1c1c1c] border-[#dfdfdf] dark:border-[#333333] text-[#171717] dark:text-[#ffffff] hover:border-[#a3a3a3] dark:hover:border-[#555555]'
            ]"
          >
            <div class="space-y-1 min-w-0 pr-2">
              <div class="flex items-center space-x-1.5">
                <MapPin 
                  class="size-3.5 shrink-0"
                  :class="selectedBarangayId === brgy.id ? 'text-[#dc2626] dark:text-[#f87171]' : 'text-[#707070] dark:text-[#a3a3a3] group-hover:text-[#171717] dark:group-hover:text-[#ffffff]'"
                />
                <span class="text-xs font-semibold truncate">
                  {{ brgy.name }}
                </span>
              </div>
              
              <div class="flex items-center space-x-2 text-[11px] text-[#707070] dark:text-[#a3a3a3]">
                <span class="inline-flex items-center space-x-1">
                  <Users class="size-3 shrink-0" />
                  <span>{{ brgy.population.toLocaleString() }} population</span>
                </span>
              </div>
            </div>

            <Check 
              v-if="selectedBarangayId === brgy.id"
              class="size-4 text-[#dc2626] dark:text-[#f87171] shrink-0" 
            />
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
