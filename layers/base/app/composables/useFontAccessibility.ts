import type { ComputedRef, Ref } from 'vue'

export type FontSizeStep = 'sm' | 'base' | 'lg' | 'xl' | '2xl'

export interface UseFontAccessibilityReturn {
  fontSize: Ref<FontSizeStep>
  label: ComputedRef<string>
  steps: readonly FontSizeStep[]
  canIncrease: ComputedRef<boolean>
  canDecrease: ComputedRef<boolean>
  setFontSize: (size: FontSizeStep) => void
  increase: () => void
  decrease: () => void
  reset: () => void
}

export type UseFontSizeReturn = UseFontAccessibilityReturn

const STORAGE_KEY = 'a11y-font-size'

const STEPS: readonly FontSizeStep[] = ['sm', 'base', 'lg', 'xl', '2xl']

const SCALE: Record<FontSizeStep, number> = {
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  '2xl': 1.375,
}

const LABELS: Record<FontSizeStep, string> = {
  sm: 'Small',
  base: 'Default',
  lg: 'Large',
  xl: 'Extra large',
  '2xl': 'Maximum',
}

function isFontSizeStep(value: unknown): value is FontSizeStep {
  return typeof value === 'string' && (STEPS as readonly string[]).includes(value)
}

export function useFontAccessibility(): UseFontAccessibilityReturn {
  const fontSizeCookie = useCookie<FontSizeStep>(STORAGE_KEY, {
    default: () => 'base',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })

  const fontSize = computed<FontSizeStep>({
    get() {
      return isFontSizeStep(fontSizeCookie.value) ? fontSizeCookie.value : 'base'
    },
    set(val) {
      fontSizeCookie.value = isFontSizeStep(val) ? val : 'base'
    },
  })

  useHead({
    htmlAttrs: {
      style: computed(() => `font-size: ${SCALE[fontSize.value] * 100}%;`),
    },
  })

  const index = computed(() => STEPS.indexOf(fontSize.value))
  const label = computed(() => LABELS[fontSize.value])
  const canIncrease = computed(() => index.value < STEPS.length - 1)
  const canDecrease = computed(() => index.value > 0)

  function setFontSize(size: FontSizeStep): void {
    if (!isFontSizeStep(size)) return
    fontSizeCookie.value = size
  }

  function increase(): void {
    if (!canIncrease.value) return
    const next = STEPS[index.value + 1]
    if (next) setFontSize(next)
  }

  function decrease(): void {
    if (!canDecrease.value) return
    const previous = STEPS[index.value - 1]
    if (previous) setFontSize(previous)
  }

  function reset(): void {
    setFontSize('base')
  }

  return {
    fontSize: fontSize as unknown as Ref<FontSizeStep>,
    label,
    steps: STEPS,
    canIncrease,
    canDecrease,
    setFontSize,
    increase,
    decrease,
    reset,
  }
}

