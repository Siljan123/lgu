<script setup lang="ts">
import {
  Plane,
  Bus,
  Ship,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  CheckCircle2,
  Building2,
  Info
} from '@lucide/vue'
import { useTravelersGuide } from '../../composables/useTravelersGuide'

const { gettingThereOptions, terminalHubInfo } = useTravelersGuide()

const activeTab = ref<'All' | 'Air' | 'Land' | 'Sea' | 'Hub'>('All')

const filteredOptions = computed(() => {
  if (activeTab.value === 'All' || activeTab.value === 'Hub') {
    return gettingThereOptions.value
  }
  return gettingThereOptions.value.filter(opt => opt.mode === activeTab.value)
})

const getModeIcon = (mode: string) => {
  if (mode === 'Air') return Plane
  if (mode === 'Sea') return Ship
  return Bus
}
</script>

<template>
  <section id="getting-there" class="space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-tight text-[#171717] dark:text-[#ffffff]">
        Getting to San Francisco, Agusan del Sur
      </h2>
      <p class="text-base text-[#707070] dark:text-[#a3a3a3] max-w-3xl">
        Strategically located at the junction of the Asian Highway AH26 (Pan-Philippine Highway), San Francisco is accessible via direct land buses, nearby airports in Butuan and Davao, and regional ferry ports.
      </p>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex flex-wrap items-center gap-2 border-b border-[#dfdfdf] dark:border-[#2e2e2e] pb-3">
      <button
        type="button"
        class="px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'All' ? 'bg-[#85181a] text-white dark:bg-[#ef4444]' : 'bg-[#fafafa] dark:bg-[#202020] text-[#171717] dark:text-[#d4d4d4] hover:bg-[#efefef] dark:hover:bg-[#2a2a2a]'"
        @click="activeTab = 'All'"
      >
        <Compass class="w-4 h-4" />
        All Routes
      </button>

      <button
        type="button"
        class="px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'Air' ? 'bg-[#85181a] text-white dark:bg-[#ef4444]' : 'bg-[#fafafa] dark:bg-[#202020] text-[#171717] dark:text-[#d4d4d4] hover:bg-[#efefef] dark:hover:bg-[#2a2a2a]'"
        @click="activeTab = 'Air'"
      >
        <Plane class="w-4 h-4" />
        By Air (Airports)
      </button>

      <button
        type="button"
        class="px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'Land' ? 'bg-[#85181a] text-white dark:bg-[#ef4444]' : 'bg-[#fafafa] dark:bg-[#202020] text-[#171717] dark:text-[#d4d4d4] hover:bg-[#efefef] dark:hover:bg-[#2a2a2a]'"
        @click="activeTab = 'Land'"
      >
        <Bus class="w-4 h-4" />
        By Land (Buses & Vans)
      </button>

      <button
        type="button"
        class="px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'Sea' ? 'bg-[#85181a] text-white dark:bg-[#ef4444]' : 'bg-[#fafafa] dark:bg-[#202020] text-[#171717] dark:text-[#d4d4d4] hover:bg-[#efefef] dark:hover:bg-[#2a2a2a]'"
        @click="activeTab = 'Sea'"
      >
        <Ship class="w-4 h-4" />
        By Sea (Ferry Ports)
      </button>

      <button
        type="button"
        class="px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        :class="activeTab === 'Hub' ? 'bg-[#85181a] text-white dark:bg-[#ef4444]' : 'bg-[#fafafa] dark:bg-[#202020] text-[#171717] dark:text-[#d4d4d4] hover:bg-[#efefef] dark:hover:bg-[#2a2a2a]'"
        @click="activeTab = 'Hub'"
      >
        <Building2 class="w-4 h-4" />
        New Terminal Hubang
      </button>
    </div>

    <div v-if="activeTab !== 'Hub'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="opt in filteredOptions"
        :key="opt.id"
        class="flex flex-col justify-between p-6 rounded-md bg-[#ffffff] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2e2e2e] shadow-sm hover:border-[#85181a]/50 dark:hover:border-[#ef4444]/50 transition-all space-y-4"
      >
        <div class="space-y-3">

          <h3 class="text-lg font-semibold text-[#171717] dark:text-[#ffffff] leading-snug">
            {{ opt.title }}
          </h3>

          <div class="space-y-1.5 text-xs text-[#707070] dark:text-[#a3a3a3]">
            <div class="flex items-start gap-1.5">
              <MapPin class="w-3.5 h-3.5 shrink-0 text-[#85181a] dark:text-[#ef4444] mt-0.5" />
              <span>{{ opt.hub }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 shrink-0 text-[#85181a] dark:text-[#ef4444]" />
              <span>{{ opt.distanceTime }}</span>
            </div>
          </div>

          <p class="text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ opt.description }}
          </p>

          <!-- Step-by-Step Connection Instructions -->
          <div class="pt-2 border-t border-[#dfdfdf] dark:border-[#2e2e2e] space-y-2">
            <div class="text-[11px] uppercase font-bold tracking-wider text-[#171717] dark:text-[#ffffff]">
              Connection Steps:
            </div>
            <ol class="space-y-1.5 text-xs text-[#707070] dark:text-[#a3a3a3]">
              <li v-for="(step, idx) in opt.steps" :key="idx" class="flex items-start gap-2">
                <span class="flex items-center justify-center w-4 h-4 rounded-full bg-[#fafafa] dark:bg-[#252525] border border-[#dfdfdf] dark:border-[#333333] text-[10px] font-bold text-[#85181a] dark:text-[#ef4444] shrink-0 mt-0.5">
                  {{ idx + 1 }}
                </span>
                <span class="leading-normal">{{ step }}</span>
              </li>
            </ol>
          </div>
        </div>

      </div>
    </div>

    <!-- Spotlight Section: San Francisco Integrated Terminal (Brgy. Hubang) -->
    <div class="p-6 md:p-8 space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#dfdfdf] dark:border-[#2e2e2e] pb-5">
        <div class="space-y-1">
          <h3 class="text-xl md:text-2xl font-bold text-[#171717] dark:text-[#ffffff]">
            {{ terminalHubInfo.name }}
          </h3>
          <p class="text-xs md:text-sm text-[#707070] dark:text-[#a3a3a3]">
            {{ terminalHubInfo.location }} ({{ terminalHubInfo.operatingHours }})
          </p>
        </div>

      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="(bay, idx) in terminalHubInfo.bays"
          :key="idx"
          class="p-4 bg-[#ffffff] dark:bg-[#1c1c1c] border-r border-[#dfdfdf] dark:border-[#2e2e2e] space-y-2"
        >
          <div class="text-xs font-bold text-[#85181a] dark:text-[#ef4444] uppercase tracking-wider">
            {{ bay.name }}
          </div>
          <div class="text-xs text-[#171717] dark:text-[#ffffff] font-medium">
            Destinations: <span class="font-normal text-[#707070] dark:text-[#a3a3a3]">{{ bay.destinations }}</span>
          </div>
          <div class="text-xs text-[#171717] dark:text-[#ffffff] font-medium">
            Operators: <span class="font-normal text-[#707070] dark:text-[#a3a3a3]">{{ bay.vehicles }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
