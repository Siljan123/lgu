<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus, X, Building, MapPin, Globe, Phone, Compass, Mountain, Users, Mail } from '@lucide/vue'
import type { BarangayItem } from '../../composables/useBarangayDirectory'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: Partial<BarangayItem>): void
}>()

function toDms(deg: number, isLat: boolean): string {
  const absolute = Math.abs(deg)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1)
  const direction = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W')
  return `${degrees}°${minutes}'${seconds}"${direction}`
}

function calculateDms(lat: number, lng: number): string {
  if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return ''
  return `${toDms(lat, true)} ${toDms(lng, false)}`
}

const form = ref({
  id: '',
  name: '',
  classification: 'Rural' as 'Urban' | 'Rural',
  postalCode: '8501',
  population: 3000,
  censusYear: '2024',
  elevationMeters: 60,
  elevationASL: '60m ASL',
  landAreaSqKm: 12.5,
  lat: 8.506308,
  lng: 126.011568,
  coordinatesDisplay: '8°30\'22.7"N 126°0\'41.6"E',
  hallAddress: '',
  contactPhone: '',
  contactEmail: '',
  mapEmbedUrl: '',
  description: ''
})

watch(
  () => [form.value.lat, form.value.lng],
  ([newLat, newLng]) => {
    const latNum = Number(newLat)
    const lngNum = Number(newLng)
    if (!isNaN(latNum) && !isNaN(lngNum) && (latNum !== 0 || lngNum !== 0)) {
      form.value.coordinatesDisplay = calculateDms(latNum, lngNum)
    }
  }
)

watch(
  () => form.value.elevationMeters,
  (newElev) => {
    const elevNum = Number(newElev)
    if (!isNaN(elevNum)) {
      form.value.elevationASL = `${elevNum}m ASL`
    }
  }
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.value = {
        id: '',
        name: '',
        classification: 'Rural',
        postalCode: '8501',
        population: 3000,
        censusYear: '2024',
        elevationMeters: 60,
        elevationASL: '60m ASL',
        landAreaSqKm: 12.5,
        lat: 8.506308,
        lng: 126.011568,
        coordinatesDisplay: '8°30\'22.7"N 126°0\'41.6"E',
        hallAddress: '',
        contactPhone: '',
        contactEmail: '',
        mapEmbedUrl: '',
        description: ''
      }
    }
  }
)

function handleSubmit() {
  if (!form.value.name.trim()) return

  const lat = Number(form.value.lat) || 0
  const lng = Number(form.value.lng) || 0
  const display = form.value.coordinatesDisplay.trim() || calculateDms(lat, lng) || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`

  emit('submit', {
    name: form.value.name.trim(),
    classification: form.value.classification,
    postal_code: form.value.postalCode.trim(),
    postalCode: form.value.postalCode.trim(),
    population: Number(form.value.population) || 0,
    census_year: form.value.censusYear.trim(),
    censusYear: form.value.censusYear.trim(),
    elevation_asl: form.value.elevationASL.trim(),
    elevationASL: form.value.elevationASL.trim(),
    elevation_meters: Number(form.value.elevationMeters) || 0,
    elevationMeters: Number(form.value.elevationMeters) || 0,
    land_area_sq_km: Number(form.value.landAreaSqKm) || 0,
    landAreaSqKm: Number(form.value.landAreaSqKm) || 0,
    coordinates: {
      lat,
      lng,
      display
    },
    hall_address: form.value.hallAddress.trim(),
    hallAddress: form.value.hallAddress.trim(),
    contact_phone: form.value.contactPhone.trim(),
    contactPhone: form.value.contactPhone.trim(),
    contact_email: form.value.contactEmail.trim(),
    contactEmail: form.value.contactEmail.trim(),
    map_embed_url: form.value.mapEmbedUrl.trim() || undefined,
    mapEmbedUrl: form.value.mapEmbedUrl.trim() || undefined,
    description: form.value.description.trim() || undefined
  })
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-md w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between shrink-0">
        <div class="flex items-center space-x-2.5">
          <div class="size-9 rounded-sm bg-[#dc2626]/10 text-[#dc2626] dark:text-[#f87171] flex items-center justify-center">
            <Building class="size-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#171717] dark:text-white leading-tight">
              New Barangay
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Add a new barangay to the municipal directory with complete records
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          <X class="size-5" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-5 overflow-y-auto flex-1">
        <!-- Section 1: General Info -->
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5 flex items-center gap-1.5">
            General Information
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <!-- Barangay Name -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Barangay Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g. San Isidro"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <!-- Classification -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Classification <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.classification"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              >
                <option value="Rural">Rural</option>
                <option value="Urban">Urban</option>
              </select>
            </div>

            <!-- Postal Code -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Postal Code
              </label>
              <input
                v-model="form.postalCode"
                type="text"
                placeholder="8501"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Demographics & Topography -->
        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5 flex items-center gap-1.5">
            <Users class="size-3.5 text-[#dc2626]" />
            Demographics & Topography
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <!-- Population -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Population
              </label>
              <input
                v-model.number="form.population"
                type="number"
                min="0"
                placeholder="3000"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <!-- Census Year -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Census Year / Period
              </label>
              <input
                v-model="form.censusYear"
                type="text"
                placeholder="2024"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <!-- Land Area -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Land Area (sq km)
              </label>
              <input
                v-model.number="form.landAreaSqKm"
                type="number"
                step="0.01"
                min="0"
                placeholder="12.5"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Elevation (Meters)
              </label>
              <input
                v-model.number="form.elevationMeters"
                type="number"
                step="1"
                placeholder="60"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <div class="sm:col-span-2 md:col-span-4">
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Elevation Display (ASL)
              </label>
              <input
                v-model="form.elevationASL"
                type="text"
                placeholder="e.g. 60m ASL"
                disabled
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5 flex items-center gap-1.5">
            <Compass class="size-3.5 text-[#dc2626]" />
            Geographic Coordinates & GPS Location
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <!-- Latitude -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Latitude <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.lat"
                type="number"
                step="0.000001"
                required
                placeholder="e.g. 8.506308"
                class="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Longitude <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.lng"
                type="number"
                step="0.000001"
                required
                placeholder="126.011568"
                class="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                DMS Coordinates Display
              </label>
              <input
                v-model="form.coordinatesDisplay"
                type="text"
                placeholder="8°30'22.7&quot;N 126°0'41.6&quot;E"
                class="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5 flex items-center gap-1.5">
            <MapPin class="size-3.5 text-[#dc2626]" />
            Barangay Hall & Contact Details
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Hall Address -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Barangay Hall Address
              </label>
              <input
                v-model="form.hallAddress"
                type="text"
                placeholder="e.g. Purok 1, San Isidro"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <!-- Contact Phone -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Contact Phone
              </label>
              <input
                v-model="form.contactPhone"
                type="text"
                placeholder="+63 912 001 0001"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>

            <!-- Contact Email -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Contact Email
              </label>
              <input
                v-model="form.contactEmail"
                type="email"
                placeholder="brgy.isidro@sanfranz.gov.ph"
                class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
              />
            </div>
          </div>
        </div>

        <!-- Section 5: Overview & Description -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Description / Overview (optional)
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Brief description of the barangay's history, community, geography, and local economy..."
            class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition resize-none"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="pt-4 border-t border-[#dfdfdf] dark:border-[#333333] flex items-center justify-end space-x-2.5">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!form.name.trim()"
            class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus class="size-3.5" />
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
