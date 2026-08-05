<script setup lang="ts">
import { useCitizensCharterData } from '../../composables/useCitizensCharter'
import CitizensCharterTable from './CitizensCharterTable.vue'
import {X} from '@lucide/vue'

const {
  searchQuery,
  selectedServiceId,
  selectedService,
  filteredDepartments,
  selectService
} = useCitizensCharterData()
</script>

<template>
  <section class="w-full bg-white dark:bg-[#08090b] text-neutral-900 dark:text-neutral-100 font-sans min-h-screen flex flex-col justify-between  selection:text-white dark:selection:text-black transition-colors duration-200">
    
    <!-- Main 2-Column Layout (LEFT: Main Table Output | RIGHT: Scrollable Office Navigation Sidebar) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[85vh] border-b border-neutral-200 dark:border-[#1c2128]">
      
      <!-- LEFT COLUMN: Main Output & Service Detail Table (8 cols on desktop) -->
      <div class="lg:col-span-8 p-6 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-[#1c2128] bg-white dark:bg-[#08090b]">
        
        <div class="space-y-6 w-full max-w-5xl mx-auto">
          
          <!-- Section Title & Headline -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-neutral-950  font-bold leading-none mb-2">
                Citizen's Charter<span class="inline-block ml-1">.</span>
              </h1>
              <p class="italic text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-normal mt-1">
                Transparent public service standards & standard operating procedure specifications.
              </p>
            </div>
            
            <div class="text-xs text-neutral-500 dark:text-neutral-500 space-y-0.5 text-right hidden sm:block">
              <p>Republic Act 11032 Compliant</p>
              <p class="font-medium">No Noon Break Policy</p>
            </div>
          </div>

          <!-- Selected Service Overview Banner Card -->
          <div class="rounded-md border border-neutral-200 dark:border-gray-600 overflow-hidden 0 shadow-xs">
            
            <!-- Top Banner Header Strip -->
            <div class="bg-red-800 text-white  py-3 px-6 text-xs font-semibold uppercase tracking-wider flex flex-wrap items-center justify-between border-b gap-2">
              <span class="truncate font-bold">{{ selectedService?.serviceRendered }}</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] shrink-0 font-medium">
                Standard Process Standard
              </span>
            </div>

            <!-- Specs Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-[#202630] border-b border-neutral-200 dark:border-[#202630] bg-white dark:bg-[#11141a] text-xs">
              <div class="p-3.5 text-center">
                <span class="text-neutral-500 dark:text-neutral-500 block text-[10px] uppercase font-semibold">Availability</span>
                <span class="text-neutral-900 dark:text-neutral-200 font-medium block mt-0.5">{{ selectedService?.availability }}</span>
              </div>
              <div class="p-3.5 text-center">
                <span class="text-neutral-500 dark:text-neutral-500 block text-[10px] uppercase font-semibold">Requirements</span>
                <span class="text-neutral-900 dark:text-neutral-200 font-medium block mt-0.5">{{ selectedService?.requirements }}</span>
              </div>
              <div class="p-3.5 text-center">
                <span class="text-neutral-500 dark:text-neutral-500 block text-[10px] uppercase font-semibold">Fees</span>
                <span class=" font-bold block mt-0.5">{{ selectedService?.fees }}</span>
              </div>
            </div>

            <!-- Interactive Steps Table Output -->
            <div class="p-4 sm:p-6 bg-white dark:bg-[#0c0e11] space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-neutral-800 dark:text-neutral-300 uppercase tracking-wider font-bold flex items-center gap-2">
                  <span class="w-2 h-2 rounded-sm"></span>
                  Detailed Client & Provider Workflow
                </span>
                <span class="text-xs font-bold  px-2.5 py-0.5 rounded border">
                  Total Time: {{ selectedService?.totalProcessingTime }}
                </span>
              </div>

              <!-- Workflow Table Component -->
              <CitizensCharterTable  v-if="selectedService"
                :steps="selectedService.steps"
                :totalProcessingTime="selectedService.totalProcessingTime"
              />
            </div>

            <!-- Card Footer -->
            <div class="px-6 py-2.5 bg-neutral-50 dark:bg-[#0a0c0f] border-t border-neutral-200 dark:border-[#1e232b] flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-500">
              <span>San Francisco, Agusan del Sur • MEEDMO Public Charter</span>
              <span>Continuous Daily Operations</span>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 p-6 lg:p-8 bg-neutral-50 dark:bg-[#070809] flex flex-col justify-start">
        <!-- Sidebar Sticky Header & Search Input -->
        <div class="sticky top-0 z-10 pb-4 space-y-4 bg-neutral-50 dark:bg-[#070809]">
          <div class="flex items-center justify-between">
            <h2 class="text-xs uppercase tracking-wider font-bold text-neutral-900 dark:text-white">
              Select Office Service Desk
            </h2>
            <span class="text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-200/80 dark:bg-[#1a1f26] px-2 py-0.5 rounded">
              {{ filteredDepartments.flatMap(d => d.services).length }} Services
            </span>
          </div>

          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Search office services..."
              class="w-full pl-9 pr-8 py-2 text-xs rounded border border-neutral-300 dark:border-[#222832] bg-white dark:bg-[#0d0f13] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none transition-colors"
            />
            <svg class="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute right-2.5 top-1.5 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
             <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Scrollable Department & Service Item Navigation Tree (Laravel Docs Style) -->
        <div class="overflow-y-auto max-h-[calc(100vh-220px)] pr-2 space-y-6 custom-scrollbar">
          
          <!-- No Results Fallback -->
          <div v-if="filteredDepartments.length === 0" class="py-8 text-center text-xs text-neutral-500">
            No office services found matching "<span class="text-neutral-800 dark:text-neutral-300">{{ searchQuery }}</span>"
          </div>

          <!-- Grouped Department Section -->
          <div 
            v-for="dept in filteredDepartments" 
            :key="dept.id"
            class="space-y-2"
          >
            <!-- Department Group Header -->
            <div class="flex items-center gap-2 pt-1 pb-1">
              <span class="w-1.5 h-1.5 rounded-sm"></span>
              <h3 class="text-xs uppercase tracking-wider font-bold text-neutral-700 dark:text-neutral-300">
                {{ dept.name }}
              </h3>
            </div>

            <!-- Service Items List with Laravel-style Active Indicator Bar -->
            <ul class="space-y-1 pl-2 border-l border-neutral-200 dark:border-[#1e242c]">
              <li v-for="service in dept.services" :key="service.id">
                <button
                  @click="selectService(service.id)"
                  :class="[
                    'w-full text-left py-2.5 px-3 rounded transition-all text-xs relative flex items-center justify-between group cursor-pointer',
                    selectedServiceId === service.id
                      ? 'bg-neutral-200/70 dark:bg-[#141820] text-neutral-950 dark:text-white font-semibold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#0e1116]'
                  ]"
                >
                  <span 
                    :class="[
                      'absolute -left-[9px] top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r transition-all',
                      selectedServiceId === service.id 
                        ? 'bg-red-600  opacity-100' 
                        : 'bg-transparent opacity-0 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700'
                    ]"
                  ></span>

                  <!-- Service Name -->
                  <span class="truncate pr-2 leading-snug">{{ service.serviceRendered }}</span>

                  <!-- Badge showing time -->
                  <span 
                    :class="[
                      'text-[10px] px-1.5 py-0.5 rounded shrink-0 transition-colors',
                      selectedServiceId === service.id
                        ? ' font-bold border'
                        : 'bg-neutral-200/60 dark:bg-[#181d24] text-neutral-500 dark:text-neutral-400'
                    ]"
                  >
                    {{ service.totalProcessingTime }}
                  </span>
                </button>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* Custom scrollbar styling for the sidebar navigation tree */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(160, 160, 160, 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(160, 160, 160, 0.5);
}
</style>
