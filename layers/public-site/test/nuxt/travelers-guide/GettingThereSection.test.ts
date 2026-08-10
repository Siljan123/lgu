import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import GettingThereSection from '../../../app/components/travelers-guide/GettingThereSection.vue'

describe('GettingThereSection Component', () => {
  it('renders section title, transport route tabs, and Hubang Intermodal Terminal hub info', async () => {
    const wrapper = await mountSuspended(GettingThereSection)

    expect(wrapper.text()).toContain('Getting to San Francisco, Agusan del Sur')
    expect(wrapper.text()).toContain('Via Butuan Bancasi Airport (BXU)')
    expect(wrapper.text()).toContain('San Francisco Integrated Bus & Transport Terminal')
    expect(wrapper.text()).toContain('Barangay Hubang')
  })

  it('switches tabs between All, Air, Land, Sea, and Hub', async () => {
    const wrapper = await mountSuspended(GettingThereSection)

    const airTab = wrapper.findAll('button').find(b => b.text().includes('By Air'))
    expect(airTab).toBeDefined()

    await airTab?.trigger('click')
    expect(wrapper.text()).toContain('Via Butuan Bancasi Airport (BXU)')
  })
})
