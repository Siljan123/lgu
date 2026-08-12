import type { MaybeRef } from 'vue'

export interface WeatherCoords {
  lat?: number | string
  lon?: number | string
  latitude?: number | string
  longitude?: number | string
}

export const useCurrentWeather = (coords?: MaybeRef<WeatherCoords>) => {
  const query = computed(() => {
    const raw = toValue(coords)
    if (!raw) return {}
    return {
      ...(raw.lat !== undefined ? { lat: raw.lat } : raw.latitude !== undefined ? { lat: raw.latitude } : {}),
      ...(raw.lon !== undefined ? { lon: raw.lon } : raw.longitude !== undefined ? { lon: raw.longitude } : {}),
    }
  })

  const { data, pending, error, refresh } = useLazyFetch('/api/weather/current', {
    query,
    server: true,
    default: () => null,
  })

  return { weather: data, pending, error, refresh }
}