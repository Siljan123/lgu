<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import OrganizationChart from 'organization-chart-vue3'
import 'organization-chart-vue3/style.css'
import type {
  OrganizationChartSelectPayload,
} from 'organization-chart-vue3'
import type { OfficialNode, OfficialMember, OfficialRow } from '../../../types/official'
import OrgChartMinimapNavigator, { type MiniMapNode } from '../organization/OrgChartMinimapNavigator.vue'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Plus,
  Edit3,
  Trash2,
  Info,
  Phone,
  ChevronLeft,
  ChevronRight,
  Search,
  Maximize2,
  Minimize2,
} from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    treeRoot: OfficialNode | null
    pending?: boolean
    error?: unknown
    selectedOfficialId?: string | null
    searchQuery?: string
    isAdmin?: boolean
  }>(),
  {
    pending: false,
    error: undefined,
    selectedOfficialId: null,
    searchQuery: '',
    isAdmin: true,
  }
)

const emit = defineEmits<{
  (e: 'select-official', id: string): void
  (e: 'add-child', parentId: string): void
  (e: 'edit', official: any): void
  (e: 'delete', official: any): void
  (e: 'view-details', official: any): void
}>()

const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const isFullscreen = ref(false)

// Minimap geometry navigator
const chartCanvasRef = ref<HTMLElement | null>(null)
const chartContentRef = ref<HTMLElement | null>(null)

const viewportSize = ref({ w: 0, h: 0 })
const contentSize = ref({ w: 0, h: 0 })

const isCanvasMeasured = computed(() =>
  viewportSize.value.w > 0 && viewportSize.value.h > 0
  && contentSize.value.w > 0 && contentSize.value.h > 0
)

const visibleContentRect = computed(() => {
  const cw = Math.max(1, contentSize.value.w)
  const ch = Math.max(1, contentSize.value.h)
  const s = scale.value || 1
  return {
    cw,
    ch,
    x: cw / 2 - (cw / 2 + panX.value) / s,
    y: -panY.value / s,
    w: viewportSize.value.w / s,
    h: viewportSize.value.h / s,
  }
})

const measuredMiniNodes = ref<MiniMapNode[]>([])

function measureCanvasBoxes() {
  const viewport = chartCanvasRef.value
  if (viewport) {
    viewportSize.value = { w: viewport.clientWidth, h: viewport.clientHeight }
  }
  const content = chartContentRef.value
  if (content) {
    contentSize.value = { w: content.offsetWidth, h: content.offsetHeight }
  }
}

function measureMiniMapNodes() {
  const content = chartContentRef.value
  if (!content || !isCanvasMeasured.value) return

  const cards = content.querySelectorAll<HTMLElement>('[data-mini-node-id]')
  if (cards.length === 0) return

  const s = scale.value || 1
  const contentBox = content.getBoundingClientRect()
  const cw = Math.max(1, contentSize.value.w)
  const ch = Math.max(1, contentSize.value.h)

  const list: MiniMapNode[] = []
  cards.forEach((el) => {
    const box = el.getBoundingClientRect()
    list.push({
      id: el.dataset.miniNodeId || '',
      isLabel: el.dataset.miniNodeLabel === 'true',
      x: ((box.left - contentBox.left) / s / cw) * 120,
      y: ((box.top - contentBox.top) / s / ch) * 100,
      w: Math.max(3, (box.width / s / cw) * 120),
      h: Math.max(2, (box.height / s / ch) * 100),
    })
  })
  measuredMiniNodes.value = list
}

const miniMapNodes = computed(() => measuredMiniNodes.value)

let measureFrame: number | null = null
let canvasObserver: ResizeObserver | null = null

function scheduleMeasure() {
  if (typeof requestAnimationFrame === 'undefined') {
    measureCanvasBoxes()
    measureMiniMapNodes()
    return
  }
  if (measureFrame !== null) cancelAnimationFrame(measureFrame)
  measureFrame = requestAnimationFrame(() => {
    measureFrame = null
    measureCanvasBoxes()
    measureMiniMapNodes()
  })
}

function observeCanvas() {
  if (!canvasObserver) return
  canvasObserver.disconnect()
  if (chartCanvasRef.value) canvasObserver.observe(chartCanvasRef.value)
  if (chartContentRef.value) canvasObserver.observe(chartContentRef.value)
}

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    canvasObserver = new ResizeObserver(() => scheduleMeasure())
  }
  observeCanvas()
  scheduleMeasure()
  window.addEventListener('resize', scheduleMeasure)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('resize', scheduleMeasure)
  if (measureFrame !== null && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(measureFrame)
  }
  canvasObserver?.disconnect()
  canvasObserver = null
})

watch([chartCanvasRef, chartContentRef], () => {
  observeCanvas()
  scheduleMeasure()
})

watch([() => props.treeRoot, scale, isFullscreen], async () => {
  setTimeout(scheduleMeasure, 100)
}, { deep: true })

