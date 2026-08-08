import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CoreSection from '../../../app/components/mission-vision/CoreSection.vue'

describe('CoreSection Component', () => {
  it('renders Core Values heading and all 5 core values with their indexes', async () => {
    const wrapper = await mountSuspended(CoreSection)

    expect(wrapper.text()).toContain('Core Values')


    expect(wrapper.text()).toContain('Respect for Human Worth and Dignity; Unity;')

    expect(wrapper.text()).toContain('Trustworthiness and Accountability')


    expect(wrapper.text()).toContain("Passion and Commitment for People's Development; and Concern for Environment Conservation and Protection")

  })
})
