<script setup lang="ts">
import { useBarangayDirectory } from '../../composables/useBarangayDirectory'
import BarangayDirectorySidebar from './BarangayDirectorySidebar.vue'
import BarangayDirectoryHeaderStats from './BarangayDirectoryHeaderStats.vue'
import BarangayMiniMapCard from './BarangayMiniMapCard.vue'
import BarangayOfficialsOrgChart from './BarangayOfficialsOrgChart.vue'

const { selectedBarangay } = useBarangayDirectory()
</script>

<template>
  <section class="w-full bg-[#fafafa] dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] py-10 md:py-14 transition-colors">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Sidebar Navigation (Sticky on Desktop) -->
        <div class="lg:col-span-4 lg:sticky lg:top-24">
          <BarangayDirectorySidebar />
        </div>

        <!-- Main Details Content Area -->
        <main v-if="selectedBarangay" class="lg:col-span-8 space-y-8">
          
          <!-- Heading Section & Stats Card -->
          <BarangayDirectoryHeaderStats :barangay="selectedBarangay" />

          <!-- Mini Map Card -->
          <BarangayMiniMapCard :barangay="selectedBarangay" />

          <!-- Barangay Officials Org Chart Tree -->
          <BarangayOfficialsOrgChart
            :officials="selectedBarangay.officials"
            :barangay-name="selectedBarangay.name"
          />

        </main>

      </div>

    </div>
  </section>
</template>
