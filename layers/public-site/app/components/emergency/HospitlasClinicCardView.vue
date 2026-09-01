<script setup lang="ts">
import { ref } from 'vue'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Navigation, 
  Route, 
  Clock, 
  HeartPulse, 
  Pill 
} from '@lucide/vue'
import { calculateDistanceKm, type MedicalFacility } from '../../composables/useEmergency'

interface Props {
  facilities?: MedicalFacility[]
  activeFacilityId?: string | null
  userLocation?: { lat: number; lng: number } | null
}

const props = withDefaults(defineProps<Props>(), {
  facilities: () => [],
  activeFacilityId: null,
  userLocation: null,
})

const emit = defineEmits<{
  (e: 'selectFacility', facility: MedicalFacility): void
}>()

const failedImages = ref(new Set<string>())

const onImageError = (id: string) => {
  failedImages.value.add(id)
}

const getItemDistance = (item: MedicalFacility) => {
  if (!props.userLocation || !item.coordinates) return null
  return calculateDistanceKm(props.userLocation, item.coordinates)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <article
      v-for="item in facilities"
      :key="item.id"
      class="group relative flex flex-col h-full bg-[#ffffff] dark:bg-[#202020] rounded-md border border-[#dfdfdf] dark:border-[#2e2e2e] overflow-hidden transition-all duration-300 hover:shadow-md hover:border-red-500 dark:hover:border-red-500 cursor-pointer"
      :class="[activeFacilityId === item.id ? 'ring-1 ring-red-600 dark:ring-red-500 shadow-md border-transparent' : '']"
      @click="emit('selectFacility', item)"
    >
      <div class="relative w-full aspect-video overflow-hidden bg-[#18181b] flex flex-col items-center justify-center border-b border-[#dfdfdf] dark:border-[#2e2e2e]">
        <div 
          v-if="userLocation && getItemDistance(item)"
          class="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#171717]/85 backdrop-blur-md text-[#ffffff] text-[11px] font-bold shadow-md border border-white/10"
        >
          <Route :size="12" class="text-[#facc15]" />
          <span>{{ getItemDistance(item)?.distanceText }} away</span>
        </div>

        <template v-if="item.image && !failedImages.has(item.id)">
          <img 
            :src="item.image" 
            :alt="item.name" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            loading="lazy"
            @error="onImageError(item.id)"
          />
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center text-center p-4 space-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <div class="p-2.5 rounded-full bg-[#ffffff]/10 text-[#ffffff] backdrop-blur-xs">
              <HeartPulse v-if="item.mainCategory === 'Hospitals'" :size="24" />
              <Pill v-else-if="item.mainCategory === 'Pharmacies'" :size="24" />
              <Building2 v-else :size="24" />
            </div>
            <span class="text-[11px] font-medium tracking-wider text-[#a1a1aa] uppercase">{{ item.name }}</span>
          </div>
        </template>
      </div>

      <!-- Content Details -->
      <div class="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div class="space-y-2">
          <h3 class="text-base font-bold tracking-tight text-[#171717] dark:text-[#ffffff] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
            {{ item.name }}
          </h3>

          <div class="space-y-1.5 text-xs text-[#525252] dark:text-[#d4d4d4]">
            <div class="flex items-start gap-1.5">
              <MapPin :size="14" class="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <span class="leading-relaxed">{{ item.address }}</span>
            </div>

            <div v-if="item.operatingHours" class="flex items-center gap-1.5 text-[#707070] dark:text-[#a3a3a3]">
              <Clock :size="13" class="text-emerald-600 dark:text-emerald-400" />
              <span>Hours: {{ item.operatingHours }}</span>
            </div>

            <div v-if="item.contactNo" class="flex items-center gap-1.5 text-[#1e293b] dark:text-[#f8fafc] font-semibold">
              <Phone :size="13" class="text-red-600 dark:text-red-400" />
              <span>{{ item.contactNo }}</span>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button
          type="button"
          class="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-[#ffffff] bg-[#171717] dark:bg-[#181616] group-hover:bg-red-600 dark:group-hover:bg-red-600 dark:group-hover:text-[#ffffff] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          @click.stop="emit('selectFacility', item)"
        >
          <Navigation :size="13" />
          <span>{{ userLocation ? 'Draw Route Line & View' : 'Focus on Map' }}</span>
        </button>
      </div>
    </article>
  </div>
</template>
