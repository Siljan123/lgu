import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationDetailModal from '../../../app/components/destinations/DestinationDetailModal.vue'
import type { Destination } from '../../../app/composables/useDestinations'

const sampleDestination: Destination = {
  id: 'mt-magdiwata',
  name: 'Mt. Magdiwata',
  category: 'Parks & Viewpoints',
  barangay: 'San Isidro',
  shortDescription: 'Sacred mountain peak and rainforest sanctuary.',
  fullDescription: 'Mt. Magdiwata stands at 633 meters above sea level in Barangay San Isidro...',
  highlights: ['Primary rainforest trail', 'Watershed protection area', 'Rich biodiversity'],
  howToGetThere: 'Accessible via Brgy. San Isidro jump-off point.',
  bestTimeToVisit: 'Early morning trek',
  accessNotes: 'Clearance from Tourism Office required.',
  image: '/images/destinations/mt_magdiwata.jpg',
  photoUrls: [
    '/images/destinations/mt_magdiwata_1.jpg',
    '/images/destinations/mt_magdiwata_2.jpg'
  ],
  opening: '06:00 AM',
  closing: '05:00 PM',
  coordinates: { lat: 8.5123, lng: 125.9812 }
}

const sampleNoImageDestination: Destination = {
  id: 'local-shrine',
  name: 'San Francisco Cultural Shrine',
  category: 'Heritage & Culture',
  barangay: 'Poblacion',
  shortDescription: 'Historical cultural shrine',
  fullDescription: 'Historical cultural shrine located in San Francisco Poblacion',
  highlights: ['Local heritage site'],
  howToGetThere: 'Town proper',
  bestTimeToVisit: 'Daytime',
  accessNotes: 'Open to public',
  image: ''
}

describe('DestinationDetailModal Component', () => {
  it('does not render modal contents when isOpen is false', async () => {
    document.body.innerHTML = ''
    await mountSuspended(DestinationDetailModal, {
      props: {
        destination: sampleDestination,
        isOpen: false
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    expect(document.body.textContent).not.toContain('Mt. Magdiwata')
  })

  it('renders modal content, overview, highlights, and visitor info in body when isOpen is true', async () => {
    document.body.innerHTML = ''
    await mountSuspended(DestinationDetailModal, {
      props: {
        destination: sampleDestination,
        isOpen: true
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    const text = document.body.textContent
    expect(text).toContain('Mt. Magdiwata')
    expect(text).toContain('Parks & Viewpoints')
    expect(text).toContain('Brgy. San Isidro')
    expect(text).toContain('Overview & Heritage')
    expect(text).toContain('Primary rainforest trail')
    expect(text).toContain('How to get there')
    expect(text).toContain('Best time to visit')
    expect(text).toContain('Access & Guidelines')
  })

  it('switches photo when thumbnail in gallery is clicked inside teleported modal', async () => {
    document.body.innerHTML = ''
    await mountSuspended(DestinationDetailModal, {
      props: {
        destination: sampleDestination,
        isOpen: true
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    const galleryButtons = Array.from(document.body.querySelectorAll('button')).filter(b => b.querySelector('img'))
    expect(galleryButtons.length).toBe(2)

    galleryButtons[1]?.click()
    await new Promise(r => setTimeout(r, 50))
    const heroImg = document.body.querySelector('.aspect-21\\/9 img') as HTMLImageElement | null
    expect(heroImg?.src).toContain('mt_magdiwata_2.jpg')
  })

  it('renders fallback No Image Available placeholder in modal when image fails to load', async () => {
    document.body.innerHTML = ''
    await mountSuspended(DestinationDetailModal, {
      props: {
        destination: sampleNoImageDestination,
        isOpen: true
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    expect(document.body.textContent).toContain('No Image Available')
  })

  it('emits close event when Close Window button is clicked', async () => {
    document.body.innerHTML = ''
    const wrapper = await mountSuspended(DestinationDetailModal, {
      props: {
        destination: sampleDestination,
        isOpen: true
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    const closeBtn = Array.from(document.body.querySelectorAll('button')).find(b => b.textContent?.includes('Close Window'))
    expect(closeBtn).toBeDefined()

    closeBtn?.click()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when top close icon button is clicked', async () => {
    document.body.innerHTML = ''
    const wrapper = await mountSuspended(DestinationDetailModal, {
      props: {
        destination: sampleDestination,
        isOpen: true
      },
      global: {
        stubs: { GoogleMap: true }
      }
    })

    const iconCloseBtn = document.body.querySelector('button[aria-label="Close modal"]') as HTMLButtonElement | null
    expect(iconCloseBtn).not.toBeNull()

    iconCloseBtn?.click()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
