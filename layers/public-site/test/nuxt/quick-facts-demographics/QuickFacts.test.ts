import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import QuickFacts from '../../../app/components/quick-facts-demographics/QuickFacts.vue'

describe('QuickFacts Component', () => {
  it('renders quick stats and default overview content', async () => {
    const wrapper = await mountSuspended(QuickFacts)

    expect(wrapper.text()).toContain('Quick Facts')
    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('27')
    expect(wrapper.text()).toContain('80,760')
    expect(wrapper.text()).toContain('1st Class')
    expect(wrapper.text()).toContain('392.53 km²')
    expect(wrapper.text()).toContain('San Francisco, officially the Municipality of San Francisco')

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/images/san_francisco_overview.jpg')
    expect(img.attributes('alt')).toContain('San Francisco, Agusan del Sur')
  })

  it('accepts custom content, imageSrc, and imageAlt props', async () => {
    const wrapper = await mountSuspended(QuickFacts, {
      props: {
        content: 'Custom Quick Facts Description Text',
        imageSrc: '/images/custom_hero.jpg',
        imageAlt: 'Custom Hero Image Alt'
      }
    })

    expect(wrapper.text()).toContain('Custom Quick Facts Description Text')
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/images/custom_hero.jpg')
    expect(img.attributes('alt')).toBe('Custom Hero Image Alt')
  })
})
