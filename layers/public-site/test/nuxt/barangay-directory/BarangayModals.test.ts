import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BarangayAddModal from '../../../app/components/barangay-directory/BarangayAddModal.vue'
import BarangayEditModal from '../../../app/components/barangay-directory/BarangayEditModal.vue'
import type { BarangayItem } from '../../../app/composables/useBarangayDirectory'

describe('BarangayAddModal and BarangayEditModal', () => {
  const sampleBarangay: BarangayItem = {
    id: 'sample-brgy',
    name: 'Sample Barangay',
    classification: 'Rural',
    postalCode: '8501',
    population: 3500,
    censusYear: '2024',
    elevationASL: '75m ASL',
    elevationMeters: 75,
    coordinates: {
      lat: 8.506308,
      lng: 126.011568,
      display: '8°30\'22.7"N 126°0\'41.6"E'
    },
    landAreaSqKm: 14.5,
    hallAddress: 'Purok 1, Sample Barangay',
    contactPhone: '+63 912 001 0001',
    contactEmail: 'brgy.sample@sanfranz.gov.ph',
    mapEmbedUrl: 'https://maps.google.com/?q=8.506308,126.011568',
    description: 'A vibrant agricultural community.',
    officials: []
  }

  it('renders BarangayAddModal with all columns including latitude and longitude and emits submit payload', async () => {
    const wrapper = await mountSuspended(BarangayAddModal, {
      props: {
        open: true
      }
    })

    expect(wrapper.text()).toContain('New Barangay')
    expect(wrapper.text()).toContain('Geographic Coordinates & GPS Location')
    expect(wrapper.text()).toContain('Latitude')
    expect(wrapper.text()).toContain('Longitude')
    expect(wrapper.text()).toContain('DMS Coordinates Display')
    expect(wrapper.text()).toContain('Elevation (Meters)')
    expect(wrapper.text()).toContain('Census Year / Period')

    const nameInput = wrapper.find('input[placeholder="e.g. San Isidro"]')
    await nameInput.setValue('New Barangay')

    const form = wrapper.find('form')
    await form.trigger('submit')

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeDefined()
    expect(emitted![0]![0]).toMatchObject({
      name: 'New Barangay',
      classification: 'Rural',
      coordinates: expect.objectContaining({
        lat: expect.any(Number),
        lng: expect.any(Number),
        display: expect.any(String)
      })
    })
  })

  it('renders BarangayEditModal with populated values for all columns and emits submit payload', async () => {
    const wrapper = await mountSuspended(BarangayEditModal, {
      props: {
        open: true,
        barangay: sampleBarangay
      }
    })

    expect(wrapper.text()).toContain('Edit Barangay Information')
    expect(wrapper.text()).toContain('Brgy. Sample Barangay')
    expect(wrapper.text()).toContain('Geographic Coordinates & GPS Location')

    const form = wrapper.find('form')
    await form.trigger('submit')

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeDefined()
    expect(emitted![0]).toEqual([
      'sample-brgy',
      expect.objectContaining({
        name: 'Sample Barangay',
        classification: 'Rural',
        population: 3500,
        censusYear: '2024',
        elevationMeters: 75,
        elevationASL: '75m ASL',
        landAreaSqKm: 14.5,
        coordinates: {
          lat: 8.506308,
          lng: 126.011568,
          display: '8°30\'22.7"N 126°0\'41.6"E'
        },
        hallAddress: 'Purok 1, Sample Barangay',
        contactPhone: '+63 912 001 0001',
        contactEmail: 'brgy.sample@sanfranz.gov.ph',
        mapEmbedUrl: 'https://maps.google.com/?q=8.506308,126.011568',
        description: 'A vibrant agricultural community.'
      })
    ])
  })
})
