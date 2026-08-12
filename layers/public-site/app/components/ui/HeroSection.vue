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
  <section class="w-full bg-background pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-[#dfdfdf] dark:border-[#2a2a2a]">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- Text Content -->
        <div class="max-w-2xl flex flex-col justify-center">
        
          <slot name="title">
            <h1 class="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight md:tracking-[-1.44px] lg:tracking-[-1.92px] text-primary leading-[1.1] mb-6 whitespace-pre-line text-balance">
              {{ title }}
            </h1>
          </slot>
          
          <slot name="description">
            <p v-if="description" class="text-base md:text-lg text-[#707070] dark:text-[#a3a3a3] leading-relaxed max-w-[65ch]">
              {{ description }}
            </p>
          </slot>
          
          <div v-if="$slots.default" class="mt-8 flex flex-wrap gap-4">
            <slot />
          </div>
        </div>

        <!-- Image Content -->
       <div v-if="image || $slots.image" class="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2a2a2a]">
        <slot name="image">
          <NuxtImg 
            :src="image" 
            :alt="imageAlt" 
            class="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700 ease-out opacity-90"
            loading="lazy"
            format="webp"
          />
        </slot>
      </div>
      </div>
    </div>
  </section>
</template>
