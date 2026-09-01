<script setup lang="ts">
import { ref } from 'vue'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Check, 
  Copy, 
  Route, 
  Clock,
  ArrowRightIcon, 
} from '@lucide/vue'
import { calculateDistanceKm, type MedicalFacility } from '../../composables/useEmergency'

interface Props {
  facilities?: MedicalFacility[]
  totalCount?: number
  selectedCategory?: string
  activeFacilityId?: string | null
  userLocation?: { lat: number; lng: number } | null
}

const props = withDefaults(defineProps<Props>(), {
  facilities: () => [],
  totalCount: 0,
  selectedCategory: 'All',
  activeFacilityId: null,
  userLocation: null,
})

const emit = defineEmits<{
  (e: 'selectFacility', facility: MedicalFacility): void
}>()

const copiedId = ref<string | null>(null)
const failedImages = ref(new Set<string>())

const onImageError = (id: string) => {
  failedImages.value.add(id)
}

const getItemDistance = (item: MedicalFacility) => {
  if (!props.userLocation || !item.coordinates) return null
  return calculateDistanceKm(props.userLocation, item.coordinates)
}

const copyPhone = (phone?: string, id: string = 'details') => {
  if (!phone) return
  navigator.clipboard.writeText(phone)
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}
</script>

<template>
  <div class="w-full overflow-hidden rounded-md">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm border-collapse">
        <thead>
          <tr class="bg-[#243048] dark:bg-[#1a2333] text-[#ffffff] font-bold text-xs uppercase tracking-wider border-b border-[#dfdfdf] dark:border-[#2e2e2e]">
            <th scope="col" class="py-4 px-6 text-left w-2/5">
              Medical Facility
            </th>
            <th scope="col" class="py-4 flex gap-2 px-6 text-left w-2/5">
               <MapPin :size="14" class="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              Address
            </th>
            <th scope="col" class="py-4 px-6 text-center w-1/5">
              Focus on Map
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#dfdfdf] dark:divide-[#2a2a2a] text-[#171717] dark:text-[#e5e5e5]">
          <tr 
            v-for="(item, index) in facilities" 
            :key="item.id"
            class="group transition-colors duration-150 cursor-pointer hover:bg-[#fafafa] dark:hover:bg-[#262626]"
            :class="[
              activeFacilityId === item.id ? 'bg-gray-200 font-medium' : index % 2 === 0 ? 'bg-[#ffffff] dark:bg-[#202020]' : 'bg-[#fafafa]/60 dark:bg-[#1c1c1c]/60'
            ]"
            @click="emit('selectFacility', item)"
          >
            <td class="py-4 px-4 align-middle">
              <div class="flex gap-3 items-center">
                <template v-if="item.image && !failedImages.has(item.id)">
                  <img 
                    :src="item.image" 
                    :alt="item.name" 
                    class="w-14 h-14 rounded-md object-cover border border-[#dfdfdf] dark:border-[#333333] shrink-0"
                    @error="onImageError(item.id)" 
                  />
                </template>
                <div>
                  <div class="font-bold text-sm text-[#171717] dark:text-[#ffffff] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {{ item.name }}
                  </div>
                  <div class="mt-1 flex items-center gap-1.5 flex-wrap">
                    <span v-if="item.operatingHours" class="inline-flex items-center gap-1 text-[10px] text-[#707070] dark:text-[#a3a3a3]">
                      <Clock :size="10" />
                      {{ item.operatingHours }}
                    </span>
                    <span v-if="userLocation && getItemDistance(item)" class="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-500/10 px-1.5 py-0.5 rounded">
                      <Route :size="10" />
                      {{ getItemDistance(item)?.distanceText }}
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Address Column -->
            <td class="py-4 px-6 text-xs text-[#525252] dark:text-[#d4d4d4] font-medium leading-snug">
              <div class="flex gap-1.5">
                <span>{{ item.address }}</span>
              </div>
            </td>

            <td class="py-4 px-6 text-center align-middle">
              <template v-if="item.contactNo">
                <div class="flex items-center justify-center gap-2">
                  <a 
                    :href="`tel:${item.contactNo.replace(/[^0-9+]/g, '')}`" 
                    class="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                    @click.stop
                  >
                    <Phone :size="12" />
                    <span>{{ item.contactNo }}</span>
                  </a>
                  <button
                    type="button"
                    title="Copy phone"
                    class="p-1 rounded text-[#707070] hover:text-[#171717] dark:hover:text-[#ffffff] transition-all"
                    @click.stop="copyPhone(item.contactNo, item.id)"
                  >
                    <Check v-if="copiedId === item.id" :size="13" class="text-green-600" />
                    <Copy v-else :size="13" />
                  </button>
                </div>
              </template>
              <template v-else>
                <button
                  type="button"
                  class="px-3 py-1 text-xs font-semibold text-red-600 hover:underline"
                  @click.stop="emit('selectFacility', item)"
                >
                  <ArrowRightIcon :size="20" />
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
