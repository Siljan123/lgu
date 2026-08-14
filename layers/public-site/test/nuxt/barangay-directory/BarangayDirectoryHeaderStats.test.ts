import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BarangayDirectoryHeaderStats from '../../../app/components/barangay-directory/BarangayDirectoryHeaderStats.vue'
import type { BarangayItem } from '../../../app/composables/useBarangayDirectory'

describe('BarangayDirectoryHeaderStats Component', () => {
  const mockBarangay: BarangayItem = {
    id: 'alegria',
    name: 'Alegria',
    classification: 'Rural',
    postalCode: '8500',
    population: 3420,
    censusYear: '2025 Official Census',
    elevationASL: '65m ASL',
    elevationMeters: 65,
    coordinates: { lat: 8.5124, lng: 125.9512, display: '8.5124° N, 125.9512° E' },
    landAreaSqKm: 14.2,
    hallAddress: 'Purok 2, Brgy. Alegria',
    contactPhone: '+63 (085) 839-1001',
    contactEmail: 'brgy.alegria@sfads.gov.ph',
    description: 'Known for rich agricultural valleys.',
    officials: []
  }

  it('renders barangay name, description, postal code, and contact information correctly', async () => {
    const wrapper = await mountSuspended(BarangayDirectoryHeaderStats, {
      props: {
        barangay: mockBarangay
      }
    })

    expect(wrapper.text()).toContain('Alegria')
    expect(wrapper.text()).toContain('Known for rich agricultural valleys.')
    expect(wrapper.text()).toContain('Postal Code: 8500')
    expect(wrapper.text()).toContain('+63 (085) 839-1001')
    expect(wrapper.text()).toContain('brgy.alegria@sfads.gov.ph')
  })
})
