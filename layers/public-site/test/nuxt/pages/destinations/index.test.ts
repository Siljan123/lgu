import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationsIndexPage from '../../../../app/pages/(tourism)/destinations/index.vue'

describe('Destinations & Landmarks Page', () => {
  it('renders page hero header, title, and advisory section', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage)

    expect(wrapper.text()).toContain('Destinations & Landmarks')
    expect(wrapper.text()).toContain('Discover the natural wonders, sacred mountains, ancient landmarks')
    expect(wrapper.text()).toContain('Planning a Visit to San Francisco, Agusan del Sur?')
    expect(wrapper.text()).toContain('Municipal Tourism Office')
  })

  it('renders initial list of destinations and category filter pills', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage)

    // Landmarks listed
    expect(wrapper.text()).toContain('Toog Tree of Alegria')
    expect(wrapper.text()).toContain('Mt. Magdiwata')
    expect(wrapper.text()).toContain('Agusan Marsh Wildlife Sanctuary — San Francisco Gateway')
    expect(wrapper.text()).toContain('Irosin Stone Crafts')

    // Filter categories present
    expect(wrapper.text()).toContain('Natural Attractions')
    expect(wrapper.text()).toContain('Heritage & Culture')
    expect(wrapper.text()).toContain('Adventure & Outdoor')
    expect(wrapper.text()).toContain('Wildlife & Conservation')
  })

  it('filters destinations when category pill is clicked', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage)

    const adventureButton = wrapper.findAll('button').find(b => b.text().trim() === 'Adventure & Outdoor')
    expect(adventureButton).toBeDefined()

    await adventureButton?.trigger('click')

    expect(wrapper.text()).toContain('Mt. Magdiwata')
    expect(wrapper.text()).not.toContain('Irosin Stone Crafts')
  })

  it('filters destinations when typing into search input', async () => {
    const wrapper = await mountSuspended(DestinationsIndexPage)

    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('rosewood')

    expect(wrapper.text()).toContain('Toog Tree of Alegria')
    expect(wrapper.text()).not.toContain('Mt. Magdiwata')
  })
})
