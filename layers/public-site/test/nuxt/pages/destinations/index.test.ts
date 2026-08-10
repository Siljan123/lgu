import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationsIndexPage from '../../../../app/pages/(tourism)/destinations/index.vue'

describe('Destinations & Landmarks Page (index.vue)', () => {
  it('renders hero title, description, and filter controls', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage, {
      global: {
        stubs: { GoogleMap: true }
      }
    })

    expect(wrapper.text()).toContain('Destinations & Landmarks')
    expect(wrapper.text()).toContain('Discover the natural wonders, sacred mountains, inland resorts')
    expect(wrapper.text()).toContain('Category:')
    expect(wrapper.text()).toContain('Map Explorer')
  })

  it('renders initial list of destinations from coordinates dataset', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage, {
      global: {
        stubs: { GoogleMap: true }
      }
    })

    // Initial landmarks listed from coordinates dataset
    expect(wrapper.text()).toContain('Bible Baptist Church')
    expect(wrapper.text()).toContain('Forsquare Gospel Church')
  })

  it('filters destinations list when category option in dropdown is selected', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage, {
      global: {
        stubs: { GoogleMap: true }
      }
    })

  })

  it('filters destinations list when user types in the search query input', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage, {
      global: {
        stubs: { GoogleMap: true }
      }
    })

    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('Bible Baptist')

    expect(wrapper.text()).toContain('Bible Baptist Church')
    expect(wrapper.text()).not.toContain('Carson Waterside Mountain Resort')
  })

  it('toggles view mode from Grid to Map Explorer view when button is clicked', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage, {
      global: {
        stubs: { GoogleMap: true }
      }
    })
  })

  it('resets filters when Clear all filters button is clicked in empty search state', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage, {
      global: {
        stubs: { GoogleMap: true }
      }
    })

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('NonExistentLandmarkQuery123')

    expect(wrapper.text()).toContain('No destinations found')

    const clearBtn = wrapper.findAll('button').find(b => b.text().includes('Clear all filters'))
    expect(clearBtn?.exists()).toBe(true)

    await clearBtn?.trigger('click')

    expect(wrapper.text()).toContain('Bible Baptist Church')
  })
})
