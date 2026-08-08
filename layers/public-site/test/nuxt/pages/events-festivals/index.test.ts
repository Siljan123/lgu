import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EventsFestivalsIndexPage from '../../../../app/pages/(tourism)/events-festivals/index.vue'

describe('Events & Festivals Page', () => {
  it('renders page hero header and section titles', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    expect(wrapper.text()).toContain('Events & Festivals')
    expect(wrapper.text()).toContain('Celebrate the vibrant culture, indigenous Manobo heritage')
    expect(wrapper.text()).toContain('Municipal Festivals & Celebrations')
    expect(wrapper.text()).toContain('Upcoming Events Feed')
  })

  it('renders festival identity block and recurring highlights', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)
    expect(wrapper.text()).toContain('Magdiwata Festival')
    expect(wrapper.text()).toContain('Tribal Street Dancing')
    expect(wrapper.text()).toContain('Cultural & Indigenous')
  })

  it('renders upcoming events feed for dynamic scheduled events', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    expect(wrapper.text()).toContain('Upcoming Events Feed')
    expect(wrapper.text()).toContain('Manobo Tribal Street Dancing Competition')
    expect(wrapper.text()).toContain('Philippine Independence Day Civic Parade')
  })

  it('renders content roadmap section with recurring events', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    expect(wrapper.text()).toContain('Recurring Local & Municipal Events')
    expect(wrapper.text()).toContain('Barangay-Level Fiestas')
    expect(wrapper.text()).toContain('Independence Day Activities')
    expect(wrapper.text()).toContain('Year-End & Christmas Season Town Programs')
    expect(wrapper.text()).toContain('LGU Agricultural & Trade Fairs')
  })

  it('filters events and festivals when category pill is clicked', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    const tradeButton = wrapper.findAll('button').find(b => b.text().trim() === 'Trade & Agriculture')
    expect(tradeButton).toBeDefined()

    await tradeButton?.trigger('click')

    expect(wrapper.text()).not.toContain('Magdiwata Festival')
    expect(wrapper.text()).toContain('Agusan del Sur Agricultural Produce & Craft Expo')
  })

  it('filters events when typing into search input', async () => {
    const wrapper = await mountSuspended(EventsFestivalsIndexPage)

    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('Manobo')
    expect(wrapper.text()).toContain('Magdiwata Festival')

    await searchInput.setValue('NonMatchingSearchTerm')
    expect(wrapper.text()).toContain('No events found matching your criteria')
  })
})
