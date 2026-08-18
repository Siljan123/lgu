<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import OrganizationChart from 'organization-chart-vue3'
import 'organization-chart-vue3/style.css'
import type {
  OrganizationChartSelectPayload,
} from 'organization-chart-vue3'
import type { OfficialNode, OfficialMember, OfficialRow } from '../../../types/official'
import {
  UserCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Plus,
  Edit3,
  Trash2,
  Info,
  Maximize2,
  Minimize2,
  Phone,
  Shield,
} from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    treeRoot: OfficialNode | null
    pending?: boolean
    error?: unknown
    selectedOfficialId?: string | null
  }>(),
  {
    pending: false,
    error: undefined,
    selectedOfficialId: null,
  }
)

const emit = defineEmits<{
  (e: 'select-official', id: string): void
  (e: 'add-child', parentId: string): void
  (e: 'edit', official: any): void
  (e: 'delete', official: any): void
  (e: 'view-details', official: any): void
}>()

// Pan & Zoom state
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const isFullscreen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function zoomIn() {
  scale.value = Math.min(2.5, Number((scale.value + 0.15).toFixed(2)))
}

function zoomOut() {
  scale.value = Math.max(0.3, Number((scale.value - 0.15).toFixed(2)))
}

function resetZoom() {
  scale.value = 1
  panX.value = 0
  panY.value = 0
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function handleWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const newScale = Math.min(Math.max(0.3, scale.value + delta), 2.5)
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
  if ((e.target as HTMLElement).closest('button, a, input, select, .action-btn')) return
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
    if ((e.target as HTMLElement).closest('button, a, input, select, .action-btn')) return
    isDragging.value = true
    startX.value = e.touches[0]!.clientX - panX.value
    startY.value = e.touches[0]!.clientY - panY.value
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
  }
}

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})

function handleSelect(payload: OrganizationChartSelectPayload) {
  if (payload.kind === 'member' && payload.member) {
    emit('select-official', payload.member.id as string)
    return
  }
  if (payload.node) {
    emit('select-official', payload.node.id as string)
  }
}

function onCardAddChild(member: any) {
  emit('add-child', member.id)
}

function onCardEdit(member: any, node: any) {
  emit('edit', {
    id: member.id,
    first_name: member.first_name,
    middle_name: member.middle_name,
    last_name: member.last_name,
    position_id: member.position_id,
    position: { id: member.position_id, title: node.title },
    contact: member.contact,
    image_url: member.image_url || member.photo_url,
    parent_id: member.parent_id,
  })
}

function onCardDelete(member: any, node: any) {
  emit('delete', {
    id: member.id,
    first_name: member.first_name,
    middle_name: member.middle_name,
    last_name: member.last_name,
    position: { title: node.title },
  })
}

function onCardViewDetails(member: any, node: any) {
  emit('view-details', {
    id: member.id,
    first_name: member.first_name,
    middle_name: member.middle_name,
    last_name: member.last_name,
    position_id: member.position_id,
    position: { title: node.title },
    contact: member.contact,
    image_url: member.image_url || member.photo_url,
    parent_id: member.parent_id,
  })
}
</script>

