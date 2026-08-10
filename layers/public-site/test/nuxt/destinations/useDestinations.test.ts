import { describe, it, expect } from 'vitest'
import { useDestinations } from '../../../app/composables/useDestinations'

describe('useDestinations composable', () => {
  it('provides the complete dataset of destinations for San Francisco, Agusan del Sur', () => {
    const { destinationsData } = useDestinations()
    
    expect(destinationsData.length).toBeGreaterThan(50)
    const names = destinationsData.map(d => d.name)
    expect(names).toContain('Bible Baptist Church')
    expect(names).toContain('Forsquare Gospel Church')
    expect(names).toContain('Carson Waterside Mountain Resort')
  })

  it('filters destinations correctly by category', () => {
    const { selectCategory, selectedCategory, filteredDestinations } = useDestinations()

    selectCategory('Cultural & Historical Landmarks')
    expect(selectedCategory.value).toBe('Cultural & Historical Landmarks')
    const culturalItems = filteredDestinations.value
    expect(culturalItems.length).toBeGreaterThan(5)
    expect(culturalItems.map(d => d.name)).toContain('Bible Baptist Church')
    expect(culturalItems.map(d => d.name)).toContain('Forsquare Gospel Church')

    selectCategory('Day-Tour Resorts / Swimming Spots')
    expect(filteredDestinations.value.map(d => d.name)).toContain('Carson Waterside Mountain Resort')
  })

  it('filters destinations correctly by search query', () => {
    const { searchQuery, filteredDestinations } = useDestinations()

    searchQuery.value = 'Bible Baptist'
    expect(filteredDestinations.value).toHaveLength(1)
    expect(filteredDestinations.value[0].name).toBe('Bible Baptist Church')

    searchQuery.value = 'Carson Waterside'
    expect(filteredDestinations.value).toHaveLength(1)
    expect(filteredDestinations.value[0].name).toBe('Carson Waterside Mountain Resort')
  })

  it('retrieves destination by ID and manages selected destination state', () => {
    const { getDestinationById, selectDestination, selectedDestination } = useDestinations()

    const targetId = 'church_bible_baptist_church_8.502511_125.976772'
    const item = getDestinationById(targetId)
    expect(item).toBeDefined()
    expect(item?.name).toBe('Bible Baptist Church')

    selectDestination(targetId)
    expect(selectedDestination.value?.id).toBe(targetId)

    selectDestination(null)
    expect(selectedDestination.value).toBeNull()
  })
})
