<script setup lang="ts">


definePageMeta({
    layout: 'guest'
})

useHead({
    title: 'Where to Stay, Eat & Services — San Francisco, Agusan del Sur',
    meta: [{
        name: 'description',
        content: 'Official directory of hotels, homestays, dining establishments, cafes, spas, salons, malls, and healthcare services in San Francisco, Agusan del Sur.'
    }]
})
</script>

<template>
    <div>
        <UiHeroSection
            title="Where to Stay and Eat "
            description="Explore local accommodations, dining spots, cafes, beauty salons, spas, shopping malls, and healthcare facilities across San Francisco, Agusan del Sur."
        />
        
        <main class="min-h-screen py-6 bg-[#ffffff] dark:bg-[#171717] transition-colors">
            <LazyWhereToStayEatWhereToStaySection />
        </main>

        <Footer />
    </div>
</template>