import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CitizensCharterCard from '../../../app/components/citizens-charter/CitizensCharterCard.vue'

describe('CitizensCharterCard Component', () => {
  it('renders section title and default selected service details', async () => {
    const wrapper = await mountSuspended(CitizensCharterCard)

    expect(wrapper.text()).toContain("Citizen's Charter")
    expect(wrapper.text()).toContain('Transparent public service standards')
    expect(wrapper.text()).toContain('Complaints and Assistance Desk')
    expect(wrapper.text()).toContain('30 Minutes')
  })

  it('filters office service desk items when searching', async () => {
    const wrapper = await mountSuspended(CitizensCharterCard)

    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('Consumer')
    expect(wrapper.text()).toContain('Consumer Welfare Assistance Desk')
    expect(wrapper.text()).not.toContain('Business Permit Fee Payment')

    await searchInput.setValue('NonExistentServiceXYZ')
    expect(wrapper.text()).toContain('No office services found matching "NonExistentServiceXYZ"')
  })

  it('changes selected service when a service item is clicked', async () => {
    const wrapper = await mountSuspended(CitizensCharterCard)

    const serviceButtons = wrapper.findAll('ul button')
    const secondButton = serviceButtons.find(b => b.text().includes('Consumer Welfare Assistance Desk'))
    expect(secondButton).toBeDefined()

    await secondButton?.trigger('click')

    expect(wrapper.text()).toContain('Consumer Welfare Assistance Desk')
    expect(wrapper.text()).toContain('40 Minutes')
  })
})
