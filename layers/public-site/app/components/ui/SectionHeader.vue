<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  maxDescriptionWidth?: string
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#dfdfdf] dark:border-[#2a2a2a]">
    <div>
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
        {{ title }}
      </h2>
      <p
        v-if="description"
        :class="['mt-2 text-base text-[#707070] dark:text-[#a3a3a3] leading-relaxed', maxDescriptionWidth || 'max-w-2xl']"
      >
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.action" class="shrink-0">
      <slot name="action" />
    </div>
  </div>
</template>
