<script setup lang="ts">
definePageMeta({
    layout: 'guest'
})

useHead({
    title: 'Where to Stay & Eat — San Francisco, Agusan del Sur',
    meta: [{
        name: 'description',
        content: 'Official tourism directory of hotels, inns, lodges, homestays, resorts, restaurants, eateries, carinderias, cafes, and local food stalls in San Francisco, Agusan del Sur.'
    }]
})
</script>

<template>
    <div>
        <UiHeroSection
            title="Where to Stay and Eat"
            description="Explore local accommodations (Hotels, Inns, Lodges, Homestays, Resorts) and dining spots (Restaurants, Eateries, Cafes, Local Food Stalls) across San Francisco, Agusan del Sur."
        />
        
        <main class="min-h-screen py-6 bg-[#ffffff] dark:bg-[#171717] transition-colors">
            <LazyWhereToStayEatWhereToStaySection />
        </main>

        <Footer />
    </div>
</template>