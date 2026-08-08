<script setup lang="ts">
import { Calendar } from '@lucide/vue'
import type { EventItem } from '../../composables/useEventsFestivals'

defineProps<{
  event: EventItem
}>()

const emit = defineEmits<{
  (e: 'select', event: EventItem): void
}>()
</script>

<template>
  <article 
    class="group relative flex flex-col justify-between h-full bg-[#ffffff] dark:bg-[#202020] rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#c7c7c7] dark:hover:border-[#404040] cursor-pointer"
    @click="emit('select', event)"
  >
    <!-- Card Content -->
    <div class="space-y-2">
      <!-- Category Badge / Label -->
      <div class="flex items-center justify-between gap-2">
      
        <Badge v-if="event.badge" class="px-2 py-0.5 rounded text-[10px] font-medium bg-[#171717] dark:bg-[#333333] text-[#ffffff]">
          {{ event.badge }}
        </Badge>
      </div>

      <!-- Title -->
      <h3 class="text-lg md:text-xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] transition-colors leading-snug">
        {{ event.title }}
      </h3>

      <!-- Short Description -->
      <p class="text-xs md:text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed line-clamp-3">
        {{ event.shortDescription }}
      </p>
    </div>

    <!-- Card Footer Divider & Meta Info -->
    <div class="mt-6 pt-4 border-t border-[#ededed] dark:border-[#2e2e2e] flex items-center justify-between gap-4 text-xs text-[#707070] dark:text-[#a3a3a3]">
      <div class="flex items-center gap-1.5 shrink-0">
        <Calendar :size="13" class="text-[#85181a] dark:text-[#ef4444]" />
        <span class="font-medium text-[#171717] dark:text-[#ffffff]">{{ event.startDate }}</span>
      </div>

      <div class="text-right truncate max-w-[180px]">
        <span class="truncate">{{ event.location }}</span>
      </div>
    </div>
  </article>
</template>
