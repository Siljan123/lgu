<script setup lang="ts">


definePageMeta({
  layout: 'guest',
})
</script>

<template>
  <div>
    <UiHeroSection
      title="Barangay Directory"
      description="Explore official records, contact information, postal codes, geographic mini maps, and organizational charts of all 27 barangays in LGU SFADS."
      image-src="/images/hero-sections/barangay-directory-hero.jpg"
    />
    <BarangayDirectorySection />
  </div>
</template>