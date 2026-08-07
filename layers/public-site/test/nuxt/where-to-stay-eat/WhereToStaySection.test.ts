import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WhereToStaySection from '../../../app/components/where-to-stay-eat/WhereToStaySection.vue'

describe('WhereToStaySection Component', () => {
  it('renders section title, search bar, split map & streetview layout, and directory list', async () => {
    const wrapper = await mountSuspended(WhereToStaySection)

    expect(wrapper.text()).toContain('Interactive Directory Map & Street View 360°')
    expect(wrapper.text()).toContain('Establishments Showcase')
    expect(wrapper.text()).toContain('Cards View')
    expect(wrapper.text()).toContain('Table View')
  })

  it('toggles viewMode from Cards View to Table View when button is clicked', async () => {
    const wrapper = await mountSuspended(WhereToStaySection)

    const tableViewButton = wrapper.findAll('button').find(b => b.text().includes('Table View'))
    expect(tableViewButton).toBeDefined()

    await tableViewButton?.trigger('click')
    expect(wrapper.find('table').exists()).toBe(true)

    const cardsViewButton = wrapper.findAll('button').find(b => b.text().includes('Cards View'))
    expect(cardsViewButton).toBeDefined()

    await cardsViewButton?.trigger('click')
    expect(wrapper.find('table').exists()).toBe(false)
  })
})
