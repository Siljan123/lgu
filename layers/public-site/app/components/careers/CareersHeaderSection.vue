<script setup lang="ts">
import { Building2, ShieldCheck, Briefcase, TrendingUp, Award } from '@lucide/vue'

defineProps<{
  vacanciesCount: number
  promotionsCount: number
  awardsCount: number
}>()
</script>

<template>
  <section class="w-full bg-[#ffffff] dark:bg-[#1c1c1c] border-b border-[#dfdfdf] dark:border-[#2a2a2a] py-8 md:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div class="lg:col-span-8 space-y-4">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-primary leading-tight">
            Human Resource Corner
          </h1>

          <p class="text-base md:text-lg text-[#707070] dark:text-[#a3a3a3] leading-relaxed max-w-[72ch]">
            The Human Resource Corner keeps residents and job seekers informed about opportunities, achievements, and career growth within the Local Government Unit of San Francisco, Agusan del Sur. This section is regularly updated by the Human Resource Management Office (HRMO) in line with the Municipality's commitment to transparency and good governance.
          </p>
        </div>
        <div class="lg:col-span-4 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          <div class="p-4 border-l border-b border-[#dfdfdf] flex items-center justify-between">
            <div class="space-y-0.5">
              <span class="text-xs uppercase font-medium text-[#707070] dark:text-[#a3a3a3] tracking-wider block">Plantilla Openings</span>
              <span class="text-2xl sm:text-3xl font-semibold text-primary block leading-none">{{ vacanciesCount }}</span>
            </div>
          </div>
          <div class="p-4 border-l border-b border-[#dfdfdf] flex items-center justify-between">
            <div class="space-y-0.5">
              <span class="text-xs uppercase font-medium text-[#707070] dark:text-[#a3a3a3] tracking-wider block">Recent Promotions</span>
              <span class="text-2xl sm:text-3xl font-semibold text-primary block leading-none">{{ promotionsCount }}</span>
            </div>
          </div>

          <div class="p-4 border-l border-b border-[#dfdfdf] flex items-center justify-between">
            <div class="space-y-0.5">
              <span class="text-xs uppercase font-medium text-[#707070] dark:text-[#a3a3a3] tracking-wider block">Service Awards</span>
              <span class="text-2xl sm:text-3xl font-semibold text-primary block leading-none">{{ awardsCount }}</span>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
