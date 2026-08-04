<script setup lang="ts">
definePageMeta({
  layout: 'guest',
})
</script>

<template>
  <div class="bg-[#ffffff] dark:bg-[#1c1c1c] min-h-dvh">
    <UiHeroSection 
        title='The History of&#10;San Francisco' 
        description='Discover the rich heritage and origins of our municipality. From its early days as a small village nestled along the Adlayan River to its growth into a thriving community.'
    />
    <HistorySection />
    <Footer />
  </div>
</template>
