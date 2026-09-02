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
    miniW: 140,
    miniH: 100,
  }
)

const emit = defineEmits<{
  (e: 'update:panX', value: number): void
  (e: 'update:panY', value: number): void
}>()

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Maps the visible content rectangle into minimap pixel coordinates.
 * This position is relative to the node coordinate space (before the group offset).
 */
const viewRect = computed(() => {
  if (!props.isCanvasMeasured) return { x: 0, y: 0, w: props.miniW, h: props.miniH }
  const r = props.visibleContentRect
  const w = Math.min(props.miniW, Math.max(100, (r.w / r.cw) * props.miniW))
  const h = Math.min(props.miniH, Math.max(100, (r.h / r.ch) * props.miniH))
  const keep = 20
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

/**
 * Translates the entire minimap group (nodes + viewport rect together) so
 * the viewport rect stays roughly centered. This gives the visual effect
 * of the chart content panning inside the minimap — like Supabase's schema
 * visualizer where the minimap "follows" your current view.
 *
 * Because both nodes and viewport rect are inside this transform, their
 * relative alignment stays correct.
 */
const minimapGroupStyle = computed(() => {
  if (!props.isCanvasMeasured) return { transform: 'none' }
  const vr = viewRect.value
  // Offset to center the viewport rect in the minimap SVG
  const rawOffsetX = (props.miniW / 2) - (vr.x + vr.w / 2)
  const rawOffsetY = (props.miniH / 2) - (vr.y + vr.h / 2)
  // Clamp so nodes don't completely leave the minimap
  const maxShift = 0.4
  const tx = clamp(rawOffsetX, -props.miniW * maxShift, props.miniW * maxShift)
  const ty = clamp(rawOffsetY, -props.miniH * maxShift, props.miniH * maxShift)
  return {
    transform: `translate(${tx}px, ${ty}px)`,
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

/**
 * Converts a minimap click/drag position into panX/panY values that
 * center the main viewport on the corresponding content coordinates.
 *
 * The click position must be un-transformed by the current group offset
 * to get back to the node coordinate space before mapping to content coords.
 */
function panFromMinimapEvent(e: MouseEvent) {
  if (!props.isCanvasMeasured) return
  const svg = (e.currentTarget as SVGElement) || (e.target as HTMLElement).closest('svg')
  if (!svg) return

  const rect = svg.getBoundingClientRect()
  const clickX = ((e.clientX - rect.left) / (rect.width || props.miniW)) * props.miniW
  const clickY = ((e.clientY - rect.top) / (rect.height || props.miniH)) * props.miniH

  const r = props.visibleContentRect
  const s = props.scale || 1

  // Undo the current group offset to get node-space coordinates
  const vr = viewRect.value
  const rawOffsetX = (props.miniW / 2) - (vr.x + vr.w / 2)
  const rawOffsetY = (props.miniH / 2) - (vr.y + vr.h / 2)
  const maxShift = 0.4
  const tx = clamp(rawOffsetX, -props.miniW * maxShift, props.miniW * maxShift)
  const ty = clamp(rawOffsetY, -props.miniH * maxShift, props.miniH * maxShift)

  const nodeX = clickX - tx
  const nodeY = clickY - ty

  // Map to content coordinates
  const contentX = (nodeX / props.miniW) * r.cw
  const contentY = (nodeY / props.miniH) * r.ch

  // Viewport pixel dimensions (independent of scale)
  const viewportW = r.w * s
  const viewportH = r.h * s

  // Compute pan values that center the viewport on the clicked content position
  // Derived from: transform: translate3d(panX, panY, 0) scale(s), transformOrigin: top center
  const newPanX = s * (r.cw / 2 - contentX) + viewportW / 2 - r.cw / 2
  const newPanY = viewportH / 2 - s * contentY

  emit('update:panX', Math.round(newPanX))
  emit('update:panY', Math.round(newPanY))
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
    class="absolute bottom-4 ml-4 z-10 flex flex-col bg-[#f4f4f5]/95 dark:bg-[#18181b]/95 p-2.5 rounded-sm border border-neutral-300 dark:border-neutral-700 shadow-xl backdrop-blur-md select-none transition-all duration-200"
    :class="[
      isMinimapDragging || isMainDragging
        ? ' scale-[1]'
        : 'hover:border-neutral-400'
    ]"
  >
    <div class="relative p-1.5 bg-white dark:bg-[#09090b] rounded-sm border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
      <svg
        :width="miniW"
        :height="miniH"
        class="cursor-move block rounded-sm"
        @mousedown.prevent="handleMinimapMouseDown"
      >
        <pattern id="miniDotGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#cbd5e1" class="dark:fill-neutral-700" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#miniDotGrid)" class="bg-[#fafafa] dark:bg-[#0c0c0e]" />

        <!-- Group: nodes + viewport rect move together, keeping viewport centered -->
        <g :style="minimapGroupStyle" class="transition-all duration-75">
          <!-- Node dots -->
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
                'transition-opacity duration-75',
                highlightedNodeId === node.id || node.isLabel ? '' : 'dark:fill-neutral-100'
              ]"
            />
          </g>

          <!-- Viewport rect -->
          <rect
            :x="viewRectX"
            :y="viewRectY"
            :width="viewRectWidth"
            :height="viewRectHeight"
            rx="3"
            fill="rgba(100, 38, 38, 0.01)"
            stroke="#f2603c"
            stroke-width="1.5"
            class="pointer-events-none transition-all duration-75"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
