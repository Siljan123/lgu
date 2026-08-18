<script setup lang="ts">
definePageMeta({
    layout:'guest'
})
useHead({
    title:"Elected Official's",
    meta:[{
        name:"description",
        content:"Municipality of Sanfrancisco Agusan del sur Elected Official's"
    }]
})
const {treeRoot, pending, error} = useOfficials()
</script>

<template>

    <UiHeroSection
    title="Elected Officlal's"
    description="Municipality of Sanfrancisco Agusan del sur Elected Official's"
    />
    <div class="w-ful bg-gray-50 dark:bg-background">
        <div class="mx-auto py-8 max-w-7xl justify-center text-center">
            <ElectedOfficialsOrgChart
            :tree-root="treeRoot"
            :pending="pending"
            :error="error"
            />
        </div>
    </div>
</template>