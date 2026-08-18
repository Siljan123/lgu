<script setup lang="ts">
import { X, UserCheck, Phone, ShieldCheck, Edit3, UserPlus, GitFork } from '@lucide/vue'
import type { OfficialRow } from '../../../types/official'


const props = defineProps<{
  open: boolean
  official: OfficialRow | null
  parentOfficialName?: string | null
  subordinates?: { id: string; fullName: string; position: string }[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'edit', official: OfficialRow): void
  (e: 'add-child', parentId: string): void
}>()
</script>

<template>
  <div
    v-if="open && official"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
      <!-- Modal Header Banner -->
      <div class="relative bg-linear-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:to-neutral-900 p-6 text-white">
        <button
          type="button"
          @click="emit('close')"
          aria-label="Close"
          class="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
        >
          <X class="size-4" />
        </button>

        <div class="flex flex-col items-center text-center space-y-3">
          <!-- Avatar -->
          <div class="relative size-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-white dark:bg-[#222222]">
            <img
              v-if="official.image_url"
              :src="official.image_url"
              :alt="formatOfficialName(official.first_name, official.middle_name, official.last_name)"
              class="size-full object-cover"
            />
            <div
              v-else
              class="size-full flex items-center justify-center bg-[#dc2626]/20 text-[#f87171] font-bold text-2xl"
            >
              {{ official.first_name?.charAt(0).toUpperCase() || '?' }}
            </div>
          </div>

          <div>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#dc2626] text-white tracking-wide uppercase">
              {{ official.position?.title || 'Elected Official' }}
            </span>
            <h3 class="text-lg font-bold text-white mt-1.5 leading-snug">
              {{ formatOfficialName(official.first_name, official.middle_name, official.last_name) }}
            </h3>
            <p class="text-xs text-neutral-300">
              Municipality of San Francisco, Agusan del Sur
            </p>
          </div>
        </div>
      </div>

      <!-- Content Body -->
      <div class="p-5 space-y-4">
        <!-- Details Card -->
        <div class="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-2.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-neutral-500 dark:text-neutral-400 flex items-center space-x-1.5">
              <ShieldCheck class="size-3.5 text-[#dc2626]" />
              <span>Position:</span>
            </span>
            <span class="font-semibold text-neutral-800 dark:text-neutral-200">
              {{ official.position?.title || 'Elected Official' }}
            </span>
          </div>

          <div v-if="official.contact" class="flex items-center justify-between">
            <span class="text-neutral-500 dark:text-neutral-400 flex items-center space-x-1.5">
              <Phone class="size-3.5 text-[#dc2626]" />
              <span>Contact:</span>
            </span>
            <span class="font-medium text-neutral-700 dark:text-neutral-300">
              {{ official.contact }}
            </span>
          </div>

          <div v-if="parentOfficialName" class="flex items-center justify-between">
            <span class="text-neutral-500 dark:text-neutral-400 flex items-center space-x-1.5">
              <GitFork class="size-3.5 text-[#dc2626]" />
              <span>Reports To:</span>
            </span>
            <span class="font-medium text-neutral-700 dark:text-neutral-300">
              {{ parentOfficialName }}
            </span>
          </div>

          <div v-if="subordinates && subordinates.length > 0" class="pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
            <span class="text-neutral-500 dark:text-neutral-400 block mb-1.5 font-medium">
              Attached Sub-Officials / Councilors ({{ subordinates.length }}):
            </span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="sub in subordinates"
                :key="sub.id"
                class="px-2 py-1 rounded-md bg-neutral-200/70 dark:bg-neutral-800 text-[11px] text-neutral-800 dark:text-neutral-200"
              >
                {{ sub.fullName }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
