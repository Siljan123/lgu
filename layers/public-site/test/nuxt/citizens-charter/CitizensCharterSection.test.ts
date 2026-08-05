import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CitizensCharterSection from '../../../app/components/citizens-charter/CitizensCharterSection.vue'

describe('CitizensCharterSection Component', () => {
  it('renders office selection sidebar and default selected office with all its services', async () => {
    const wrapper = await mountSuspended(CitizensCharterSection)

    // Sidebar Title & Offices
    expect(wrapper.text()).toContain('Select Municipal Office')
    expect(wrapper.text()).toContain('MEEDMO')
    expect(wrapper.text()).toContain('TREASURY')
    expect(wrapper.text()).toContain('ASSESSOR')

    // Default Selected Office (MEEDMO) Header
    expect(wrapper.text()).toContain('Economic Enterprise Development & Management (MEEDMO)')

    // Render ALL services of MEEDMO simultaneously
    expect(wrapper.text()).toContain('Complaints and Assistance Desk')
    expect(wrapper.text()).toContain('Consumer Welfare Assistance Desk')
    expect(wrapper.text()).toContain('30 Minutes')
    expect(wrapper.text()).toContain('40 Minutes')
  })

  it('filters offices and services when searching', async () => {
    const wrapper = await mountSuspended(CitizensCharterSection)

    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('Consumer')
    expect(wrapper.text()).toContain('Consumer Welfare Assistance Desk')

    await searchInput.setValue('NonExistentServiceXYZ')
    expect(wrapper.text()).toContain('No offices or services match "NonExistentServiceXYZ"')
  })

  it('changes selected office when an office sidebar item is clicked', async () => {
    const wrapper = await mountSuspended(CitizensCharterSection)

    const treasuryButton = wrapper.findAll('aside button').find(b => b.text().includes('TREASURY'))
    expect(treasuryButton).toBeDefined()

    await treasuryButton?.trigger('click')

    // Workspace now shows Office of the Municipal Treasurer (OMT) with all its services
    expect(wrapper.text()).toContain('Office of the Municipal Treasurer (OMT)')
    expect(wrapper.text()).toContain('Business Permit Fee Payment & Tax Clearance')
    expect(wrapper.text()).toContain('Real Property Tax (RPT) Payment')
  })
})
