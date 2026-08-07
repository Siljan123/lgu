import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EventsFestivalsIndexPage from '../../../../app/pages/(tourism)/events-festivals/index.vue'

describe('Events & Festivals Page', () => {
  it('renders page hero header, title, and advisory section', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    expect(wrapper.text()).toContain('Events & Festivals')
    expect(wrapper.text()).toContain('Celebrate the vibrant culture, indigenous Manobo heritage')
    expect(wrapper.text()).toContain('Participating in San Francisco Festivals?')
    expect(wrapper.text()).toContain('Municipal Tourism Office')
  })

  it('renders flagship event and category filter pills', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    expect(wrapper.text()).toContain('Diwata / Magdiwata Festival')
    expect(wrapper.text()).toContain('Cultural & Indigenous')
    expect(wrapper.text()).toContain('Civic & Historical')
    expect(wrapper.text()).toContain('Environmental & Conservation')
    expect(wrapper.text()).toContain('Trade & Agriculture')
  })

  it('renders content roadmap section with recurring events', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    expect(wrapper.text()).toContain('Recurring Local & Municipal Events')
    expect(wrapper.text()).toContain('Barangay-Level Fiestas')
    expect(wrapper.text()).toContain('Independence Day Activities')
    expect(wrapper.text()).toContain('Year-End & Christmas Season Town Programs')
    expect(wrapper.text()).toContain('LGU Agricultural & Trade Fairs')
  })

  it('filters events when category pill is clicked', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    const tradeButton = wrapper.findAll('button').find(b => b.text().trim() === 'Trade & Agriculture')
    expect(tradeButton).toBeDefined()

    await tradeButton?.trigger('click')

    expect(wrapper.text()).toContain('No events found matching your criteria')
    expect(wrapper.text()).not.toContain('Diwata / Magdiwata Festival')
  })

  it('filters events when typing into search input', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('Manobo')
    expect(wrapper.text()).toContain('Diwata / Magdiwata Festival')

    await searchInput.setValue('NonMatchingSearchTerm')
    expect(wrapper.text()).toContain('No events found matching your criteria')
  })
})
