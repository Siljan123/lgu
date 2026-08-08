import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UpcomingEventCard from '../../../app/components/events-festivals/UpcomingEventCard.vue'
import type { EventItem } from '../../../app/composables/useEventsFestivals'

const sampleEventItem: EventItem = {
  id: 'diwata-street-dancing-competition',
  title: 'Manobo Tribal Street Dancing Competition',
  shortDescription: 'Choreographed street dance performances in vibrant Manobo costumes celebrating Mt. Magdiwata.',
  category: 'Cultural & Indigenous',
  startDate: 'June 21, 2026',
  location: 'Main Highway & Municipal Ground Amphitheater',
  isFeatured: true,
  badge: 'Festival Highlight'
}

describe('UpcomingEventCard Component', () => {
  it('renders event title, badge, short description, start date, and location', async () => {
    const wrapper = await mountSuspended(UpcomingEventCard, {
      props: {
        event: sampleEventItem
      }
    })

    expect(wrapper.text()).toContain('Festival Highlight')
    expect(wrapper.text()).toContain('Manobo Tribal Street Dancing Competition')
    expect(wrapper.text()).toContain('Choreographed street dance performances in vibrant Manobo costumes')
    expect(wrapper.text()).toContain('June 21, 2026')
    expect(wrapper.text()).toContain('Main Highway & Municipal Ground Amphitheater')
  })

  it('emits select event when card is clicked', async () => {
    const wrapper = await mountSuspended(UpcomingEventCard, {
      props: {
        event: sampleEventItem
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([sampleEventItem])
  })
})
