<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    dotRadius?: number
    dotSpacing?: number
    cursorRadius?: number
    cursorForce?: number
    bulgeOnly?: boolean
    bulgeStrength?: number
    waveAmplitude?: number
    gradientFrom?: string
    gradientTo?: string
    sparkle?: boolean
    glowRadius?: number
    glowColor?: string
    class?: string
  }>(),
  {
    dotRadius: 1.5,
    dotSpacing: 14,
    cursorRadius: 500,
    cursorForce: 0.1,
    bulgeOnly: true,
    bulgeStrength: 67,
    glowRadius: 160,
    sparkle: false,
    waveAmplitude: 0,
    gradientFrom: '#e74c3c',
    gradientTo: '#B22222',
    glowColor: '#14110E',
    class: ''
  }
)

const root = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const glowEl = ref<SVGCircleElement | null>(null)

const glowId = useId()

const dotFieldOptions = computed(() => ({
  dotRadius: props.dotRadius,
  dotSpacing: props.dotSpacing,
  cursorRadius: props.cursorRadius,
  cursorForce: props.cursorForce,
  bulgeOnly: props.bulgeOnly,
  bulgeStrength: props.bulgeStrength,
  waveAmplitude: props.waveAmplitude,
  gradientFrom: props.gradientFrom,
  gradientTo: props.gradientTo,
  sparkle: props.sparkle
}))

useDotField(root, canvas, glowEl, dotFieldOptions)
</script>

<template>
  <div ref="root" class="relative w-full h-full overflow-hidden" :class="props.class">
    <canvas ref="canvas" class="absolute inset-0 w-full h-full" />

    <svg class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <defs>
        <radialGradient :id="glowId">
          <stop offset="0%" :stop-color="glowColor" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>

      <circle
        ref="glowEl"
        cx="-9999"
        cy="-9999"
        :r="glowRadius"
        :fill="`url(#${glowId})`"
        style="opacity: 0; will-change: opacity"
      />
    </svg>
  </div>
</template>