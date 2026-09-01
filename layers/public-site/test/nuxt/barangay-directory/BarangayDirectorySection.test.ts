import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import BarangayDirectorySection from '../../../app/components/barangay-directory/BarangayDirectorySection.vue'
import BarangayDirectoryAuthSection from '../../../app/components/barangay-directory/BarangayDirectoryAuthSection.vue'
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
        { id: 'al-1', name: 'Hon. Rodrigo M. Santos', title: 'Punong Barangay (Captain)', position_category: 'captain' }
      ]
    }
  ]

  beforeEach(() => {
    registerEndpoint('/api/barangay-directory', () => mockBarangays)
    registerEndpoint('/api/barangay-directory/alegria', () => mockBarangays[0])
    registerEndpoint('/api/barangay-directory/terms', () => [
      { id: 'term-1', label: '2023-2026', is_current: true }
    ])
    const { setDynamicBarangays } = useBarangayDirectory()
    setDynamicBarangays(mockBarangays)
  })

  it('renders public directory without CRUD buttons', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySection)

    expect(wrapper.text()).toContain('List of Barangays')

    // Public view must not have CRUD buttons
    expect(wrapper.find('button[title="Add New Barangay"]').exists()).toBe(false)
    expect(wrapper.find('button[title="Edit Official"]').exists()).toBe(false)
    expect(wrapper.find('button[title="Delete Official"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Add Term')
  })

  it('renders auth directory with CRUD buttons allowed', async () => {
    const wrapper = await mountSuspended(BarangayDirectoryAuthSection)

    expect(wrapper.text()).toContain('List of Barangays')

    // Auth section must have CRUD buttons
    expect(wrapper.find('button[title="Add New Barangay"]').exists()).toBe(true)
    expect(wrapper.find('button[title="Edit Official"]').exists()).toBe(true)
    expect(wrapper.find('button[title="Delete Official"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Add Term')
  })
})

