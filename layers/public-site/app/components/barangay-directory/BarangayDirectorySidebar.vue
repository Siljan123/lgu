<script setup lang="ts">
import { useBarangayDirectory } from '../../composables/useBarangayDirectory'
import { Search, X, MapPin, Building, Users, Check } from '@lucide/vue'

const {
  searchQuery,
  selectedClassification,
  selectedBarangayId,
  filteredBarangays,
  barangays,
  selectBarangay,
  setSearchQuery,
  setClassification
} = useBarangayDirectory()

</script>

<template>
  <Card>
    <!-- Title & Counter Header -->
    <CardHeader>
      <div class="flex items-center justify-between border-b border-[#dfdfdf] dark:border-[#333333] pb-3">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-[#171717] dark:text-[#ffffff]">
            List of Barangays
          </h2>
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#fafafa] dark:bg-[#1c1c1c] text-[#707070] dark:text-[#a3a3a3] border border-[#dfdfdf] dark:border-[#333333]">
           {{ filteredBarangays.length }} of {{ barangays.length }}
        </span>
      </div>
       <!-- Search Bar -->
      <div class="relative mt-4">
        <input
          :value="searchQuery"
          @input="e => setSearchQuery((e.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search barangay, official..."
          class="w-full pl-9 pr-8 py-2 text-xs rounded-md border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] placeholder-[#707070] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#dc2626] transition-colors"
        />
        <Search class="size-4 text-[#707070] dark:text-[#a3a3a3] absolute left-2.5 top-2.5" aria-hidden="true" />
        <button
          v-if="searchQuery"
          type="button"
          @click="setSearchQuery('')"
          class="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#171717] dark:hover:text-[#ffffff] transition-colors"
          aria-label="Clear search"
        >
          <X class="size-4" />
        </button>
      </div>

    </CardHeader>
   
   
    <!-- Scrollable Barangays List -->
     <CardContent>
        <div class="space-y-1 max-h-135 overflow-y-auto pr-1 pb-4">
          <div v-if="filteredBarangays.length === 0" class="p-6 text-center text-xs text-[#707070] dark:text-[#a3a3a3]">
            No barangays found matching "{{ searchQuery }}"
          </div>

          <button
            v-for="brgy in filteredBarangays"
            :key="brgy.id"
            type="button"
            @click="selectBarangay(brgy.id)"
            :class="[
              'w-full text-left p-3 rounded-lg border transition-all duration-150 flex items-center justify-between group',
              selectedBarangayId === brgy.id
                ? ' dark:bg-[#dc2626]/20 border-[#dc2626] text-[#dc2626] dark:text-[#f87171]'
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
</template>
