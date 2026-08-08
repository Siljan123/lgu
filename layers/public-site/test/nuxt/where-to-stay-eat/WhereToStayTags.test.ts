import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WhereToStayTags from '../../../app/components/where-to-stay-eat/WhereToStayTags.vue'
import type { Establishment } from '../../../app/composables/useWhereToStayEat'

const sampleEstablishments: Establishment[] = [
  {
    id: 'sample-1',
    name: 'Sample Hotel',
    category: 'Hotel',
    address: 'Barangay 1, San Francisco, Agusan del Sur',
    barangay: 'Barangay 1',
    coordinates: { lat: 8.5042, lng: 125.9786 }
  },
  {
    id: 'sample-2',
    name: 'Sample Cafe',
    category: 'Coffee Shop',
    address: 'Barangay 2, San Francisco, Agusan del Sur',
    barangay: 'Barangay 2',
    coordinates: { lat: 8.5050, lng: 125.9790 }
  }
]

describe('WhereToStayTags Component', () => {
  it('renders search input, category dropdown, and barangay dropdown', async () => {
    const wrapper = await mountSuspended(WhereToStayTags, {
      props: {
        categories: ['Hotel', 'Coffee Shop'],
        categoryCounts: { All: 2, Hotel: 1, 'Coffee Shop': 1 },
        selectedCategory: 'All',
        selectedBarangay: 'All',
        barangays: ['All', 'Barangay 1', 'Barangay 2'],
        searchQuery: '',
        establishments: sampleEstablishments,
        filteredCount: 2,
        totalCount: 2
      }
    })

    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    const selects = wrapper.findAll('select')
    expect(selects.length).toBe(2)
    expect(wrapper.text()).toContain('All Categories (2)')
    expect(wrapper.text()).toContain('All Barangays')
  })

  it('emits update:searchQuery when typing into search input', async () => {
    const wrapper = await mountSuspended(WhereToStayTags, {
      props: {
        categories: ['Hotel'],
        categoryCounts: { All: 1, Hotel: 1 },
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

  it('emits update:selectedCategory when category dropdown changes', async () => {
    const wrapper = await mountSuspended(WhereToStayTags, {
      props: {
        categories: ['Hotel', 'Coffee Shop'],
        categoryCounts: { All: 2, Hotel: 1, 'Coffee Shop': 1 },
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
    await categorySelect.setValue('Hotel')

    expect(wrapper.emitted('update:selectedCategory')).toBeTruthy()
    expect(wrapper.emitted('update:selectedCategory')?.[0]).toEqual(['Hotel'])
  })
})
