<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue'
import OrganizationChart from 'organization-chart-vue3'
import 'organization-chart-vue3/style.css'
import { getInitials } from '../../../utils/string'

import type {
  OrganizationChartSelectPayload,
} from 'organization-chart-vue3'
import type {
  MunicipalDepartmentNode,
  AddNodePayload,
  EditNodePayload,
} from '../../../types/organization'
import {
  Building2,
  Plus,
  Trash2,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Maximize2,
  Minimize2,
  Phone,
  AlertCircle,
  Info,
} from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    treeRoot: MunicipalDepartmentNode | null
    positions?: string[]
    selectedOfficeId?: string
    viewMode?: 'all' | 'focused'
    pending?: boolean
    error?: unknown
  }>(),
  {
    positions: () => [],
    selectedOfficeId: 'mayor-root',
    viewMode: 'all',
    pending: false,
    error: undefined,
  }
)

const emit = defineEmits<{
  (e: 'add-node', payload: AddNodePayload): void
  (e: 'edit-node', payload: EditNodePayload): void
  (e: 'delete-node', nodeId: string): void
  (e: 'reset-default'): void
  (e: 'select-office', nodeId: string): void
}>()

// Pan & Zoom state
const scale = ref(0.9)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const isFullscreen = ref(false)

const highlightedNodeId = ref<string | null>(null)
// Modal states
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteConfirmOpen = ref(false)
const isDetailsModalOpen = ref(false)
const isResetConfirmOpen = ref(false)

const selectedTargetNode = ref<MunicipalDepartmentNode | null>(null)
const selectedParentId = ref<string>('')

const treeList = computed<MunicipalDepartmentNode[]>(() => {
  if (!props.treeRoot) return []
  if (Array.isArray(props.treeRoot)) return props.treeRoot
  const roots = (props.treeRoot as any).roots as MunicipalDepartmentNode[] | undefined
  if (roots && Array.isArray(roots) && roots.length > 0) {
    return roots
  }
  return [props.treeRoot]
})

const allNodesList = computed(() => {
  if (treeList.value.length === 0) return []
  const list: { id: string; title: string; acronym?: string; depth: number }[] = []
  function traverse(node: MunicipalDepartmentNode, depth = 0) {
    list.push({
      id: node.id,
      title: node.title,
      acronym: node.acronym,
      depth,
    })
    if (node.children) {
      for (const child of node.children) {
        traverse(child, depth + 1)
      }
    }
  }
  for (const tree of treeList.value) {
    traverse(tree, 0)
  }
  return list
})

function zoomIn() {
  scale.value = Math.min(2.5, Number((scale.value + 0.15).toFixed(2)))
}

function zoomOut() {
  scale.value = Math.max(0.25, Number((scale.value - 0.15).toFixed(2)))
}

function resetZoom() {
  scale.value = 0.9
  panX.value = 0
  panY.value = 0
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.08 : 0.08
  const newScale = Math.min(Math.max(0.25, scale.value + delta), 2.5)
  scale.value = Number(newScale.toFixed(2))
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  panX.value = e.clientX - startX.value
  panY.value = e.clientY - startY.value
}

function handleMouseUp() {
  isDragging.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}

function handleMouseDown(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('button, a, input, select, textarea, .interactive-btn')) return
  isDragging.value = true
  startX.value = e.clientX - panX.value
  startY.value = e.clientY - panY.value
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value || e.touches.length !== 1) return
  if (e.cancelable) e.preventDefault()
  panX.value = e.touches[0]!.clientX - startX.value
  panY.value = e.touches[0]!.clientY - startY.value
}

function handleTouchEnd() {
  isDragging.value = false
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea, .interactive-btn')) return
    isDragging.value = true
    startX.value = e.touches[0]!.clientX - panX.value
    startY.value = e.touches[0]!.clientY - panY.value
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})

function openAddChildModal(parentNode: MunicipalDepartmentNode) {
  selectedTargetNode.value = parentNode
  selectedParentId.value = parentNode.id
  isAddModalOpen.value = true
}

function openEditModal(node: MunicipalDepartmentNode) {
  selectedTargetNode.value = node
  isEditModalOpen.value = true
}

