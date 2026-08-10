import { describe, it, expect } from 'vitest'
import { useLocalFares } from '../../../app/composables/useLocalFares'

describe('useLocalFares composable', () => {
  it('provides the complete static list of local fares in San Francisco, Agusan del Sur', () => {
    const { fares } = useLocalFares()

    expect(fares.value).toBeDefined()
    expect(fares.value!.length).toBeGreaterThanOrEqual(5)

    const hubangRoute = fares.value!.find(
      f => f.from === 'Poblacion' && f.to === 'New Terminal Hubang'
    )
    expect(hubangRoute).toBeDefined()
    expect(hubangRoute?.mode).toContain('Tricycle')
    expect(hubangRoute?.fare).toBe('₱15')
    expect(hubangRoute?.discountedFare).toBe('₱12')
    expect(hubangRoute?.estimatedTime).toBe('10-15 mins')
  })

  it('filters fares correctly by origin location', () => {
    const { selectedOrigin, filteredFares } = useLocalFares()

    selectedOrigin.value = 'Poblacion'
    const poblacionFares = filteredFares.value
    expect(poblacionFares.length).toBeGreaterThan(0)
    expect(poblacionFares.every(f => f.from === 'Poblacion')).toBe(true)

    selectedOrigin.value = 'New Terminal Hubang'
    const hubangFares = filteredFares.value
    expect(hubangFares.length).toBeGreaterThan(0)
    expect(hubangFares.every(f => f.from === 'New Terminal Hubang')).toBe(true)
  })

  it('filters fares correctly by vehicle mode', () => {
    const { selectedMode, filteredFares } = useLocalFares()

    selectedMode.value = 'Habal-habal'
    const habalFares = filteredFares.value
    expect(habalFares.length).toBeGreaterThan(0)
    expect(habalFares.every(f => f.mode.includes('Habal-habal'))).toBe(true)
  })

  it('filters fares correctly by search query', () => {
    const { searchQuery, filteredFares } = useLocalFares()

    searchQuery.value = 'Magdiwata'
    expect(filteredFares.value.length).toBe(1)
    expect(filteredFares.value[0].to).toContain('Mt. Magdiwata')

    searchQuery.value = 'Alegria'
    expect(filteredFares.value.length).toBe(1)
    expect(filteredFares.value[0].to).toContain('Brgy. Alegria')
  })

  it('provides available origin locations and mode options', () => {
    const { fromLocations, availableModes } = useLocalFares()

    expect(fromLocations.value).toContain('All')
    expect(fromLocations.value).toContain('Poblacion')
    expect(fromLocations.value).toContain('New Terminal Hubang')

    expect(availableModes.value).toContain('All')
    expect(availableModes.value).toContain('Tricycle')
  })
})
