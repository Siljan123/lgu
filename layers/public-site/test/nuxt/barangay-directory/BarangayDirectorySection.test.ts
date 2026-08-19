import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import BarangayDirectorySection from '../../../app/components/barangay-directory/BarangayDirectorySection.vue'
import { useBarangayDirectory, type BarangayItem } from '../../../app/composables/useBarangayDirectory'

describe('BarangayDirectorySection Component', () => {
  const mockBarangays: BarangayItem[] = [
    {
      id: 'alegria',
      name: 'Alegria',
      classification: 'Rural',
      postalCode: '8501',
      population: 3420,
      censusYear: '2024',
      elevationASL: '75m ASL',
      elevationMeters: 75,
      coordinates: { lat: 8.5321, lng: 125.9621, display: '8°31\'55.6"N 125°57\'43.6"E' },
      landAreaSqKm: 14.5,
      hallAddress: 'Purok 1, Alegria',
      contactPhone: '+63 912 001 0001',
      contactEmail: 'brgy.alegria@sanfranz.gov.ph',
      officials: [
        { id: 'al-1', name: 'Hon. Rodrigo M. Santos', title: 'Punong Barangay (Captain)' }
      ]
    }
  ]

  beforeEach(() => {
    registerEndpoint('/api/barangay-directory', () => mockBarangays)
    registerEndpoint('/api/barangay-directory/alegria', () => mockBarangays[0])
    const { setDynamicBarangays } = useBarangayDirectory()
    setDynamicBarangays(mockBarangays)
  })

  it('renders sidebar and main details section with child components when a barangay is selected', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySection)

    expect(wrapper.text()).toContain('List of Barangays')
    expect(wrapper.text()).toContain('Barangay Officials')
  })
})
