import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MissionSection from '../../../app/components/mission-vision/MissionSection.vue'

describe('MissionSection Component', () => {
  it('renders mission section header, text content, and hero image', async () => {
    const wrapper = await mountSuspended(MissionSection)

    expect(wrapper.text()).toContain('The Mission')
    expect(wrapper.text()).toContain(
      'Deliver effective, efficient and quality services to the constituents and optimize utilization of its natural resources with consideration to ecological effects.'
    )

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/images/vision-mission-hero.jpg')
    expect(img.attributes('alt')).toBe('Agusan del Sur Government Pavilion')
  })
})
