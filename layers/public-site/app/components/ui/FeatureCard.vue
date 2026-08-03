<script setup lang="ts">
import { Card } from '@/../layers/base/app/components/ui/card'

defineProps<{
  class?: string
}>()
</script>

<template>
  <Card
    :class="[
      'bg-white dark:bg-[#202020] border-[#dfdfdf] dark:border-[#2e2e2e] hover:border-[#c7c7c7] dark:hover:border-[#404040] transition-all shadow-sm flex flex-col justify-between',
      $props.class
    ]"
  >
    <slot />
  </Card>
</template>
