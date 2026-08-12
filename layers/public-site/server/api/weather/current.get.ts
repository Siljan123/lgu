interface OpenMeteoResponse {
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    weather_code: number
    wind_speed_10m: number
  }
}

const DEFAULT_LAT = 8.5167
const DEFAULT_LON = 125.9833

function parseWmoCode(code: number): { condition: string; description: string } {
  switch (code) {
    case 0:
      return { condition: 'Clear', description: 'clear sky' }
    case 1:
      return { condition: 'Clouds', description: 'mainly clear' }
    case 2:
      return { condition: 'Clouds', description: 'partly cloudy' }
    case 3:
      return { condition: 'Clouds', description: 'overcast clouds' }
    case 45:
    case 48:
      return { condition: 'Fog', description: 'foggy' }
    case 51:
      return { condition: 'Drizzle', description: 'light drizzle' }
    case 53:
      return { condition: 'Drizzle', description: 'moderate drizzle' }
    case 55:
      return { condition: 'Drizzle', description: 'dense drizzle' }
    case 56:
    case 57:
      return { condition: 'Drizzle', description: 'freezing drizzle' }
    case 61:
      return { condition: 'Rain', description: 'slight rain' }
    case 63:
      return { condition: 'Rain', description: 'moderate rain' }
    case 65:
      return { condition: 'Rain', description: 'heavy rain' }
    case 66:
    case 67:
      return { condition: 'Rain', description: 'freezing rain' }
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: 'Snow', description: 'snowfall' }
    case 80:
      return { condition: 'Rain', description: 'slight rain showers' }
    case 81:
      return { condition: 'Rain', description: 'moderate rain showers' }
    case 82:
      return { condition: 'Rain', description: 'violent rain showers' }
    case 85:
    case 86:
      return { condition: 'Snow', description: 'snow showers' }
    case 95:
      return { condition: 'Thunderstorm', description: 'thunderstorm' }
    case 96:
    case 99:
      return { condition: 'Thunderstorm', description: 'thunderstorm with hail' }
    default:
      return { condition: 'Clouds', description: 'partly cloudy' }
  }
}

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)

  const latRaw = query.lat ?? query.latitude ?? DEFAULT_LAT
  const lonRaw = query.lon ?? query.longitude ?? DEFAULT_LON

  const lat = Number(latRaw)
  const lon = Number(lonRaw)

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid latitude or longitude coordinates',
    })
  }

  const url = `https://api.open-meteo.com/v1/forecast`
    + `?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`

  const data = await $fetch<OpenMeteoResponse>(url)
  const weatherInfo = parseWmoCode(data.current.weather_code)

  return {
    tempC: data.current.temperature_2m,
    feelsLikeC: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windKph: data.current.wind_speed_10m,
    condition: weatherInfo.condition,
    description: weatherInfo.description,
    updatedAt: new Date(data.current.time + 'Z').toISOString(),
  }
}, {
  maxAge: 60 * 15,
  getKey: (event) => {
    const query = getQuery(event)
    const lat = Number(query.lat ?? query.latitude ?? DEFAULT_LAT)
    const lon = Number(query.lon ?? query.longitude ?? DEFAULT_LON)
    return `weather_current_om_${lat.toFixed(4)}_${lon.toFixed(4)}`
  },
})