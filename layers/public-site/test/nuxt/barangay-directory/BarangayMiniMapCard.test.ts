import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BarangayMiniMapCard from '../../../app/components/barangay-directory/BarangayMiniMapCard.vue'
import type { BarangayItem } from '../../../app/composables/useBarangayDirectory'

describe('BarangayMiniMapCard Component', () => {
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

  it('copies coordinates to clipboard when copy button is clicked', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true
    })

    const wrapper = await mountSuspended(BarangayMiniMapCard, {
      props: {
        barangay: mockBarangay
      }
    })

  })
})
