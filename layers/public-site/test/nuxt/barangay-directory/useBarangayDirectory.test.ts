import { describe, expect, it, beforeEach } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { useBarangayDirectory, type BarangayItem } from '../../../app/composables/useBarangayDirectory'

describe('useBarangayDirectory Composable', () => {
  const mockInitialBarangays: BarangayItem[] = [
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
        { id: 'al-1', name: 'Hon. Alegria Captain', title: 'Punong Barangay (Captain)' }
      ]
    },
    {
      id: 'hubang',
      name: 'Hubang',
      classification: 'Urban',
      postalCode: '8501',
      population: 9450,
      censusYear: '2024',
      elevationASL: '55m ASL',
      elevationMeters: 55,
      coordinates: { lat: 8.518, lng: 125.975, display: '8°31\'04.8"N 125°58\'30.0"E' },
      landAreaSqKm: 10.8,
      hallAddress: 'National Highway, Hubang',
      contactPhone: '+63 912 001 0009',
      contactEmail: 'brgy.hubang@sanfranz.gov.ph',
      officials: []
    }
  ]

  beforeEach(() => {
    registerEndpoint('/api/barangay-directory', () => mockInitialBarangays)
    registerEndpoint('/api/barangay-directory/alegria', () => mockInitialBarangays[0])
    registerEndpoint('/api/barangay-directory/hubang', () => mockInitialBarangays[1])

    const { setSearchQuery, setClassification, setDynamicBarangays, selectBarangay } = useBarangayDirectory()
    setDynamicBarangays(mockInitialBarangays)
    setSearchQuery('')
    setClassification('All')
    selectBarangay('alegria')
  })

  it('provides reactive barangays list and computes statistics', () => {
    const {
      barangays,
      totalPopulation,
      classificationCounts,
      selectedBarangay
    } = useBarangayDirectory()

    expect(barangays.value.length).toBe(2)
    expect(totalPopulation.value).toBe(12870)
    expect(classificationCounts.value.all).toBe(2)
    expect(classificationCounts.value.rural).toBe(1)
    expect(classificationCounts.value.urban).toBe(1)
    expect(selectedBarangay.value).toBeDefined()
    expect(selectedBarangay.value?.name).toBe('Alegria')
  })

  it('filters barangays by search query and classification', () => {
    const {
      filteredBarangays,
      setSearchQuery,
      setClassification
    } = useBarangayDirectory()

    setSearchQuery('Alegria')
    expect(filteredBarangays.value.length).toBe(1)
    expect(filteredBarangays.value[0]?.name).toBe('Alegria')

    setSearchQuery('')
    setClassification('Urban')
    expect(filteredBarangays.value.every(b => b.classification === 'Urban')).toBe(true)
    expect(filteredBarangays.value.length).toBe(1)
  })

  it('handles selectBarangay reactively', async () => {
    const {
      selectedBarangayId,
      selectedBarangay,
      selectBarangay
    } = useBarangayDirectory()

    await selectBarangay('hubang')
    expect(selectedBarangayId.value).toBe('hubang')
    expect(selectedBarangay.value?.id).toBe('hubang')
  })

  it('performs CRUD operations in state when endpoints are called', async () => {
    registerEndpoint('/api/barangay-directory', {
      method: 'POST',
      handler: () => ({
        id: 'test-barangay',
        name: 'Test Barangay',
        classification: 'Rural',
        population: 1500,
        postal_code: '8501',
        officials: [],
        landmarks: []
      })
    })

    registerEndpoint('/api/barangay-directory/test-barangay', {
      method: 'PUT',
      handler: () => ({
        id: 'test-barangay',
        name: 'Updated Test Barangay',
        classification: 'Rural',
        population: 1600,
        postal_code: '8501'
      })
    })

    registerEndpoint('/api/barangay-directory/test-barangay', {
      method: 'DELETE',
      handler: () => ({
        success: true
      })
    })

    const {
      barangays,
      createBarangay,
      updateBarangay,
      deleteBarangay
    } = useBarangayDirectory()

    const newBrgy = {
      id: 'test-barangay',
      name: 'Test Barangay',
      classification: 'Rural' as const,
      population: 1500,
      postal_code: '8501',
      officials: [],
      landmarks: []
    }

    const created = await createBarangay(newBrgy)
    expect(created.id).toBe('test-barangay')
    expect(barangays.value.some(b => b.id === 'test-barangay')).toBe(true)

    const updated = await updateBarangay('test-barangay', { name: 'Updated Test Barangay' })
    expect(updated.name).toBe('Updated Test Barangay')

    const deleted = await deleteBarangay('test-barangay')
    expect(deleted).toBe(true)
    expect(barangays.value.some(b => b.id === 'test-barangay')).toBe(false)
  })
})
