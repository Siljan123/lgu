<script setup lang="ts">
import { Calendar, MapPin, Sparkles, Clock, PlusCircle, Layers, Building2 } from '@lucide/vue'
import type { RecurringEvent } from '../../composables/useEventsFestivals'

interface Props {
  recurringEvents: RecurringEvent[]
}

defineProps<Props>()
</script>

<template>
  <section class="w-full space-y-8 pt-6">
    <!-- Header Title -->
    <div class="space-y-2 max-w-3xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#85181a]/10 dark:bg-[#ef4444]/10 text-[#85181a] dark:text-[#ef4444]">
        <Layers :size="14" />
        Content Roadmap — Additional Observances
      </div>
      <h2 class="text-2xl md:text-3xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
        Recurring Local & Municipal Events
      </h2>
      <p class="text-sm md:text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
        The Diwata/Magdiwata Festival is San Francisco's flagship celebration. As official schedules and details are confirmed by the Municipal Tourism Office and LGU admin panel, entries for recurring observances are expanded below.
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="item in recurringEvents" 
        :key="item.id"
        class="p-6 md:p-7 rounded-xl bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] flex flex-col justify-between space-y-4 hover:border-[#85181a]/40 transition-colors"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ededed] dark:bg-[#2a2a2a] text-[#171717] dark:text-[#d4d4d4]">
              <Clock :size="12" class="text-[#85181a] dark:text-[#ef4444]" />
              {{ item.badge }}
            </span>
            <span class="text-xs font-mono text-[#707070] dark:text-[#a3a3a3]">
              {{ item.category }}
            </span>
          </div>

          <h3 class="text-xl font-medium text-[#171717] dark:text-[#ffffff]">
            {{ item.title }}
          </h3>

          <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
            {{ item.shortDescription }}
          </p>
        </div>

        <div class="pt-4 border-t border-[#ededed] dark:border-[#2e2e2e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#707070] dark:text-[#a3a3a3]">
          <div class="flex items-center gap-1.5">
            <Calendar :size="13" class="text-[#85181a] dark:text-[#ef4444]" />
            <strong class="text-[#171717] dark:text-[#ffffff] font-medium">{{ item.schedule }}</strong>
          </div>
          <div class="flex items-center gap-1.5">
            <Building2 :size="13" />
            <span>{{ item.organizer }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Panel / Tourism Office Notice Box -->
    <div class="p-6 md:p-8 rounded-2xl bg-[#ffffff] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2e2e2e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div class="space-y-1 max-w-2xl">
        <h4 class="text-base font-semibold text-[#171717] dark:text-[#ffffff] flex items-center gap-2">
          <PlusCircle :size="18" class="text-[#85181a] dark:text-[#ef4444]" />
          LGU Event Calendar Updates
        </h4>
        <p class="text-xs md:text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
          Event dates for barangay fiestas and LGU trade fairs are updated annually as official executive orders and committee guidelines are promulgated.
        </p>
      </div>

      <a 
        href="mailto:tourism@sanfrancisco-ads.gov.ph" 
        class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-semibold text-[#171717] dark:text-[#ffffff] bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] hover:bg-[#ededed] dark:hover:bg-[#2e2e2e] transition-colors shrink-0"
      >
        Submit Event Entry
      </a>
    </div>
  </section>
</template>
