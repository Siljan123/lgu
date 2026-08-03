<script setup lang="ts">
definePageMeta({
  layout: 'guest',
})

const searchDialogRef = ref()

function onOpenSearch(query?: string) {
  searchDialogRef.value?.open(query || '')
}
</script>

<template>
  <div>
    <HomeHeroSection @open-search="onOpenSearch" />
    <HomeDirectActionCenterSection @open-search="onOpenSearch" />
    <HomeIntegratedEnterpriseSuiteSection @open-search="onOpenSearch" />
    <HomeHumanResourcesBulletinSection @open-search="onOpenSearch" />
    <HomeExecutiveOfficeSection @open-search="onOpenSearch" />
    <HomeLegislativeOfficeSection @open-search="onOpenSearch" />
    <HomeNewsUpdatesSection @open-search="onOpenSearch" />
    <HomeSearchDialog ref="searchDialogRef" />

    <Footer />
  </div>
</template>

