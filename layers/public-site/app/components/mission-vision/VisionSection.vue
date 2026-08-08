<script setup lang="ts">

const {vision} = useContent()
</script>

<template>
    <section class="px-6 py-24 md:py-32 lg:py-40 bg-[#fafafa] dark:bg-[#1c1c1c] transition-colors">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <span class="text-xs md:text-sm uppercase tracking-widest text-primary/70 dark:text-white/70 mb-8 font-medium">The Vision</span>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight md:tracking-tighter lg:tracking-tighter leading-[1.1] max-w-[45ch] text-balance">
          {{ vision }}
        </h1>
      </div>
    </section>
</template>