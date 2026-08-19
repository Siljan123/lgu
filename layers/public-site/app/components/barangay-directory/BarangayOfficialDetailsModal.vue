<script setup lang="ts">
import {
  X,
  Phone,
  UserCheck,
  Edit3,
  UserPlus,
  Network,
  Users
} from '@lucide/vue'
import type { BarangayOfficial } from '../../composables/useBarangayDirectory'

const props = defineProps<{
  open: boolean
  official: BarangayOfficial | null
  parentOfficialName?: string
  subordinates?: BarangayOfficial[]
  barangayName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', official: BarangayOfficial): void
  (e: 'add-child', parentId: string): void
}>()
</script>

<template>
  <div
    v-if="open && official"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="size-9 rounded-xl bg-[#dc2626]/10 text-[#dc2626] dark:text-[#f87171] flex items-center justify-center">
            <UserCheck class="size-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#171717] dark:text-white leading-tight">
              Official Profile Details
            </h3>
            <p v-if="barangayName" class="text-xs text-neutral-500 dark:text-neutral-400">
              Brgy. {{ barangayName }}
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

      <!-- Modal Body -->
      <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- Avatar & Name Header -->
        <div class="flex items-center space-x-4">
          <div class="relative size-16 rounded-full overflow-hidden border-2 border-[#dfdfdf] dark:border-[#333333] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 shadow-xs">
            <img
              v-if="official.avatar_url || official.avatar"
              :src="official.avatar_url || official.avatar"
              :alt="official.name"
              class="size-full object-cover"
            />
            <div
              v-else
              class="size-full flex items-center justify-center bg-[#dc2626]/10 text-[#dc2626] font-bold text-lg"
            >
              {{ official.name?.charAt(0).toUpperCase() || '?' }}
            </div>
          </div>

          <div class="min-w-0">
            <h4 class="text-base font-bold text-neutral-900 dark:text-white leading-snug">
              {{ official.name }}
            </h4>
            <span class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              {{ official.title || official.position?.title || 'Official' }}
            </span>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl p-3.5 space-y-2.5 text-xs">
          <div v-if="official.committee" class="flex justify-between items-center">
            <span class="text-neutral-500 dark:text-neutral-400">Committee / Assignment:</span>
            <span class="font-semibold text-neutral-800 dark:text-neutral-200 text-right">{{ official.committee }}</span>
          </div>

          <div v-if="official.contact" class="flex justify-between items-center">
            <span class="text-neutral-500 dark:text-neutral-400">Contact Number:</span>
            <span class="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center space-x-1">
              <Phone class="size-3 text-[#dc2626]" />
              <span>{{ official.contact }}</span>
            </span>
          </div>

          <div v-if="parentOfficialName" class="flex justify-between items-center">
            <span class="text-neutral-500 dark:text-neutral-400">Reports To (Parent):</span>
            <span class="font-semibold text-neutral-800 dark:text-neutral-200">{{ parentOfficialName }}</span>
          </div>

          <div v-if="subordinates && subordinates.length > 0" class="pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <span class="block text-neutral-500 dark:text-neutral-400 mb-1.5">Direct Subordinates ({{ subordinates.length }}):</span>
            <div class="space-y-1">
              <div
                v-for="sub in subordinates"
                :key="sub.id"
                class="flex items-center justify-between p-1.5 bg-white dark:bg-neutral-800 rounded-lg text-[11px]"
              >
                <span class="font-medium text-neutral-900 dark:text-white">{{ sub.name }}</span>
                <span class="text-neutral-500 dark:text-neutral-400">{{ sub.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
