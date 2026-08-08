<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Calendar, MapPin, Sparkles, ChevronRight, Award, Flame, Mountain, ShieldCheck, Mail, ArrowLeft } from '@lucide/vue'
import { useEventsFestivals } from '../../../../composables/useEventsFestivals'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const { getFestivalById, festivalsData, eventsForFestival } = useEventsFestivals()

const festivalId = computed(() => route.params.id as string)
const festival = computed(() => getFestivalById(festivalId.value))

if (!festival.value) {
  showError({ statusCode: 404, statusMessage: 'Festival celebration not found' })
}

useHead({
  title: computed(() => `${festival.value?.name || 'Festival'} — San Francisco, Agusan del Sur`),
  meta: [
    {
      name: 'description',
      content: computed(() => festival.value?.shortDescription || 'San Francisco Agusan del Sur cultural festival celebration.')
    }
  ]
})

const scheduledEvents = computed(() => {
  if (!festival.value) return []
  return eventsForFestival(festival.value.slug)
})

const otherFestivals = computed(() => {
  return festivalsData.filter(f => f.id !== festivalId.value && f.slug !== festivalId.value).slice(0, 3)
})
</script>

<template>
  <div v-if="festival" class="bg-[#ffffff] dark:bg-[#1c1c1c] min-h-dvh flex flex-col">
    
    <!-- Top Banner / Hero -->
    <section class="relative w-full bg-[#171717] dark:bg-[#121212] border-b border-[#dfdfdf] dark:border-[#2e2e2e] pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div class="absolute inset-0 opacity-20 dark:opacity-30">
        <NuxtImg 
          :src="festival.image" 
          alt="Background overlay" 
          class="w-full h-full object-cover blur-md"
        />
      </div>
      
      <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs font-medium text-[#b2b2b2] mb-6">
          <NuxtLink to="/" class="hover:text-[#ffffff] transition-colors">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/events-festivals" class="hover:text-[#ffffff] transition-colors">Events & Festivals</NuxtLink>
          <span>/</span>
          <span class="text-[#ffffff] truncate max-w-50 sm:max-w-none">{{ festival.name }}</span>
        </nav>

        <div class="max-w-3xl">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <Badge class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#85181a] text-[#ffffff]">
              {{ festival.category }}
            </Badge>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-[#ffffff]/20 text-[#ffffff] backdrop-blur-sm border border-[#ffffff]/20">
              {{ festival.whenHeld }}
            </span>
          </div>

          <h1 class="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#ffffff] leading-[1.15]">
            {{ festival.name }}
          </h1>

          <p class="mt-4 text-base md:text-lg text-[#dfdfdf] leading-relaxed">
            {{ festival.tagline }} — {{ festival.shortDescription }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Detail Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16 space-y-16">
      
      <!-- Image & Background Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div class="lg:col-span-7 rounded-2xl overflow-hidden border border-[#dfdfdf] dark:border-[#2e2e2e] shadow-lg bg-[#fafafa] dark:bg-[#202020]">
          <NuxtImg 
            :src="festival.image" 
            :alt="festival.name"
            class="w-full aspect-4/3 object-cover"
            loading="eager"
            format="webp"
          />
        </div>

        <div class="lg:col-span-5 space-y-6">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444] mb-2">
              Cultural Identity & Heritage
            </h2>
            <h3 class="text-2xl font-medium text-[#171717] dark:text-[#ffffff] tracking-tight">
              About this festival
            </h3>
          </div>

          <p class="text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ festival.fullDescription }}
          </p>

          <div class="p-4 rounded-xl bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] space-y-2">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-[#171717] dark:text-[#ffffff] flex items-center gap-1.5">
              <ShieldCheck :size="14" class="text-[#85181a] dark:text-[#ef4444]" />
              Why It Matters
            </h4>
            <p class="text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
              {{ festival.whyItMatters }}
            </p>
          </div>

          <div class="pt-4 border-t border-[#ededed] dark:border-[#2e2e2e]">
            <NuxtLink 
              to="/events-festivals" 
              class="inline-flex items-center gap-2 text-sm font-semibold text-[#85181a] dark:text-[#ef4444] hover:underline"
            >
              <ArrowLeft :size="16" />
              Back to Events & Festivals
            </NuxtLink>
          </div>
        </div>
      </div>

      <section v-if="scheduledEvents.length > 0" >
        <div>
          <h2 class="text-2xl font-medium text-[#171717] dark:text-[#ffffff] tracking-tight mt-1 ">
           Scheduled Activities for {{ festival.name }}
          </h2>
          <p class="text-sm text-[#707070] dark:text-[#a3a3a3] mb-4">
            Time-bound events and official programs managed for the current festival season.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="event in scheduledEvents" 
            :key="event.id"
            class="p-6 bg-[#ffffff] dark:bg-[#1a1a1a] border-r border-[#dfdfdf] dark:border-[#2e2e2e] flex flex-col justify-between space-y-4"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <Badge v-if="event.badge" class="px-2 py-0.5 rounded text-[10px] font-medium bg-[#171717] dark:bg-[#333333] text-[#ffffff]">
                  {{ event.badge }}
                </Badge>
              </div>

              <h3 class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">
                {{ event.title }}
              </h3>

              <p class="mt-2 text-xs md:text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                {{ event.shortDescription }}
              </p>
            </div>

            <div class="pt-4 border-t border-[#ededed] dark:border-[#2e2e2e] space-y-1.5 text-xs text-[#707070] dark:text-[#a3a3a3]">
              <div class="flex items-center gap-1.5">
                <Calendar :size="13" class="text-[#85181a] dark:text-[#ef4444]" />
                <span class="font-medium text-[#171717] dark:text-[#ffffff]">{{ event.startDate }}</span>
                <span v-if="event.endDate"> – {{ event.endDate }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <MapPin :size="13" />
                <span>{{ event.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <Footer />
  </div>
</template>
