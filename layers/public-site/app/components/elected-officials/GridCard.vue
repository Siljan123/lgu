<script setup lang="ts">
import { computed } from 'vue'
import {
  Phone,
  Info,
} from '@lucide/vue'

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const props = withDefaults(
  defineProps<{
    filteredOfficials?: any[]
  }>(),
  {
    filteredOfficials: () => [],
  }
)

const emit = defineEmits<{
  (e: 'view-details', official: any): void
}>()

// Sort officials based on rank position (lowest rank_order = highest rank: Mayor (1), Vice Mayor (2), SB Member (4)...)
const sortedOfficials = computed(() => {
  const list = [...(props.filteredOfficials || [])]
  return list.sort((a, b) => {
    const rankA = a.rank_order ?? a.position?.rank_order ?? 99
    const rankB = b.rank_order ?? b.position?.rank_order ?? 99
    if (rankA !== rankB) {
      return rankA - rankB
    }
    return (a.last_name || a.fullName || '').localeCompare(b.last_name || b.fullName || '')
  })
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="sortedOfficials.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card
        v-for="official in sortedOfficials"
        :key="official.id"
        @click="emit('view-details', official)"
        class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] hover:border-[#dc2626] dark:hover:border-[#dc2626] transition-all flex flex-col justify-between cursor-pointer group"
      >
        <CardContent class="space-y-3">
          <!-- Avatar & Position Badge -->
          <div class="flex items-start justify-between">
            <div class="relative size-14 rounded-full overflow-hidden border border-[#dfdfdf] dark:border-[#333333] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 shadow-xs">
              <img
                v-if="official.avatar_url || official.image_url"
                :src="(official.avatar_url || official.image_url) as string"
                :alt="official.fullName"
                class="size-full object-cover"
              />
              <div
                v-else
                class="size-full flex items-center justify-center bg-[#dc2626]/10 text-[#dc2626] font-bold text-base"
              >
                {{ official.first_name?.charAt(0).toUpperCase() || '?' }}
              </div>
            </div>

          
          </div>

          <!-- Name & Contact -->
          <div class="mt-3.5">
            <h4 class="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-1  transition-colors">
              {{ official.fullName }}
            </h4>
            <p v-if="official.parentName" class="text-[11px] text-[#ff0300] dark:text-neutral-400 mt-0.5 truncate">
             {{ official.parentName }}
            </p>
            <p v-if="official.contact" class="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1 flex items-center space-x-1">
              <Phone class="size-3 text-[#dc2626]" />
              <span>{{ official.contact }}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="py-16 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#dfdfdf] dark:border-[#333333] space-y-3">
      <p>No elected officials matching "<span class="font-semibold text-neutral-900 dark:text-white">{{ searchQuery }}</span>".</p>
      <button
        v-if="searchQuery"
        type="button"
        @click="searchQuery = ''"
        class="px-3.5 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition cursor-pointer"
      >
        Clear Search Filter
      </button>
    </div>
  </div>
</template>