<template>
  <div
    ref="containerRef"
    class="w-full transition-all duration-300"
    :class="[
      isFullscreen
        ? 'fixed inset-0 z-50 bg-white dark:bg-[#121212] p-4 flex flex-col'
        : 'relative'
    ]"
  >
    <div v-if="pending" class="py-16 text-center text-neutral-500 dark:text-neutral-400 space-y-3">
      <div class="size-8 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-sm font-medium">Loading elected officials structure…</p>
    </div>

    <div v-else-if="error" class="py-16 text-center text-destructive space-y-3">
      <p class="text-sm font-semibold">Couldn't load elected officials. Please try again later.</p>
    </div>

    <div
      v-else-if="treeRoot"
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl shadow-sm overflow-hidden flex flex-col"
      :class="[isFullscreen ? 'flex-1 min-h-0' : '']"
    >
      <!-- Pan & Zoom Control Toolbar -->
      <div class="flex items-center justify-between gap-2 bg-[#fafafa] dark:bg-[#202020] border-b border-[#dfdfdf] dark:border-[#333333] px-3.5 py-2.5 text-xs select-none">
        <div class="flex items-center space-x-2 text-[#707070] dark:text-[#a3a3a3]">
          <Move class="size-3.5 text-[#dc2626]" />
          <span class="hidden sm:inline font-medium">Click & drag to navigate • Scroll to zoom</span>
          <span class="sm:hidden font-medium">Drag to pan</span>
        </div>

        <div class="flex items-center space-x-1.5">
          <button
            type="button"
            @click="zoomOut"
            class="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut class="size-4" />
          </button>

          <span class="text-xs font-mono font-bold text-[#171717] dark:text-[#ffffff] min-w-10 text-center select-none">
            {{ Math.round(scale * 100) }}%
          </span>

          <button
            type="button"
            @click="zoomIn"
            class="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn class="size-4" />
          </button>

          <div class="h-4 w-px bg-[#dfdfdf] dark:bg-[#333333] mx-1"></div>

          <button
            type="button"
            @click="resetZoom"
            class="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors flex items-center space-x-1 cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw class="size-3.5" />
            <span class="text-[11px] font-medium hidden md:inline">Reset</span>
          </button>

          <button
            type="button"
            @click="toggleFullscreen"
            class="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors flex items-center space-x-1 cursor-pointer ml-1"
            :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'"
          >
            <Minimize2 v-if="isFullscreen" class="size-3.5 text-[#dc2626]" />
            <Maximize2 v-else class="size-3.5" />
          </button>
        </div>
      </div>

      <!-- Canvas Area -->
      <div
        class="relative w-full overflow-hidden bg-[#fafafa]/50 dark:bg-[#121212]/50 cursor-grab active:cursor-grabbing select-none"
        :class="[isFullscreen ? 'flex-1 min-h-0' : 'min-h-137.5 h-[68vh]']"
        @mousedown="handleMouseDown"
        @touchstart.passive="handleTouchStart"
        @wheel.prevent="handleWheel"
        @dragstart.prevent
      >
        <div
          class="w-full flex justify-center py-10 transition-transform duration-75 ease-out"
          :style="{
            transform: `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`,
            transformOrigin: 'top center'
          }"
        >
          <OrganizationChart
            :data="treeRoot"
            @select="handleSelect"
            class="elected-officials-org-chart mx-auto"
          >
            <!-- Position Header Bar -->
            <template #node-title="{ node }">
              <div
                class="px-2.5 py-1.5 font-bold text-xs flex items-center justify-center text-center wrap-break-words leading-tight transition-colors shadow-xs"
                :class="[
                  node.title.toLowerCase().includes('mayor') && !node.title.toLowerCase().includes('vice')
                    ? 'bg-neutral-900 text-white dark:bg-black dark:text-white border-b border-neutral-700'
                    : node.title.toLowerCase().includes('vice')
                      ? 'bg-[#dc2626] text-white border-b border-red-700'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-700'
                ]"
              >
                <span class="truncate">{{ node.title }}</span>
              </div>
            </template>

            <!-- Member / Official Card Template -->
            <template #member="{ member, node }">
              <div
                class="group/card relative p-3 text-center w-full bg-white dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] transition-all"
                :class="[
                  selectedOfficialId === member.id ? '' : ''
                ]"
              >
                <!-- Avatar Photo or Initials -->
                <div class="mb-2 flex justify-center">
                  <div
                    v-if="member.image_url || member.photo_url"
                    class="size-12 rounded-full overflow-hidden border-2 border-[#dfdfdf] dark:border-[#333333] shadow-xs shrink-0"
                  >
                    <img
                      :src="(member.image_url || member.photo_url) as string"
                      :alt="member.name as string"
                      class="size-full object-cover pointer-events-none select-none"
                    />
                  </div>
                  <div
                    v-else
                    class="size-12 rounded-full flex items-center justify-center bg-[#dc2626]/10 dark:bg-[#dc2626]/20 text-[#dc2626] dark:text-[#f87171] font-bold text-base border border-[#dfdfdf] dark:border-[#333333] select-none shadow-xs shrink-0"
                  >
                    {{ (member.name as string)?.charAt(0).toUpperCase() ?? '?' }}
                  </div>
                </div>

                <!-- Full Name -->
                <strong class="block text-xs sm:text-sm font-bold text-neutral-900 dark:text-white leading-snug wrap-break-words whitespace-normal line-clamp-2">
                  {{ member.name }}
                </strong>

                <!-- Contact Badge if available -->
                <div
                  v-if="member.contact"
                  class="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                >
                  <Phone class="size-2.5 text-[#dc2626]" />
                  <span>{{ member.contact }}</span>
                </div>

                <div v-else
                    class="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                >
                  <Phone class="size-2.5 text-[#dc2626]" />
                  <span>N/A</span>
                </div>
                <div class="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center space-x-1">
                  <!-- View Details -->
                  <button
                    type="button"
                    @click.stop="onCardViewDetails(member, node)"
                    class="action-btn p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
                    title="View Profile Details"
                  >
                    <Info class="size-3.5" />
                  </button>

                  <!-- Add Sub-Official -->
                  <button
                    type="button"
                    @click.stop="onCardAddChild(member)"
                    class="action-btn p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                    title="Add Subordinate Official"
                  >
                    <Plus class="size-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click.stop="onCardEdit(member, node)"
                    class="action-btn p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="Edit Official"
                  >
                    <Edit3 class="size-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click.stop="onCardDelete(member, node)"
                    class="action-btn p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-500 hover:text-[#dc2626] transition cursor-pointer"
                    title="Delete Official"
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

    <div v-else class="py-16 text-center text-neutral-500 dark:text-neutral-400">
      No elected officials to display yet.
    </div>
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
  width: 210px !important;
  min-width: 210px !important;
  max-width: 210px !important;
  box-sizing: border-box !important;
  border: 1px solid #dfdfdf;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark :deep(.org-node .org-container) {
  border-color: #333333;
  background-color: #1c1c1c;
}

