import { describe, it, expect } from 'vitest'
import { useWhereToStayEat } from '../../../app/composables/useWhereToStayEat'

describe('useWhereToStayEat composable', () => {
  it('provides establishments dataset loaded from coordinates.json', () => {
    const { establishmentsData, categories } = useWhereToStayEat()

    expect(establishmentsData.length).toBeGreaterThan(0)
    expect(categories.length).toBeGreaterThan(0)

    const sample = establishmentsData[0]
    expect(sample).toHaveProperty('id')
    expect(sample).toHaveProperty('name')
    expect(sample).toHaveProperty('category')
    expect(sample).toHaveProperty('address')
    expect(sample).toHaveProperty('coordinates')
  })

  it('defaults selectedCategory to "All" and viewMode to "grid"', () => {
    const { selectedCategory, selectedBarangay, viewMode, currentPage } = useWhereToStayEat()

    expect(selectedCategory.value).toBe('All')
    expect(selectedBarangay.value).toBe('All')
    expect(viewMode.value).toBe('grid')
    expect(currentPage.value).toBe(1)
  })

  it('filters establishments by category', () => {
    const { selectCategory, selectedCategory, filteredEstablishments, categories } = useWhereToStayEat()

    if (categories.length > 0) {
      const targetCat = categories[0]!
      selectCategory(targetCat)
      expect(selectedCategory.value).toBe(targetCat)

      filteredEstablishments.value.forEach(item => {
        expect(item.category).toBe(targetCat)
      })
    }
  })

  it('filters establishments by search query', () => {
    const { searchQuery, filteredEstablishments, establishmentsData } = useWhereToStayEat()

    const targetItem = establishmentsData[0]!
    searchQuery.value = targetItem.name.slice(0, 4)

    expect(filteredEstablishments.value.length).toBeGreaterThan(0)
    const names = filteredEstablishments.value.map(e => e.name.toLowerCase())
    expect(names.some(name => name.includes(targetItem.name.slice(0, 4).toLowerCase()))).toBe(true)
  })

  it('resets currentPage to 1 when filters or search query change', () => {
    const { currentPage, searchQuery, selectCategory } = useWhereToStayEat()

    currentPage.value = 3
    expect(currentPage.value).toBe(3)

    searchQuery.value = 'Cafe'
    expect(currentPage.value).toBe(1)

    currentPage.value = 2
    selectCategory('Hotel')
    expect(currentPage.value).toBe(1)
  })

  it('selects an establishment and updates selectedEstablishment computed property', () => {
    const { selectEstablishment, selectedEstablishment, establishmentsData } = useWhereToStayEat()

    const target = establishmentsData[0]!
    selectEstablishment(target)
    expect(selectedEstablishment.value?.id).toBe(target.id)

    selectEstablishment(null)
    expect(selectedEstablishment.value).toBeNull()
  })

  it('computes mapMarkers from filteredEstablishments', () => {
    const { mapMarkers, filteredEstablishments } = useWhereToStayEat()

    expect(mapMarkers.value.length).toBe(filteredEstablishments.value.length)
    if (mapMarkers.value.length > 0) {
      expect(mapMarkers.value[0]).toHaveProperty('position')
      expect(mapMarkers.value[0]).toHaveProperty('title')
    }
  })
})
