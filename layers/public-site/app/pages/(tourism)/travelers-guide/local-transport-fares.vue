<script setup lang="ts">
import LocalTransportSection from '../../../components/travelers-guide/LocalTransportSection.vue'
import Footer from '../../../components/footer/Footer.vue'
import { ArrowLeft } from '@lucide/vue'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Local Transport & Fare Matrix — San Francisco, Agusan del Sur',
  meta: [
    {
      name: 'description',
      content: 'Official regulated passenger fare matrix in San Francisco, Agusan del Sur. Includes Poblacion to New Terminal Hubang rates, tricycle TODA fares, student discounts, and travel times.'
    }
  ]
})
</script>

<template>
  <div class="bg-[#ffffff] dark:bg-[#1c1c1c] min-h-dvh flex flex-col transition-colors">
    <UiHeroSection
      title="Local Transport & Official Fare Matrix"
      description="Regulated municipal fare tariffs, vehicle options (Tricycle, Multicab, Habal-habal, UV Express), student discounts, and transit duration across San Francisco, Agusan del Sur."
      image="/images/destinations/mt_magdiwata.jpg"
      image-alt="San Francisco Agusan del Sur local transport"
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
       
      </div>
    </div>

    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <LocalTransportSection />
    </main>

    <Footer />
  </div>
</template>
