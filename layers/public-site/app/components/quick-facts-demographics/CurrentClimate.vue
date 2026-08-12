<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudFog } from '@lucide/vue'
import type { Component } from 'vue'

const WEATHER_ICONS: Record<string, Component> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudDrizzle,
  Thunderstorm: CloudLightning,
  Snow: CloudSnow,
  Mist: CloudFog,
  Fog: CloudFog,
  Haze: CloudFog,
}

function getWeatherIcon(condition?: string) {
  return condition ? (WEATHER_ICONS[condition] ?? Cloud) : Cloud
}

const { weather, pending } = useCurrentWeather()
const icon = computed(() => getWeatherIcon(weather.value?.condition))

const isOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="rootEl" class="relative inline-block">
    <button
      type="button"
      class="flex items-center justify-center rounded-full p-2 hover:bg-muted/50 transition-colors"
      :aria-expanded="isOpen"
      aria-label="Current weather"
      @click="isOpen = !isOpen"
    >
      <span v-if="pending" class="size-5 animate-pulse rounded-full bg-muted" />
      <component :is="icon" v-else class="size-5 text-primary" />
    </button>

    <div
      v-if="weather && isOpen"
      class="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md"
    >
      <p class="text-2xl font-semibold">{{ Math.round(weather.tempC) }}°C</p>
      <p class="text-sm capitalize text-muted-foreground">
        {{ weather.description ?? weather.condition }} · Feels like {{ Math.round(weather.feelsLikeC) }}°C
      </p>
      <p class="mt-1 text-xs text-muted-foreground">
        Humidity {{ weather.humidity }}% · Wind {{ Math.round(weather.windKph) }} km/h
      </p>
    </div>
  </div>
</template>