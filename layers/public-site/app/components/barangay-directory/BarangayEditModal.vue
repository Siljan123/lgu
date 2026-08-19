<script setup lang="ts">
import { ref, watch } from 'vue'
import { Edit3, X, Building, MapPin, Globe, Phone } from '@lucide/vue'
import type { BarangayItem } from '../../composables/useBarangayDirectory'

const props = defineProps<{
  open: boolean
  barangay: BarangayItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', id: string, payload: Partial<BarangayItem>): void
}>()

const form = ref({
  name: '',
  classification: 'Rural' as 'Urban' | 'Rural',
  postalCode: '8501',
  population: 0,
  censusYear: '2024',
  elevationASL: '60m ASL',
  elevationMeters: 60,
  landAreaSqKm: 12.5,
  hallAddress: '',
  contactPhone: '',
  contactEmail: '',
  description: ''
})

watch(
  () => props.barangay,
  (b) => {
    if (b) {
      form.value = {
        name: b.name || '',
        classification: (b.classification === 'Urban' ? 'Urban' : 'Rural'),
        postalCode: b.postal_code || b.postalCode || '8501',
        population: b.population || 0,
        censusYear: b.census_year || b.censusYear || '2024',
        elevationASL: b.elevation_asl || b.elevationASL || '60m ASL',
        elevationMeters: b.elevation_meters || b.elevationMeters || 60,
        landAreaSqKm: b.land_area_sq_km || b.landAreaSqKm || 0,
        hallAddress: b.hall_address || b.hallAddress || '',
        contactPhone: b.contact_phone || b.contactPhone || '',
        contactEmail: b.contact_email || b.contactEmail || '',
        description: b.description || ''
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!props.barangay?.id || !form.value.name.trim()) return

  emit('submit', props.barangay.id, {
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
    hall_address: form.value.hallAddress.trim(),
    hallAddress: form.value.hallAddress.trim(),
    contact_phone: form.value.contactPhone.trim(),
    contactPhone: form.value.contactPhone.trim(),
    contact_email: form.value.contactEmail.trim(),
    contactEmail: form.value.contactEmail.trim(),
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
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Edit3 class="size-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#171717] dark:text-white leading-tight">
              Edit Barangay Information
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Brgy. {{ barangay?.name }}
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
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Barangay Name -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Barangay Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
            />
          </div>

          <!-- Classification -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Classification <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.classification"
              class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
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
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
            />
          </div>

          <!-- Population -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Population
            </label>
            <input
              v-model.number="form.population"
              type="number"
              min="0"
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
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
              step="0.1"
              min="0"
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
            />
          </div>

          <!-- Elevation -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Elevation (ASL)
            </label>
            <input
              v-model="form.elevationASL"
              type="text"
              placeholder="e.g. 65m ASL"
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
            />
          </div>

          <!-- Hall Address -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Barangay Hall Address
            </label>
            <input
              v-model="form.hallAddress"
              type="text"
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
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
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
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
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
            />
          </div>

          <!-- Description -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Description / Overview
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-4 border-t border-[#dfdfdf] dark:border-[#333333] flex items-center justify-end space-x-2.5">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!form.name.trim()"
            class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Edit3 class="size-3.5" />
            <span>Update Barangay</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
