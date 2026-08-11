<script setup lang="ts">
import { type PromotedEmployee } from '../../composables/useCareers'
import CareersSearchInput from './CareersSearchInput.vue'
import {
  TrendingUp,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  ArrowRight
} from '@lucide/vue'

defineProps<{
  promotions: PromotedEmployee[]
  searchQuery: string
  yearFilter: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:yearFilter', val: string): void
}>()

const promotionSuggestedTags = [
  'Civil Engineer',
  'Health Officer',
  'Accountant',
  'HRMO',
  'Planning',
  'Architect',
  '2026',
  '2025'
]
</script>

<template>
  <div class="space-y-8">

    <!-- Section Intro Card -->
    <div>
      <div class="flex items-center gap-2">
        <h2 class="text-xl uppercase tracking-wider font-semibold text-primary">
          Personnel Advancement & Recognition of Growth
        </h2>
      </div>

      <p class="text-sm md:text-base mt-4 text-[#707070] dark:text-[#a3a3a3] leading-relaxed max-w-[85ch]">
        The Municipal Government takes pride in recognizing the professional growth of its employees. This section features personnel who have been promoted to higher positions in recognition of their dedication, competence, and continued service to the people of San Francisco, Agusan del Sur.
      </p>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="p-4 sm:p-5 rounded-xl border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        
        <!-- Search Input with Dropdown Tags -->
        <div class="md:col-span-8">
          <CareersSearchInput
            :modelValue="searchQuery"
            @update:modelValue="emit('update:searchQuery', $event)"
            placeholder="Search by employee name, promoted position, or department..."
            :suggestedTags="promotionSuggestedTags"
            label="Suggested Personnel Searches"
          />
        </div>

        <!-- Year Select Filter -->
        <div class="md:col-span-4">
          <select
            :value="yearFilter"
            @change="emit('update:yearFilter', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] text-primary focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
          >
            <option value="ALL">All Effective Years</option>
            <option value="2026">2026 Promotions</option>
            <option value="2025">2025 Promotions</option>
          </select>
        </div>

      </div>
    </div>

    <!-- Promotions Cards Grid -->
    <div v-if="promotions.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <article
        v-for="person in promotions"
        :key="person.id"
        class="p-6 rounded-sm border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#ffffff] dark:bg-[#1c1c1c] hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between space-y-6 shadow-xs"
      >
        <div class="space-y-4">
          <!-- Top Badge & CSC Notice -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] font-mono text-[#707070] dark:text-[#a3a3a3]">
              {{ person.cscResolution }}
            </span>
          </div>

          <!-- Employee Header Info -->
          <div class="flex items-start gap-3.5">
            <div class="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
              {{ person.employeeName.charAt(0) }}
            </div>
            
            <div class="space-y-0.5">
              <h3 class="text-lg font-medium tracking-tight text-primary leading-tight">
                {{ person.employeeName }}
              </h3>
              <p class="text-xs text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5">
                <span>{{ person.department }}</span>
              </p>
            </div>
          </div>

          <!-- Career Transition Badge (Previous -> Promoted) -->
          <div class="p-3.5 rounded-lg bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf]/70 dark:border-[#333333] space-y-2 text-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="space-y-0.5">
                <span class="text-[10px] text-[#707070] dark:text-[#a3a3a3] uppercase font-medium block">Previous Position</span>
                <span class="text-xs font-normal text-[#707070] dark:text-[#a3a3a3] line-through block">{{ person.previousPosition }}</span>
              </div>

              <ArrowRight class="size-4 text-emerald-500 shrink-0 self-center hidden sm:block" />

              <div class="space-y-0.5 text-left sm:text-right">
                <span class="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold block">Promoted Position</span>
                <span class="text-xs font-semibold text-primary block">{{ person.promotedPosition }}</span>
              </div>
            </div>
          </div>

          <!-- Commendation & Merit Quote -->
          <blockquote class="p-3 rounded-lg border border-l-2  border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa]/50 dark:bg-[#1c1c1c] text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed italic">
            "{{ person.commendation }}"
          </blockquote>
        </div>

        <!-- Footer: Effective Date -->
        <div class="pt-4 border-t border-[#dfdfdf] dark:border-[#2a2a2a] flex items-center justify-between text-xs text-[#707070] dark:text-[#a3a3a3]">
          <span class="flex items-center gap-1.5">
            <Calendar class="size-3.5 text-emerald-500" />
            Effective Date: <strong class="text-primary font-medium">{{ person.effectiveDate }}</strong>
          </span>
        </div>

      </article>

    </div>

    <!-- Empty State -->
    <div v-else class="py-16 text-center rounded-xl border border-dashed border-[#dfdfdf] dark:border-[#333333] space-y-3">
      <TrendingUp class="size-10 text-[#707070] mx-auto stroke-1" />
      <h3 class="text-base font-medium text-primary">No Promotion Records Found</h3>
      <p class="text-xs text-[#707070] dark:text-[#a3a3a3] max-w-md mx-auto">
        Try adjusting your search query or choosing one of the suggested tags above.
      </p>
      <button
        type="button"
        @click="emit('update:searchQuery', ''); emit('update:yearFilter', 'ALL');"
        class="px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

  </div>
</template>
