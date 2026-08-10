import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WhereToStayTags from '../../../app/components/where-to-stay-eat/WhereToStayTags.vue'
import type { Establishment } from '../../../app/composables/useWhereToStayEat'

const sampleEstablishments: Establishment[] = [
  {
    id: 'sample-1',
    name: 'Sample Hotel',
    mainCategory: 'Where to Stay',
    subCategory: 'Hotels',
    category: 'Hotels',
    address: 'Barangay 1, San Francisco, Agusan del Sur',
    barangay: 'Barangay 1',
    coordinates: { lat: 8.5042, lng: 125.9786 }
  },
  {
    id: 'sample-2',
    name: 'Sample Cafe',
    mainCategory: 'Where to Eat',
    subCategory: 'Cafes',
    category: 'Cafes',
    address: 'Barangay 2, San Francisco, Agusan del Sur',
    barangay: 'Barangay 2',
    coordinates: { lat: 8.5050, lng: 125.9790 }
  }
]

describe('WhereToStayTags Component', () => {
  it('renders main category tabs, search input, subcategory dropdown, and barangay dropdown', async () => {
    const wrapper = await mountSuspended(WhereToStayTags, {
      props: {
        categories: ['Hotels', 'Cafes'],
        mainCategories: ['All', 'Where to Stay', 'Where to Eat'],
        categoryCounts: { All: 2, Hotels: 1, Cafes: 1 },
        mainCategoryCounts: { All: 2, 'Where to Stay': 1, 'Where to Eat': 1 },
        selectedMainCategory: 'All',
        selectedSubCategory: 'All',
        selectedCategory: 'All',
        selectedBarangay: 'All',
        barangays: ['All', 'Barangay 1', 'Barangay 2'],
        searchQuery: '',
        establishments: sampleEstablishments,
        filteredCount: 2,
        totalCount: 2
      }
    })

    expect(wrapper.text()).toContain('Where to Stay')
    expect(wrapper.text()).toContain('Where to Eat')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    const selects = wrapper.findAll('select')
    expect(selects.length).toBe(2)
    expect(wrapper.text()).toContain('All Subcategories')
    expect(wrapper.text()).toContain('All Barangays')
  })

  it('emits update:selectedMainCategory when clicking main category tabs', async () => {
    const wrapper = await mountSuspended(WhereToStayTags, {
      props: {
        categories: ['Hotels', 'Cafes'],
        mainCategories: ['All', 'Where to Stay', 'Where to Eat'],
        categoryCounts: { All: 2, Hotels: 1, Cafes: 1 },
        mainCategoryCounts: { All: 2, 'Where to Stay': 1, 'Where to Eat': 1 },
        selectedMainCategory: 'All',
        selectedSubCategory: 'All',
        selectedCategory: 'All',
        selectedBarangay: 'All',
        barangays: ['All'],
        searchQuery: '',
        establishments: sampleEstablishments,
        filteredCount: 2,
        totalCount: 2
      }
    })

    const buttons = wrapper.findAll('button')
    const stayBtn = buttons.find(b => b.text().includes('Where to Stay'))
    expect(stayBtn).toBeDefined()
    await stayBtn?.trigger('click')

    expect(wrapper.emitted('update:selectedMainCategory')).toBeTruthy()
    expect(wrapper.emitted('update:selectedMainCategory')?.[0]).toEqual(['Where to Stay'])
  })

  it('emits update:searchQuery when typing into search input', async () => {
    const wrapper = await mountSuspended(WhereToStayTags, {
      props: {
        categories: ['Hotels'],
        categoryCounts: { All: 1, Hotels: 1 },
        selectedCategory: 'All',
        selectedBarangay: 'All',
        barangays: ['All'],
        searchQuery: '',
        establishments: sampleEstablishments,
        filteredCount: 2,
        totalCount: 2
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Sample Hotel')

    expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
    expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual(['Sample Hotel'])
  })

  it('emits update:selectedSubCategory when subcategory dropdown changes', async () => {
    const wrapper = await mountSuspended(WhereToStayTags, {
      props: {
        categories: ['Hotels', 'Cafes'],
        categoryCounts: { All: 2, Hotels: 1, Cafes: 1 },
        selectedCategory: 'All',
        selectedBarangay: 'All',
        barangays: ['All'],
        searchQuery: '',
        establishments: sampleEstablishments,
        filteredCount: 2,
        totalCount: 2
      }
    })

    const categorySelect = wrapper.findAll('select')[0]!
    await categorySelect.setValue('Hotels')

    expect(wrapper.emitted('update:selectedSubCategory')).toBeTruthy()
    expect(wrapper.emitted('update:selectedSubCategory')?.[0]).toEqual(['Hotels'])
  })
})
