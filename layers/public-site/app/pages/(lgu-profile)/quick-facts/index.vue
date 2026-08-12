<script setup lang="ts">
definePageMeta({
  layout: 'guest',
})
</script>

<template>
  <div class="bg-[#ffffff] dark:bg-[#1c1c1c] min-h-dvh">
    <UiHeroSection 
      title="Quick Facts &amp;&#10;Demographics" 
      description="Comprehensive municipal profile, historical population census records, geographic indicators, and official statistics for San Francisco, Agusan del Sur."
    />
    <QuickFactsDemographicsQuickFacts/>
   
    <QuickFactsDemographicsSection/>
   
    <QuickFactsDemographicsGeographySection />
   
    <Footer />
  </div>
</template>