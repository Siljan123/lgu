<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
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
  UserPlus
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
}>()

// Pan & Zoom state
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

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

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})

function buildMemberObject(o?: BarangayOfficial, fallbackTitle = 'Official', fallbackName = 'Hon. Official') {
  return {
    id: o?.id || `fallback-${fallbackTitle.toLowerCase().replace(/\s+/g, '-')}`,
    name: o?.name || fallbackName,
    avatar: o?.avatar || o?.avatar_url,
    image_url: o?.avatar || o?.avatar_url,
    committee: o?.committee,
    contact: o?.contact,
    rawOfficial: o
  }
}

function getOfficialTitle(o: BarangayOfficial): string {
  return (o.title || o.position?.title || '').toLowerCase()
}

// Direct position categorizers from database titles
const captain = computed(() => props.officials.find(o => {
  const t = getOfficialTitle(o)
  return t.includes('captain') || t.includes('punong')
}))

const secretary = computed(() => props.officials.find(o => {
  const t = getOfficialTitle(o)
  return t.includes('secretary') || t.includes('kalihim')
}))

const treasurer = computed(() => props.officials.find(o => {
  const t = getOfficialTitle(o)
  return t.includes('treasurer') || t.includes('ingat-yaman')
}))

const skChairperson = computed(() => props.officials.find(o => {
  const t = getOfficialTitle(o)
  return t.includes('sk') || t.includes('kabataan')
}))

const kagawads = computed(() => props.officials.filter(o => {
  const t = getOfficialTitle(o)
  return !t.includes('captain') && !t.includes('punong') && !t.includes('secretary') && !t.includes('kalihim') && !t.includes('treasurer') && !t.includes('ingat-yaman') && !t.includes('sk') && !t.includes('kabataan')
}))

// Check if officials have explicit parent-child hierarchy in database
const hasExplicitHierarchy = computed(() => {
  return props.officials.some(o => o.parent_id || o.parentId)
})

