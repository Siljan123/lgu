import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LocalTransportFaresPage from '../../../../app/pages/(tourism)/travelers-guide/local-transport-fares.vue'

describe('Local Transport Fares Dedicated Page', () => {
  it('renders page layout with Hero section and LocalTransportSection component', async () => {
    const wrapper = await mountSuspended(LocalTransportFaresPage)

    expect(wrapper.text()).toContain('Local Transport & Official Fare Matrix')
    expect(wrapper.text()).toContain('Poblacion')
    expect(wrapper.text()).toContain('New Terminal Hubang')
    expect(wrapper.text()).toContain('Back to Main Traveler\'s Guide')
  })
})
