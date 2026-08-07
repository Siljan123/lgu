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
        establishment: null,
        customLocation: null
      }
    })

    expect(wrapper.text()).toContain('Select or Click Map Location')
    expect(wrapper.text()).toContain('Street View & Location View')
  })

  it('renders establishment name, address, category, and phone number when establishment is passed', async () => {
    const wrapper = await mountSuspended(WhereToStayStreetView, {
      props: {
        establishment: sampleEstablishment,
        customLocation: null
      }
    })

    expect(wrapper.text()).toContain('Alegria Cafe')
    expect(wrapper.text()).toContain('Coffee Shop')
    expect(wrapper.text()).toContain('Barangay Alegria, San Francisco, Agusan del Sur')
    expect(wrapper.text()).toContain('09151234567')
    expect(wrapper.text()).toContain('Open in Google Maps')
  })

  it('renders custom location badge when customLocation is set', async () => {
    const wrapper = await mountSuspended(WhereToStayStreetView, {
      props: {
        establishment: null,
        customLocation: { lat: 8.5042, lng: 125.9786 }
      }
    })

    expect(wrapper.text()).toContain('Custom Map Location')
    expect(wrapper.text()).toContain('Marked Map Location')
  })
})
