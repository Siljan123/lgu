import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { UiHeroSection } from '#components'

describe('UiHeroSection', () => {
  it('renders title and description from props', async () => {
    const component = await mountSuspended(UiHeroSection, {
      props: {
        title: 'The History of\nSan Francisco',
        description: 'Discover the rich heritage and origins of our municipality.',
        imageAlt: 'Historical placeholder'
      }
    })
    
    // Check if the title text is rendered
    expect(component.text()).toContain('The History of')
    expect(component.text()).toContain('San Francisco')
    
    // Check if the paragraph description is present
    expect(component.text()).toContain('Discover the rich heritage and origins of our municipality.')
    
    // Check if the image element is present with correct attributes
    const image = component.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('alt')).toBe('Historical placeholder')
  })

  it('supports custom slots for title, description, and image', async () => {
    const component = await mountSuspended(UiHeroSection, {
      props: {
        title: 'Default Title',
        description: 'Default Description'
      },
      slots: {
        title: () => 'Custom Hero Title',
        description: () => 'Custom Hero Description'
      }
    })

    expect(component.text()).toContain('Custom Hero Title')
    expect(component.text()).toContain('Custom Hero Description')
  })
})
