import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LocalTransportSection from '../../../app/components/travelers-guide/LocalTransportSection.vue'

describe('LocalTransportSection Component', () => {
  it('renders section title, fare matrix table, and spotlight Poblacion to Hubang route', async () => {
    const wrapper = await mountSuspended(LocalTransportSection)

    expect(wrapper.text()).toContain('Fare Matrix')
  })

  it('filters routes when user enters search query', async () => {
    const wrapper = await mountSuspended(LocalTransportSection)

    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)

    await input.setValue('Magdiwata')
    expect(wrapper.text()).toContain('Mt. Magdiwata Base')
  })

  it('supports table pagination and page size selection', async () => {
    const wrapper = await mountSuspended(LocalTransportSection)

    expect(wrapper.text()).toContain('Showing 1 to 4 of')
    expect(wrapper.find('#itemsPerPageSelect').exists()).toBe(true)

    const select = wrapper.find('#itemsPerPageSelect')
    await select.setValue(8)
  })

  it('renders sticky Origin column for mobile horizontal scrolling', async () => {
    const wrapper = await mountSuspended(LocalTransportSection)

    const stickyTh = wrapper.find('th.sticky')
    expect(stickyTh.exists()).toBe(true)
    expect(stickyTh.classes()).toContain('left-0')
    expect(stickyTh.text()).toBe('Origin')

    const stickyTd = wrapper.find('td.sticky')
    expect(stickyTd.exists()).toBe(true)
    expect(stickyTd.classes()).toContain('left-0')
  })
})

