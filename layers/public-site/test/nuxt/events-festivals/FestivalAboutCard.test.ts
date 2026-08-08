import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FestivalAboutCard from '../../../app/components/events-festivals/FestivalAboutCard.vue'
import type { Festival, EventItem } from '../../../app/composables/useEventsFestivals'

const sampleFestival: Festival = {
  id: 'diwata-magdiwata-festival',
  slug: 'diwata-magdiwata-festival',
  name: 'Diwata / Magdiwata Festival',
  tagline: 'Flagship Cultural & Environmental Celebration of San Francisco',
  category: 'Cultural & Indigenous',
  whenHeld: 'Annually, June 18–21',
  peakDay: 'June 21',
  shortDescription: "A four-day cultural and environmental festival honoring Mt. Magdiwata.",
  fullDescription: "The Diwata Festival is San Francisco's biggest annual celebration.",
  highlights: [
    { title: 'Tribal Street Dancing', description: 'Performers in Manobo-inspired costumes.' }
  ],
  whyItMatters: 'Watershed conservation.',
  howToAttend: 'Free and open to the public.',
  isFlagship: true,
  image: '/images/destinations/mt_magdiwata.jpg',
  organizer: 'Municipal Tourism Office',
  tags: ['Flagship Festival']
}

const sampleEvents: EventItem[] = [
  {
    id: 'diwata-street-dancing-competition',
    title: 'Manobo Tribal Street Dancing Competition',
    shortDescription: 'Choreographed street dance performances in vibrant Manobo costumes.',
    category: 'Cultural & Indigenous',
    startDate: 'June 21, 2026',
    location: 'Main Highway & Municipal Ground Amphitheater',
    relatedFestivalSlug: 'diwata-magdiwata-festival'
  }
]

describe('FestivalAboutCard Component', () => {
  it('renders festival name, tagline, category, highlights, and dedicated page link', async () => {
    const wrapper = await mountSuspended(FestivalAboutCard, {
      props: {
        festival: sampleFestival,
        events: sampleEvents
      }
    })

    expect(wrapper.text()).toContain('Diwata / Magdiwata Festival')
    expect(wrapper.text()).toContain('Flagship Cultural & Environmental Celebration of San Francisco')
    expect(wrapper.text()).toContain('Tribal Street Dancing')
    expect(wrapper.text()).toContain('Explore Dedicated Festival Page')
  })
})