function zoomIn() {
  scale.value = Math.min(2, Number((scale.value + 0.10).toFixed(2)))
}

function zoomOut() {
  scale.value = Math.max(0.3, Number((scale.value - 0.10).toFixed(2)))
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
  const newScale = Math.min(Math.max(0.5, scale.value + delta), 2.5)
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

function handleSelect(payload: OrganizationChartSelectPayload) {
  if (payload.kind === 'member' && payload.member) {
    emit('select-official', payload.member.id as string)
    return
  }
  if (payload.node) {
    emit('select-official', payload.node.id as string)
  }
}

// Search matching & focus logic
const matchedNodeIds = computed(() => {
  const q = (props.searchQuery || '').trim().toLowerCase()
  if (!q) return new Set<string>()

  const set = new Set<string>()
  function traverse(node: OfficialNode) {
    const member = node.member?.[0]
    const nameMatch = member?.name?.toLowerCase().includes(q)
    const titleMatch = (node.title || member?.position || member?.role)?.toLowerCase().includes(q)
    const contactMatch = member?.contact?.toLowerCase().includes(q)

    if (nameMatch || titleMatch || contactMatch) {
      set.add(node.id)
    }
    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  if (props.treeRoot) {
    traverse(props.treeRoot)
  }
  return set
})

const matchedList = computed(() => Array.from(matchedNodeIds.value))
const currentMatchIndex = ref(0)

function focusNode(nodeId: string) {
  if (!chartCanvasRef.value || !chartContentRef.value) return

  const nodeEl = chartContentRef.value.querySelector(`[data-mini-node-id="${nodeId}"]`) as HTMLElement | null
  if (!nodeEl) return

  emit('select-official', nodeId)

  const canvasRect = chartCanvasRef.value.getBoundingClientRect()
  const contentRect = chartContentRef.value.getBoundingClientRect()
  const nodeRect = nodeEl.getBoundingClientRect()

  const nodeCenterX = (nodeRect.left - contentRect.left + nodeRect.width / 2) / scale.value
  const nodeCenterY = (nodeRect.top - contentRect.top + nodeRect.height / 2) / scale.value

  panX.value = Math.round(canvasRect.width / 2 - nodeCenterX * scale.value)
  panY.value = Math.round(canvasRect.height / 2 - nodeCenterY * scale.value)
}

function nextMatch() {
  if (matchedList.value.length === 0) return
  currentMatchIndex.value = (currentMatchIndex.value + 1) % matchedList.value.length
  const id = matchedList.value[currentMatchIndex.value]
  if (id) focusNode(id)
}

function prevMatch() {
  if (matchedList.value.length === 0) return
  currentMatchIndex.value = (currentMatchIndex.value - 1 + matchedList.value.length) % matchedList.value.length
  const id = matchedList.value[currentMatchIndex.value]
  if (id) focusNode(id)
}

watch(
  () => props.searchQuery,
  (q) => {
    currentMatchIndex.value = 0
    if (q && q.trim()) {
      setTimeout(() => {
        if (matchedList.value.length > 0) {
          const firstId = matchedList.value[0]
          if (firstId) focusNode(firstId)
        }
      }, 100)
    }
  }
)

function onCardAddChild(member: any) {
  emit('add-child', member.id)
}

function onCardEdit(member: any, node: any) {
  emit('edit', {
    id: member.id,
    label_name: member.label_name || (member.is_label ? (member.name || node.title) : undefined),
    first_name: member.first_name,
    middle_name: member.middle_name,
    last_name: member.last_name,
    position_id: member.position_id,
    position: { id: member.position_id, title: node.title },
    contact: member.contact,
    avatar_url: member.avatar_url || member.image_url || member.photo_url,
    image_url: member.avatar_url || member.image_url || member.photo_url,
    parent_id: member.parent_id,
    is_label: member.is_label,
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
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-md shadow-sm overflow-hidden flex flex-col"
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
        ref="chartCanvasRef"
        class="relative w-full overflow-hidden bg-[#fafafa]/50 dark:bg-[#121212]/50 cursor-grab active:cursor-grabbing select-none"
        :class="[isFullscreen ? 'flex-1 min-h-0' : 'min-h-137.5 h-[68vh]']"
        @mousedown="handleMouseDown"
        @touchstart.passive="handleTouchStart"
        @wheel.prevent="handleWheel"
        @dragstart.prevent
      >
        <!-- Search Match Navigator Badge -->
        <div
          v-if="searchQuery && searchQuery.trim()"
          class="absolute top-3 left-3 z-30 flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#1c1c1c]/95 backdrop-blur-md border border-[#dfdfdf] dark:border-[#333333] shadow-md text-xs select-none"
        >
          <Search class="size-3.5 text-[#dc2626]" />
          <span class="font-medium text-neutral-800 dark:text-neutral-200">
            <strong class="text-[#dc2626]">{{ matchedList.length }}</strong> match{{ matchedList.length === 1 ? '' : 'es' }}
          </span>
          <div v-if="matchedList.length > 1" class="flex items-center space-x-1 pl-1.5 border-l border-neutral-200 dark:border-neutral-700">
            <span class="text-[11px] text-neutral-500 font-mono">{{ currentMatchIndex + 1 }}/{{ matchedList.length }}</span>
            <button
              type="button"
              @click.stop="prevMatch"
              class="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition cursor-pointer"
              title="Previous Match"
            >
              <ChevronLeft class="size-3.5" />
            </button>
            <button
              type="button"
              @click.stop="nextMatch"
              class="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition cursor-pointer"
              title="Next Match"
            >
              <ChevronRight class="size-3.5" />
            </button>
          </div>
        </div>

        <div
          ref="chartContentRef"
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
            <template #node-title="{ node }">
              <div
                v-if="!node.hideTitle && !node.member?.[0]?.is_label"
                class="px-2.5 py-1.5 font-bold text-xs flex items-center justify-center text-center"
                :class="[
                  node.title.toLowerCase().includes('mayor') && !node.title.toLowerCase().includes('vice')
                    ? 'bg-neutral-900 text-white dark:bg-black dark:text-white border-b border-neutral-700'
                    : node.title.toLowerCase().includes('vice')
                      ? 'bg-[#dc2626] text-white border-b border-red-700'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-700'
                ]"
              >
                <span class="flex w-full">{{ node.title }}</span>
              </div>
            </template>

            <template #member="{ member, node }">
              <!-- Label  -->
              <div
                v-if="member.is_label"
                :data-mini-node-id="member.id"
                data-mini-node-label="true"
                class="px-3 py-2 text-center w-full bg-neutral-100 dark:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-all font-bold text-xs"
                :class="[
                  selectedOfficialId === member.id ? 'ring-1 ring-[#261f22]' : '',
                  matchedNodeIds.has(member.id)
                    ? 'ring-2 ring-[#dc2626] shadow-sm scale-105 z-20 bg-red-50/50 dark:bg-red-950/30'
                    : (matchedNodeIds.size > 0 ? 'opacity-35 hover:opacity-100 transition-opacity' : '')
                ]"
              >
                <div class="">
                  {{ member.label_name || member.position || member.name }}
                </div>

                <div class="mt-1.5 pt-1.5 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-center space-x-1" v-if="isAdmin">
                  <button
                    type="button"
                    @click.stop="onCardAddChild(member)"
                    class="action-btn p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                    title="Add Subordinate under this label"
                  >
                    <Plus class="size-3.5" />
                  </button>
                  <!-- Edit Label -->
                  <button
                    type="button"
                    @click.stop="onCardEdit(member, node)"
                    class="action-btn p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    title="Edit Label"
                  >
                    <Edit3 class="size-3.5" />
                  </button>

                  <!-- Delete Label -->
                  <button
                    type="button"
                    @click.stop="onCardDelete(member, node)"
                    class="action-btn p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-500 hover:text-[#dc2626] transition cursor-pointer"
                    title="Delete Label"
                  >
                    <Trash2 class="size-3.5" />
                  </button>
                </div>
              </div>

              <!-- Real Official Card -->
              <div
                v-else
                :data-mini-node-id="member.id"
                data-mini-node-label="false"
                class="group/card relative p-3 text-center w-full bg-white dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] transition-all"
                :class="[
                  selectedOfficialId === member.id ? 'ring-1 ring-[#261f22]' : '',
                  matchedNodeIds.has(member.id)
                    ? 'ring-3 shadow-md scale-105 z-20'
                    : (matchedNodeIds.size > 0 ? 'opacity-35 hover:opacity-100 transition-opacity' : '')
                ]"
              >
                <!-- Avatar Photo or Initials -->
                <div class="mb-2 flex justify-center">
                  <div
                    v-if="member.avatar_url || member.image_url || member.photo_url"
                    class="size-12 rounded-full overflow-hidden border-2 border-[#dfdfdf] dark:border-[#333333] shadow-xs shrink-0"
                  >
                    <img
                      :src="(member.avatar_url || member.image_url || member.photo_url) as string"
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
                <div class="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center space-x-1" v-if="isAdmin">
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

        <OrgChartMinimapNavigator
          :show="true"
          :nodes="miniMapNodes"
          :is-canvas-measured="isCanvasMeasured"
          :visible-content-rect="visibleContentRect"
          :scale="scale"
          :pan-x="panX"
          :pan-y="panY"
          :highlighted-node-id="selectedOfficialId"
          :is-main-dragging="isDragging"
          @update:panX="panX = $event"
          @update:panY="panY = $event"
        />
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
  border-radius: 4px;
  box-shadow: 2px rgba(0, 0, 0, 0.05);
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
