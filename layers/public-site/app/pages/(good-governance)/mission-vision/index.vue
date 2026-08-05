<script setup lang="ts">
definePageMeta({
  layout: 'guest',
})

useHead({
  title: 'Vision & Mission | LGU Agusan del Sur',
  meta: [
    {
      name: 'description',
      content: 'The Vision, Mission, and Core Values of the Commercial and Educational Center of Agusan del Sur.'
    }
  ]
})
</script>


<template>
  <div>
    <UiHeroSection 
      title="Vision & Mission"
      description="The Vision, Mission, and Core Values of the Commercial and Educational Center of Agusan del Sur."
    />
    
    <MissionVisionSection />
    <MissionVisionMissionSection />
    <MissionVisionCoreSection />

    <Footer />
  </div>
</template>