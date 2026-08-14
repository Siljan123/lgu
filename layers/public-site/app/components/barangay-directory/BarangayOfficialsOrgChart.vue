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
  Crown,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
} from '@lucide/vue'

const props = defineProps<{
  officials: BarangayOfficial[]
  barangayName: string
  barangayId?: string
}>()

const barangaySlug = computed(() => {
  if (props.barangayId) return props.barangayId
  return props.barangayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
})

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
  if ((e.target as HTMLElement).closest('button, a, select')) return
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
    if ((e.target as HTMLElement).closest('button, a, select')) return
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

const captain = computed(() => props.officials.find((o) => o.role === 'captain'))
const secretary = computed(() => props.officials.find((o) => o.role === 'secretary'))
const treasurer = computed(() => props.officials.find((o) => o.role === 'treasurer'))
const kagawads = computed(() => props.officials.filter((o) => o.role === 'kagawad'))
const skChairperson = computed(() => props.officials.find((o) => o.role === 'sk_chairperson'))

const treeRoot = computed<OrganizationChartNode>(() => {
  const captainObj = captain.value
  const secretaryObj = secretary.value
  const treasurerObj = treasurer.value
  const kagawadObjs = kagawads.value
  const skObj = skChairperson.value

  const children: OrganizationChartNode[] = []

  const execChildren: OrganizationChartNode[] = [
    {
      id: secretaryObj?.id || 'sec-node',
      title: 'Barangay Secretary',
      member: [
        {
          id: secretaryObj?.id || 'sec-member',
          name: secretaryObj?.name || 'Barangay Secretary',
          role: 'secretary',
          avatar: secretaryObj?.avatar,
        },
      ],
    },
    {
      id: treasurerObj?.id || 'treas-node',
      title: 'Barangay Treasurer',
      member: [
        {
          id: treasurerObj?.id || 'treas-member',
          name: treasurerObj?.name || 'Barangay Treasurer',
          role: 'treasurer',
          avatar: treasurerObj?.avatar,
        },
      ],
    },
  ]

  children.push(...execChildren)

  if (kagawadObjs.length > 0) {
    const kagawadChildren: OrganizationChartNode[] = kagawadObjs.map((k, idx) => {
      return {
        id: k.id || `kag-${idx}`,
        title: `Kagawad #${idx + 1}`,
        member: [
          {
            id: k.id || `kag-mem-${idx}`,
            name: k.name,
      
            committee: k.committee,
            role: 'kagawad',
            avatar: k.avatar,
          },
        ],
      }
    })

    children.push(...kagawadChildren)
  }

  if (skObj) {
    children.push({
      id: skObj.id || 'sk-node',
      title: 'Sangguniang Kabataan (SK) Chairperson',
      member: [
        {
          id: skObj.id || 'sk-member',
          name: skObj.name,
          role: 'sk_chairperson',
          avatar: skObj.avatar,
        },
      ],
    })
  }

  return {
    id: captainObj?.id || 'captain-node',
    title: 'Punong Barangay (Captain)',
    member: [
      {
        id: captainObj?.id || 'captain-member',
        name: captainObj?.name || 'Hon. Barangay Captain',
        role: 'captain',
        avatar: captainObj?.avatar,
      },
    ],
    children,
  }
})

function handleSelect(payload: OrganizationChartSelectPayload) {
  if (payload.kind === 'member') {
    console.log('official selected', payload.member?.name)
    return
  }
  console.log('position selected', payload.node.title)
}
</script>

<template>
  <Card class="p-4 bg-white dark:bg-[#1c1c1c] border-[#dfdfdf] dark:border-[#333333] shadow-sm">
    <CardHeader class="px-0 pt-0 pb-4">
      <div class="flex flex-wrap items-center justify-between border-b border-[#dfdfdf] dark:border-[#333333] pb-4 gap-3">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-lg bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171]">
            <UserCheck class="size-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-[#171717] dark:text-[#ffffff] tracking-tight">
              {{ 'Barangay Officials' }}
            </h2>
            <p class="text-xs text-[#707070] dark:text-[#a3a3a3]">
              Sangguniang Barangay Leadership of {{ barangayName }}
            </p>
          </div>
        </div>
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
            class="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors"
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
            class="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn class="size-4" />
          </button>

          <div class="h-4 w-px bg-[#dfdfdf] dark:bg-[#333333] mx-1"></div>

          <button
            type="button"
            @click="resetZoom"
            class="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[#171717] dark:text-[#ffffff] transition-colors flex items-center space-x-1"
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
            <template #node-title="{ node }">
              <div
                class="px-2 py-1.5 font-bold text-xs rounded-b-lg transition-colors flex items-center justify-center text-center break-words leading-tight"
                :class="[
                  node.id === 'captain-node' || node.title.includes('Captain')
                    ? 'bg-[#dc2626] text-white'
                    : node.title.includes('SK') || node.title.includes('Kabataan')
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'bg-[#fafafa] dark:bg-[#262626] text-[#171717] dark:text-[#ffffff] border-t border-[#dfdfdf] dark:border-[#333333]'
                ]"
              >
                <span>{{ node.title }}</span>
              </div>
            </template>

            <template #member="{ member }">
              <div class="p-3 text-center w-full bg-white dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff]">
                <div v-if="member.image_url || member.avatar" class="mb-2 flex justify-center">
                  <img
                    :src="(member.image_url || member.avatar) as string"
                    :alt="(member.name as string)"
                    class="w-10 h-10 rounded-full object-cover border border-[#dfdfdf] dark:border-[#333333] pointer-events-none select-none"
                  />
                </div>
                <div v-else class="mb-2 flex justify-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center bg-[#dc2626]/10 dark:bg-[#dc2626]/20 text-[#dc2626] dark:text-[#f87171] font-bold text-sm border border-[#dfdfdf] dark:border-[#333333] select-none"
                  >
                    {{ (member.name as string)?.charAt(0).toUpperCase() ?? '?' }}
                  </div>
                </div>
                <strong class="block text-sm font-bold text-[#171717] dark:text-[#ffffff] leading-snug select-none break-words whitespace-normal">
                  {{ member.name }}
                </strong>
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
  margin: 0 10px !important;
  display: inline-block !important;
  position: relative !important;
}

:deep(.org-node .org-container) {
  display: flex !important;
  flex-direction: column !important;
  width: 185px !important;
  min-width: 185px !important;
  max-width: 185px !important;
  box-sizing: border-box !important;
  border: 1px solid #dfdfdf;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.2s ease;
}

.dark :deep(.org-node .org-container) {
  border-color: #333333;
  background-color: #1c1c1c;
}

:deep(.org-node .org-container:hover) {
  border-color: #dc2626;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
}

:deep(.org-title) {
  order: 2 !important;
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: anywhere !important;
}

:deep(.org-content) {
  order: 1 !important;
  border: none !important;
  margin-top: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: anywhere !important;
}

:deep(.org-child-level:before),
:deep(.org-child-level:after),
:deep(.org-extend:after) {
  border-color: #dfdfdf !important;
}

.dark :deep(.org-child-level:before),
.dark :deep(.org-child-level:after),
.dark :deep(.org-extend:after) {
  border-color: #333333 !important;
}

:deep(.org-extend-arrow:before) {
  border-color: #707070 #707070 transparent transparent !important;
}
</style>
