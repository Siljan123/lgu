<script setup lang="ts">
import municipalHallBg from '@base/app/assets/images/bg/municipal_hall.png'
</script>

<template>
  <section class="w-full bg-[#ffffff] dark:bg-[#1c1c1c] pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden border-b border-[#dfdfdf] dark:border-[#2a2a2a]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <!-- Text Content -->
        <div class="max-w-2xl">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] leading-[1.1] mb-6">
            The History of<br />San Francisco
          </h1>
          <p class="text-[18px] text-[#707070] dark:text-[#a3a3a3] leading-relaxed max-w-[65ch]">
            Discover the rich heritage and origins of our municipality. From its early days as a small village nestled along the Adlayan River to its growth into a thriving community.
          </p>
        </div>

        <!-- Placeholder Image -->
        <div class="relative w-full aspect-4/3 sm:aspect-video lg:aspect-4/3 rounded-lg overflow-hidden bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2a2a2a]">
          <img 
            :src="municipalHallBg"
            alt="Historical placeholder" 
            class="w-full h-full object-cover opacity-90"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>
