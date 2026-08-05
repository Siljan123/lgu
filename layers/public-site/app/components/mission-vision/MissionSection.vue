<script lang="ts"></script>

<template>
    <section class="grid grid-cols-1 md:grid-cols-2 border-b border-[#dfdfdf]">
      <!-- Image Column -->
      <div class="h-[50vh] md:h-auto bg-[#fafafa]">
        <img 
          src="/images/vision-mission-hero.jpg" 
          alt="Agusan del Sur Government Pavilion" 
          class="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply" 
        />
      </div>
      <!-- Text Column -->
      <div class="px-6 py-24 md:p-24 lg:p-32 flex flex-col justify-center bg-[#1c1c1c] dark:bg-[#ffffff] text-[#ffffff] dark:text-[#171717]">
        <span class="text-xs md:text-sm uppercase tracking-widest text-[#ffffff]/80 dark:text-[#171717]/80 mb-8 font-medium">The Mission</span>
        <h2 class="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight md:tracking-tight lg:tracking-tighter leading-[1.15] text-balance">
          Deliver effective, efficient and quality services to the constituents and optimize utilization of its natural resources with consideration to ecological effects.
        </h2>
        <!-- Signature Brand Accent -->
        <div class="w-16 h-1 bg-brand mt-12 md:mt-16"></div>
      </div>
    </section>
</template>