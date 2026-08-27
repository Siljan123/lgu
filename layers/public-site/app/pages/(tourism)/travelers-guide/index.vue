<script setup lang="ts">
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

    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-16">
      <LocalTransportSection />
    </main>
    <Footer />
  </div>
</template>