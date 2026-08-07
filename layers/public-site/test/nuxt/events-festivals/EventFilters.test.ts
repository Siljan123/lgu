import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EventFilters from '../../../app/components/events-festivals/EventFilters.vue'

describe('EventFilters Component', () => {
  const categories = ['All', 'Cultural & Indigenous', 'Civic & Historical', 'Trade & Agriculture']

  it('renders search input, counts, and category pills', async () => {
    const wrapper = await mountSuspended(EventFilters, {
      props: {
        categories,
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 5,
        filteredCount: 5
      }
    })

    expect(wrapper.text()).toContain('Showing 5 of 5 events')
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Cultural & Indigenous')
    expect(wrapper.text()).toContain('Civic & Historical')
    expect(wrapper.text()).toContain('Trade & Agriculture')
    
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
  })

  it('emits update:searchQuery on user typing', async () => {
    const wrapper = await mountSuspended(EventFilters, {
      props: {
        categories,
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 5,
        filteredCount: 5
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('Diwata')

    expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
    expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual(['Diwata'])
  })

  it('emits update:selectedCategory when category pill is clicked', async () => {
    const wrapper = await mountSuspended(EventFilters, {
      props: {
        categories,
        selectedCategory: 'All',
        searchQuery: '',
        totalCount: 5,
        filteredCount: 5
      }
    })

    const categoryButton = wrapper.findAll('button').find(b => b.text() === 'Cultural & Indigenous')
    expect(categoryButton).toBeDefined()

    await categoryButton?.trigger('click')
    expect(wrapper.emitted('update:selectedCategory')).toBeTruthy()
    expect(wrapper.emitted('update:selectedCategory')?.[0]).toEqual(['Cultural & Indigenous'])
  })

  it('clears search query when clear button is clicked', async () => {
    const wrapper = await mountSuspended(EventFilters, {
      props: {
        categories,
        selectedCategory: 'All',
        searchQuery: 'Diwata',
        totalCount: 5,
        filteredCount: 1
      }
    })

    const clearButton = wrapper.find('button')
    expect(clearButton.exists()).toBe(true)

    await clearButton.trigger('click')
    expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
    expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual([''])
  })
})
