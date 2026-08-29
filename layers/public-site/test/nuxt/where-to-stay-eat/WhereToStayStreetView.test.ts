import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WhereToStayStreetView from '../../../app/components/where-to-stay-eat/WhereToStayStreetView.vue'
import type { Establishment } from '../../../app/composables/useWhereToStayEat'

const sampleEstablishment: Establishment = {
  id: 'st-1',
  name: 'Alegria Cafe',
  category: 'Coffee Shop',
  address: 'Barangay Alegria, San Francisco, Agusan del Sur',
  contactNo: '09151234567',
  barangay: 'Barangay Alegria',
  coordinates: { lat: 8.5056, lng: 125.9945 }
}

describe('WhereToStayStreetView Component', () => {
  it('renders empty fallback prompt when no location is provided', async () => {
    const wrapper = await mountSuspended(WhereToStayStreetView, {
      props: {
        establishment: null
      }
    })

    expect(wrapper.text()).toContain('Select an Establishment')
    expect(wrapper.text()).toContain('360° Street View')
  })

  it('renders establishment name, address, category, and phone number when establishment is passed', async () => {
    const wrapper = await mountSuspended(WhereToStayStreetView, {
      props: {
        establishment: sampleEstablishment
      }
    })

    expect(wrapper.text()).toContain('Alegria Cafe')
    expect(wrapper.text()).toContain('Coffee Shop')
    expect(wrapper.text()).toContain('Barangay Alegria, San Francisco, Agusan del Sur')
    expect(wrapper.text()).toContain('09151234567')
    expect(wrapper.text()).toContain('Open in Google Maps')
  })

  it('renders distance badge and Navigate from My Location CTA when userLocation is set', async () => {
    const wrapper = await mountSuspended(WhereToStayStreetView, {
      props: {
        establishment: sampleEstablishment,
        userLocation: { lat: 8.5042, lng: 125.9786 },
        routeDistance: '2.5 km',
        routeDuration: '5 mins'
      }
    })

    expect(wrapper.text()).toContain('2.5 km from your location')
    expect(wrapper.text()).toContain('(5 mins)')
    expect(wrapper.text()).toContain('Navigate from My Location')
    const link = wrapper.find('a')
    expect(link.attributes('href')).toContain('google.com/maps/dir/')
    expect(link.attributes('href')).toContain('origin=8.5042,125.9786')
    expect(link.attributes('href')).toContain('destination=8.5056,125.9945')
  })
})
