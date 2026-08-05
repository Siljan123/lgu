<script setup lang="ts">
definePageMeta({
  layout: 'guest',
})

useHead({
  title: "Citizen's Charter - LGU | Municipality of San Francisco",
  meta: [
    {
      name: 'description',
      content: "Official Citizen's Charter of the Municipal Economic Enterprise Development and Management Office (MEEDMO), Municipality of San Francisco, Agusan del Sur."
    }
  ]
})
</script>

<template>
 <div class="min-h-dvh">
    <CitizensCharterCard />
    <Footer />
  </div>
</template>