const treeRoot = computed<OrganizationChartNode>(() => {
  if (hasExplicitHierarchy.value && props.officials.length > 0) {
    const officialMap = new Map<string, OrganizationChartNode>()
    const rootNodes: OrganizationChartNode[] = []

    props.officials.forEach(o => {
      const displayTitle = o.title || o.position?.title || 'Official'
      officialMap.set(o.id, {
        id: o.id,
        title: displayTitle,
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

  // 2. Standard Barangay Hierarchy by Position Titles
  const captainObj = captain.value
  const secretaryObj = secretary.value
  const treasurerObj = treasurer.value
  const kagawadObjs = kagawads.value
  const skObj = skChairperson.value

  const children: OrganizationChartNode[] = []

  const execChildren: OrganizationChartNode[] = [
    {
      id: secretaryObj?.id || 'sec-node',
      title: secretaryObj?.title || 'Barangay Secretary',
      member: [buildMemberObject(secretaryObj, 'Barangay Secretary', secretaryObj?.name || 'Barangay Secretary')],
    },
    {
      id: treasurerObj?.id || 'treas-node',
      title: treasurerObj?.title || 'Barangay Treasurer',
      member: [buildMemberObject(treasurerObj, 'Barangay Treasurer', treasurerObj?.name || 'Barangay Treasurer')],
    },
  ]

  children.push(...execChildren)

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
      member: [buildMemberObject(skObj, 'SK Chairperson', skObj.name || 'SK Chairperson')],
    })
  }

  return {
    id: captainObj?.id || 'captain-node',
    title: captainObj?.title || 'Punong Barangay (Captain)',
    member: [buildMemberObject(captainObj, 'Punong Barangay (Captain)', captainObj?.name || 'Hon. Barangay Captain')],
    children,
  }
})

function handleSelect(payload: OrganizationChartSelectPayload) {
  if (payload.kind === 'member') {
    const raw = payload.member?.rawOfficial as BarangayOfficial | undefined
    if (raw) {
      emit('view-details', raw)
    }
  }
}

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
</script>

<template>
  <Card class="p-4 bg-white dark:bg-[#1c1c1c] border-[#dfdfdf] dark:border-[#333333] shadow-xs">
    <CardHeader class="px-0 pt-0 pb-4">
      <div class="flex flex-wrap items-center justify-between border-b border-[#dfdfdf] dark:border-[#333333] pb-4 gap-3">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-lg bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171]">
            <UserCheck class="size-5" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-base sm:text-lg font-bold text-[#171717] dark:text-[#ffffff] tracking-tight">
                Barangay Officials
              </h2>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                {{ officials.length }} Members
              </span>
            </div>
            <p class="text-xs text-[#707070] dark:text-[#a3a3a3]">
              Sangguniang Barangay Leadership of {{ barangayName }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="emit('add-official')"
          class="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus class="size-3.5" />
          <span>Add Official</span>
        </button>
      </div>
    </CardHeader>

    <CardContent class="px-0 py-2 space-y-3">
      <!-- Pan & Zoom Control Toolbar -->
      <div class="flex items-center justify-between gap-2 bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] rounded-xl px-3 py-2 text-xs">
        <div class="flex items-center space-x-2 text-[#707070] dark:text-[#a3a3a3]">
          <Move class="size-3.5 text-[#dc2626]" />
          <span class="hidden sm:inline font-medium">Click & drag to move • Scroll to zoom</span>
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
        </div>
      </div>

      <!-- Movable & Zoomable Viewport Canvas -->
      <div
        class="relative w-full min-h-125 h-[65vh] overflow-hidden rounded-xl border border-[#dfdfdf] dark:border-[#333333] bg-[#fafafa]/50 dark:bg-[#121212]/50 cursor-grab active:cursor-grabbing select-none"
        @mousedown="handleMouseDown"
        @touchstart.passive="handleTouchStart"
        @wheel.prevent="handleWheel"
        @dragstart.prevent
      >
        <div
          class="w-full flex justify-center py-8 transition-transform duration-75 ease-out"
          :style="{
            transform: `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`,
            transformOrigin: 'top center'
          }"
        >
          <OrganizationChart
            v-if="treeRoot"
            :data="treeRoot"
            @select="handleSelect"
            class="barangay-org-chart mx-auto"
          >
            <!-- Node Title Bar -->
            <template #node-title="{ node }">
              <div
                class="px-2.5 py-1.5 font-bold text-xs flex items-center justify-center text-center wrap-break-words leading-tight transition-colors shadow-xs"
                :class="[
                  node.title.toLowerCase().includes('captain') || node.title.toLowerCase().includes('punong')
                    ? 'bg-neutral-900 text-white dark:bg-black dark:text-white border-b border-neutral-700'
                    : node.title.toLowerCase().includes('sk') || node.title.toLowerCase().includes('chairperson')
                      ? 'bg-[#dc2626] text-white border-b border-red-700'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-700'
                ]"
              >
                <span class="truncate">{{ node.title }}</span>
              </div>
            </template>

            <!-- Member / Official Card Template with inside-node CRUD actions -->
            <template #member="{ member, node }">
              <div class="group/card relative p-3 text-center w-full bg-white dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] transition-all">
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

                <!-- Committee -->
                <p v-if="member.committee" class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                  {{ member.committee }}
                </p>

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
                  <!-- View Profile Details -->
                  <button
                    v-if="member.rawOfficial"
                    type="button"
                    @click.stop="onCardViewDetails(member)"
                    class="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
                    title="View Profile Details"
                  >
                    <Info class="size-3.5" />
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
    </CardContent>
  </Card>
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
  border: 1px solid #dfdfdf;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

:deep(.dark .org-node .org-container) {
  border-color: #333333;
  background-color: #1c1c1c;
}

:deep(.org-node .org-container:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.12);
  border-color: #dc2626;
}

:deep(.org-lines) {
  position: relative;
}

:deep(.org-lines td) {
  padding: 0 !important;
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
