<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import {
  useBarangayDirectory,
  type BarangayItem,
  type BarangayOfficial,
  type BarangayTerm
} from '../../composables/useBarangayDirectory'
import BarangayDirectorySidebar from './BarangayDirectorySidebar.vue'
import BarangayDirectoryHeaderStats from './BarangayDirectoryHeaderStats.vue'
import BarangayMiniMapCard from './BarangayMiniMapCard.vue'
import BarangayOfficialsOrgChart from './BarangayOfficialsOrgChart.vue'
import BarangayOfficialAddModal from './BarangayOfficialAddModal.vue'
import BarangayOfficialEditModal from './BarangayOfficialEditModal.vue'
import BarangayOfficialDeleteModal from './BarangayOfficialDeleteModal.vue'
import BarangayAddModal from './BarangayAddModal.vue'
import BarangayEditModal from './BarangayEditModal.vue'
import BarangayDeleteModal from './BarangayDeleteModal.vue'
import BarangayTermSwitcher from './BarangayTermSwitcher.vue'
import BarangayTermModal from './BarangayTermModal.vue'

const {
  barangays,
  filteredBarangays,
  selectedBarangay,
  selectedClassification,
  searchQuery,
  totalPopulation,
  classificationCounts,
  isLoading,
  isLoadingDetails,
  error,
  terms,
  selectedTermId,
  fetchBarangays,
  fetchBarangayById,
  fetchTerms,
  selectTerm,
  createTerm,
  updateTerm,
  deleteTerm,
  selectBarangay,
  createBarangay,
  updateBarangay,
  deleteBarangay,
  addOfficial,
  updateOfficial,
  deleteOfficial,
  reorderOfficials,
  uploadAvatar
} = useBarangayDirectory()

// Modal states
const isAddOfficialOpen = ref(false)
const isEditOfficialOpen = ref(false)
const isDeleteOfficialOpen = ref(false)
const isDetailsOfficialOpen = ref(false)
const isAddBarangayOpen = ref(false)
const isEditBarangayOpen = ref(false)
const isDeleteBarangayOpen = ref(false)
const isTermModalOpen = ref(false)

const selectedParentId = ref<string | null>(null)
const targetOfficial = ref<BarangayOfficial | null>(null)
const targetBarangay = ref<BarangayItem | null>(null)
const targetTerm = ref<BarangayTerm | null>(null)

const activeOfficials = computed<BarangayOfficial[]>(() => {
  return selectedBarangay.value?.officials || []
})