function openDeleteModal(node: MunicipalDepartmentNode) {
  selectedTargetNode.value = node
  isDeleteConfirmOpen.value = true
}

function openDetailsModal(node: MunicipalDepartmentNode) {
  selectedTargetNode.value = node
  isDetailsModalOpen.value = true
}

function handleAddNode(payload: AddNodePayload) {
  emit('add-node', payload)
  isAddModalOpen.value = false
}

function handleEditNode(payload: EditNodePayload) {
  emit('edit-node', payload)
  isEditModalOpen.value = false
}

function handleDeleteNode(nodeId: string) {
  emit('delete-node', nodeId)
  isDeleteConfirmOpen.value = false
  selectedTargetNode.value = null
}

function handleResetDefaults() {
  emit('reset-default')
  isResetConfirmOpen.value = false
}

function handleSelect(payload: OrganizationChartSelectPayload) {
  const node = payload.node as MunicipalDepartmentNode
  if (node) {
    highlightedNodeId.value = node.id
  }
}

// Watch selectedOfficeId prop to update highlight
watch(
  () => props.selectedOfficeId,
  (newId) => {
    if (newId) {
      highlightedNodeId.value = newId
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    ref="containerRef"
    class="w-full transition-all duration-300"
    :class="[
      isFullscreen
        ? 'fixed inset-0 z-50 bg-white dark:bg-[#121212] p-4 md:p-6 flex flex-col h-screen'
        : 'relative'
    ]"
  >
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2.5 bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-xl px-3 py-2 shadow-xs">
      <div class="flex items-center space-x-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
        <Building2 class="size-4 text-[#dc2626]" />
        <span>Hierarchy View</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="toggleFullscreen"
          class="interactive-btn p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'"
        >
          <Minimize2 v-if="isFullscreen" class="size-4" />
          <Maximize2 v-else class="size-4" />
        </button>
      </div>
    </div>

    <div
      class="relative w-full border border-[#dfdfdf] dark:border-[#333333] rounded-xl bg-[#fafafa]/60 dark:bg-[#141414]/60 overflow-hidden shadow-sm flex-1 flex flex-col"
      :class="[isFullscreen ? 'min-h-0' : 'min-h-[72vh] h-[75vh]']"
    >
      <div class="absolute bottom-4 right-4 z-20 flex items-center space-x-1.5 bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-xs border border-[#dfdfdf] dark:border-[#333333] rounded-xl px-3 py-1.5 shadow-md text-xs">
        <div class="flex items-center space-x-1.5 text-neutral-500 dark:text-neutral-400 mr-2 border-r border-neutral-200 dark:border-neutral-700 pr-2">
          <Move class="size-3.5 text-[#dc2626]" />
          <span class="text-[11px] select-none font-medium hidden sm:inline">Drag • Scroll</span>
        </div>

        <button
          type="button"
          @click="zoomOut"
          class="interactive-btn p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut class="size-4" />
        </button>

        <span class="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-100 min-w-10 text-center select-none">
          {{ Math.round(scale * 100) }}%
        </span>

        <button
          type="button"
          @click="zoomIn"
          class="interactive-btn p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn class="size-4" />
        </button>

        <div class="h-3.5 w-px bg-neutral-200 dark:bg-neutral-700 mx-1"></div>

        <button
          type="button"
          @click="resetZoom"
          class="interactive-btn p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors flex items-center space-x-1"
          title="Reset Zoom & Pan"
        >
          <RotateCcw class="size-3.5" />
          <span class="text-[11px] font-medium hidden md:inline">Reset</span>
        </button>
      </div>

      <div v-if="pending" class="w-full h-full flex flex-col items-center justify-center py-24 text-center text-neutral-500">
        <div class="size-8 border-3 border-[#dc2626] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-sm font-medium">Loading organizational structure…</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error && !treeRoot" class="w-full h-full flex flex-col items-center justify-center py-24 text-center text-destructive">
        <AlertCircle class="size-8 mb-2 text-destructive" />
        <p class="text-sm font-semibold">Unable to load organizational structure.</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!treeRoot" class="w-full h-full flex flex-col items-center justify-center py-24 text-center text-neutral-500">
        <Building2 class="size-8 mb-2 text-neutral-400" />
        <p class="text-sm">No organizational structure available.</p>
      </div>

      <div
        v-else
        ref="chartCanvasRef"
        class="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden flex-1"
        @mousedown="handleMouseDown"
        @touchstart.passive="handleTouchStart"
        @wheel.prevent="handleWheel"
        @dragstart.prevent
      >
        <div
          class="w-full min-w-max flex flex-wrap items-start justify-center gap-12 sm:gap-16 py-12 px-8 transition-transform duration-75 ease-out origin-top"
          :style="{
            transform: `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`,
            transformOrigin: 'top center'
          }"
        >
          <div
            v-for="tree in treeList"
            :key="tree.id"
            class="flex flex-col items-center"
          >
            <OrganizationChart
              :data="tree"
              @select="handleSelect"
              class="sfads-municipal-org-chart mx-auto"
            >
              <template #node-title="{ node }">
                <div class="flex items-center justify-between px-2 py-1 gap-1.5 overflow-hidden">
                  <span
                    v-if="(node as MunicipalDepartmentNode).acronym"
                    class="shrink-0 whitespace-nowrap px-2 py-0.5 bg-[#dc2626] text-white rounded text-[10px] font-mono font-extrabold"
                  >
                    {{ (node as MunicipalDepartmentNode).acronym }}
                  </span>
                  <span
                    v-if="node.children && node.children.length > 0"
                    class="shrink-0 ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    title="Sub-nodes count"
                  >
                    {{ node.children.length }}
                  </span>
                </div>
                <div
                  class="px-3 font-bold text-xs items-start transition-colors border-b"
                >
                   <span class="block w-full  font-bold text-xs sm:text-[13px] text-neutral-900 dark:text-white wrap-break-words line-clamp-2 text-left">
                      {{ node?.title }}
                    </span> 
                 
                </div>
              </template>

              <template #member="{ member, node }">
                
                <div
                  class="p-3 w-full bg-white dark:bg-[#1c1c1c] text-neutral-900 dark:text-neutral-100 flex flex-col justify-between group transition-all"
                  :class="[
                    highlightedNodeId === node?.id ? 'shadow-sm' : ''
                  ]"
                >
                  <div>
                    <div>
                      <div
                        v-if="member?.image_url"
                        class="size-12 sm:size-14 rounded-full overflow-hidden mx-auto"
                      >
                        <NuxtImg
                          :src="member.image_url"
                          :alt="member?.first_name"
                          class="w-full h-full object-cover"
                        />
                      </div>

                      <!-- fallback: initials avatar -->
                      <div
                        v-else
                        class="size-12 sm:size-14 rounded-full mx-auto flex items-center justify-center bg-[#dc2626]/10 text-[#dc2626] font-bold text-sm sm:text-base select-none"
                      >
                        {{ getInitials(member?.first_name) }}
                      </div>

                      
                    </div>
                  

                    <div class="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center space-y-0.5">
                      <p class="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {{ member?.name }}
                      </p>
                      <p
                        v-if="member?.position"
                        class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate"
                        :title="member?.position"
                      >
                        {{ member?.position }}
                      </p>
                    
                    </div>
                     <span class="flex  mt-1"> 
                      <Phone :size="15"/>
                      <p class="text-xs ml-4 font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {{ member?.contact }}
                      </p>
                    </span>
                  </div>

                  <!-- Hover Quick Actions Bar -->
                  <div class="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <!-- Add Sub-Node Button -->
                    <button
                      type="button"
                      @click.stop="openAddChildModal(node as MunicipalDepartmentNode)"
                      class="interactive-btn p-1.5 rounded-md bg-[#dc2626]/10 hover:bg-[#dc2626] text-[#dc2626] hover:text-white dark:bg-[#dc2626]/20 dark:text-[#f87171] dark:hover:text-white transition-colors cursor-pointer"
                      title="Add Child / Sub-Unit under this office"
                    >
                      <Plus class="size-3.5" />
                    </button>

                    <!-- View Details Button -->
                    <button
                      type="button"
                      @click.stop="openDetailsModal(node as MunicipalDepartmentNode)"
                      class="interactive-btn p-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                      title="View office details"
                    >
                      <Info class="size-3.5" />
                    </button>

                    <!-- Edit Button -->
                    <button
                      type="button"
                      @click.stop="openEditModal(node as MunicipalDepartmentNode)"
                      class="interactive-btn p-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                      title="Edit office / unit"
                    >
                      <Edit3 class="size-3.5" />
                    </button>

                    <!-- Delete Button (Available for any node except Mayor root) -->
                    <button
                      v-if="node?.id !== 'mayor-root' && node?.id !== '305451c6-aa72-4bf9-9480-5509c8263c23' && node?.id !== '00000000-0000-4000-8000-000000000001'"
                      type="button"
                      @click.stop="openDeleteModal(node as MunicipalDepartmentNode)"
                      class="interactive-btn p-1.5 rounded-md bg-destructive/10 hover:bg-destructive text-destructive hover:text-white transition-colors cursor-pointer"
                      title="Delete office / unit"
                    >
                      <Trash2 class="size-3.5" />
                    </button>
                  </div>
                </div>
              </template>
            </OrganizationChart>
          </div>
        </div>
      </div>
    </div>

    <OrganizationMunicipalOrgAddModal
      :open="isAddModalOpen"
      :selected-parent-id="selectedParentId"
      :all-nodes="allNodesList"
      :positions="positions"
      @close="isAddModalOpen = false"
      @submit="handleAddNode"
    />

    <OrganizationMunicipalOrgEditModal
      :open="isEditModalOpen"
      :node="selectedTargetNode"
      :positions="positions"
      @close="isEditModalOpen = false"
      @submit="handleEditNode"
    />

    <OrganizationMunicipalOrgDetailsModal
      :open="isDetailsModalOpen"
      :node="selectedTargetNode"
      @close="isDetailsModalOpen = false"
      @add-sub-node="(node) => { isDetailsModalOpen = false; openAddChildModal(node) }"
      @edit="(node) => { isDetailsModalOpen = false; openEditModal(node) }"
    />

    <OrganizationMunicipalOrgDeleteModal
      :open="isDeleteConfirmOpen"
      :node="selectedTargetNode"
      @close="isDeleteConfirmOpen = false"
      @confirm="handleDeleteNode"
    />

    <OrganizationMunicipalOrgResetModal
      :open="isResetConfirmOpen"
      @close="isResetConfirmOpen = false"
      @confirm="handleResetDefaults"
    />
  </div>
