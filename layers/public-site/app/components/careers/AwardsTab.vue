<script setup lang="ts">
import { type AwardRecognition } from '../../composables/useCareers'
import CareersSearchInput from './CareersSearchInput.vue'
import {
  Award,
  Trophy,
  Star,
  Building2,
  Calendar,
  CheckCircle2,
  Medal,
  Users
} from '@lucide/vue'

defineProps<{
  awards: AwardRecognition[]
  searchQuery: string
  categoryFilter: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:categoryFilter', val: string): void
}>()

const awardSuggestedTags = [
  'CSC Honor Awards',
  'DILG Governance',
  'PRAISE Award',
  'HRMO Team',
  'Planning',
  'Health',
  'IT Division',
  '2025'
]
</script>

<template>
  <div class="space-y-8">

    <div>
      <div class="flex items-center gap-2">
        <h2 class="text-xl uppercase tracking-wider font-semibold text-primary">
          Excellence & Public Service Awards
        </h2>
      </div>

      <p class="text-sm md:text-base mt-4 text-[#707070] dark:text-[#a3a3a3] leading-relaxed max-w-[85ch]">
        The Municipal Government celebrates the outstanding performance and exemplary service of its employees and offices. This section highlights individuals and departments who have received awards and recognitions from the Civil Service Commission, the Department of the Interior and Local Government, and other awarding bodies for their excellent public service.
      </p>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="p-4 sm:p-5 rounded-xl border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        
        <div class="md:col-span-6">
          <CareersSearchInput
            :modelValue="searchQuery"
            @update:modelValue="emit('update:searchQuery', $event)"
            placeholder="Search by award title, awardee name, or awarding body..."
            :suggestedTags="awardSuggestedTags"
            label="Suggested Award Keywords"
          />
        </div>

        <!-- Category Filter Select -->
        <div class="md:col-span-6">
          <select
            :value="categoryFilter"
            @change="emit('update:categoryFilter', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] text-primary focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
          >
            <option value="ALL">All Award Categories</option>
            <option value="CSC Honor Awards">CSC Honor Awards Program (HAP)</option>
            <option value="DILG Governance">DILG Local Governance Performance</option>
            <option value="LGU PRAISE Excellence">LGU HRMO PRAISE Excellence</option>
          </select>
        </div>

      </div>
    </div>

    <!-- Awards Cards Grid -->
    <div v-if="awards.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <article
        v-for="item in awards"
        :key="item.id"
        class="p-6 rounded-sm border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#ffffff] dark:bg-[#1c1c1c] hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between space-y-6 shadow-xs"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1 text-[11px] font-medium text-[#707070] dark:text-[#a3a3a3]">
              <Users v-if="item.recipientType === 'Office'" class="size-3" />
              <Star v-else class="size-3 text-amber-500" />
              {{ item.recipientType }} Awardee
            </span>
          </div>
          <div class="space-y-1">
            <h3 class="text-xl font-medium tracking-tight text-primary leading-snug">
              {{ item.awardTitle }}
            </h3>
            <p class="text-xs text-brand font-semibold uppercase tracking-wider">
              Conferred by: {{ item.awardingBody }}
            </p>
          </div>

          <!-- Citation Quote -->
          <p class="text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ item.citation }}
          </p>
        </div>

        <div class="pt-4 border-t border-[#dfdfdf] dark:border-[#2a2a2a] flex items-center justify-between text-xs text-[#707070] dark:text-[#a3a3a3]">
          <span class="flex items-center gap-1.5">
            <Calendar class="size-3.5 text-amber-500" />
            Conferred Year: <strong class="text-primary font-medium">{{ item.year }}</strong>
          </span>

          <span class="px-2.5 py-0.5 rounded-md bg-[#fafafa] dark:bg-[#252525] border text-[11px] font-medium text-primary">
            {{ item.category }}
          </span>
        </div>

      </article>

    </div>

    <!-- Empty State -->
    <div v-else class="py-16 text-center rounded-xl border border-dashed border-[#dfdfdf] dark:border-[#333333] space-y-3">
      <Award class="size-10 text-[#707070] mx-auto stroke-1" />
      <h3 class="text-base font-medium text-primary">No Award Records Match</h3>
      <p class="text-xs text-[#707070] dark:text-[#a3a3a3] max-w-md mx-auto">
        Try adjusting your search query or choosing one of the suggested tags above.
      </p>
      <button
        type="button"
        @click="emit('update:searchQuery', ''); emit('update:categoryFilter', 'ALL');"
        class="px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

  </div>
</template>
