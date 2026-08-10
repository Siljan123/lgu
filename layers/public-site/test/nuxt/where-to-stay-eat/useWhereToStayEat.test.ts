import { describe, it, expect } from 'vitest'
import { useWhereToStayEat } from '../../../app/composables/useWhereToStayEat'

describe('useWhereToStayEat composable', () => {
  it('provides stay and eat establishments loaded and classified from coordinates.json', () => {
    const { establishmentsData, mainCategories, staySubCategories, eatSubCategories } = useWhereToStayEat()

    expect(establishmentsData.length).toBeGreaterThan(0)
    expect(mainCategories).toContain('Where to Stay')
    expect(mainCategories).toContain('Where to Eat')
    expect(staySubCategories).toEqual(['Hotels', 'Inns / lodges', 'Homestays', 'Resorts'])
    expect(eatSubCategories).toEqual(['Restaurants', 'Eateries / carinderias', 'Cafes', 'Local food stalls'])

    const sample = establishmentsData[0]!
    expect(sample).toHaveProperty('id')
    expect(sample).toHaveProperty('name')
    expect(sample).toHaveProperty('mainCategory')
    expect(sample).toHaveProperty('subCategory')
    expect(sample).toHaveProperty('category')
    expect(sample).toHaveProperty('address')
    expect(sample).toHaveProperty('coordinates')
    expect(['Where to Stay', 'Where to Eat']).toContain(sample.mainCategory)
  })

  it('defaults selectedCategory to "All" and viewMode to "grid"', () => {
    const { selectedCategory, selectedMainCategory, selectedSubCategory, selectedBarangay, viewMode, currentPage } = useWhereToStayEat()

    expect(selectedMainCategory.value).toBe('All')
    expect(selectedSubCategory.value).toBe('All')
    expect(selectedCategory.value).toBe('All')
    expect(selectedBarangay.value).toBe('All')
    expect(viewMode.value).toBe('grid')
    expect(currentPage.value).toBe(1)
  })

  it('filters establishments by mainCategory and subCategory', () => {
    const { selectMainCategory, selectSubCategory, selectedMainCategory, selectedSubCategory, filteredEstablishments } = useWhereToStayEat()

    selectMainCategory('Where to Stay')
    expect(selectedMainCategory.value).toBe('Where to Stay')
    filteredEstablishments.value.forEach(item => {
      expect(item.mainCategory).toBe('Where to Stay')
    })

    selectSubCategory('Homestays')
    expect(selectedSubCategory.value).toBe('Homestays')
    filteredEstablishments.value.forEach(item => {
      expect(item.subCategory).toBe('Homestays')
    })
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
    const { currentPage, searchQuery, selectMainCategory } = useWhereToStayEat()

    currentPage.value = 3
    expect(currentPage.value).toBe(3)

    searchQuery.value = 'Cafe'
    expect(currentPage.value).toBe(1)

    currentPage.value = 2
    selectMainCategory('Where to Stay')
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
