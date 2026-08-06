import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import GeographySection from '../../../app/components/quick-facts-demographics/GeographySection.vue'

describe('GeographySection Component', () => {
  it('renders Geography & Climate section with paragraph description and climate table', async () => {
    const wrapper = await mountSuspended(GeographySection)

    expect(wrapper.text()).toContain('Geography')
    expect(wrapper.text()).toContain('392.53 square kilometres')
    expect(wrapper.text()).toContain('3.93%')
    expect(wrapper.text()).toContain('Climate Data for San Francisco, Agusan del Sur')
    expect(wrapper.text()).toContain('Record high °C (°F)')
    expect(wrapper.text()).toContain('Average precipitation mm (inches)')
    expect(wrapper.text()).toContain('Meteoblue')
  })

  it('toggles accordion content visibility when header button is clicked', async () => {
    const wrapper = await mountSuspended(GeographySection)

    const toggleButton = wrapper.find('button')
    expect(toggleButton.exists()).toBe(true)
    expect(toggleButton.attributes('aria-expanded')).toBe('true')

    // Find the expandable content section (the div right below button with border-t)
    const expandableContent = wrapper.find('div.border-t')
    expect(expandableContent.exists()).toBe(true)
    expect(expandableContent.isVisible()).toBe(true)

    await toggleButton.trigger('click')
    expect(toggleButton.attributes('aria-expanded')).toBe('false')
    expect(expandableContent.attributes('style')).toContain('display: none;')
  })
})

