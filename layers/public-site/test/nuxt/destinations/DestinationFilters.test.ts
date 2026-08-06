import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationFilters from '../../../app/components/destinations/DestinationFilters.vue'

describe('DestinationFilters Component', () => {
  it('renders category pill buttons and search input', async () => {
    const categories = ['All', 'Natural Attractions', 'Heritage & Culture']
    const wrapper = await mountSuspended(DestinationFilters, {
      props: {
        categories,
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 4,
        filteredCount: 4
      }
    })

    expect(wrapper.text()).toContain('Natural Attractions')
    expect(wrapper.text()).toContain('Heritage & Culture')
    expect(wrapper.text()).toContain('Showing 4 of 4 destinations')
  })

  it('emits update:searchQuery when typing in the search input', async () => {
    const wrapper = await mountSuspended(DestinationFilters, {
      props: {
        categories: ['All'],
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 4,
        filteredCount: 4
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Magdiwata')

    expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
    expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual(['Magdiwata'])
  })

  it('emits update:selectedCategory when clicking a category pill', async () => {
    const categories = ['All', 'Adventure & Outdoor']
    const wrapper = await mountSuspended(DestinationFilters, {
      props: {
        categories,
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 4,
        filteredCount: 4
      }
    })

    const categoryButton = wrapper.findAll('button').find(b => b.text().includes('Adventure & Outdoor'))
    expect(categoryButton).toBeDefined()

    await categoryButton?.trigger('click')
    expect(wrapper.emitted('update:selectedCategory')).toBeTruthy()
    expect(wrapper.emitted('update:selectedCategory')?.[0]).toEqual(['Adventure & Outdoor'])
  })
})
