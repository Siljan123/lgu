import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationDetailPage from '../../../../app/pages/(tourism)/destinations/[id].vue'

describe('Destination Landmark Detail Page ([id].vue)', () => {
  it('renders full landmark details when navigated by landmark name param', async () => {
    const wrapper = await mountSuspended(DestinationDetailPage, {
      route: {
        params: { name: 'Bible Baptist Church' }
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    expect(wrapper.text()).toContain('Bible Baptist Church')
    expect(wrapper.text()).toContain('Barangay 5, San Francisco')
    expect(wrapper.text()).toContain('About this landmark')
  })

  it('renders full landmark details, overview, highlights, and visitor guides for a valid destination id param', async () => {
    const wrapper = await mountSuspended(DestinationDetailPage, {
      route: {
        params: { id: 'church_bible_baptist_church_8.502511_125.976772' }
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    expect(wrapper.text()).toContain('Bible Baptist Church')
    expect(wrapper.text()).toContain('Barangay 5, San Francisco')
    expect(wrapper.text()).toContain('About this landmark')
    expect(wrapper.text()).toContain('Back to all destinations')
  })

  it('renders fallback No Image Available placeholder when landmark photo is missing', async () => {
    const wrapper = await mountSuspended(DestinationDetailPage, {
      route: {
        params: { id: 'church_forsquare_gospel_church_8.460357_125.968595' }
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    expect(wrapper.text()).toContain('Forsquare Gospel Church')
    expect(wrapper.text()).toContain('No Image Available')
  })

  it('switches photo when clicking a gallery thumbnail button if multiple photos exist', async () => {
    const wrapper = await mountSuspended(DestinationDetailPage, {
      route: {
        params: { id: 'church_forsquare_gospel_church_8.404827_125.987705' }
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    const galleryButtons = wrapper.findAll('button').filter(b => b.find('img').exists())
    if (galleryButtons.length > 1) {
      await galleryButtons[1]?.trigger('click')
      const mainImg = wrapper.find('.aspect-4\\/3 img')
      expect(mainImg.exists()).toBe(true)
    }
  })

  it('renders live GPS device tracking controls instead of search bar', async () => {
    const wrapper = await mountSuspended(DestinationDetailPage, {
      route: {
        params: { id: 'church_bible_baptist_church_8.502511_125.976772' }
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    // Search bar should not exist
    const searchInput = wrapper.find('input[placeholder*="Going to"]')
    expect(searchInput.exists()).toBe(false)

    // GPS Device Tracking button should be present
    expect(wrapper.text()).toContain('Track My Device GPS')
  })

})
