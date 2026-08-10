import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationRoutePlanner from '../../../app/components/destinations/DestinationRoutePlanner.vue'
import type { LandmarkOption } from '../../../app/composables/useDestinations'

const sampleLandmarks: LandmarkOption[] = [
  {
    id: 'atms_1st_valley_bank_8.501489_125.978219',
    name: '1st Valley Bank',
    category: 'ATMS',
    barangay: 'Barangay 5',
    coordinates: { lat: 8.501489, lng: 125.978219 },
    type: 'bank'
  },
  {
    id: 'integrated_bus_terminal',
    name: 'Integrated Bus Terminal',
    category: 'BUS_TERMINAL',
    barangay: 'Barangay 3',
    coordinates: { lat: 8.508000, lng: 125.975000 },
    type: 'terminal'
  },
  {
    id: 'carson-resort',
    name: 'Carson Waterside Mountain Resort',
    category: 'INDLAND_RESORTS',
    barangay: 'Alegria',
    coordinates: { lat: 8.4892, lng: 125.9842 },
    type: 'resort'
  }
]

describe('DestinationRoutePlanner Component', () => {

  it('emits update:origin when origin landmark is selected', async () => {
    const wrapper = await mountSuspended(DestinationRoutePlanner, {
      props: {
        landmarks: sampleLandmarks
      }
    })

    const originInput = wrapper.findAll('input')[0]
    expect(originInput.exists()).toBe(true)

    await originInput.trigger('focus')
    const dropdownItems = wrapper.findAll('button').filter(b => b.text().includes('1st Valley Bank'))
    expect(dropdownItems.length).toBeGreaterThan(0)

    await dropdownItems[0].trigger('mousedown')
    expect(wrapper.emitted('update:origin')).toBeTruthy()
    expect(wrapper.emitted('update:origin')?.[0]).toEqual([sampleLandmarks[0]])
  })

  it('emits swap when swap button is clicked', async () => {
    const wrapper = await mountSuspended(DestinationRoutePlanner, {
      props: {
        landmarks: sampleLandmarks,
        originLandmark: sampleLandmarks[0],
        destinationLandmark: sampleLandmarks[1]
      }
    })

    const swapBtn = wrapper.find('button[title="Swap start & destination"]')
    expect(swapBtn.exists()).toBe(true)

    await swapBtn.trigger('click')
    expect(wrapper.emitted('swap')).toBeTruthy()
  })

  it('renders route summary banner when routeResult prop is provided', async () => {
    const wrapper = await mountSuspended(DestinationRoutePlanner, {
      props: {
        landmarks: sampleLandmarks,
        originLandmark: sampleLandmarks[0],
        destinationLandmark: sampleLandmarks[1],
        routeResult: {
          distanceText: '2.4 km',
          durationText: '~5 mins',
          distanceMeters: 2400,
          durationSeconds: 300,
          steps: [
            { instructions: 'Head north on Santol Ave', distance: '500 m', duration: '1 min' }
          ],
          path: [sampleLandmarks[0]!.coordinates, sampleLandmarks[1]!.coordinates]
        }
      }
    })

    expect(wrapper.text()).toContain('Line path active:')
    expect(wrapper.text()).toContain('1st Valley Bank')
    expect(wrapper.text()).toContain('Integrated Bus Terminal')
  })
})
