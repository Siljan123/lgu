import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationCard from '../../../app/components/destinations/DestinationCard.vue'
import type { Destination } from '../../../app/composables/useDestinations'

const sampleDestination: Destination = {
  id: 'toog-tree-of-alegria',
  name: 'Toog Tree of Alegria',
  category: 'Heritage & Culture',
  barangay: 'Alegria',
  shortDescription: 'A 300-year-old Philippine rosewood tree.',
  fullDescription: 'Rising over 50 meters along the roadside in Barangay Alegria...',
  highlights: ['One of the tallest and oldest trees'],
  howToGetThere: 'Located along national highway.',
  bestTimeToVisit: 'Anytime',
  accessNotes: 'Free entry',
  image: '/images/destinations/toog_tree_alegria.jpg'
}

describe('DestinationCard Component', () => {
  it('renders destination name, category badge, barangay badge, and short description', async () => {
    const wrapper = await mountSuspended(DestinationCard, {
      props: {
        destination: sampleDestination
      }
    })

    expect(wrapper.text()).toContain('Toog Tree of Alegria')
    expect(wrapper.text()).toContain('Heritage & Culture')
    expect(wrapper.text()).toContain('Brgy. Alegria')
    expect(wrapper.text()).toContain('A 300-year-old Philippine rosewood tree.')
  })

  it('emits select event when View Landmark button is clicked', async () => {
    const wrapper = await mountSuspended(DestinationCard, {
      props: {
        destination: sampleDestination
      }
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([sampleDestination])
  })
})
