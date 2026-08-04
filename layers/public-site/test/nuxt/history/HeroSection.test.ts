import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { HistoryHeroSection } from '#components'

describe('HistoryHeroSection', () => {
  it('renders as expected', async () => {
    const component = await mountSuspended(HistoryHeroSection)
    
    // Check if the main heading is present
    expect(component.text()).toContain('The History ofSan Francisco')
    
    // Check if the paragraph text is present
    expect(component.text()).toContain('Discover the rich heritage and origins of our municipality.')
    
    // Check if the placeholder image is present
    const image = component.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('alt')).toBe('Historical placeholder')
  })
})
