import type { Ref } from 'vue'

const TWO_PI = Math.PI * 2

export type DotFieldOptions = {
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
}

type Dot = {
  ax: number
  ay: number
  sx: number
  sy: number
  vx: number
  vy: number
  x: number
  y: number
}

type Size = {
  w: number
  h: number
  offsetX: number
  offsetY: number
}

const DEFAULTS: Required<DotFieldOptions> = {
  dotRadius: 1.5,
  dotSpacing: 14,
  cursorRadius: 500,
  cursorForce: 0.1,
  bulgeOnly: true,
  bulgeStrength: 67,
  waveAmplitude: 0,
  gradientFrom: 'rgba(124, 255, 103, 0.35)',
  gradientTo: 'rgba(160, 255, 188, 0.25)',
  sparkle: false
}

/**
 * Drives an animated field of dots on a <canvas>, plus an accompanying
 * cursor-glow opacity value meant for an overlaid SVG radial gradient.
 *
 * All DOM/window access happens inside onMounted / event handlers, so this
 * is safe to call from a component rendered only on the client
 * (e.g. a `.client.vue` component or inside <ClientOnly>).
 */
export function useDotField(
  root: Ref<HTMLElement | null>,
  canvas: Ref<HTMLCanvasElement | null>,
  glowEl: Ref<SVGCircleElement | null>,
  options: Ref<DotFieldOptions> | DotFieldOptions = {}
) {
  let glowOpacity = 0
  let dots: Dot[] = []
  let size: Size = { w: 0, h: 0, offsetX: 0, offsetY: 0 }
  let engagement = 0
  let frameCount = 0
  let raf = 0
  let resizeTimer: ReturnType<typeof setTimeout>
  let speedInterval: ReturnType<typeof setInterval>

  const mouse = {
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    speed: 0
  }

  function opts(): Required<DotFieldOptions> {
    const raw = isRef(options) ? options.value : options
    return { ...DEFAULTS, ...raw }
  }

  function buildDots(w: number, h: number) {
    const { dotRadius, dotSpacing } = opts()
    const step = dotRadius + dotSpacing

    const cols = Math.floor(w / step)
    const rows = Math.floor(h / step)

    const padX = (w % step) / 2
    const padY = (h % step) / 2

    const nextDots: Dot[] = new Array(rows * cols)
    let idx = 0

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ax = padX + col * step + step / 2
        const ay = padY + row * step + step / 2

        nextDots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay }
      }
    }

    dots = nextDots
  }

  function updateMouseSpeed() {
    const dx = mouse.prevX - mouse.x
    const dy = mouse.prevY - mouse.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    mouse.speed += (dist - mouse.speed) * 0.5

    if (mouse.speed < 0.001) mouse.speed = 0

    mouse.prevX = mouse.x
    mouse.prevY = mouse.y
  }

  function doResize(ctx: CanvasRenderingContext2D, dpr: number) {
    if (!root.value || !canvas.value) return

    const rect = root.value.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    canvas.value.width = w * dpr
    canvas.value.height = h * dpr
    canvas.value.style.width = `${w}px`
    canvas.value.style.height = `${h}px`

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    size = {
      w,
      h,
      offsetX: rect.left + window.scrollX,
      offsetY: rect.top + window.scrollY
    }

    buildDots(w, h)
  }

  function tick(ctx: CanvasRenderingContext2D) {
    frameCount++

    const { w, h } = size
    const { cursorRadius, cursorForce, bulgeOnly, bulgeStrength, waveAmplitude, gradientFrom, gradientTo, sparkle, dotRadius } = opts()

    const t = frameCount * 0.02
    const targetEngagement = Math.min(mouse.speed / 5, 1)

    engagement += (targetEngagement - engagement) * 0.06
    if (engagement < 0.001) engagement = 0

    glowOpacity += (engagement - glowOpacity) * 0.08

    if (glowEl.value) {
      glowEl.value.setAttribute('cx', String(mouse.x))
      glowEl.value.setAttribute('cy', String(mouse.y))
      glowEl.value.style.opacity = String(glowOpacity)
    }

    ctx.clearRect(0, 0, w, h)

    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, gradientFrom)
    grad.addColorStop(1, gradientTo)
    ctx.fillStyle = grad

    const crSq = cursorRadius * cursorRadius
    const rad = dotRadius / 2

    ctx.beginPath()

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i]!

      const dx = mouse.x - d.ax
      const dy = mouse.y - d.ay
      const distSq = dx * dx + dy * dy

      if (distSq < crSq && engagement > 0.01) {
        const dist = Math.sqrt(distSq)
        const angle = Math.atan2(dy, dx)

        if (bulgeOnly) {
          const falloff = 1 - dist / cursorRadius
          const push = falloff * falloff * bulgeStrength * engagement

          d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15
          d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15
        } else {
          const safeDist = Math.max(dist, 0.001)
          const move = (500 / safeDist) * (mouse.speed * cursorForce)

          d.vx += Math.cos(angle) * -move
          d.vy += Math.sin(angle) * -move
        }
      } else if (bulgeOnly) {
        d.sx += (d.ax - d.sx) * 0.1
        d.sy += (d.ay - d.sy) * 0.1
      }

      if (!bulgeOnly) {
        d.vx *= 0.9
        d.vy *= 0.9

        d.x = d.ax + d.vx
        d.y = d.ay + d.vy

        d.sx += (d.x - d.sx) * 0.1
        d.sy += (d.y - d.sy) * 0.1
      }

      let drawX = d.sx
      let drawY = d.sy

      if (waveAmplitude > 0) {
        drawY += Math.sin(d.ax * 0.03 + t) * waveAmplitude
        drawX += Math.cos(d.ay * 0.03 + t * 0.7) * waveAmplitude * 0.5
      }

      if (sparkle) {
        const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0
        const r = hash % 100 < 3 ? rad * 1.8 : rad

        ctx.moveTo(drawX + r, drawY)
        ctx.arc(drawX, drawY, r, 0, TWO_PI)
      } else {
        ctx.moveTo(drawX + rad, drawY)
        ctx.arc(drawX, drawY, rad, 0, TWO_PI)
      }
    }

    ctx.fill()

    raf = requestAnimationFrame(() => tick(ctx))
  }

  function start() {
    if (!root.value || !canvas.value) return

    const ctx = canvas.value.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => doResize(ctx!, dpr), 100)
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.pageX - size.offsetX
      mouse.y = e.pageY - size.offsetY
    }

    doResize(ctx, dpr)

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    speedInterval = setInterval(updateMouseSpeed, 20)
    raf = requestAnimationFrame(() => tick(ctx))

    onBeforeUnmount(() => {
      cancelAnimationFrame(raf)
      clearInterval(speedInterval)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
    })
  }

  onMounted(() => {
    start()
  })

  if (isRef(options)) {
    watch(
      () => [options.value.dotRadius, options.value.dotSpacing],
      async () => {
        await nextTick()
        if (size.w > 0 && size.h > 0) buildDots(size.w, size.h)
      }
    )
  }

  return {
    /** Current mouse position in element-local coordinates (not reactive; read in RAF/event contexts only). */
    mouse
  }
}