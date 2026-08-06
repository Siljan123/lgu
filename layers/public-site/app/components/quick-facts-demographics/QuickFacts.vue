<script setup lang="ts">
const props = withDefaults(defineProps<{
  content?: string
  imageSrc?: string
  imageAlt?: string
}>(), {
  imageSrc: '/images/san_francisco_overview.jpg',
  imageAlt: 'San Francisco, Agusan del Sur Aerial Landscape & Overview'
})

const { content: defaultContent } = useQuickFacts()
const { quickStats } = useDemographics()

const displayContent = computed(() => props.content || defaultContent)
</script>

<template>
  <section class="py-12 md:py-16  text-[#171717] bg-[#fafafa] dark:bg-[#202020] dark:text-[#ffffff] border-b border-[#dfdfdf] dark:border-[#2a2a2a]">
    <div class=" mx-auto px-6 lg:px-8 space-y-8 md:space-y-10">
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div 
          v-for="(stat, idx) in quickStats" 
          :key="idx" 
          class="p-5 md:p-8 bg-[#fafafa] dark:bg-[#202020] border-r border-[#dfdfdf] dark:border-[#2e2e2e] flex flex-2 justify-between hover:border-[#c7c7c7] dark:hover:border-[#444] transition-all"
        >
          <div>
            <span class="text-sm uppercase tracking-wider text-[#707070] dark:text-[#a0a0a0] font-medium block mb-1">
              {{ stat.label }}
            </span>
            <p class="text-xs text-[oklch(0.497_0.18_26.815)] dark:text-red-400  mt-3 font-normal">
            {{ stat.subtext }}
          </p>
          </div>
         
           <div class="text-xl md:text-2xl font-semibold text-[#171717] dark:text-[#ffffff] tracking-tight tabular-nums">
              {{ stat.value }}
            </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <!-- Overview Text Container (7 cols) -->
        <div class="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-4">
            
              <h2 class="text-md font-semibold uppercase tracking-widest text-[#707070] dark:text-[#a0a0a0]">
                Quick Facts
              </h2>
            </div>
            <p class="text-base md:text-lg text-[#171717] dark:text-[#e0e0e0] leading-relaxed whitespace-pre-line font-sans">
              {{ displayContent }}
            </p>
          </div>
        </div>

        <!-- Sample Reference Image Card (5 cols) -->
        <div class="lg:col-span-5 bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] overflow-hidden shadow-xs relative flex flex-col group min-h-[300px] md:min-h-[360px]">
          <div class="relative w-full h-full min-h-[300px] bg-[#1a1a1a] overflow-hidden flex-1">
            <img 
              :src="props.imageSrc" 
              :alt="props.imageAlt" 
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 absolute inset-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <!-- Floating Top Badges -->
            <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span class="px-3 py-1">
              </span>
              <span class="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-mono rounded-full border border-white/20">
                Agusan del Sur
              </span>
            </div>

            <!-- Floating Bottom Caption -->
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <h3 class="text-lg font-medium tracking-tight">San Francisco Townscape</h3>
              <p class="text-xs text-white/80">Caraga Region XIII &bull; 1st Class Municipality</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>