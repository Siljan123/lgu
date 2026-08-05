<script setup lang="ts">
definePageMeta({
  layout: 'guest',
})

useHead({
  title: "Citizen's Charter - LGU | Municipality of San Francisco",
  meta: [
    {
      name: 'description',
      content: "Official Citizen's Charter of the Municipality of San Francisco, Agusan del Sur, detailing public service standards, processing times, fees, and requirements across municipal offices."
    }
  ]
})
</script>

<template>
  <div>
    <UiHeroSection
      title="Citizen's Charter"
      description="Official Citizen's Charter of the Municipality of San Francisco, Agusan del Sur, detailing public service standards, processing times, fees, and requirements across municipal offices."
    />
    <CitizensCharterSection />
    <Footer />
  </div>
</template>

