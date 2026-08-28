<script setup lang="ts">

definePageMeta({
  layout: 'guest',
})

useHead({
  title: 'Ordinances & Executive Orders | Municipality of San Francisco',
  meta: [
    {
      name: 'description',
      content: 'Official directory of enacted municipal ordinances, executive orders, and Sangguniang Bayan resolutions of San Francisco, Agusan del Sur.',
    },
  ],
})
</script>

<template>
  <div>
    <UiHeroSection
      title="Ordinances & Executive Orders"
      description="Access and download official local legislation, municipal ordinances, mayoral executive orders, and Sangguniang Bayan resolutions."
      image="/images/logo/sanfrancisco-ads-aerial.jpg"
    />
    <OrdinancesOrdinanceSection />
    <Footer />
  </div>
</template>