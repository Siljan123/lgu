import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationFilters from '../../../app/components/destinations/DestinationFilters.vue'

describe('DestinationFilters Component', () => {
  it('renders search input, category select toggle button, and count stats', async () => {
    const categories = ['All', 'Inland Resorts', 'Heritage & Culture', 'Parks & Viewpoints']
    const wrapper = await mountSuspended(DestinationFilters, {
      props: {
        categories,
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 10,
        filteredCount: 10,
        viewMode: 'grid'
      }
    })

    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Category:')
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Showing 10 of 10')
  })

  it('emits update:searchQuery when user types into the search input', async () => {
    const wrapper = await mountSuspended(DestinationFilters, {
      props: {
        categories: ['All'],
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 10,
        filteredCount: 10,
        viewMode: 'grid'
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Carson')

    expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
    expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual(['Carson'])
  })

  it('opens category dropdown and emits update:selectedCategory when clicking a category option', async () => {
    const categories = ['All', 'Heritage & Culture', 'Inland Resorts']
    const wrapper = await mountSuspended(DestinationFilters, {
      props: {
        categories,
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 10,
        filteredCount: 10,
        viewMode: 'grid'
      }
    })

    // Click category dropdown trigger button
    const categoryToggleBtn = wrapper.findAll('button').find(b => b.text().includes('Category:'))
    expect(categoryToggleBtn?.exists()).toBe(true)

    await categoryToggleBtn?.trigger('click')

    // Dropdown is now open
    expect(wrapper.text()).toContain('Heritage & Culture')
    const optionBtn = wrapper.findAll('button').find(b => b.text().trim() === 'Heritage & Culture')
    expect(optionBtn?.exists()).toBe(true)

    await optionBtn?.trigger('click')
    expect(wrapper.emitted('update:selectedCategory')).toBeTruthy()
    expect(wrapper.emitted('update:selectedCategory')?.[0]).toEqual(['Heritage & Culture'])
  })

  it('emits update:viewMode when toggling between Grid and Map Explorer view buttons', async () => {
    const wrapper = await mountSuspended(DestinationFilters, {
      props: {
        categories: ['All'],
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 10,
        filteredCount: 10,
        viewMode: 'grid'
      }
    })

    const mapExplorerBtn = wrapper.findAll('button').find(b => b.text().includes('Map Explorer'))
    expect(mapExplorerBtn?.exists()).toBe(true)

    await mapExplorerBtn?.trigger('click')
    expect(wrapper.emitted('update:viewMode')).toBeTruthy()
    expect(wrapper.emitted('update:viewMode')?.[0]).toEqual(['map'])
  })

  it('displays search suggestions when typing query matching searchSuggestions prop', async () => {
    const wrapper = await mountSuspended(DestinationFilters, {
      props: {
        categories: ['All'],
        selectedCategory: 'All',
        searchQuery: 'Carson',
        totalCount: 1,
        filteredCount: 1,
        viewMode: 'grid',
        searchSuggestions: ['Carson Waterside Mountain Resort', 'Carson Pool']
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.trigger('focus')

    expect(wrapper.text()).toContain('Carson Waterside Mountain Resort')
  })
})
