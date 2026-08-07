import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EventRoadmapSection from '../../../app/components/events-festivals/EventRoadmapSection.vue'
import type { RecurringEvent } from '../../../app/composables/useEventsFestivals'

const sampleRecurringEvents: RecurringEvent[] = [
  {
    id: 'barangay-fiestas',
    title: 'Barangay-Level Fiestas',
    category: 'Community & Faith',
    schedule: 'Dates vary by barangay throughout the year',
    venue: 'Respective Barangay Halls',
    shortDescription: 'Local barangay celebrations featuring patron saint honorings.',
    organizer: 'Barangay Councils',
    badge: 'Recurring Observance'
  },
  {
    id: 'independence-day',
    title: 'Independence Day Activities',
    category: 'Civic & Historical',
    schedule: 'Annually, June 12',
    venue: 'San Francisco Municipal Hall Grounds',
    shortDescription: 'Civic parade and flag-raising ceremony.',
    organizer: 'LGU Executive Committee',
    badge: 'National Holiday'
  }
]

describe('EventRoadmapSection Component', () => {
  it('renders section title, subtitle, and list of recurring events', async () => {
    const wrapper = await mountSuspended(EventRoadmapSection, {
      props: {
        recurringEvents: sampleRecurringEvents
      }
    })

    expect(wrapper.text()).toContain('Content Roadmap — Additional Observances')
    expect(wrapper.text()).toContain('Recurring Local & Municipal Events')
    expect(wrapper.text()).toContain('Barangay-Level Fiestas')
    expect(wrapper.text()).toContain('Independence Day Activities')
    expect(wrapper.text()).toContain('Dates vary by barangay throughout the year')
    expect(wrapper.text()).toContain('Annually, June 12')
  })

  it('renders LGU event calendar updates advisory box', async () => {
    const wrapper = await mountSuspended(EventRoadmapSection, {
      props: {
        recurringEvents: sampleRecurringEvents
      }
    })

    expect(wrapper.text()).toContain('LGU Event Calendar Updates')
    expect(wrapper.text()).toContain('Submit Event Entry')
  })
})
