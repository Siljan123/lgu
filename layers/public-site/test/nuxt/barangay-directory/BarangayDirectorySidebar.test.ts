import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import BarangayDirectorySidebar from '../../../app/components/barangay-directory/BarangayDirectorySidebar.vue'
import { useBarangayDirectory, type BarangayItem } from '../../../app/composables/useBarangayDirectory'

describe('BarangayDirectorySidebar Component', () => {
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
      officials: []
    },
    {
      id: 'bayugan-2',
      name: 'Bayugan 2',
      classification: 'Rural',
      postalCode: '8501',
      population: 5120,
      censusYear: '2024',
      elevationASL: '62m ASL',
      elevationMeters: 62,
      coordinates: { lat: 8.5412, lng: 125.9715, display: '8°32\'28.3"N 125°58\'17.4"E' },
      landAreaSqKm: 18.2,
      hallAddress: 'Purok Central, Bayugan 2',
      contactPhone: '+63 912 001 0002',
      contactEmail: 'brgy.bayugan2@sanfranz.gov.ph',
      officials: []
    }
  ]

  beforeEach(() => {
    registerEndpoint('/api/barangay-directory', () => mockBarangays)
    registerEndpoint('/api/barangay-directory/alegria', () => mockBarangays[0])
    registerEndpoint('/api/barangay-directory/bayugan-2', () => mockBarangays[1])

    const { setSearchQuery, setDynamicBarangays } = useBarangayDirectory()
    setDynamicBarangays(mockBarangays)
    setSearchQuery('')
  })

  it('renders barangay directory list and allows searching', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySidebar)

    expect(wrapper.text()).toContain('List of Barangays')
    expect(wrapper.text()).toContain('Alegria')
    expect(wrapper.text()).toContain('Bayugan 2')

    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('Alegria')
    expect(wrapper.text()).toContain('Alegria')
    expect(wrapper.text()).not.toContain('Bayugan 2')

    const clearButton = wrapper.find('button[aria-label="Clear search"]')
    expect(clearButton.exists()).toBe(true)
    await clearButton.trigger('click')

    expect(wrapper.text()).toContain('Bayugan 2')
  })

  it('shows no barangays found message when search query has no match', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySidebar)

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('NonExistentBarangay12345')

    expect(wrapper.text()).toContain('No barangays found matching "NonExistentBarangay12345"')
  })

  it('handles barangay selection when clicked', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySidebar)

    const barangayButtons = wrapper.findAll('button')
    const alegriaButton = barangayButtons.find(b => b.text().includes('Alegria'))
    expect(alegriaButton).toBeDefined()

    await alegriaButton?.trigger('click')

    const { selectedBarangayId } = useBarangayDirectory()
    expect(selectedBarangayId.value).toBe('alegria')
  })
})
