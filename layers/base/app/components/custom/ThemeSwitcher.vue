<script setup lang="ts">
import { computed } from 'vue'
import { Monitor, Moon, RotateCcw, Sun, Type, Palette } from '@lucide/vue'
import { useColorMode } from '@vueuse/core'
import { useFontAccessibility, type FontSizeStep } from '../../composables/useFontAccessibility'

const mode = useColorMode()
const {
  fontSize,
  label,
  setFontSize,
  reset: resetFontSize,
} = useFontAccessibility()

const theme = computed({
  get: () => (mode.store?.value || mode.value) as 'light' | 'dark' | 'auto',
  set: (val: 'light' | 'dark' | 'auto') => {
    mode.value = val
  },
})

function setTheme(value: 'light' | 'dark' | 'auto') {
  theme.value = value
}

function resetAll() {
  resetFontSize()
  setTheme('auto')
}

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'auto', label: 'System', icon: Monitor },
] as const

const stepOptions: Array<{ step: FontSizeStep; shortLabel: string; fullLabel: string; scale: string }> = [
  { step: 'sm', shortLabel: 'S', fullLabel: 'Small', scale: '87.5%' },
  { step: 'base', shortLabel: 'M', fullLabel: 'Default', scale: '100%' },
  { step: 'lg', shortLabel: 'L', fullLabel: 'Large', scale: '112.5%' },
  { step: 'xl', shortLabel: 'XL', fullLabel: 'Extra Large', scale: '125%' },
  { step: '2xl', shortLabel: '2XL', fullLabel: 'Maximum', scale: '137.5%' },
]

const currentThemeLabel = computed(() => {
  const activeMode = mode.store?.value || mode.value
  if (activeMode === 'auto') return `System (${mode.value === 'dark' ? 'Dark' : 'Light'})`
  if (activeMode === 'light') return 'Light'
  if (activeMode === 'dark') return 'Dark'
  return 'System'
})

const hasNonDefaultSettings = computed(() => {
  const activeMode = mode.store?.value || mode.value
  return fontSize.value !== 'base' || activeMode !== 'auto'
})
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="relative size-9 rounded-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Accessibility and display settings"
      >
        <Palette class="size-4.5 text-foreground transition-transform duration-200" />
        <span class="sr-only">Toggle accessibility settings</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        align="end"
        class="w-72 sm:w-80 rounded-md border border-border bg-popover p-3.5 shadow-lg"
      >
        <!-- Color Mode Section -->
        <div class="space-y-1.5 mb-3.5">
          <div class="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Color Mode</span>
            <span class="text-foreground font-semibold">{{ currentThemeLabel }}</span>
          </div>
          <ButtonGroup class="w-full grid grid-cols-3">
            <Button
              v-for="item in themeOptions"
              :key="item.value"
              :variant="theme === item.value ? 'default' : 'outline'"
              size="sm"
              class="h-8 text-xs gap-1.5 cursor-pointer"
              @click.prevent="setTheme(item.value)"
            >
              <component :is="item.icon" class="size-3.5" />
              <span>{{ item.label }}</span>
            </Button>
          </ButtonGroup>
        </div>

        <!-- Font Size Section -->
        <div class="space-y-1.5 mb-3.5">
          <div class="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span class="flex items-center gap-1">
              <Type class="size-3.5" />
              Font Size
            </span>
            <span class="text-foreground font-semibold">{{ label }}</span>
          </div>

          <!-- Segmented Font Size Selector -->
          <ButtonGroup class="w-full flex">
            <Button
              v-for="stepItem in stepOptions"
              :key="stepItem.step"
              :variant="fontSize === stepItem.step ? 'default' : 'outline'"
              size="sm"
              class="flex-1 h-8 text-xs font-semibold cursor-pointer"
              :title="`${stepItem.fullLabel} (${stepItem.scale})`"
              @click.prevent="setFontSize(stepItem.step)"
            >
              {{ stepItem.shortLabel }}
            </Button>
          </ButtonGroup>
        </div>

        <!-- Footer Reset Action -->
        <div class="pt-2.5 border-t border-border/80">
          <Button
            variant="outline"
            size="sm"
            :disabled="!hasNonDefaultSettings"
            class="w-full h-8 text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
            @click.prevent="resetAll"
          >
            <RotateCcw class="size-3.5" />
            <span>Reset to default</span>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenu>
</template>

