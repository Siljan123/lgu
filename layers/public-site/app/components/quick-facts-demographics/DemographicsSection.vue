<script setup lang="ts">
const { censusData, municipalFacts } = useDemographics()

// Calculate maximum population for visual growth bar scaling
const maxPopulation = computed(() => {
  return Math.max(...censusData.value.map(item => item.population))
})

const getGrowthBarWidth = (pop: number) => {
  return `${Math.round((pop / maxPopulation.value) * 100)}%`
}

const activeTab = ref('all')
</script>

<template>
  <section class="py-16 md:py-24 bg-background text-[#171717] dark:text-[#ffffff]">
   
    
    <div class="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
      <!-- Section Header -->
      <div class="max-w-3xl space-y-3">
        <h2 class="text-3xl md:text-4xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
          Demographics & Municipal Data
        </h2>
        <p class="text-base text-[#707070] dark:text-[#9a9a9a] leading-relaxed">
          Official population census, historical growth statistics, and key municipal indicators of San Francisco, Agusan del Sur.
        </p>
      </div>

      <!-- Main Grid: Demographic Table & Municipal Fact Card -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Municipal Profile Card with Photo (5 cols) -->
        <div class="lg:col-span-5 bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2c2c2c] rounded-2xl overflow-hidden shadow-xs flex flex-col">
          
          <!-- Card Image Header -->
          <div class="relative h-64 w-full bg-[#1c1c1c] overflow-hidden group">
            <img 
              src="/images/municipal_hall.jpg" 
              alt="San Francisco Municipal Hall, Agusan del Sur"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            <!-- Floating Badge Overlays -->
            <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span class="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
                LGU Profile
              </span>
              <span class="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-mono rounded-full border border-white/20">
                8°31′N 125°59′E
              </span>
            </div>

            <div class="absolute bottom-4 left-4 right-4 text-white">
              <h3 class="text-xl font-medium tracking-tight">San Francisco</h3>
              <p class="text-xs text-white/80">Agusan del Sur, Caraga Region XIII</p>
            </div>
          </div>

          <!-- Card Content Grid -->
          <div class="p-6 space-y-6 flex-1">
            <div class="flex items-center justify-between border-b border-[#dfdfdf] dark:border-[#2c2c2c] pb-4">
              <h4 class="text-sm font-semibold uppercase tracking-wider text-[#171717] dark:text-[#ffffff]">
                Municipal of San Francisco
              </h4>
              <span class="text-xs text-[#707070] dark:text-[#9a9a9a]">1st Class Municipality</span>
            </div>

            <!-- Grouped Data Fields -->
            <div class="space-y-6 max-h-[500px] overflow-y-auto pr-1">
              <div 
                v-for="(section, sIdx) in municipalFacts" 
                :key="sIdx"
                class="space-y-3"
              >
                <h5 class="text-xs font-semibold uppercase tracking-wider text-[#707070] dark:text-[#9a9a9a] bg-[#fafafa] dark:bg-[#252525] px-3 py-1.5 rounded-md border border-[#dfdfdf] dark:border-[#333]">
                  {{ section.title }}
                </h5>

                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div 
                    v-for="(item, iIdx) in section.items" 
                    :key="iIdx" 
                    class="flex flex-col py-1 border-b border-[#f0f0f0] dark:border-[#262626] last:border-0"
                  >
                    <dt class="text-[#707070] dark:text-[#9a9a9a] font-normal">{{ item.label }}</dt>
                    <dd 
                      class="font-medium mt-0.5 text-[#171717] dark:text-[#ffffff]"
                      :class="{ 'text-[oklch(0.497_0.18_26.815)] dark:text-red-400 font-semibold': item.highlight }"
                    >
                      <a 
                        v-if="item.link" 
                        :href="item.link" 
                        target="_blank" 
                        rel="noopener"
                        class="underline hover:text-[oklch(0.497_0.18_26.815)] transition-colors"
                      >
                        {{ item.value }}
                      </a>
                      <span v-else>{{ item.value }}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

          </div>

        </div>

        <!-- Right Column: Historical Population Census Table (7 cols) -->
        <div class="lg:col-span-7 bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2c2c2c] rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfdfdf] dark:border-[#2c2c2c] pb-5">
            <div>
              <h3 class="text-xl font-medium text-[#171717] dark:text-[#ffffff] tracking-tight">
                Population Census History
              </h3>
              <p class="text-xs text-[#707070] dark:text-[#9a9a9a] mt-1">
                San Francisco growth rate per census year (1960–2020)
              </p>
            </div>
            <div class="inline-flex items-center gap-2 text-xs text-[#707070] dark:text-[#9a9a9a] bg-[#fafafa] dark:bg-[#222] px-3 py-1.5 rounded-md border border-[#dfdfdf] dark:border-[#333]">
              <span class="font-medium text-[#171717] dark:text-[#fff]">27</span> Barangays
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs uppercase text-[#707070] dark:text-[#9a9a9a] bg-[#fafafa] dark:bg-[#242424] border-y border-[#dfdfdf] dark:border-[#2e2e2e]">
                <tr>
                  <th scope="col" class="py-3 px-4 font-medium">Census Year</th>
                  <th scope="col" class="py-3 px-4 font-medium text-right">Population</th>
                  <th scope="col" class="py-3 px-4 font-medium text-right">Growth / Yr</th>
                  <th scope="col" class="py-3 px-4 font-medium hidden sm:table-cell">Distribution</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#dfdfdf] dark:divide-[#2e2e2e]">
                <tr 
                  v-for="row in censusData" 
                  :key="row.year"
                  class="hover:bg-[#fafafa] dark:hover:bg-[#222] transition-colors group"
                >
                  <td class="py-3.5 px-4 font-medium text-[#171717] dark:text-[#ffffff] tabular-nums">
                    {{ row.year }}
                  </td>
                  <td class="py-3.5 px-4 text-right font-medium text-[#171717] dark:text-[#ffffff] tabular-nums">
                    {{ row.population.toLocaleString() }}
                  </td>
                  <td class="py-3.5 px-4 text-right tabular-nums">
                    <span 
                      class="inline-block px-2 py-0.5 rounded text-xs font-medium"
                      :class="row.growthRate.startsWith('+') ? 'bg-[#f0fdf4] dark:bg-[#14321d] text-[#166534] dark:text-[#4ade80]' : 'text-[#707070] dark:text-[#9a9a9a]'"
                    >
                      {{ row.growthRate }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 hidden sm:table-cell">
                    <div class="w-full bg-[#f0f0f0] dark:bg-[#333] h-2 rounded-full overflow-hidden">
                      <div 
                        class="bg-[#171717] dark:bg-[#ffffff] group-hover:bg-[oklch(0.497_0.18_26.815)] h-full transition-all duration-500 rounded-full"
                        :style="{ width: getGrowthBarWidth(row.population) }"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot class="border-t border-[#dfdfdf] dark:border-[#2e2e2e] text-xs text-[#707070] dark:text-[#9a9a9a]">
                <tr>
                  <td colspan="4" class="py-3 px-4 text-left">
                    Source: Philippine Statistics Authority (PSA) Census of Population (1960–2020)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
