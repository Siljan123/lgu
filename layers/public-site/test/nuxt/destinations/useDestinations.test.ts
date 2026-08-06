import { describe, it, expect } from 'vitest'
import { useDestinations } from '../../../app/composables/useDestinations'

describe('useDestinations composable', () => {
  it('provides the complete static list of destinations for San Francisco, Agusan del Sur', () => {
    const { destinationsData } = useDestinations()
    
    expect(destinationsData).toHaveLength(4)
    const names = destinationsData.map(d => d.name)
    expect(names).toContain('Toog Tree of Alegria')
    expect(names).toContain('Mt. Magdiwata')
    expect(names).toContain('Agusan Marsh Wildlife Sanctuary — San Francisco Gateway')
    expect(names).toContain('Irosin Stone Crafts')
  })

  it('filters destinations correctly by category', () => {
    const { selectCategory, selectedCategory, filteredDestinations } = useDestinations()

    selectCategory('Heritage & Culture')
    expect(selectedCategory.value).toBe('Heritage & Culture')
    const heritageItems = filteredDestinations.value
    expect(heritageItems.length).toBe(2)
    expect(heritageItems.map(d => d.name)).toContain('Toog Tree of Alegria')
    expect(heritageItems.map(d => d.name)).toContain('Irosin Stone Crafts')

    selectCategory('Adventure & Outdoor')
    expect(filteredDestinations.value).toHaveLength(1)
    expect(filteredDestinations.value[0].name).toBe('Mt. Magdiwata')
  })

  it('filters destinations correctly by search query', () => {
    const { searchQuery, filteredDestinations } = useDestinations()

    searchQuery.value = 'San Isidro'
    expect(filteredDestinations.value).toHaveLength(1)
    expect(filteredDestinations.value[0].name).toBe('Mt. Magdiwata')

    searchQuery.value = 'rosewood'
    expect(filteredDestinations.value).toHaveLength(1)
    expect(filteredDestinations.value[0].name).toBe('Toog Tree of Alegria')
  })

  it('retrieves destination by ID and manages selected destination state', () => {
    const { getDestinationById, selectDestination, selectedDestination } = useDestinations()

    const item = getDestinationById('mt-magdiwata')
    expect(item).toBeDefined()
    expect(item?.barangay).toBe('San Isidro')

    selectDestination('mt-magdiwata')
    expect(selectedDestination.value?.id).toBe('mt-magdiwata')

    selectDestination(null)
    expect(selectedDestination.value).toBeNull()
  })
})
