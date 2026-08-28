<script setup lang="ts">

definePageMeta({
  layout:'sidebar-test'
})
useHead({
  title: 'Legal Documents Administration | Municipality of San Francisco',
  meta: [
    {
      name: 'description',
      content: 'Management portal for municipal ordinances, executive orders, and SB resolutions of San Francisco, Agusan del Sur.',
    },
  ],
})
</script>

<template>
  <div class="w-full min-w-0 flex-1">
    <OrdinancesOrdinanceAuthSection />
  </div>
</template>