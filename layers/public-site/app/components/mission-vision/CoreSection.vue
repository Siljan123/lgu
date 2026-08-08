<script setup lang="ts">

const {core} = useContent()
</script>

<template>
  <section class="px-6 py-24 md:py-32 bg-[#fafafa] dark:bg-[#1c1c1c] transition-colors">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

      <!-- Typographic Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 border-t border-[#dfdfdf] pt-16">
        <div
          v-for="(item, index) in core"
          :key="item.description"
          class="flex flex-col"
        >
          <span class="text-brand text-sm font-medium mb-4">
            {{ String(index + 1).padStart(1, '0') }}
          </span>
          <h3 class="text-xl md:text-3xl font-medium tracking-normal md:tracking-tight leading-[1.2]">
            {{ item.description }}
          </h3>
        </div>
      </div>

    </div>
  </section>
</template>