:deep(.org-node .org-container:hover) {
  border-color: #dc2626;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px -2px rgba(220, 38, 38, 0.15);
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

.dark :deep(.org-child-level:before),
.dark :deep(.org-child-level:after),
.dark :deep(.org-extend:after) {
  border-color: #475569 !important;
}

:deep(.org-extend:after) {
  height: 20px !important;
  bottom: 10px !important;
}

/* Extend arrow button styling */
:deep(.org-extend-arrow) {
  box-sizing: border-box !important;
  appearance: none !important;
  cursor: pointer !important;
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
  margin: 0 !important;
  position: absolute !important;
  bottom: 12px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 10 !important;
  background-color: #ffffff !important;
  border: 2px solid #cbd5e1 !important;
  border-radius: 9999px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.dark :deep(.org-extend-arrow) {
  background-color: #1e293b !important;
  border-color: #475569 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

:deep(.org-extend-arrow:hover) {
  transform: translateX(-50%) scale(1.2) !important;
  border-color: #dc2626 !important;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25) !important;
}

/* Arrowhead icon inside the circular button */
:deep(.org-extend-arrow:before) {
  content: "" !important;
  box-sizing: border-box !important;
  width: 7px !important;
  height: 7px !important;
  border-style: solid !important;
  border-width: 2px 2px 0 0 !important;
  border-color: #64748b !important;
  margin: 0 !important;
  display: block !important;
  transform-origin: center !important;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease !important;
  transform: translateY(-1px) rotate(135deg) !important;
}

.dark :deep(.org-extend-arrow:before) {
  border-color: #94a3b8 !important;
}

:deep(.org-extend-arrow:hover:before) {
  border-color: #dc2626 !important;
}

/* Expanded state rotation animation */
:deep(.org-extend .org-extend-arrow:before) {
  transform: translateY(1px) rotate(-45deg) !important;
}

@keyframes org-node-expand {
  0% {
    opacity: 0;
    transform: translateY(-12px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
