<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import OrganizationChart from 'organization-chart-vue3'
import 'organization-chart-vue3/style.css'
import type {
  OrganizationChartNode,
  OrganizationChartSelectPayload,
} from 'organization-chart-vue3'
import {
  UserCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
} from '@lucide/vue'

withDefaults(
  defineProps<{
    treeRoot: OrganizationChartNode | null
    pending?: boolean
    error?: unknown
  }>(),
  {
    pending: false,
    error: undefined,
  }
)

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

function handleSelect(payload: OrganizationChartSelectPayload) {
  if (payload.kind === 'member') {
    console.log('official selected', payload.member?.name)
    return
  }
  console.log('position selected', payload.node.title)
}
</script>

<template>
  <div class="w-full">
    <div v-if="pending" class="py-12 text-center text-muted-foreground">
      Loading elected officials…
    </div>

    <div v-else-if="error" class="py-12 text-center text-destructive">
      Couldn't load elected officials. Please try again later.
    </div>

    <Card v-else-if="treeRoot" class="p-4 bg-white dark:bg-[#1c1c1c] border-[#dfdfdf] dark:border-[#333333] shadow-sm">

      <CardContent class="px-0 py-2 space-y-3">
        <!-- Pan & Zoom Control Toolbar -->
        <div class="flex items-center justify-between gap-2 bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] rounded-sm px-3 py-2 text-xs">
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

            <span class="text-xs font-mono font-bold text-[#171717] dark:text-[#ffffff] min-w-10.5 text-center select-none">
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

        <div
          class="relative w-full min-h-125 h-[65vh] overflow-hidden rounded-xl bg-[#fafafa]/50 dark:bg-[#121212]/50 cursor-grab active:cursor-grabbing select-none"
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
              :data="treeRoot"
              @select="handleSelect"
              class="elected-officials-org-chart mx-auto"
            >
              <template #node-title="{ node }">
                <div
                  class="px-2 py-1.5 font-bold text-xs rounded-b-lg transition-colors flex items-center justify-center text-center wrap-break-words leading-tight"
                  :class="[
                    node.id === 'mayor' || node.title.toLowerCase().includes('mayor') && !node.title.toLowerCase().includes('vice')
                      ? 'bg-[#333333] text-white'
                      : node.title.toLowerCase().includes('vice')
                       
                  ]"
                >
                  <span>{{ node.title }}</span>
                </div>
              </template>

              <template #member="{ member }">
                <div class="p-3 text-center w-full bg-white dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff]">
                  <div v-if="member.image_url" class="mb-2 flex justify-center">
                    <img
                      :src="member.image_url as string"
                      :alt="member.name as string"
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
                  <strong class="block text-sm font-bold text-[#171717] dark:text-[#ffffff] leading-snug select-none wrap-break-words whitespace-normal">
                    {{ member.name }}
                  </strong>
                  <span v-if="member.add && member.add !== member.name" class="block text-xs text-[#707070] dark:text-[#a3a3a3] mt-0.5 select-none">
                    {{ member.add }}
                  </span>
                </div>
              </template>
            </OrganizationChart>
          </div>
        </div>
      </CardContent>
    </Card>

    <div v-else class="py-12 text-center text-muted-foreground">
      No officials to display yet.
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
  margin: 0 12px !important;
  display: inline-block !important;
  position: relative !important;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

:deep(.org-node .org-container) {
  display: flex !important;
  flex-direction: column !important;
  width: 190px !important;
  min-width: 190px !important;
  max-width: 190px !important;
  box-sizing: border-box !important;
  border: 1px solid #dfdfdf;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark :deep(.org-node .org-container) {
  border-color:1px solid #333333;
  background-color: #1c1c1c;
}

:deep(.org-node .org-container:hover) {
  border-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px -2px rgba(220, 38, 38, 0.15);
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

/* Connector lines styling */
:deep(.org-child-level:before),
:deep(.org-child-level:after),
:deep(.org-extend:after) {
  border-color: #cbd5e1 !important;
  border-width: 2px !important;
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

/* Smooth expansion and collapse animation transform for child nodes */
:deep(.org-child-level) {
  animation: org-node-expand 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: top center;
  will-change: transform, opacity;
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