<script setup lang="ts">
import GettingThereSection from '../../../components/travelers-guide/GettingThereSection.vue'
import { ArrowLeft } from '@lucide/vue'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Getting There & Connections — San Francisco, Agusan del Sur',
  meta: [
    {
      name: 'description',
      content: 'How to reach San Francisco, Agusan del Sur by air (Butuan, Davao, Surigao airports), land buses along AH26, sea ferries, and the San Francisco Intermodal Terminal at Brgy. Hubang.'
    }
  ]
})
</script>

<template>
  <div class="bg-[#ffffff] dark:bg-[#1c1c1c] min-h-dvh flex flex-col transition-colors">
    <UiHeroSection
      title="Getting There & Transit Connections"
      description="Airports, highway bus routes, regional ferry links, and local intermodal transport terminal guide for San Francisco, Agusan del Sur."
      image="/images/destinations/mt_magdiwata.jpg"
      image-alt="San Francisco Agusan del Sur transit and landscape"
    />

    <!-- Navigation Bar -->
    <div class="bg-[#fafafa] dark:bg-[#202020] border-b border-[#dfdfdf] dark:border-[#2e2e2e]">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
        <NuxtLink
          to="/travelers-guide"
          class="inline-flex items-center text-xs font-semibold text-[#85181a] dark:text-[#ef4444] hover:underline"
        >
          <ArrowLeft class="w-3.5 h-3.5 mr-1" />
          Back to Main Traveler's Guide
        </NuxtLink>
        <div class="flex items-center gap-3 text-xs font-medium text-[#707070] dark:text-[#a3a3a3]">
          <NuxtLink to="/travelers-guide/local-transport-fares" class="hover:text-[#85181a] dark:hover:text-[#ef4444]">Fares</NuxtLink>
          <span>•</span>
          <NuxtLink to="/travelers-guide/rules-permits" class="hover:text-[#85181a] dark:hover:text-[#ef4444]">Permits</NuxtLink>
          <span>•</span>
          <NuxtLink to="/travelers-guide/emergency-hotlines" class="hover:text-[#85181a] dark:hover:text-[#ef4444]">Emergency</NuxtLink>
        </div>
      </div>
    </div>

    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <GettingThereSection />
    </main>

    <Footer />
  </div>
</template>
