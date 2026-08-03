<script setup lang="ts">
import { TabsList } from '@/../layers/base/app/components/ui/tabs'
</script>

<template>
  <div class="overflow-x-auto pb-2 scrollbar-none">
    <TabsList class="bg-[#ededed] dark:bg-[#252525] p-1 rounded-lg inline-flex w-full sm:w-auto min-w-max border border-[#dfdfdf]/70 dark:border-[#333333]">
      <slot />
    </TabsList>
  </div>
</template>
