<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDestinations } from '../../../composables/useDestinations'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const { getDestinationById, destinationsData } = useDestinations()

const destinationId = computed(() => route.params.id as string)
const destination = computed(() => getDestinationById(destinationId.value))

if (!destination.value) {
  showError({ statusCode: 404, statusMessage: 'Destination landmark not found' })
}

useHead({
  title: computed(() => `${destination.value?.name || 'Destination'} — San Francisco, Agusan del Sur`),
  meta: [
    {
      name: 'description',
      content: computed(() => destination.value?.shortDescription || 'San Francisco Agusan del Sur tourist destination.')
    }
  ]
})

const otherDestinations = computed(() => {
  return destinationsData.filter(d => d.id !== destinationId.value).slice(0, 3)
})
</script>

<template>
  <div v-if="destination" class="bg-[#ffffff] dark:bg-[#1c1c1c] min-h-dvh flex flex-col">
    
    <!-- Top Banner / Hero -->
    <section class="relative w-full bg-[#171717] dark:bg-[#121212] border-b border-[#dfdfdf] dark:border-[#2e2e2e] pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div class="absolute inset-0 opacity-20 dark:opacity-30">
        <NuxtImg 
          :src="destination.image" 
          alt="Background overlay" 
          class="w-full h-full object-cover blur-md"
        />
      </div>
      
      <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs font-medium text-[#b2b2b2] mb-6">
          <NuxtLink to="/" class="hover:text-[#ffffff] transition-colors">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/destinations" class="hover:text-[#ffffff] transition-colors">Destinations</NuxtLink>
          <span>/</span>
          <span class="text-[#ffffff] truncate max-w-50 sm:max-w-none">{{ destination.name }}</span>
        </nav>

        <div class="max-w-3xl">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#85181a] text-[#ffffff]">
              {{ destination.category }}
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-[#ffffff]/20 text-[#ffffff] backdrop-blur-sm border border-[#ffffff]/20">
              Brgy. {{ destination.barangay }}
            </span>
          </div>

          <h1 class="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#ffffff] leading-[1.15]">
            {{ destination.name }}
          </h1>

          <p class="mt-4 text-base md:text-lg text-[#dfdfdf] leading-relaxed">
            {{ destination.shortDescription }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Detail Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div class="lg:col-span-7 rounded-2xl overflow-hidden border border-[#dfdfdf] dark:border-[#2e2e2e] shadow-lg bg-[#fafafa] dark:bg-[#202020]">
          <NuxtImg 
            :src="destination.image" 
            :alt="destination.name"
            class="w-full aspect-4/3 object-cover"
            loading="eager"
            format="webp"
          />
        </div>
        <div class="lg:col-span-5 space-y-6">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444] mb-2">
              Heritage & Background
            </h2>
            <h3 class="text-2xl font-medium text-[#171717] dark:text-[#ffffff] tracking-tight">
              About this landmark
            </h3>
          </div>
          <p class="text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ destination.fullDescription }}
          </p>
          <div class="pt-4 border-t border-[#ededed] dark:border-[#2e2e2e]">
            <NuxtLink 
              to="/destinations" 
              class="inline-flex items-center gap-2 text-sm font-semibold text-[#85181a] dark:text-[#ef4444] hover:underline"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to all destinations
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Highlights Card -->
      <section class="bg-background">
        <h2 class="text-xl md:text-2xl font-medium text-[#171717] dark:text-[#ffffff] mb-6 flex items-center gap-2">
          Key Site Highlights
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(highlight, i) in destination.highlights" 
            :key="i"
            class="flex items-start gap-3 p-4 rounded-xl bg-[#ffffff] dark:bg-[#1a1a1a] border border-[#dfdfdf] dark:border-[#2a2a2a]"
          >
            <div class="p-1.5 rounded-full bg-[#85181a]/10 text-[#85181a] dark:bg-[#ef4444]/10 dark:text-[#ef4444] shrink-0 mt-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-sm md:text-base font-medium text-[#171717] dark:text-[#ffffff]">
              {{ highlight }}
            </span>
          </div>
        </div>
      </section>

      <!-- Visitor Guide Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] space-y-3">
          <div class="w-10 h-10 rounded-lg bg-[#fafafa] dark:bg-[#1a1a1a] flex items-center justify-center text-[#85181a] dark:text-[#ef4444]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold text-[#171717] dark:text-[#ffffff]">How to get there</h3>
          <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ destination.howToGetThere }}
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] space-y-3">
          <div class="w-10 h-10 rounded-lg bg-[#fafafa] dark:bg-[#1a1a1a] flex items-center justify-center text-[#85181a] dark:text-[#ef4444]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold text-[#171717] dark:text-[#ffffff]">Best time to visit</h3>
          <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ destination.bestTimeToVisit }}
          </p>
        </div>

        <div class="p-6 rounded-2xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] space-y-3">
          <div class="w-10 h-10 rounded-lg bg-[#fafafa] dark:bg-[#1a1a1a] flex items-center justify-center text-[#85181a] dark:text-[#ef4444]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h3 class="text-base font-semibold text-[#171717] dark:text-[#ffffff]">Access notes</h3>
          <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ destination.accessNotes }}
          </p>
        </div>
      </section>

      <!-- Other Destinations -->
      <section v-if="otherDestinations.length > 0" class="pt-8 border-t border-[#ededed] dark:border-[#2e2e2e]">
        <h2 class="text-2xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] mb-8">
          More Landmarks in San Francisco
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <NuxtLink 
            v-for="item in otherDestinations" 
            :key="item.id"
            :to="`/destinations/${item.id}`"
            class="group border border-[#dfdfdf] dark:border-[#2e2e2e] p-4 bg-[#ffffff] dark:bg-[#202020] transition-all"
          >
            <div class="aspect-16/10  overflow-hidden mb-4 bg-[#fafafa] dark:bg-[#1a1a1a]">
              <NuxtImg 
                :src="item.image" 
                :alt="item.name" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                format="webp"
              />
            </div>
            <span class="text-xs font-semibold text-[#85181a] dark:text-[#ef4444] uppercase tracking-wider">
              {{ item.category }}
            </span>
            <h3 class="text-base font-medium text-[#171717] dark:text-[#ffffff] group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] transition-colors mt-1 line-clamp-1">
              {{ item.name }}
            </h3>
          </NuxtLink>
        </div>
      </section>

    </main>

    <Footer />
  </div>
</template>
