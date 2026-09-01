<script setup lang="ts">
import HospitlasClinicSection from '../../components/emergency/HospitlasClinicSection.vue'

definePageMeta({
  layout: 'guest',
})
useSeoMeta({
  title: 'Emergency, Hospitals, Clinics & Pharmacies — Municipality of San Francisco, Agusan del Sur',
  description: 'Quick access to emergency hotlines, hospitals, rural health units, clinics, diagnostic centers, and pharmacies across San Francisco, Agusan del Sur with GPS route line directions.'
})
</script>

<template>
  <div class="w-full space-y-4">
    <UiHeroSection
      title="Emergency, Hospitals & Clinics"
      description="Quick access to 24/7 emergency hotlines, hospitals, Rural Health Units, specialty clinics, and pharmacies across San Francisco, Agusan del Sur with GPS route navigation."
    />
    <HospitlasClinicSection />
  </div>
</template>