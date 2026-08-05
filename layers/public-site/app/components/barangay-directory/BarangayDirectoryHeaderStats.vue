<script setup lang="ts">
import type { BarangayItem } from '../../composables/useBarangayDirectory'
import { MapPin, Users, Compass, Mail, Phone, Building2, Globe, Mountain, Calendar } from '@lucide/vue'

defineProps<{
  barangay: BarangayItem
}>()
</script>

<template>
  <Card>
     <CardHeader>
       <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dfdfdf] dark:border-[#333333] pb-6">
        <div class="space-y-1">
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ffffff]">
            {{ barangay.name }}
          </h1>
          <p v-if="barangay.description" class="text-xs md:text-sm text-[#707070] dark:text-[#a3a3a3] max-w-3xl">
            {{ barangay.description }}
          </p>
        </div>
        <div class="flex items-center space-x-2 shrink-0 overflow-x-auto no-scrollbar mb-1 md:mb-15">
          <div class="p-2.5 rounded-lg bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:bo0rder-[#333333] ">
            <span class="block text-[10px] text-[#707070] dark:text-[#a3a3a3] uppercase font-semibold">Postal Code: {{ barangay.postalCode }}</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3  text-xs text-[#707070] dark:text-[#a3a3a3] dark:border-[#333333]">
        <div class="flex items-center space-x-2">
          <Building2 class="size-4 text-[#dc2626] shrink-0" />
          <span><strong class="text-[#171717] dark:text-[#ffffff]">Barangay Hall:</strong> {{ barangay.hallAddress }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="flex items-center space-x-1.5">
            <Phone class="size-3.5 text-[#dc2626] shrink-0" />
            <span>{{ barangay.contactPhone }}</span>
          </span>
          <span class="flex items-center space-x-1.5 truncate">
            <Globe class="size-3.5 text-[#dc2626] shrink-0" />
            <span class="truncate">{{ barangay.contactEmail }}</span>
          </span>
        </div>
      </div>
     </CardHeader>

  </Card>
</template>
