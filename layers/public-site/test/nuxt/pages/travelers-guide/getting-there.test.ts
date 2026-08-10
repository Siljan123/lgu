import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import GettingTherePage from '../../../../app/pages/(tourism)/travelers-guide/getting-there.vue'

describe('Getting There Dedicated Page', () => {
  it('renders page layout with Hero section and GettingThereSection component', async () => {
    const wrapper = await mountSuspended(GettingTherePage)

    expect(wrapper.text()).toContain('Getting There & Transit Connections')
    expect(wrapper.text()).toContain('Getting to San Francisco, Agusan del Sur')
    expect(wrapper.text()).toContain('Via Butuan Bancasi Airport (BXU)')
    expect(wrapper.text()).toContain('Back to Main Traveler\'s Guide')
  })
})
