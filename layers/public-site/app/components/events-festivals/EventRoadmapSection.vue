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
      <h2 class="text-2xl md:text-3xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
        Recurring Local & Municipal Events
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="item in recurringEvents" 
        :key="item.id"
        class="p-6 md:p-7 bg-background border-r flex flex-col justify-between space-y-4 transition-colors"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <Badge class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ededed] dark:bg-[#2a2a2a] text-[#171717] dark:text-[#d4d4d4]">
              <Clock :size="12" class="text-[#85181a] dark:text-[#ef4444]" />
              {{ item.badge }}
            </Badge>
      
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
  </section>
</template>
