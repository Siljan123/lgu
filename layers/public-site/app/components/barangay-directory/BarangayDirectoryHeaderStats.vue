<script setup lang="ts">
import type { BarangayItem } from '../../composables/useBarangayDirectory'
import { Phone, Globe, UserPlus, Edit3, Trash2 } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    barangay: BarangayItem
    isAdmin?: boolean
  }>(),
  {
    isAdmin: false
  }
)

const emit = defineEmits<{
  (e: 'add-official'): void
  (e: 'edit-barangay'): void
  (e: 'delete-barangay'): void
}>()
</script>

<template>
  <div class="mb-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-4">
      <div class="space-y-1">
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ffffff]">
            {{ barangay.name }}
          </h1>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            :class="[
              barangay.classification === 'Urban'
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
            ]"
          >
            {{ barangay.classification }}
          </span>
        </div>
        <p v-if="barangay.description" class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          {{ barangay.description }}
        </p>
      </div>

      <!-- Action Buttons & Badges -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="p-2 rounded-lg bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333]">
          <span class="block text-[10px] text-[#707070] dark:text-[#a3a3a3] uppercase font-semibold">
            Postal Code: {{ barangay.postalCode }}
          </span>
        </div>

        <button
          v-if="isAdmin"
          type="button"
          @click="emit('edit-barangay')"
          class="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#171717] dark:text-[#ffffff] transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-semibold"
          title="Edit Barangay Info"
        >
          <Edit3 class="size-3.5" />
          <span>Edit Barangay</span>
        </button>

        <button
          v-if="isAdmin"
          type="button"
          @click="emit('delete-barangay')"
          class="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-[#dc2626] transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-semibold"
          title="Delete Barangay"
        >
          <Trash2 class="size-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>

    <!-- Contact details row -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#707070] dark:text-[#a3a3a3]">
      <div class="sm:flex items-center space-x-4">
        <span v-if="barangay.contactPhone" class="flex items-center space-x-1.5">
          <Phone class="size-3.5 text-[#dc2626] shrink-0" />
          <span>{{ barangay.contactPhone }}</span>
        </span>
        <span v-if="barangay.contactEmail" class="flex items-center space-x-1.5 truncate">
          <Globe class="size-3.5 text-[#dc2626] shrink-0" />
          <span class="truncate">{{ barangay.contactEmail }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
