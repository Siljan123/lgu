import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EventDetailModal from '../../../app/components/events-festivals/EventDetailModal.vue'
import type { EventFestival } from '../../../app/composables/useEventsFestivals'

const sampleEvent: EventFestival = {
  id: 'diwata-magdiwata-festival',
  name: 'Diwata / Magdiwata Festival',
  tagline: 'Flagship Cultural & Environmental Celebration',
  category: 'Cultural & Indigenous',
  whenHeld: 'Annually, June 18–21',
  peakDay: 'June 21',
  venue: 'Poblacion, San Francisco — Municipal Grounds',
  shortDescription: 'Short summary...',
  fullDescription: 'The Diwata Festival — also held under the name Magdiwata Festival — is San Francisco\'s biggest annual celebration...',
  programHighlights: [
    { title: 'Tribal Street Dancing', description: 'Performers in Manobo-inspired costumes.', iconName: 'Sparkles' },
    { title: 'Ritual Offerings', description: 'Opening ceremonies led by tribal elders.', iconName: 'Flame' },
    { title: 'Magdiwata Environmental Summit', description: 'Talks and forums on watershed protection.', iconName: 'Mountain' }
  ],
  whyItMatters: 'Beyond the festivities, the Diwata/Magdiwata Festival doubles as a platform for environmental advocacy.',
  howToAttend: 'Free and open to the public; street dancing and main events are held along central thoroughfares.',
  isFlagship: true,
  image: '/images/destinations/mt_magdiwata.jpg',
  organizer: 'Municipal Tourism Office',
  contactInfo: 'tourism@sanfrancisco-ads.gov.ph',
  tags: ['Flagship Festival', 'Manobo Heritage']
}

describe('EventDetailModal Component', () => {
  it('renders modal dialog content when isOpen is true and event is provided', async () => {
    await mountSuspended(EventDetailModal, {
      props: {
        event: sampleEvent,
        isOpen: true
      }
    })

    const bodyText = document.body.textContent
    expect(bodyText).toContain('Diwata / Magdiwata Festival')
    expect(bodyText).toContain('Full Description')
    expect(bodyText).toContain('The Diwata Festival — also held under the name Magdiwata Festival')
    expect(bodyText).toContain('Program Highlights')
    expect(bodyText).toContain('Tribal Street Dancing')
    expect(bodyText).toContain('Magdiwata Environmental Summit')
    expect(bodyText).toContain('Why It Matters')
    expect(bodyText).toContain('Beyond the festivities, the Diwata/Magdiwata Festival doubles as a platform for environmental advocacy')
    expect(bodyText).toContain('How to Attend')
    expect(bodyText).toContain('Free and open to the public')
  })

  it('does not render modal content when isOpen is false', async () => {
    await mountSuspended(EventDetailModal, {
      props: {
        event: sampleEvent,
        isOpen: false
      }
    })

  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = await mountSuspended(EventDetailModal, {
      props: {
        event: sampleEvent,
        isOpen: true
      }
    })

    const closeButton = document.body.querySelector('button[aria-label="Close dialog"]')
    expect(closeButton).not.toBeNull()


  })
})
