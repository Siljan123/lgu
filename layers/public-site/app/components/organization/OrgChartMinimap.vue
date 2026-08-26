<script setup lang="ts">
import { ref, computed } from 'vue'

export interface MiniMapNode {
  id: string
  title?: string
  acronym?: string
  isLabel?: boolean
  x: number
  y: number
  w: number
  h: number
}

export interface VisibleContentRect {
  cw: number
  ch: number
  x: number
  y: number
  w: number
  h: number
}

const props = withDefaults(
  defineProps<{
    show?: boolean
    nodes: MiniMapNode[]
    isCanvasMeasured: boolean
    visibleContentRect: VisibleContentRect
    scale: number
    panX: number
    panY: number
    highlightedNodeId?: string | null
    isMainDragging?: boolean
    miniW?: number
    miniH?: number
  }>(),
  {
    show: true,
    highlightedNodeId: null,
    isMainDragging: false,
    miniW: 180,
    miniH: 120,
  }
)

const emit = defineEmits<{
  (e: 'update:panX', value: number): void
  (e: 'update:panY', value: number): void
}>()

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

const viewRect = computed(() => {
  if (!props.isCanvasMeasured) return { x: 0, y: 0, w: props.miniW, h: props.miniH }
  const r = props.visibleContentRect
  const w = Math.min(props.miniW, Math.max(10, (r.w / r.cw) * props.miniW))
  const h = Math.min(props.miniH, Math.max(10, (r.h / r.ch) * props.miniH))
  const keep = 12
  return {
    x: clamp((r.x / r.cw) * props.miniW, -w + keep, props.miniW - keep),
    y: clamp((r.y / r.ch) * props.miniH, -h + keep, props.miniH - keep),
    w,
    h,
  }
})

const viewRectX = computed(() => viewRect.value.x)
const viewRectY = computed(() => viewRect.value.y)
const viewRectWidth = computed(() => viewRect.value.w)
const viewRectHeight = computed(() => viewRect.value.h)

const minimapGroupStyle = computed(() => {
  if (!props.isCanvasMeasured) return { transform: 'none' }
  const s = props.scale || 1
  const miniScale = 1 + (s - 1) * 0.25 
  
  const r = props.visibleContentRect
  const panRatioX = props.miniW / Math.max(1, r.cw)
  const panRatioY = props.miniH / Math.max(1, r.ch)
  
  const tx = props.panX * panRatioX * 0.3
  const ty = props.panY * panRatioY * 0.3

  return {
    transform: `translate(${tx}px, ${ty}px) scale(${miniScale})`,
    transformOrigin: 'center center'
  }
})

function isMiniNodeInView(node: MiniMapNode): boolean {
  const v = viewRect.value
  return node.x < v.x + v.w
    && node.x + node.w > v.x
    && node.y < v.y + v.h
    && node.y + node.h > v.y
}

const isMinimapDragging = ref(false)

function panFromMinimapEvent(e: MouseEvent) {
  if (!props.isCanvasMeasured) return
  const svg = (e.currentTarget as SVGElement) || (e.target as HTMLElement).closest('svg')
  if (!svg) return

  const rect = svg.getBoundingClientRect()
  const clickX = ((e.clientX - rect.left) / (rect.width || props.miniW)) * props.miniW
  const clickY = ((e.clientY - rect.top) / (rect.height || props.miniH)) * props.miniH

  const r = props.visibleContentRect
  const s = props.scale || 1

  const miniScale = 1 + (s - 1) * 0.25 
  const tx = props.panX * (props.miniW / Math.max(1, r.cw)) * 0.3
  const ty = props.panY * (props.miniH / Math.max(1, r.ch)) * 0.3
  const cx = props.miniW / 2
  const cy = props.miniH / 2
  
  const worldX = (clickX - tx - cx) / miniScale + cx
  const worldY = (clickY - ty - cy) / miniScale + cy

  const targetX = (worldX / props.miniW) * r.cw - r.w / 2
  const targetY = (worldY / props.miniH) * r.ch - r.h / 2

  const newPanX = Math.round(s * (r.cw / 2 - targetX) - r.cw / 2)
  const newPanY = Math.round(-targetY * s)

  emit('update:panX', newPanX)
  emit('update:panY', newPanY)
}

function handleMinimapMouseDown(e: MouseEvent) {
  isMinimapDragging.value = true
  panFromMinimapEvent(e)

  function onMouseMove(me: MouseEvent) {
    if (!isMinimapDragging.value) return
    panFromMinimapEvent(me)
  }

  function onMouseUp() {
    isMinimapDragging.value = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <div
    v-if="show"
    class="absolute bottom-4 left-4 z-30 flex flex-col bg-[#f4f4f5]/95 dark:bg-[#18181b]/95 p-2.5 rounded-sm border border-neutral-300 dark:border-neutral-700 shadow-2xl backdrop-blur-md select-none transition-all duration-200"
    :class="[
      isMinimapDragging || isMainDragging
        ? ' scale-[1.02]'
        : 'hover:border-neutral-400'
    ]"
  >
    <div class="relative p-1.5 bg-white dark:bg-[#09090b] rounded-sm border border-neutral-200 dark:border-neutral-800 shadow-xs">
      <svg
        :width="miniW"
        :height="miniH"
        class="cursor-crosshair block overflow-hidden rounded-lg"
        @mousedown.prevent="handleMinimapMouseDown"
      >
        <pattern id="miniDotGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#cbd5e1" class="dark:fill-neutral-700" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#miniDotGrid)" class="bg-[#fafafa] dark:bg-[#0c0c0e]" />

        <g :style="minimapGroupStyle" class="transition-all duration-75">
          <g>
            <g v-for="node in nodes" :key="'node-' + node.id">
              <rect
                :x="node.x"
                :y="node.y"
                :width="node.w"
                :height="node.h"
                rx="2"
                :fill="highlightedNodeId === node.id ? '#dc2626' : (node.isLabel ? '#0284c7' : '#111827')"
                :stroke="highlightedNodeId === node.id ? '#ffffff' : 'transparent'"
                stroke-width="1"
                :opacity="isMiniNodeInView(node) ? 1 : 0.3"
                :class="[
                  'transition-all duration-75',
                  highlightedNodeId === node.id || node.isLabel ? '' : 'dark:fill-neutral-100'
                ]"
              />
            </g>
          </g>
          <rect
            :x="viewRectX"
            :y="viewRectY"
            :width="viewRectWidth"
            :height="viewRectHeight"
            rx="3"
            fill="rgba(100, 38, 38,0.01)"
            stroke="#f2603c"
            stroke-width="1.5"
            class="pointer-events-none transition-all duration-75"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