</template>

<style scoped>

:deep(.org-table) {
  border-collapse: separate !important;
  border-spacing: 0 !important;
  margin: 0 auto !important;
}

:deep(.org-table td) {
  vertical-align: top !important;
  text-align: center !important;
}

:deep(.org-node) {
  box-sizing: border-box !important;
  margin: 0 14px !important;
  display: inline-block !important;
  position: relative !important;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

:deep(.org-node .org-container) {
  display: flex !important;
  flex-direction: column !important;
  width: 215px !important;
  min-width: 215px !important;
  max-width: 215px !important;
  box-sizing: border-box !important;
  border: .5px solid #dfdfdf;
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark :deep(.org-node .org-container) {
  border-color: #333333;
  background-color: #1c1c1c;
}

:deep(.org-node .org-container:hover) {
  border-color: #c02c2c;
  transform: translateY(-1px);
  box-shadow: 0 1px 2px -3px rgba(220, 38, 38, 0.18);
}

:deep(.org-title) {
  order: 1 !important;
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: anywhere !important;
}

:deep(.org-content) {
  order: 2 !important;
  border: none !important;
  margin-top: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: anywhere !important;
}

/* Connector lines styling */
:deep(.org-child-level:before) {
  content: "" !important;
  border-left: 2px solid #cbd5e1 !important;
  height: 15px !important;
  position: absolute !important;
  bottom: 100% !important;
  left: 50% !important;
  transform: translate(-1px) !important;
}

:deep(.org-child-level:after) {
  content: "" !important;
  border: none !important;
  border-top: 2px solid #cbd5e1 !important;
  position: absolute !important;
  top: -15px !important;
  left: 0 !important;
  right: 0 !important;
}

:deep(.org-child-level:first-child:before),
:deep(.org-child-level:last-child:before) {
  display: none !important;
}

:deep(.org-child-level:first-child:after) {
  border: 2px solid transparent !important;
  border-color: #cbd5e1 transparent transparent #cbd5e1 !important;
  height: 15px !important;
  left: 50% !important;
  right: 0 !important;
  top: -15px !important;
  transform: translate(1px) !important;
}

:deep(.org-child-level:last-child:after) {
  border: 2px solid transparent !important;
  border-color: #cbd5e1 #cbd5e1 transparent transparent !important;
  height: 15px !important;
  left: 0 !important;
  right: 50% !important;
  top: -15px !important;
  transform: translate(-1px) !important;
}

:deep(.org-child-level:first-child.org-child-level:last-child:after) {
  border: none !important;
  border-left: 2px solid #cbd5e1 !important;
  left: 50% !important;
  right: auto !important;
  height: 15px !important;
  transform: translate(-1px) !important;
}

:deep(.org-extend:after) {
  content: "" !important;
  border: none !important;
  border-left: 2px solid #cbd5e1 !important;
  height: 20px !important;
  position: absolute !important;
  bottom: 15px !important;
  left: 50% !important;
  transform: translate(-1px) !important;
}

/* Dark mode connector lines */
.dark :deep(.org-child-level:before) {
  border-left-color: #475569 !important;
}

.dark :deep(.org-child-level:after) {
  border-top-color: #475569 !important;
}

.dark :deep(.org-child-level:first-child:after) {
  border-color: #475569 transparent transparent #475569 !important;
}

.dark :deep(.org-child-level:last-child:after) {
  border-color: #475569 #475569 transparent transparent !important;
}

.dark :deep(.org-child-level:first-child.org-child-level:last-child:after) {
  border-left-color: #475569 !important;
}

.dark :deep(.org-extend:after) {
  border-left-color: #475569 !important;
}

/* Extend / minimize arrow button styling */
:deep(.org-extend-arrow) {
  box-sizing: border-box !important;
  appearance: none !important;
  cursor: pointer !important;
  width: 22px !important;
  height: 22px !important;
  padding: 0 !important;
  margin: 0 !important;
  position: absolute !important;
  bottom: 6px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 10 !important;
  background-color: #ffffff !important;
  border: 2px solid #cbd5e1 !important;
  border-radius: 9999px !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.dark :deep(.org-extend-arrow) {
  background-color: #1c1c1c !important;
  border-color: #475569 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3) !important;
}

:deep(.org-extend-arrow:hover) {
  transform: translateX(-50%) scale(1.2) !important;
  border-color: #dc2626 !important;
  background-color: #fef2f2 !important;
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.25) !important;
}

.dark :deep(.org-extend-arrow:hover) {
  background-color: #2a1515 !important;
}

/* Arrowhead glyph inside circular button */
:deep(.org-extend-arrow:before) {
  content: "" !important;
  box-sizing: border-box !important;
  width: 6px !important;
  height: 6px !important;
  border-style: solid !important;
  border-width: 2px 2px 0 0 !important;
  border-color: #64748b !important;
  margin: 0 !important;
  display: block !important;
  transform-origin: center !important;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease !important;
  transform: translateY(-1px) rotate(135deg) !important;
}

.dark :deep(.org-extend-arrow:before) {
  border-color: #94a3b8 !important;
}

:deep(.org-extend-arrow:hover:before) {
  border-color: #dc2626 !important;
}

/* Expanded state rotation animation (points up when extended, indicating click to collapse/minimize) */
:deep(.org-extend .org-extend-arrow:before) {
  transform: translateY(1px) rotate(-45deg) !important;
}

@keyframes org-node-expand {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Staggered entrance animation */
@media (prefers-reduced-motion: no-preference) {
  @keyframes org-fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .org-node {
    animation: org-fade-in-up 0.45s ease-out both;
    animation-delay: 0.05s;
  }

  .org-node .org-node {
    animation-delay: 0.2s;
  }

  .org-node .org-node .org-node {
    animation-delay: 0.35s;
  }
}
</style>