watch(
  () => selectedBarangay.value?.id,
  (newId) => {
    if (newId) {
      const current = selectedBarangay.value
      if (!current?.officials || current.officials.length === 0) {
        fetchBarangayById(newId)
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  if (barangays.value.length === 0) {
    await fetchBarangays()
  }
  if (terms.value.length === 0) {
    await fetchTerms()
  }
  if (barangays.value.length > 0) {
    const currentId = selectedBarangay.value?.id || barangays.value[0]!.id
    await selectBarangay(currentId)
  }
})

function openAddOfficialModal(parentId: string | null = null) {
  selectedParentId.value = parentId
  isAddOfficialOpen.value = true
}

function openAddChildModal(parentId: string) {
  selectedParentId.value = parentId
  isAddOfficialOpen.value = true
}

function openEditOfficialModal(official: BarangayOfficial) {
  targetOfficial.value = official
  isEditOfficialOpen.value = true
}

function openDeleteOfficialModal(official: BarangayOfficial) {
  targetOfficial.value = official
  isDeleteOfficialOpen.value = true
}

function openDetailsOfficialModal(official: BarangayOfficial) {
  targetOfficial.value = official
  isDetailsOfficialOpen.value = true
}

async function handleAddOfficial(payload: Partial<BarangayOfficial>) {
  if (!selectedBarangay.value?.id) return
  try {
    await addOfficial(selectedBarangay.value.id, payload)
    isAddOfficialOpen.value = false
    selectedParentId.value = null
  } catch (err) {
    console.error('Failed to add official:', err)
  }
}

async function handleEditOfficial(officialId: string, payload: Partial<BarangayOfficial>) {
  try {
    await updateOfficial(officialId, payload, selectedBarangay.value?.id)
    isEditOfficialOpen.value = false
    targetOfficial.value = null
  } catch (err) {
    console.error('Failed to update official:', err)
  }
}

async function handleDeleteOfficial(officialId: string) {
  try {
    await deleteOfficial(officialId, selectedBarangay.value?.id)
    isDeleteOfficialOpen.value = false
    targetOfficial.value = null
  } catch (err) {
    console.error('Failed to delete official:', err)
  }
}

async function handleReorderOfficials(orderedIds: string[]) {
  if (!selectedBarangay.value?.id || !orderedIds?.length) return
  try {
    await reorderOfficials(selectedBarangay.value.id, orderedIds)
  } catch (err) {
    console.error('Failed to reorder officials:', err)
  }
}

function openAddBarangayModal() {
  isAddBarangayOpen.value = true
}

function openEditBarangayModal() {
  if (selectedBarangay.value) {
    targetBarangay.value = selectedBarangay.value
    isEditBarangayOpen.value = true
  }
}

function openDeleteBarangayModal() {
  if (selectedBarangay.value) {
    targetBarangay.value = selectedBarangay.value
    isDeleteBarangayOpen.value = true
  }
}

async function handleAddBarangay(payload: Partial<BarangayItem>) {
  try {
    const created = await createBarangay(payload)
    isAddBarangayOpen.value = false
    if (created?.id) {
      await selectBarangay(created.id)
    }
  } catch (err) {
    console.error('Failed to create barangay:', err)
  }
}

async function handleEditBarangay(id: string, payload: Partial<BarangayItem>) {
  try {
    await updateBarangay(id, payload)
    isEditBarangayOpen.value = false
    targetBarangay.value = null
  } catch (err) {
    console.error('Failed to update barangay:', err)
  }
}

async function handleDeleteBarangay(id: string) {
  try {
    await deleteBarangay(id)
    isDeleteBarangayOpen.value = false
    targetBarangay.value = null
  } catch (err) {
    console.error('Failed to delete barangay:', err)
  }
}

// Term Handlers
function openAddTermModal() {
  targetTerm.value = null
  isTermModalOpen.value = true
}

function openEditTermModal(term: BarangayTerm) {
  targetTerm.value = term
  isTermModalOpen.value = true
}

async function handleTermSubmit(payload: Partial<BarangayTerm>, id?: string) {
  try {
    if (id) {
      await updateTerm(id, payload)
    } else {
      await createTerm(payload)
    }
    isTermModalOpen.value = false
    targetTerm.value = null
  } catch (err) {
    console.error('Failed to save term:', err)
  }
}

async function handleSelectTerm(termId: string) {
  try {
    await selectTerm(termId)
  } catch (err) {
    console.error('Failed to switch term:', err)
  }
}

async function handleDeleteTerm(term: BarangayTerm) {
  if (!term?.id) return
  const ok = typeof window === 'undefined'
    ? true
    : window.confirm(
        `Delete term "${term.label}"? All elected officials recorded under this term will be permanently removed. This cannot be undone.`
      )
  if (!ok) return
  try {
    await deleteTerm(term.id)
  } catch (err) {
    console.error('Failed to delete term:', err)
  }
}
</script>

<template>
  <section class="w-full bg-[#fafafa] dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] py-8 sm:py-10 md:py-14 transition-colors min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

      <div v-if="isLoading && barangays.length === 0" class="animate-pulse space-y-6">
        <div class="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-2xl w-full"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-3 h-120 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
          <div class="lg:col-span-9 h-120 bg-neutral-200 dark:bg-neutral-800 rounded-2xl"></div>
        </div>
      </div>
      
      <div v-else class="space-y-6">
        <BarangayDirectoryHeaderStats 
          v-if="selectedBarangay" 
          :barangay="selectedBarangay" 
          :is-admin="true"
          @add-official="() => openAddOfficialModal(null)"
          @edit-barangay="openEditBarangayModal"
          @delete-barangay="openDeleteBarangayModal"
        />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start mt-6">
          <div class="lg:col-span-3 px-1 sm:px-2 lg:sticky lg:top-24">
            <BarangayDirectorySidebar @add-barangay="openAddBarangayModal" :is-admin="true" />
          </div>

          <!-- Main Content Area -->
          <main class="lg:col-span-9 min-w-0 space-y-6 md:space-y-8">
            <div v-if="selectedBarangay" class="space-y-6 md:space-y-8">
              <BarangayMiniMapCard :barangay="selectedBarangay" />

              <!-- Term of office switcher (public can browse past terms) -->
              <BarangayTermSwitcher
                v-if="terms.length"
                :terms="terms"
                :selected-term-id="selectedTermId"
                :is-admin="true"
                @select="handleSelectTerm"
                @add="openAddTermModal"
                @edit="openEditTermModal"
                @delete="handleDeleteTerm"
              />

              <div class="w-full overflow-x-auto">
                <BarangayOfficialsOrgChart
                  :officials="selectedBarangay.officials ?? []"
                  :barangay-name="selectedBarangay.name"
                  :barangay-id="selectedBarangay.id"
                  :is-admin="true"
                  @add-official="() => openAddOfficialModal(null)"
                  @add-child="openAddChildModal"
                  @edit="openEditOfficialModal"
                  @delete="openDeleteOfficialModal"
                  @view-details="openDetailsOfficialModal"
                  @reorder="handleReorderOfficials"
                />
              </div>
            </div>

            <!-- Empty / Error state -->
            <div 
              v-else 
              class="py-16 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-[#dfdfdf] dark:border-[#333333]"
            >
              <p class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">No Barangay Selected</p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Select a barangay from the list on the left to view details and organizational structure.</p>
              <button
                v-if="barangays.length === 0"
                type="button"
                @click="fetchBarangays"
                class="mt-4 px-4 py-2 text-xs font-semibold bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] transition-colors cursor-pointer"
              >
                Reload from Supabase
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Official Modals -->
    <BarangayOfficialAddModal
      :open="isAddOfficialOpen"
      :barangay-id="selectedBarangay?.id || ''"
      :barangay-name="selectedBarangay?.name || ''"
      :selected-parent-id="selectedParentId"
      :all-officials="activeOfficials"
      @close="isAddOfficialOpen = false"
      @submit="handleAddOfficial"
      @upload-avatar="uploadAvatar"
    />

    <BarangayOfficialEditModal
      :open="isEditOfficialOpen"
      :official="targetOfficial"
      :all-officials="activeOfficials"
      :barangay-name="selectedBarangay?.name"
      @close="isEditOfficialOpen = false"
      @submit="handleEditOfficial"
      @upload-avatar="uploadAvatar"
    />

    <BarangayOfficialDeleteModal
      :open="isDeleteOfficialOpen"
      :official="targetOfficial"
      :all-officials="activeOfficials"
      @close="isDeleteOfficialOpen = false"
      @confirm="handleDeleteOfficial"
    />

    <!-- Barangay Modals -->
    <BarangayAddModal
      :open="isAddBarangayOpen"
      @close="isAddBarangayOpen = false"
      @submit="handleAddBarangay"
    />

    <BarangayEditModal
      :open="isEditBarangayOpen"
      :barangay="targetBarangay"
      @close="isEditBarangayOpen = false"
      @submit="handleEditBarangay"
    />

    <BarangayDeleteModal
      :open="isDeleteBarangayOpen"
      :barangay="targetBarangay"
      @close="isDeleteBarangayOpen = false"
      @confirm="handleDeleteBarangay"
    />

    <!-- Term Modal (add / edit) -->
    <BarangayTermModal
      :open="isTermModalOpen"
      :term="targetTerm"
      @close="isTermModalOpen = false"
      @submit="handleTermSubmit"
    />
  </section>
</template>