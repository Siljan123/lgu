<script setup lang="ts">
interface Props {
  title: string
  description: string
  image?: string
  imageAlt?: string
}

withDefaults(defineProps<Props>(), {
  image: '/images/bg/municipal_hall.png',
  imageAlt: 'Hero section image',
})
</script>

<template>
  <section class="w-full bg-[#ffffff] dark:bg-[#1c1c1c] pt-12 pb-8 sm:pt-16 sm:pb-12 overflow-hidden border-b border-[#dfdfdf] dark:border-[#2a2a2a]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <!-- Text Content -->
        <div class="max-w-2xl">
          <slot name="title">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] leading-[1.1] mb-4 whitespace-pre-line">
              {{ title }}
            </h1>
          </slot>
          <slot name="description">
            <p v-if="description" class="text-[16px] sm:text-[18px] text-[#707070] dark:text-[#a3a3a3] leading-relaxed max-w-[65ch]">
              {{ description }}
            </p>
          </slot>
          <slot />
        </div>

        <!-- Image Content -->
       <div v-if="image || $slots.image" class="relative w-full aspect-21/9 sm:aspect-video lg:aspect-video rounded-lg overflow-hidden bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2a2a2a]">
        <slot name="image">
          <NuxtImg 
            :src="image" 
            :alt="imageAlt" 
            class="w-full h-full object-cover opacity-90"
            loading="lazy"
            format="webp"
          />
        </slot>
      </div>
      </div>
    </div>
  </section>
</template>
