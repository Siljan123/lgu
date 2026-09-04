import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationGrid from '../../../app/components/destinations/DestinationGrid.vue'
import type { Destination } from '../../../app/composables/useDestinations'

const sampleDestinations: Destination[] = [
  {
    id: 'toog-tree-alegria',
    name: 'Toog Tree of Alegria',
    category: 'Cultural & Historical Landmarks',
    barangay: 'Alegria',
    shortDescription: 'Historic 300-year-old rosewood tree.',
    fullDescription: 'Rising over 50 meters in Alegria...',
    highlights: ['Oldest tree in region'],
    howToGetThere: 'National Highway',
    bestTimeToVisit: 'Daytime',
    accessNotes: 'Free entry',
    image: '/images/destinations/toog_tree.jpg',
    coordinates: { lat: 8.4812, lng: 125.9812 }
  },
  {
    id: 'carson-resort',
    name: 'Carson Waterside Mountain Resort',
    category: 'Day-Tour Resorts / Swimming Spots',
    barangay: 'Alegria',
    shortDescription: 'Inland resort with swimming pools and mountain views.',
    fullDescription: 'Popular family resort located in Alegria...',
    highlights: ['Spring-fed pools', 'Mountain views'],
    howToGetThere: 'Alegria road',
    bestTimeToVisit: 'Weekends',
    accessNotes: 'Entrance fee applies',
    image: '/images/destinations/carson.jpg',
    coordinates: { lat: 8.4892, lng: 125.9842 }
  }
]

describe('DestinationGrid Component', () => {
  it('renders list of DestinationCards in grid view mode', async () => {
    const wrapper = await mountSuspended(DestinationGrid, {
      props: {
        destinations: sampleDestinations,
        viewMode: 'grid',
        currentPage: 1,
        totalPages: 2
      }
    })

    expect(wrapper.text()).toContain('Toog Tree of Alegria')
    expect(wrapper.text()).toContain('Carson Waterside Mountain Resort')
    expect(wrapper.text()).toContain('Page 1 of 2')
  })

  it('emits page-change when pagination buttons are clicked in grid mode', async () => {
    const wrapper = await mountSuspended(DestinationGrid, {
      props: {
        destinations: sampleDestinations,
        viewMode: 'grid',
        currentPage: 1,
        totalPages: 3
      }
    })

    const nextBtn = wrapper.findAll('button').find(b => b.text().includes('Next'))
    expect(nextBtn?.exists()).toBe(true)

    await nextBtn?.trigger('click')
    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')?.[0]).toEqual([2])
  })

  it('renders empty state and emits reset-filters when destinations list is empty in grid mode', async () => {
    const wrapper = await mountSuspended(DestinationGrid, {
      props: {
        destinations: [],
        viewMode: 'grid'
      }
    })

    expect(wrapper.text()).toContain('No destinations found')
    
    const clearBtn = wrapper.find('button')
    await clearBtn.trigger('click')

    expect(wrapper.emitted('reset-filters')).toBeTruthy()
  })

  it('renders map container and sidebar list in map view mode', async () => {
    const wrapper = await mountSuspended(DestinationGrid, {
      props: {
        destinations: sampleDestinations,
        viewMode: 'map',
        mapMarkers: sampleDestinations.map(d => ({
          position: d.coordinates!,
          title: d.name
        }))
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    expect(wrapper.text()).toContain('Landmark Map View')
    expect(wrapper.text()).toContain('Filtered Landmarks (2)')
    expect(wrapper.text()).toContain('Toog Tree of Alegria')
    expect(wrapper.text()).toContain('Carson Waterside Mountain Resort')
  })

  it('emits select when View details is clicked in map view sidebar', async () => {
    const wrapper = await mountSuspended(DestinationGrid, {
      props: {
        destinations: sampleDestinations,
        viewMode: 'map'
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    const viewDetailsBtns = wrapper.findAll('button').filter(b => b.text().includes('View details'))
    expect(viewDetailsBtns.length).toBeGreaterThan(0)

    await viewDetailsBtns[0]?.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([sampleDestinations[0]])
  })

  it('does not render landmark markers initially and places marker when landmark is clicked in sidebar', async () => {
    const wrapper = await mountSuspended(DestinationGrid, {
      props: {
        destinations: sampleDestinations,
        viewMode: 'map'
      },
      global: {
        stubs: {
          GoogleMap: {
            name: 'GoogleMap',
            props: ['markers', 'center', 'zoom'],
            template: '<div data-testid="google-map" :data-markers-count="markers?.length || 0"></div>'
          }
        }
      }
    })

    const mapEl = wrapper.find('[data-testid="google-map"]')
    expect(mapEl.attributes('data-markers-count')).toBe('0')
    expect(wrapper.text()).toContain('Click a landmark in the list to place its marker')

    // Click the first landmark card in sidebar
    const firstCard = wrapper.findAll('.cursor-pointer').find(el => el.text().includes('Toog Tree of Alegria'))
    await firstCard?.trigger('click')

    expect(mapEl.attributes('data-markers-count')).toBe('1')
    expect(wrapper.text()).toContain('Selected: Toog Tree of Alegria')
  })
})
