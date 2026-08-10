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
  highlights: ['One of the tallest and oldest trees', 'Local natural heritage'],
  howToGetThere: 'Located along national highway.',
  bestTimeToVisit: 'Anytime',
  accessNotes: 'Free entry',
  image: '/images/destinations/toog_tree_alegria.jpg',
  opening: '08:00 AM',
  closing: '05:00 PM'
}

const sampleNoImageDestination: Destination = {
  id: 'church-no-photo',
  name: 'Forsquare Gospel Church',
  category: 'Heritage & Culture',
  barangay: 'Bayugan 2',
  shortDescription: 'Local community church',
  fullDescription: 'Located in Bayugan 2',
  highlights: ['Community landmark'],
  howToGetThere: 'Accessible via local roads',
  bestTimeToVisit: 'Daytime',
  accessNotes: 'Open to public',
  image: ''
}

describe('DestinationCard Component', () => {
  it('renders destination name, short description, and operating hours', async () => {
    const wrapper = await mountSuspended(DestinationCard, {
      props: {
        destination: sampleDestination
      }
    })

    expect(wrapper.text()).toContain('Toog Tree of Alegria')
    expect(wrapper.text()).toContain('A 300-year-old Philippine rosewood tree.')
    expect(wrapper.text()).toContain('08:00 AM - 05:00 PM')
  })

  it('renders NuxtImg component when valid image URL is provided', async () => {
    const wrapper = await mountSuspended(DestinationCard, {
      props: {
        destination: sampleDestination
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('toog_tree_alegria.jpg')
  })

  it('renders fallback No Image Available placeholder when image prop is empty', async () => {
    const wrapper = await mountSuspended(DestinationCard, {
      props: {
        destination: sampleNoImageDestination
      }
    })

    expect(wrapper.text()).toContain('No Image Available')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('renders fallback No Image Available placeholder when image fails to load (@error)', async () => {
    const wrapper = await mountSuspended(DestinationCard, {
      props: {
        destination: sampleDestination
      }
    })

    const img = wrapper.find('img')
    await img.trigger('error')

    expect(wrapper.text()).toContain('No Image Available')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('emits select event when View Landmark button link is clicked', async () => {
    const wrapper = await mountSuspended(DestinationCard, {
      props: {
        destination: sampleDestination
      }
    })

    const buttonLink = wrapper.findAll('a').find(a => a.text().includes('View Landmark'))
    expect(buttonLink?.exists()).toBe(true)

    await buttonLink?.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([sampleDestination])
  })
})
