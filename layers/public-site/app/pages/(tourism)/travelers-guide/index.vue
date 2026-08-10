<script setup lang="ts">
import GettingThereSection from '../../../components/travelers-guide/GettingThereSection.vue'
import LocalTransportSection from '../../../components/travelers-guide/LocalTransportSection.vue'
definePageMeta({
  layout: 'guest'
})

useHead({
  title: "Traveler's Guide & Visitor Information — San Francisco, Agusan del Sur",
  meta: [
    {
      name: 'description',
      content: 'Essential visitor guide for San Francisco, Agusan del Sur. Includes local transport fares (Poblacion to New Terminal Hubang), how to get there, Mt. Magdiwata trekking permits, Agusan Marsh rules, and emergency hotlines.'
    }
  ]
})
</script>

<template>
  <div class="bg-[#ffffff] dark:bg-[#1c1c1c] min-h-dvh flex flex-col transition-colors">
    <!-- Hero Section -->
    <UiHeroSection
      title="Traveler's Guide & Visitor Information"
      description="Everything a first-time visitor, eco-tourist, or commuter needs: transit routes, local fare matrices, watershed permits, and emergency assistance in San Francisco, Agusan del Sur."
      image="/images/destinations/mt_magdiwata.jpg"
      image-alt="San Francisco Agusan del Sur landscape and traveler guide"
    />

    <!-- Quick Access Navigation Bar -->
    <div class="sticky top-0 z-30 bg-[#ffffff]/90 dark:bg-[#1c1c1c]/90 backdrop-blur-md border-b border-[#dfdfdf] dark:border-[#2e2e2e]">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto text-xs md:text-sm font-medium text-[#707070] dark:text-[#a3a3a3]">
        <div class="flex items-center gap-3 shrink-0">
          <span class="text-[#171717] dark:text-[#ffffff] font-semibold">Quick Access:</span>
          <NuxtLink
            to="/travelers-guide/getting-there"
            class="px-3 py-1.5 rounded-lg bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] hover:border-[#85181a] dark:hover:border-[#ef4444] text-[#171717] dark:text-[#ffffff] transition-all"
          >
            Getting There & Connections
          </NuxtLink>
          <NuxtLink
            to="/travelers-guide/local-transport-fares"
            class="px-3 py-1.5 rounded-lg bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] hover:border-[#85181a] dark:hover:border-[#ef4444] text-[#171717] dark:text-[#ffffff] transition-all"
          >
            Local Transport & Fares
          </NuxtLink>
          <NuxtLink
            to="/travelers-guide/rules-permits"
            class="px-3 py-1.5 rounded-lg bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] hover:border-[#85181a] dark:hover:border-[#ef4444] text-[#171717] dark:text-[#ffffff] transition-all"
          >
            Rules & Trekking Permits
          </NuxtLink>
          <NuxtLink
            to="/travelers-guide/emergency-hotlines"
            class="px-3 py-1.5 rounded-lg bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] hover:border-[#85181a] dark:hover:border-[#ef4444] text-[#171717] dark:text-[#ffffff] transition-all"
          >
            Emergency Hotlines
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-16">
      <GettingThereSection />
      <LocalTransportSection />
      <RulesPermitsSection />
      <EmergencyHotlinesSection />
    </main>

    <Footer />
  </div>
</template>