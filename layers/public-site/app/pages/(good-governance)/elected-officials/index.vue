<script setup lang="ts">
import { ref } from 'vue'
import {
  Phone,
  Edit3,
  Trash2,
  Info,
  UserPlus,
} from '@lucide/vue'
import type { OfficialRow } from '../../../../types/official'

definePageMeta({
  layout: 'guest',
})

useHead({
  title: 'Elected Officials | Municipality of San Francisco',
  meta: [
    {
      name: 'description',
      content: 'Official directory and organizational hierarchy of elected leaders of San Francisco, Agusan del Sur.',
    },
  ],
})

const {
  treeRoot,
  flatOfficials,
  filteredOfficials,
  selectedOfficialId,
  searchQuery,
  stats,
  pending,
  error,
  selectOfficial,
} = useOfficials()

const activeViewMode = ref<'tree' | 'grid'>('tree')
const isDetailsModalOpen = ref(false)

const targetOfficial = ref<OfficialRow | null>(null)



function openDetailsModal(official: any) {
  const found = flatOfficials.value.find((o) => o.id === official.id)
  if (found) {
    targetOfficial.value = {
      id: found.id,
      label_name: found.label_name,
      first_name: found.first_name,
      middle_name: found.middle_name,
      last_name: found.last_name,
      position_id: found.position_id,
      position: { id: found.position_id || '', title: found.position },
      contact: found.contact,
      avatar_url: found.avatar_url || found.image_url,
      image_url: found.avatar_url || found.image_url,
      parent_id: found.parent_id,
      is_label: found.is_label,
    }
  } else {
    targetOfficial.value = official
  }
  isDetailsModalOpen.value = true
}
</script>

<template>
  <div>
    <!-- Hero Banner -->
    <UiHeroSection
      title="Elected Officials"
      description="Official directory and organizational structure of elected municipal leaders serving the Municipality of San Francisco, Agusan del Sur."
      image="/images/logo/sanfrancisco-ads-aerial.jpg"
    />

    <div class="w-full bg-[#fafafa] dark:bg-[#121212] min-h-[85vh] py-6 sm:py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <!-- Top Stats Overview Bar -->
        <ElectedOfficialsStats :stats="stats" />
        <ElectedOfficialsFilterBar
          v-model:search-query="searchQuery"
          v-model:active-view-mode="activeViewMode"
          :is-admin="false"
          />

        <div v-if="activeViewMode === 'tree'" class="w-full">
          <ElectedOfficialsOrgChart
            :tree-root="treeRoot"
            :pending="pending"
            :error="error"
            :selected-official-id="selectedOfficialId"
            :search-query="searchQuery"
            @select-official="selectOfficial"
            @view-details="openDetailsModal"
            :is-admin="false"
          />
        </div>
        <!-- 2. Directory Grid View -->
        <div v-else-if="activeViewMode === 'grid'" class="space-y-4">
          <ElectedOfficialsGridCard
            :filtered-officials="filteredOfficials"
            :search-query="searchQuery"
            @view-details="openDetailsModal"
            />
        </div>

      </div>
    </div>
   </div> 
  <Footer/>
</template>
