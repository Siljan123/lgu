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

  it('renders geographic coordinates, elevation, land area, and census year', async () => {
    const wrapper = await mountSuspended(BarangayMiniMapCard, {
      props: {
        barangay: mockBarangay
      }
    })

    expect(wrapper.text()).toContain('Geographic Location & Mini Map')
    expect(wrapper.text()).toContain('Alegria Coordinates & Boundary')
    expect(wrapper.text()).toContain('8.5124° N, 125.9512° E')
    expect(wrapper.text()).toContain('65m ASL')
    expect(wrapper.text()).toContain('14.2 sq km')
    expect(wrapper.text()).toContain('2025 Official Census')
  })

  it('generates correct external Google Maps and OpenStreetMap URLs', async () => {
    const wrapper = await mountSuspended(BarangayMiniMapCard, {
      props: {
        barangay: mockBarangay
      }
    })

    const googleLink = wrapper.find('a[href*="google.com/maps"]')
    expect(googleLink.exists()).toBe(true)
    expect(googleLink.attributes('href')).toContain('query=8.5124,125.9512')

    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toContain('openstreetmap.org/export/embed.html')
  })

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

    const copyBtn = wrapper.find('button[aria-label="Copy coordinates"]')
    expect(copyBtn.exists()).toBe(true)

    await copyBtn.trigger('click')
    expect(writeTextMock).toHaveBeenCalledWith('8.5124° N, 125.9512° E')
  })
})
