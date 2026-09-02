<script setup lang="ts">
import { Crown, Award, Shield } from '@lucide/vue'

defineProps<{
  stats: {
    total: number
    mayorName: string | null
    viceMayorName: string | null
    councilorsCount: number
  }
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [role: 'mayor' | 'vice-mayor' | 'councilors']
}>()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <!-- Mayor -->
    <button
      type="button"
      class="border p-2 rounded-md bg-[#ffef03] flex items-center space-x-3.5 text-left transition hover:brightness-95 disabled:pointer-events-none"
      :disabled="loading"
      @click="emit('select', 'mayor')"
    >
      <Crown class="size-5 shrink-0 text-neutral-800" />
      <div class="min-w-0">
        <span class="text-xs font-medium text-neutral-800 block truncate">Municipal Mayor</span>
        <template v-if="loading">
          <span class="block h-4 w-24 rounded bg-neutral-900/10 animate-pulse" />
        </template>
        <template v-else-if="stats.mayorName">
          <span
            class="text-xs sm:text-sm font-bold text-neutral-900 truncate block"
            :title="stats.mayorName"
          >
            {{ stats.mayorName }}
          </span>
        </template>
        <span v-else class="text-xs sm:text-sm font-bold text-neutral-900/50 italic block">
          Vacant
        </span>
      </div>
    </button>

    <button
      type="button"
      class="border p-2 rounded-md bg-[#da0b08] flex items-center space-x-3.5 text-left transition hover:brightness-95 disabled:pointer-events-none"
      :disabled="loading"
      @click="emit('select', 'vice-mayor')"
    >
      <Award class="size-5 shrink-0 text-red-100" />
      <div class="min-w-0">
        <span class="text-xs font-medium text-red-100 block truncate">Municipal Vice Mayor</span>
        <template v-if="loading">
          <span class="block h-4 w-24 rounded bg-white/20 animate-pulse" />
        </template>
        <template v-else-if="stats.viceMayorName">
          <span
            class="text-xs sm:text-sm font-bold text-white truncate block"
            :title="stats.viceMayorName"
          >
            {{ stats.viceMayorName }}
          </span>
        </template>
        <span v-else class="text-xs sm:text-sm font-bold text-red-100/70 italic block">
          Vacant
        </span>
      </div>
    </button>

    <!-- SB Councilors -->
    <button
      type="button"
      class="border p-2 rounded-md bg-[#3654a2] flex items-center space-x-3.5 text-left transition hover:brightness-95 disabled:pointer-events-none"
      :disabled="loading"
      @click="emit('select', 'councilors')"
    >
      <Shield class="size-5 shrink-0 text-blue-100" />
      <div class="min-w-0">
        <span class="text-xs font-medium text-blue-100 block">SB Councilors</span>
        <template v-if="loading">
          <span class="block h-5 w-16 rounded bg-white/20 animate-pulse" />
        </template>
        <span v-else class="text-lg font-bold text-white">{{ stats.councilorsCount }} Members</span>
      </div>
    </button>

    <!-- Total Officials (uses the previously-unused `total` prop) -->
    <div class="border p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center space-x-3.5">
      <div class="min-w-0">
        <span class="text-xs font-medium text-neutral-500 block">Total Officials</span>
        <template v-if="loading">
          <span class="block h-5 w-12 rounded bg-neutral-900/10 animate-pulse" />
        </template>
        <span v-else class="text-lg font-bold text-neutral-900 dark:text-white">{{ stats.total }}</span>
      </div>
    </div>
  </div>
</template>