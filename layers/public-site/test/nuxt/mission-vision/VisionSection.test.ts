import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VisionSection from '../../../app/components/mission-vision/VisionSection.vue'

describe('VisionSection Component', () => {
  it('renders vision title label and complete vision text', async () => {
    const wrapper = await mountSuspended(VisionSection)

    expect(wrapper.text()).toContain('The Vision')
    expect(wrapper.text()).toContain(
      'The Commercial and Educational Center of Agusan del Sur with God-loving, Healthy and Disaster Resilient community living in a Safe and Sustained Natural Environment with a Storing Local Economy under a Well Planned Infrastructure governed by a Dynamic and Transparent Leadership.'
    )
  })
})
