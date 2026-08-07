import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EventGrid from '../../../app/components/events-festivals/EventGrid.vue'
import type { EventFestival } from '../../../app/composables/useEventsFestivals'

const sampleEvent: EventFestival = {
  id: 'diwata-magdiwata-festival',
  name: 'Diwata / Magdiwata Festival',
  tagline: 'Flagship Cultural & Environmental Celebration',
  category: 'Cultural & Indigenous',
  whenHeld: 'Annually, June 18–21',
  venue: 'Poblacion, San Francisco',
  shortDescription: 'A four-day cultural festival.',
  fullDescription: 'The Diwata Festival is San Francisco\'s flagship festival...',
  programHighlights: [{ title: 'Tribal Street Dancing', description: 'Performers in costume.' }],
  whyItMatters: 'Environmental advocacy.',
  howToAttend: 'Free and open.',
  isFlagship: true,
  image: '/images/destinations/mt_magdiwata.jpg',
  organizer: 'Tourism Office',
  tags: ['Flagship']
}

describe('EventGrid Component', () => {
  it('renders a grid of EventCards when events exist', async () => {
    const wrapper = await mountSuspended(EventGrid, {
      props: {
        events: [sampleEvent]
      }
    })

    expect(wrapper.text()).toContain('Diwata / Magdiwata Festival')
    expect(wrapper.text()).not.toContain('No events found matching your criteria')
  })

  it('renders empty state message and reset button when events array is empty', async () => {
    const wrapper = await mountSuspended(EventGrid, {
      props: {
        events: []
      }
    })

    expect(wrapper.text()).toContain('No events found matching your criteria')
    
    const resetButton = wrapper.find('button')
    expect(resetButton.exists()).toBe(true)
    expect(resetButton.text()).toContain('Reset All Filters')

    await resetButton.trigger('click')
    expect(wrapper.emitted('resetFilters')).toBeTruthy()
  })
})
