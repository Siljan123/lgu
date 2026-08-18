<script setup lang="ts">
import { ref } from 'vue'
import {
  Users,
  Search,
  Plus,
  Network,
  LayoutGrid,
  Shield,
  Award,
  Phone,
  Edit3,
  Trash2,
  Info,
  UserPlus,
  Crown,
} from '@lucide/vue'
import type { OfficialRow, AddOfficialPayload, EditOfficialPayload } from '../../../../types/official'

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
      first_name: found.first_name,
      middle_name: found.middle_name,
      last_name: found.last_name,
      position_id: found.position_id,
      position: { id: found.position_id || '', title: found.position },
      contact: found.contact,
      image_url: found.image_url,
      parent_id: found.parent_id,
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
      first_name: found.first_name,
      middle_name: found.middle_name,
      last_name: found.last_name,
      position_id: found.position_id,
      position: { id: found.position_id || '', title: found.position },
      contact: found.contact,
      image_url: found.image_url,
      parent_id: found.parent_id,
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
      first_name: found.first_name,
      middle_name: found.middle_name,
      last_name: found.last_name,
      position_id: found.position_id,
      position: { id: found.position_id || '', title: found.position },
      contact: found.contact,
      image_url: found.image_url,
      parent_id: found.parent_id,
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
    <!-- Hero Banner -->
    <UiHeroSection
      title="Elected Officials"
      description="Official directory and organizational structure of elected municipal leaders serving the Municipality of San Francisco, Agusan del Sur."
      image="/images/logo/sanfrancisco-ads-aerial.jpg"
    />

    <div class="w-full bg-[#fafafa] dark:bg-[#121212] min-h-[85vh] py-6 sm:py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        <!-- Top Stats Overview Bar -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- Total Officials -->
          <div class="border-r flex items-center space-x-3.5">
            <div class="size-11 rounded-xl bg-[#dc2626]/10 dark:bg-[#dc2626]/20 text-[#dc2626] dark:text-[#f87171] flex items-center justify-center shrink-0">
              <Users class="size-5" />
            </div>
            <div class="min-w-0">
              <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400 block">Total Officials</span>
              <span class="text-lg font-bold text-neutral-900 dark:text-white">{{ stats.total }}</span>
            </div>
          </div>

          <!-- Mayor -->
         <div class="border-r flex items-center space-x-3.5">
            <div class="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Crown class="size-5" />
            </div>
            <div class="min-w-0">
              <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400 block truncate">Municipal Mayor</span>
              <span class="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate block" :title="stats.mayorName">
                {{ stats.mayorName }}
              </span>
            </div>
          </div>

          <!-- Vice Mayor -->
         <div class="border-r flex items-center space-x-3.5">
            <div class="size-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Shield class="size-5" />
            </div>
            <div class="min-w-0">
              <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400 block truncate">Municipal Vice Mayor</span>
              <span class="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate block" :title="stats.viceMayorName">
                {{ stats.viceMayorName }}
              </span>
            </div>
          </div>

          <!-- Sangguniang Bayan -->
       <div class="border-r flex items-center space-x-3.5">
            <div class="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award class="size-5" />
            </div>
            <div class="min-w-0">
              <span class="text-xs font-medium text-neutral-500 dark:text-neutral-400 block">SB Councilors</span>
              <span class="text-lg font-bold text-neutral-900 dark:text-white">{{ stats.councilorsCount }} Members</span>
            </div>
          </div>
        </div>

        <!-- Controls Toolbar (Search, View Toggle, Add Button) -->
        <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search elected officials by name, title, or contact..."
              class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
            />
          </div>

          <!-- View Switcher & Action Buttons -->
          <div class="flex items-center justify-between md:justify-end space-x-2.5">
            <!-- View Mode Switcher -->
            <div class="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                @click="activeViewMode = 'tree'"
                class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                :class="[
                  activeViewMode === 'tree'
                    ? 'bg-white dark:bg-[#1c1c1c] text-[#dc2626] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                ]"
              >
                <Network class="size-3.5" />
                <span class="hidden sm:inline">Org Chart</span>
              </button>
              <button
                type="button"
                @click="activeViewMode = 'grid'"
                class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                :class="[
                  activeViewMode === 'grid'
                    ? 'bg-white dark:bg-[#1c1c1c] text-[#dc2626] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                ]"
              >
                <LayoutGrid class="size-3.5" />
                <span class="hidden sm:inline">Directory Grid</span>
              </button>
            </div>

            <!-- Add Elected Official Button -->
            <button
              type="button"
              @click="openAddModal()"
              class="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus class="size-4" />
              <span>Add Official</span>
            </button>
          </div>
        </div>

        <!-- Main Display Views -->

        <!-- 1. Org Chart View -->
        <div v-if="activeViewMode === 'tree'" class="w-full">
          <ElectedOfficialsOrgChart
            :tree-root="treeRoot"
            :pending="pending"
            :error="error"
            :selected-official-id="selectedOfficialId"
            @select-official="selectOfficial"
            @add-child="openAddModal"
            @edit="openEditModal"
            @delete="openDeleteModal"
            @view-details="openDetailsModal"
          />
        </div>

        <!-- 2. Directory Grid View -->
        <div v-else-if="activeViewMode === 'grid'" class="space-y-4">
          <div v-if="filteredOfficials.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="official in filteredOfficials"
              :key="official.id"
              class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] hover:border-[#dc2626] dark:hover:border-[#dc2626] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <!-- Avatar & Position Badge -->
                <div class="flex items-start justify-between">
                  <div class="relative size-14 rounded-full overflow-hidden border border-[#dfdfdf] dark:border-[#333333] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      v-if="official.image_url"
                      :src="official.image_url"
                      :alt="official.fullName"
                      class="size-full object-cover"
                    />
                    <div
                      v-else
                      class="size-full flex items-center justify-center bg-[#dc2626]/10 text-[#dc2626] font-bold text-base"
                    >
                      {{ official.first_name?.charAt(0).toUpperCase() || '?' }}
                    </div>
                  </div>

                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
                    :class="[
                      official.position.toLowerCase().includes('mayor') && !official.position.toLowerCase().includes('vice')
                        ? 'bg-neutral-900 text-white dark:bg-neutral-800'
                        : official.position.toLowerCase().includes('vice')
                          ? 'bg-[#dc2626] text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                    ]"
                  >
                    {{ official.position }}
                  </span>
                </div>

                <!-- Name & Contact -->
                <div class="mt-3.5">
                  <h4 class="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-1">
                    {{ official.fullName }}
                  </h4>
                  <p v-if="official.parentName" class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                    Reports to: {{ official.parentName }}
                  </p>
                  <p v-if="official.contact" class="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1 flex items-center space-x-1">
                    <Phone class="size-3 text-[#dc2626]" />
                    <span>{{ official.contact }}</span>
                  </p>
                </div>
              </div>

              <!-- Action Toolbar -->
              <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end space-x-1">
                <button
                  type="button"
                  @click="openDetailsModal(official)"
                  class="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
                  title="View Profile Details"
                >
                  <Info class="size-3.5" />
                </button>
                <button
                  type="button"
                  @click="openAddModal(official.id)"
                  class="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                  title="Add Subordinate"
                >
                  <UserPlus class="size-3.5" />
                </button>
                <button
                  type="button"
                  @click="openEditModal(official)"
                  class="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                  title="Edit Official"
                >
                  <Edit3 class="size-3.5" />
                </button>
                <button
                  type="button"
                  @click="openDeleteModal(official)"
                  class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-500 hover:text-[#dc2626] transition cursor-pointer"
                  title="Delete Official"
                >
                  <Trash2 class="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div v-else class="py-16 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#dfdfdf] dark:border-[#333333]">
            No elected officials matching "{{ searchQuery }}".
          </div>
        </div>

      </div>
    </div>

    <!-- Modals -->
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
  <Footer/>
</template>
