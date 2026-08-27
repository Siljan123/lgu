<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import OrganizationChart from 'organization-chart-vue3'
import 'organization-chart-vue3/style.css'
import type {
  OrganizationChartNode,
  OrganizationChartSelectPayload,
} from 'organization-chart-vue3'
import type { BarangayOfficial } from '../../composables/useBarangayDirectory'
import {
  UserCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Info,
  UserPlus,
  Tag,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2
} from '@lucide/vue'

const props = defineProps<{
  officials: BarangayOfficial[]
  barangayName: string
  barangayId?: string
}>()

const emit = defineEmits<{
  (e: 'add-official'): void
  (e: 'add-child', parentId: string): void
  (e: 'edit', official: BarangayOfficial): void
  (e: 'delete', official: BarangayOfficial): void
  (e: 'view-details', official: BarangayOfficial): void
  (e: 'reorder', orderedIds: string[]): void
}>()

const isFullscreen = ref(false)

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  if (typeof document !== 'undefined') {
    if (isFullscreen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

// Pan & Zoom state
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

function zoomIn() {
  scale.value = Math.min(2.5, Number((scale.value + 0.10).toFixed(2)))
}

function zoomOut() {
  scale.value = Math.max(0.3, Number((scale.value - 0.10).toFixed(2)))
}

function resetZoom() {
  scale.value = 1
  panX.value = 0
  panY.value = 0
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
  if ((e.target as HTMLElement).closest('button, a, select, input')) return
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
    if ((e.target as HTMLElement).closest('button, a, select, input')) return
    isDragging.value = true
    startX.value = e.touches[0]!.clientX - panX.value
    startY.value = e.touches[0]!.clientY - panY.value
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
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
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

function buildMemberObject(o?: BarangayOfficial, fallbackTitle = 'Official', fallbackName = 'Hon. Official') {
  return {
    id: o?.id || `fallback-${fallbackTitle.toLowerCase().replace(/\s+/g, '-')}`,
    name: o?.name || fallbackName,
    avatar: o?.avatar || o?.avatar_url,
    image_url: o?.avatar || o?.avatar_url,
    title: o?.title,
    committee: o?.committee,
    contact: o?.contact,
    is_label: o?.is_label ?? false,
    rawOfficial: o
  }
}

function getOfficialCategory(o: BarangayOfficial): string {
  return o.position_category || o.position?.position_category || 'other'
}

const captain = computed(() =>
  props.officials.find(o => getOfficialCategory(o) === 'captain')
)

const secretary = computed(() =>
  props.officials.find(o => getOfficialCategory(o) === 'secretary')
)

const treasurer = computed(() =>
  props.officials.find(o => getOfficialCategory(o) === 'treasurer')
)

const skChairperson = computed(() =>
  props.officials.find(o => getOfficialCategory(o) === 'sk_chairperson')
)

const kagawads = computed(() =>
  props.officials.filter(o => getOfficialCategory(o) === 'kagawad')
)

// Check if officials have explicit parent-child hierarchy in database
const hasExplicitHierarchy = computed(() => {
  return props.officials.some(o => o.parent_id || o.parentId)
})

// Order a sibling group by sort_order (name breaks ties) and stamp each node
// with a 1-based `sequence` — the first child in the group is #1 — plus the
// ordered `siblingIds` of its group (used to compute moves). Recurses so every
// level of children is numbered. Root nodes are never stamped.
function stampChildSequence(nodes: OrganizationChartNode[]) {
  nodes.sort((a, b) => {
    const ra = a.member?.[0]?.rawOfficial as BarangayOfficial | undefined
    const rb = b.member?.[0]?.rawOfficial as BarangayOfficial | undefined
    const sa = typeof ra?.sort_order === 'number' ? ra.sort_order : 0
    const sb = typeof rb?.sort_order === 'number' ? rb.sort_order : 0
    if (sa !== sb) return sa - sb
    return (ra?.name || '').localeCompare(rb?.name || '')
  })
  const siblingIds = nodes.map(n => n.id as string)
  nodes.forEach((n, i) => {
    n.sequence = i + 1
    n.siblingIds = siblingIds
    if (n.children && n.children.length) stampChildSequence(n.children)
  })
}

const treeRoot = computed<OrganizationChartNode | null>(() => {
  if (props.officials.length === 0) {
    return null
  }

  if (hasExplicitHierarchy.value && props.officials.length > 0) {
    const officialMap = new Map<string, OrganizationChartNode>()
    const rootNodes: OrganizationChartNode[] = []

    props.officials.forEach(o => {
      const displayTitle = o.title || o.position?.title || 'Official'
      const parentId = o.parent_id || o.parentId
      const parent = parentId ? props.officials.find(x => x.id === parentId) : undefined
      const hideTitle = !!parent?.is_label && !o.is_label
      officialMap.set(o.id, {
        id: o.id,
        title: displayTitle,
        titleClass: hideTitle ? 'brgy-title-hidden' : undefined,
        hideTitle,
        member: [buildMemberObject(o, o.title || 'Official', o.name)],
        children: []
      })
    })

    props.officials.forEach(o => {
      const node = officialMap.get(o.id)!
      const parentId = o.parent_id || o.parentId
      if (parentId && officialMap.has(parentId)) {
        officialMap.get(parentId)!.children!.push(node)
      } else {
        rootNodes.push(node)
      }
    })

    // Number every child group from the first child (#1). Roots stay unnumbered.
    rootNodes.forEach(r => {
      if (r.children && r.children.length) stampChildSequence(r.children)
    })

    if (rootNodes.length > 0) {
      if (rootNodes.length === 1) {
        return rootNodes[0]!
      }
      return {
        id: 'root-cluster',
        title: 'Sangguniang Barangay',
        member: [buildMemberObject(captain.value, 'Punong Barangay (Captain)', captain.value?.name || 'Hon. Barangay Captain')],
        children: rootNodes
      }
    }
  }

  const captainObj = captain.value
  const secretaryObj = secretary.value
  const treasurerObj = treasurer.value
  const kagawadObjs = kagawads.value
  const skObj = skChairperson.value

  const children: OrganizationChartNode[] = []

  if (secretaryObj) {
    children.push({
      id: secretaryObj.id || 'secretary-node',
      title: secretaryObj.title || 'Barangay Secretary',
      member: [buildMemberObject(secretaryObj, 'Barangay Secretary', secretaryObj.name || 'Barangay Secretary')],
    })
  }

  if (treasurerObj) {
    children.push({
      id: treasurerObj.id || 'treasurer-node',
      title: treasurerObj.title || 'Barangay Treasurer',
      member: [buildMemberObject(treasurerObj, 'Barangay Treasurer', treasurerObj.name || 'Barangay Treasurer')],
    })
  }

  if (kagawadObjs.length > 0) {
    const kagawadChildren: OrganizationChartNode[] = kagawadObjs.map((k, idx) => {
      return {
        id: k.id || `kag-${idx}`,
        title: k.title || 'Barangay Kagawad',
        member: [buildMemberObject(k, k.title || 'Barangay Kagawad', k.name || `Barangay Kagawad #${idx + 1}`)],
      }
    })

    children.push(...kagawadChildren)
  }

  if (skObj) {
    children.push({
      id: skObj.id || 'sk-node',
      title: 'Sangguniang Kabataan (SK) Chairperson',
      member: [buildMemberObject(skObj, 'SK Chairperson', skObj.name || 'SK')],
    })
  }

  stampChildSequence(children)

  return {
    id: captainObj?.id || 'captain-node',
    title: captainObj?.title || 'Punong Barangay (Captain)',
    member: [buildMemberObject(captainObj, 'Punong Barangay (Captain)', captainObj?.name || 'Hon. Barangay Captain')],
    children,
  }
})


function onCardAddChild(member: any) {
  const raw = member?.rawOfficial as BarangayOfficial | undefined
  emit('add-child', raw?.id || member?.id || '')
}

function onCardEdit(member: any) {
  const raw = member?.rawOfficial as BarangayOfficial | undefined
  if (raw) {
    emit('edit', raw)
  }
}

function onCardDelete(member: any) {
  const raw = member?.rawOfficial as BarangayOfficial | undefined
  if (raw) {
    emit('delete', raw)
  }
}

function onCardViewDetails(member: any) {
  const raw = member?.rawOfficial as BarangayOfficial | undefined
  if (raw) {
    emit('view-details', raw)
  }
}

// Move a child node left/right among its siblings, then emit the new full sibling order.
function moveChild(node: any, dir: 'left' | 'right') {
  const ids: string[] = Array.isArray(node?.siblingIds) ? [...node.siblingIds] : []
  const i = ids.indexOf(node?.id)
  const j = dir === 'left' ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= ids.length) return
  const tmp = ids[i]!
  ids[i] = ids[j]!
  ids[j] = tmp
  emit('reorder', ids)
}

// MiniMap Navigator Visualizer

const chartCanvasRef = ref<HTMLElement | null>(null)
const chartContentRef = ref<HTMLElement | null>(null)

const viewportSize = ref({ w: 0, h: 0 })
const contentSize = ref({ w: 0, h: 0 })

const isCanvasMeasured = computed(() =>
  viewportSize.value.w > 0 && viewportSize.value.h > 0
  && contentSize.value.w > 0 && contentSize.value.h > 0
)

// Calculate the visible rectangle for the viewfinder
const visibleContentRect = computed(() => {
  const cw = Math.max(1, contentSize.value.w)
  const ch = Math.max(1, contentSize.value.h)
  const s = scale.value || 1
  
  return {
    cw, ch,
    x: cw / 2 - (cw / 2 + panX.value) / s,
    y: -panY.value / s,
    w: viewportSize.value.w / s,
    h: viewportSize.value.h / s,
  }
})
const measuredMiniNodes = ref<any[]>([])

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

  const cards = content.querySelectorAll('[data-mini-node-id]')
  if (cards.length === 0) return

  const s = scale.value || 1
  const contentBox = content.getBoundingClientRect()
  const cw = Math.max(1, contentSize.value.w)
  const ch = Math.max(1, contentSize.value.h)

  const list: any[] = []
  cards.forEach((el) => {
    const box = el.getBoundingClientRect()
    list.push({
      id: (el as HTMLElement).dataset.miniNodeId || '',
      isLabel: (el as HTMLElement).dataset.miniNodeLabel === 'true',
      x: ((box.left - contentBox.left) / s / cw) * 180,
      y: ((box.top - contentBox.top) / s / ch) * 120,
      w: Math.max(3, (box.width / s / cw) * 180),
      h: Math.max(2.5, (box.height / s / ch) * 120),
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

// The canvas lives behind a v-if, so the refs arrive after pending/error resolve.
watch([chartCanvasRef, chartContentRef], () => {
  observeCanvas()
  scheduleMeasure()
})

watch([() => props.officials, scale, isFullscreen], async () => {
  setTimeout(scheduleMeasure, 100)
}, { deep: true })
</script>

<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <div
      :class="[
        isFullscreen
          ? 'fixed inset-0 z-9999 bg-white dark:bg-[#121212] p-4 md:p-6 flex flex-col w-screen h-screen overflow-hidden'
          : 'relative w-full'
      ]"
    >
      <Card
        class="bg-white dark:bg-[#1c1c1c] border-[#dfdfdf] dark:border-[#333333] shadow-xs flex flex-col transition-all h-full"
        :class="[
          isFullscreen
            ? 'flex-1 min-h-0 h-full p-4 md:p-6 shadow-2xl rounded-2xl overflow-hidden'
            : 'p-4'
        ]"
      >
        <CardHeader v-if="!isFullscreen" class="px-0 pt-0 shrink-0">
          <div class="flex flex-wrap items-center justify-between border-b border-[#dfdfdf] dark:border-[#333333] pb-4 gap-3">
            <div class="flex items-center space-x-3">
                <UserCheck class="size-5" />
              <div>
                <div class="flex items-center space-x-2">
                  <h2 class="text-base sm:text-lg font-bold text-[#171717] dark:text-[#ffffff] tracking-tight">
                    Barangay Officials
                  </h2>
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {{ officials.filter(o => !o.is_label).length }} Members
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent
          ref="containerRef"
          class="px-0 py-2 space-y-3 flex-1 flex flex-col min-h-0 w-full transition-all duration-300 relative"
        >
          <template v-if="treeRoot">
            <div class="flex items-center justify-between gap-2 bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] rounded-xl px-3 py-2 text-xs shrink-0">
              <div class="flex items-center space-x-2 text-[#707070] dark:text-[#a3a3a3]">
                <Move class="size-3.5 text-[#dc2626]" />
                <span class="hidden sm:inline font-medium">Click & drag to move or Scroll to zoom</span>
                <span class="sm:hidden font-medium">Drag to move</span>
              </div>

              <div class="flex items-center space-x-1.5">
                <button
                  type="button"
                  @click="zoomOut"
                  class="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut class="size-4" />
                </button>

                <span class="text-xs font-mono font-bold text-[#171717] dark:text-[#ffffff] min-w-10.5 text-center">
                  {{ Math.round(scale * 100) }}%
                </span>

                <button
                  type="button"
                  @click="zoomIn"
                  class="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn class="size-4" />
                </button>

                <div class="h-4 w-px bg-[#dfdfdf] dark:bg-[#333333] mx-1"></div>

                <button
                  type="button"
                  @click="resetZoom"
                  class="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Reset View"
                >
                  <RotateCcw class="size-3.5" />
                  <span class="text-[11px] font-medium hidden md:inline">Reset</span>
                </button>

                <button
                  type="button"
                  @click="toggleFullscreen"
                  class="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors flex items-center space-x-1 cursor-pointer ml-1"
                  :title="isFullscreen ? 'Exit Fullscreen (Minimize)' : 'Maximize Full View'"
                >
                  <Minimize2 v-if="isFullscreen" class="size-3.5 text-[#dc2626]" />
                  <Maximize2 v-else class="size-3.5" />
                  <span class="text-[11px] font-medium hidden sm:inline">{{ isFullscreen ? 'Minimize' : 'Maximize' }}</span>
                </button>
              </div>
            </div>

            <!-- Movable & Zoomable Viewport Canvas -->
            <div
              class="relative w-full overflow-hidden rounded-xl border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa]/50 dark:bg-[#121212]/50 cursor-grab active:cursor-grabbing select-none"
              :class="[isFullscreen ? 'flex-1 min-h-0 h-full' : 'min-h-125 h-[65vh]']"
              @mousedown="handleMouseDown"
              @touchstart.passive="handleTouchStart"
              @wheel.prevent="handleWheel"
              @dragstart.prevent
              ref="chartCanvasRef"
            >
              <div
                class="w-full min-w-max flex justify-center py-8 transition-transform duration-75 ease-out"
                :style="{
                  transform: `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`,
                  transformOrigin: 'top center'
                }"
                ref="chartContentRef"
              >
                <OrganizationChart
                  :data="treeRoot"
                  class="barangay-org-chart mx-auto"
                >
                  <!-- Node Title Bar -->
                  <template #node-title="{ node }">
                    <div
                      v-if="!node.hideTitle"
                      class="w-full m-0 px-2.5 py-1.5 font-bold text-xs flex items-center justify-center text-center dark:bg-[#181818]"
                    >
                      <span class="truncate">
                        {{ node.title }}
                      </span>
                    </div>
                  </template>

                  <template #member="{ member, node }">
                    <div
                      v-if="member.is_label"
                      :data-mini-node-id="member.id"
                      data-mini-node-label="true"
                      class="text-center w-full bg-neutral-50 dark:bg-[#181818] text-[#171717] dark:text-[#ffffff] transition-all p-2.5 space-y-1.5"
                    >
                      <div class="flex items-center justify-center space-x-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <Tag class="size-3 text-[#dc2626]" />
                        <span class="text-[10px] font-bold uppercase tracking-wider">Section Label</span>
                      </div>

                      <div class="pt-1.5 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          @click.stop="onCardAddChild(member)"
                          class="p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                          title="Add Official / Node Under This Label"
                        >
                          <UserPlus class="size-3.5" />
                        </button>

                        <button
                          v-if="member.rawOfficial"
                          type="button"
                          @click.stop="onCardDelete(member)"
                          class="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-500 hover:text-[#dc2626] transition cursor-pointer"
                          title="Delete Label"
                        >
                          <Trash2 class="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <div v-else
                      :data-mini-node-id="member.id"
                      data-mini-node-label="false"
                      class="group/card relative p-3 text-center w-full bg-white dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] transition-all">
                      <!-- Order sequence among siblings (first child = 1) -->
                      <span
                        v-if="node.sequence && member.title ==='Kagawad' || member.title==='Barangay Kagawad'"
                        class="absolute top-1.5 left-1.5 z-10 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-[#dc2626]/10 dark:bg-[#dc2626]/20 text-[#dc2626] dark:text-[#f87171] text-[10px] font-bold leading-none tabular-nums"
                        title="Order sequence among siblings"
                      >
                        #{{ node.sequence }}
                      </span>
                      <!-- Avatar Photo or Initials -->
                      <div class="mb-2 flex justify-center">
                        <div
                          v-if="member.image_url || member.avatar"
                          class="size-12 rounded-full overflow-hidden border-2 border-[#dfdfdf] dark:border-[#333333] shadow-xs shrink-0"
                        >
                          <img
                            :src="(member.image_url || member.avatar) as string"
                            :alt="(member.name as string)"
                            class="size-full object-cover pointer-events-none select-none"
                          />
                        </div>
                        <div
                          v-else
                          class="size-12 rounded-full flex items-center justify-center bg-[#dc2626]/10 dark:bg-[#dc2626]/20 text-[#dc2626] dark:text-[#f87171] font-bold text-sm border border-[#dfdfdf] dark:border-[#333333] select-none shadow-xs shrink-0"
                        >
                          {{ (member.name as string)?.charAt(0).toUpperCase() ?? '?' }}
                        </div>
                      </div>

                      <!-- Full Name -->
                      <strong class="block text-xs sm:text-sm font-bold text-[#171717] dark:text-[#ffffff] leading-snug wrap-break-words whitespace-normal line-clamp-2">
                        {{ member.name }}
                      </strong>

                      <!-- Contact Badge -->
                      <div
                        v-if="member.contact"
                        class="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      >
                        <Phone class="size-2.5 text-[#dc2626]" />
                        <span>{{ member.contact }}</span>
                      </div>

                      <!-- CRUD Actions Toolbar Inside the Node -->
                      <div
                        class="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center space-x-1"
                      >
                        <!-- Move earlier among siblings (only when there is more than one sibling) -->
                        <button
                          v-if="node.siblingIds && node.siblingIds.length > 1"
                          type="button"
                          :disabled="node.sequence === 1"
                          @click.stop="moveChild(node, 'left')"
                          class="p-1.5 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/40 text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-500"
                          title="Move earlier (up in order)"
                        >
                          <ArrowLeft class="size-3.5" />
                        </button>

                        <!-- Move later among siblings -->
                        <button
                          v-if="node.siblingIds && node.siblingIds.length > 1"
                          type="button"
                          :disabled="node.sequence === node.siblingIds.length"
                          @click.stop="moveChild(node, 'right')"
                          class="p-1.5 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950/40 text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-500"
                          title="Move later (down in order)"
                        >
                          <ArrowRight class="size-3.5" />
                        </button>

                        <button
                          type="button"
                          @click.stop="onCardAddChild(member)"
                          class="p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                          title="Add Subordinate Official (Child Node)"
                        >
                          <UserPlus class="size-3.5" />
                        </button>

                        <!-- Edit Official -->
                        <button
                          v-if="member.rawOfficial"
                          type="button"
                          @click.stop="onCardEdit(member)"
                          class="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                          title="Edit Official"
                        >
                          <Edit3 class="size-3.5" />
                        </button>

                        <!-- Delete Official -->
                        <button
                          v-if="member.rawOfficial"
                          type="button"
                          @click.stop="onCardDelete(member)"
                          class="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-500 hover:text-[#dc2626] transition cursor-pointer"
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

            <OrganizationOrgChartMinimapNavigator
              :show="true"
              :nodes="miniMapNodes"
              :is-canvas-measured="isCanvasMeasured"
              :visible-content-rect="visibleContentRect"
              :scale="scale"
              :pan-x="panX"
              :pan-y="panY"
              :is-main-dragging="isDragging"
              @update:panX="panX = $event"
              @update:panY="panY = $event"
            />
          </template>

          <template v-else>
            <div class="py-16 px-4 flex flex-col items-center justify-center text-center rounded-xl border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa]/50 dark:bg-[#121212]/50 space-y-3 my-auto">
                <UserPlus class="size-6" />
              <div class="space-y-1 max-w-sm">
                <h3 class="text-sm font-semibold text-[#171717] dark:text-[#ffffff]">
                  No Officials Added Yet
                </h3>
                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                  There are no officials recorded for {{ barangayName || 'this barangay' }}.
                </p>
              </div>
              <button
                type="button"
                @click="emit('add-official')"
                class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs mt-2"
              >
                <Plus class="size-4" />
                <span>First Label</span>
              </button>
            </div>
          </template>
        </CardContent>
      </Card>
    </div>
  </Teleport>
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
  margin: 0 12px !important;
  display: inline-block !important;
  position: relative !important;
}

:deep(.org-node .org-container) {
  display: flex !important;
  flex-direction: column !important;
  width: 195px !important;
  min-width: 195px !important;
  max-width: 195px !important;
  box-sizing: border-box !important;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

:deep(.dark .org-node .org-container) {
  border-color: #333333;
  background-color: #a61b1b;
}

:deep(.org-node .org-container:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.12);
  border-color: #dc2626;
}

/* Children placed directly under a label inherit that label's position,
   so their own title bar is collapsed entirely (no empty gray strip). */
:deep(.org-title.brgy-title-hidden) {
  display: none !important;
}

:deep(.org-lines) {
  position: relative;
}

:deep(.org-lines td) {
  padding: 0 !important;
}

:deep(.org-title) {
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.org-line-down) {
  background-color: #dc2626 !important;
  width: 2px !important;
  height: 20px !important;
  margin: 0 auto !important;
}

:deep(.org-line-top) {
  border-top: 2px solid #dc2626 !important;
}

:deep(.org-line-left) {
  border-right: 2px solid #dc2626 !important;
}

:deep(.org-line-right) {
  border-left: 2px solid #dc2626 !important;
}
</style>
