<script setup lang="ts">
import { ref } from 'vue'
import {
  Search,
  Plus,
  Network,
  LayoutGrid,
  Phone,
  Edit3,
  Trash2,
  Info,
  UserPlus,
  X,
} from '@lucide/vue'
import type { OfficialRow, AddOfficialPayload, EditOfficialPayload } from '../../../../types/official'

definePageMeta({
  layout: 'sidebar-test',
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
  positions,
  flatOfficials,
  filteredOfficials,
  selectedOfficialId,
  searchQuery,
  stats,
  pending,
  error,
  selectOfficial,
  addOfficial,
  editOfficial,
  deleteOfficial,
} = useOfficials()

const activeViewMode = ref<'tree' | 'grid'>('tree')

// Modal States
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isDetailsModalOpen = ref(false)

const selectedParentId = ref<string | null>(null)
const targetOfficial = ref<OfficialRow | null>(null)

function openAddModal(parentId: string | null = null) {
  selectedParentId.value = parentId
  isAddModalOpen.value = true
}

function openEditModal(official: any) {
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
  isEditModalOpen.value = true
}

function openDeleteModal(official: any) {
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
  isDeleteModalOpen.value = true
}

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

// Handler executions
async function handleAddOfficial(payload: AddOfficialPayload) {
  try {
    await addOfficial(payload)
    isAddModalOpen.value = false
    selectedParentId.value = null
  } catch (err) {
    console.error('Failed to create official:', err)
  }
}

async function handleEditOfficial(payload: EditOfficialPayload) {
  try {
    await editOfficial(payload)
    isEditModalOpen.value = false
    targetOfficial.value = null
  } catch (err) {
    console.error('Failed to update official:', err)
  }
}

async function handleDeleteOfficial(id: string) {
  try {
    await deleteOfficial(id)
    isDeleteModalOpen.value = false
    targetOfficial.value = null
  } catch (err) {
    console.error('Failed to delete official:', err)
  }
}
</script>

<template>
  <div>
    <div class="bg-[#fafafa] dark:bg-[#121212] min-h-[85vh] py-6 sm:py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <ElectedOfficialsStats :stats="stats" />
        <ElectedOfficialsFilterBar
          v-model:search-query="searchQuery"
          :active-view-mode="activeViewMode"
          @update:active-view-mode="activeViewMode = $event"
          @add="openAddModal"
          :is-admin="true"
          />

        <div v-if="activeViewMode === 'tree'" class="w-full">
          <ElectedOfficialsOrgChart
            :tree-root="treeRoot"
            :pending="pending"
            :error="error"
            :selected-official-id="selectedOfficialId"
            :search-query="searchQuery"
            @select-official="selectOfficial"
            @add-child="openAddModal"
            @edit="openEditModal"
            @delete="openDeleteModal"
            @view-details="openDetailsModal"
          />
        </div>
        <div v-else-if="activeViewMode === 'grid'" class="space-y-4">
          <ElectedOfficialsGridCard
              :filtered-officials="filteredOfficials"
              :search-query="searchQuery"
              @view-details="openDetailsModal"
            />
        </div>

      </div>
    </div>

    <ElectedOfficialsOfficialAddModal
      :open="isAddModalOpen"
      :selected-parent-id="selectedParentId"
      :all-officials="flatOfficials"
      :positions="positions"
      @close="isAddModalOpen = false"
      @submit="handleAddOfficial"
    />

    <ElectedOfficialsOfficialEditModal
      :open="isEditModalOpen"
      :official="targetOfficial"
      :all-officials="flatOfficials"
      :positions="positions"
      @close="isEditModalOpen = false"
      @submit="handleEditOfficial"
    />

    <ElectedOfficialsOfficialDeleteModal
      :open="isDeleteModalOpen"
      :official="targetOfficial"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteOfficial"
    />

    <ElectedOfficialsOfficialDetailsModal
      :open="isDetailsModalOpen"
      :official="targetOfficial"
      :parent-official-name="flatOfficials.find(o => o.id === targetOfficial?.parent_id)?.fullName"
      :subordinates="flatOfficials.filter(o => o.parent_id === targetOfficial?.id)"
      @close="isDetailsModalOpen = false"
      @edit="openEditModal"
      @add-child="openAddModal"
    />
  </div>
</template>
