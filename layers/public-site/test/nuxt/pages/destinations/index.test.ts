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

    // Click Category dropdown trigger button
    const categoryToggleBtn = wrapper.findAll('button').find(b => b.text().includes('Category:'))
    expect(categoryToggleBtn?.exists()).toBe(true)

    await categoryToggleBtn?.trigger('click')

    // Click 'Inland Resorts' option inside open dropdown
    const resortOptionBtn = wrapper.findAll('button').find(b => b.text().trim() === 'Inland Resorts')
    expect(resortOptionBtn?.exists()).toBe(true)

    await resortOptionBtn?.trigger('click')

    expect(wrapper.text()).toContain('Carson Waterside Mountain Resort')
    expect(wrapper.text()).not.toContain('Bible Baptist Church')
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

    const mapExplorerBtn = wrapper.findAll('button').find(b => b.text().includes('Map Explorer'))
    expect(mapExplorerBtn?.exists()).toBe(true)

    await mapExplorerBtn?.trigger('click')

    expect(wrapper.text()).toContain('Landmark Map View')
    expect(wrapper.text()).toContain('Filtered Landmarks')
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
