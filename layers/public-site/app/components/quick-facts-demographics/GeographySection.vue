<script setup lang="ts">
import { ref } from 'vue'

const { climateData } = useGeography()
const isExpanded = ref(true)
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Formats "27 (81)" into "27 <span class='...'>81)</span>" for better visual hierarchy
const formatCellValue = (val: string) => {
  if (val.includes('(')) {
    const parts = val.split('(')
    return `${parts[0]?.trim()} <span class="text-[#707070] dark:text-[#888888] text-xs font-normal ml-0.5">(${parts[1]}</span>`
  }
  return val
}
</script>

<template>
  <Card>
    <div class="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">  
      <!-- Accordion Container -->
      
      <div class="border border-[#dfdfdf] dark:border-[#2e2e2e] rounded-2xl overflow-hidden bg-[#fafafa] dark:bg-[#202020] shadow-xs">
        <button 
          class="w-full flex items-center justify-between px-6 md:px-8 py-6 bg-[#fafafa] dark:bg-[#202020] hover:bg-[#f2f2f2] dark:hover:bg-[#252525] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-[#ffffff] cursor-pointer"
          @click="isExpanded = !isExpanded"
          :aria-expanded="isExpanded"
        >
          <div class="flex items-center gap-4">
            <div class="text-left">
              <h2 class="text-2xl md:text-3xl font-medium tracking-tight text-[#171717] px-4 dark:text-[#ffffff]">Geography &amp; Climate</h2>
           
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2e2e2e] flex items-center justify-center text-[#707070] dark:text-[#9a9a9a]">
              <svg 
                class="w-4 h-4 transition-transform duration-300"
                :class="{ 'rotate-180': !isExpanded }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>
  
     
        <div 
          v-show="isExpanded" 
          class="px-6 md:px-8 py-8 border-t border-[#dfdfdf] dark:border-[#2e2e2e] bg-white dark:bg-[#1c1c1c] space-y-8"
        >
          <p class="text-base text-[#707070] dark:text-[#9a9a9a] leading-relaxed">
            According to official statistics from the Philippine Statistics Authority (PSA), the municipality of San Francisco covers a total land area of 392.53 square kilometres (151.56 sq mi), representing 3.93% of the 9,989.52-square-kilometre total land area of the province of Agusan del Sur.
          </p>

          <div class="space-y-4 pt-2">
            <div class="border border-[#dfdfdf] dark:border-[#2e2e2e]  overflow-hidden bg-white dark:bg-[#1c1c1c] shadow-xs">
              <div class="overflow-x-auto">
                <table class="w-full text-xs md:text-sm text-center whitespace-nowrap">
                  <thead class="bg-[#fafafa] dark:bg-[#242424] border-b border-[#dfdfdf] dark:border-[#2e2e2e] text-[#171717] dark:text-[#ffffff]">
                    <tr>
                      <th colspan="14" class="py-3.5 px-4 text-xs md:text-sm font-semibold uppercase tracking-wider text-[oklch(0.497_0.18_26.815)] dark:text-red-400 border-b border-[#dfdfdf] dark:border-[#2e2e2e]">
                        Climate Data for San Francisco, Agusan del Sur
                      </th>
                    </tr>
                    <tr class="text-[#707070] dark:text-[#9a9a9a] ">
                      <th class="py-3 px-4 font-medium text-left">Month</th>
                      <th v-for="month in months" :key="month" class="py-3 px-4 bg-background font-medium">{{ month }}</th>
                      <th class="py-3 px-4 font-semibold text-[#171717] dark:text-[#ffffff] bg-[#f0f0f0] dark:bg-[#2a2a2a]">Year</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#dfdfdf] dark:divide-[#2e2e2e]">
                    <tr v-for="(row, idx) in climateData" :key="idx" class="hover:bg-[#fafafa] dark:hover:bg-[#222222] transition-colors">
                      <td class="py-3.5 px-4 text-left font-medium bg-[#fafafa] dark:bg-[#242424] ">{{ row.label }}</td>
                      <td v-for="(val, vIdx) in row.values" :key="vIdx" class="py-3.5 px-3 text-[] dark:text-[#e0e0e0] tabular-nums">
                        <span v-html="formatCellValue(val)"></span>
                      </td>
                      <td class="py-3.5 px-4 font-semibold text-[#171717] dark:text-[#ffffff] bg-[#fafafa] dark:bg-[#242424] tabular-nums">
                        <span v-html="formatCellValue(row.year)"></span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-[#fafafa] dark:bg-[#242424] border-t border-[#dfdfdf] dark:border-[#2e2e2e]">
                    <tr>
                      <td colspan="14" class="py-3 px-4 text-left text-xs text-[#707070] dark:text-[#9a9a9a]">
                        Source: Meteoblue (calculated / modeled climate statistics for San Francisco, Agusan del Sur)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Card>
</template>

