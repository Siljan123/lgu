<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useBarangayDirectory } from '../../composables/useBarangayDirectory'
import BarangayDirectorySidebar from './BarangayDirectorySidebar.vue'
import BarangayDirectoryHeaderStats from './BarangayDirectoryHeaderStats.vue'
import BarangayMiniMapCard from './BarangayMiniMapCard.vue'
import BarangayOfficialsOrgChart from './BarangayOfficialsOrgChart.vue'

const {
  barangays,
  selectedBarangay,
  isLoading,
  terms,
  fetchBarangays,
  fetchBarangayById,
  fetchTerms,
  selectBarangay
} = useBarangayDirectory()

// Automatically load full details (officials) when a barangay becomes active
watch(
  () => selectedBarangay.value?.id,
  (newId) => {
    if (newId) {
      const current = selectedBarangay.value
      if (!current?.officials || current.officials.length === 0) {
        fetchBarangayById(newId)
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (barangays.value.length === 0) {
    await fetchBarangays()
  }
  if (terms.value.length === 0) {
    await fetchTerms()
  }
  if (barangays.value.length > 0) {
    const currentId = selectedBarangay.value?.id || barangays.value[0]!.id
    await selectBarangay(currentId)
  }
})


</script>

<template>
  <section class="w-full p-4 sm:p-6 lg:p-8 transition-colors min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading Skeleton (when initially loading list) -->
      <div v-if="isLoading && barangays.length === 0" class="animate-pulse space-y-6">
        <div class="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-2xl w-full"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-3 h-120 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          <div class="lg:col-span-9 h-120 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
        </div>
      </div>

      <!-- Main Directory Layout -->
      <div v-else class="space-y-6">
        <BarangayDirectoryHeaderStats 
          v-if="selectedBarangay" 
          :barangay="selectedBarangay" 
        />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          <!-- Sidebar / Filter Bar -->
          <div class="lg:col-span-3 px-1 sm:px-2 lg:sticky lg:top-24">
            <BarangayDirectorySidebar :is-admin="false" />
          </div>

          <!-- Main Content Area -->
          <main class="lg:col-span-9 min-w-0 space-y-6 md:space-y-8">
            <div v-if="selectedBarangay" class="space-y-6 md:space-y-8">
              <BarangayMiniMapCard :barangay="selectedBarangay" />
              <div class="w-full overflow-x-auto">
                <BarangayOfficialsOrgChart
                  :officials="selectedBarangay.officials ?? []"
                  :barangay-name="selectedBarangay.name"
                  :barangay-id="selectedBarangay.id"
                  :is-admin="false"
                />
              </div>
            </div>

            <div 
              v-else 
              class="py-16 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#dfdfdf] dark:border-[#333333]"
            >
              <p class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No Barangay Selected</p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Select a barangay from the list on the left to view details and organizational structure.</p>
              <button
                v-if="barangays.length === 0"
                type="button"
                @click="fetchBarangays"
                class="mt-4 px-4 py-2 text-xs font-semibold bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] transition-colors cursor-pointer"
              >
                Reload from Supabase
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  </section>
</template>