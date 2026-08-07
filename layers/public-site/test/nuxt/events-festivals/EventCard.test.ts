import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EventCard from '../../../app/components/events-festivals/EventCard.vue'
import type { EventFestival } from '../../../app/composables/useEventsFestivals'

const sampleEvent: EventFestival = {
  id: 'diwata-magdiwata-festival',
  name: 'Diwata / Magdiwata Festival',
  tagline: 'Flagship Cultural & Environmental Celebration',
  category: 'Cultural & Indigenous',
  whenHeld: 'Annually, June 18–21',
  peakDay: 'June 21',
  venue: 'Poblacion, San Francisco — Municipal Grounds',
  shortDescription: 'A four-day cultural and environmental festival honoring Mt. Magdiwata.',
  fullDescription: 'The Diwata Festival is San Francisco\'s biggest annual celebration...',
  programHighlights: [
    { title: 'Tribal Street Dancing', description: 'Performers in Manobo-inspired costumes.', iconName: 'Sparkles' },
    { title: 'Ritual Offerings', description: 'Opening ceremonies led by tribal elders.', iconName: 'Flame' }
  ],
  whyItMatters: 'Beyond the festivities, the Diwata Festival doubles as environmental advocacy.',
  howToAttend: 'Free and open to the public.',
  isFlagship: true,
  image: '/images/destinations/mt_magdiwata.jpg',
  organizer: 'Municipal Tourism Office',
  tags: ['Flagship Festival', 'Manobo Heritage']
}

describe('EventCard Component', () => {
  it('renders event title, flagship badge, category, schedule, and short description', async () => {
    const wrapper = await mountSuspended(EventCard, {
      props: {
        event: sampleEvent
      }
    })

    expect(wrapper.text()).toContain('Diwata / Magdiwata Festival')
    expect(wrapper.text()).toContain('Cultural & Indigenous')
    expect(wrapper.text()).toContain('June 18–21')
    expect(wrapper.text()).toContain('A four-day cultural and environmental festival honoring Mt. Magdiwata.')
    expect(wrapper.text()).toContain('Tribal Street Dancing')
    expect(wrapper.text()).toContain('Ritual Offerings')
  })

  it('emits select event when View Details button is clicked', async () => {
    const wrapper = await mountSuspended(EventCard, {
      props: {
        event: sampleEvent
      }
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([sampleEvent])
  })
})
