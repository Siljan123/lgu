<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  Building2,
  Search,
  X,
  Plus,
} from '@lucide/vue'

const props = defineProps<{
  offices: {
    id: string
    title: string
    acronym?: string
    category?: string
    headName?: string
    position?: string
    depth: number
    parentId?: string
    isCustom?: boolean
    childrenCount: number
    description?: string
    isLabel?: boolean
  }[]
  selectedOfficeId: string
}>()

const emit = defineEmits<{
  (e: 'select-office', id: string): void
  (e: 'add-sub-node', officeId: string): void
}>()

const searchQuery = ref('')
const filterType = ref<'all' | 'labels'>('labels')

const filteredOffices = computed(() => {
  let list = props.offices

  if (filterType.value === 'labels') {
    list = list.filter((o) => o.isLabel)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.acronym?.toLowerCase().includes(q) ||
        o.headName?.toLowerCase().includes(q)
    )
  }
  return list
})
</script>

<template>
  <aside class="w-full bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl p-4 md:p-5 flex flex-col space-y-3.5 shadow-xs">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-[#dfdfdf] dark:border-[#333333] pb-3">
      <div class="flex items-center space-x-2.5">
        <div class="p-2 rounded-lg bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171]">
          <Building2 class="size-4" />
        </div>
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Municipal Offices
          </h3>
          
        </div>
      </div>
    </div>

    <!-- Search Input -->
    <div class="relative">
      <Search class="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        v-model="searchQuery"
        placeholder="search...."
        class="w-full pl-8 pr-7 py-2 text-xs rounded-md border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa] dark:bg-[#141414] text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] transition-colors"
      />
      <button
        v-if="searchQuery"
        type="button"
        @click="searchQuery = ''"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
      >
        <X class="size-3.5" />
      </button>
    </div>

    <div class="space-y-2.5 max-h-[58vh] overflow-y-auto pr-1">
      <div
        v-if="filteredOffices.length === 0"
        class="py-8 text-center text-xs text-neutral-400"
      >
        No {{ filterType === 'labels' ? 'labels' : 'items' }} match your search.
      </div>
      <button
        v-for="dept in filteredOffices"
        :key="dept.id"
        type="button"
        @click="emit('select-office', dept.id)"
        class="w-full text-left p-2.5 rounded-md border transition-all relative flex flex-col gap-1 group cursor-pointer"
        :class="[
          selectedOfficeId === dept.id
            ? 'bg-neutral-50 dark:bg-[#222222] border-[#dc2626] shadow-xs'
            : 'bg-white dark:bg-[#1c1c1c] border-[#dfdfdf] dark:border-[#333333] hover:border-neutral-400 dark:hover:border-neutral-600'
        ]"
      >
        <span
          class="absolute -left-px top-2.5 bottom-2.5 w-1 rounded-r-md transition-all"
          :class="[
            selectedOfficeId === dept.id
              ? 'bg-[#dc2626] opacity-100'
              : 'bg-transparent opacity-0 group-hover:bg-neutral-300 dark:group-hover:bg-neutral-700'
          ]"
        ></span>

        <div class="flex items-center justify-between gap-2 ">
          <div class="flex items-center space-x-1.5 overflow-hidden">
            <span
              v-if="dept.acronym"
              class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171] uppercase shrink-0"
            >
              {{ dept.acronym }}
            </span>
          
          </div>

        </div>

        <p
          class="text-xs font-semibold leading-snug line-clamp-2 transition-colors"
          :class="[
            selectedOfficeId === dept.id
              ? 'text-[#dc2626] dark:text-[#f87171]'
              : 'text-neutral-900 dark:text-white group-hover:text-[#dc2626]'
          ]"
        >
          {{ dept.title }}
        </p>

        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 w-full truncate">
          {{ dept.headName || 'Office In-Charge' }}
        </p>
      </button>
    </div>
  </aside>
</template>
