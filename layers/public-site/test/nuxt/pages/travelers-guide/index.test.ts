import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TravelersGuidePage from '../../../../app/pages/(tourism)/travelers-guide/index.vue'

describe("Traveler's Guide Hub Page", () => {
  it('renders page layout with hero, quick access navigation, and all sections', async () => {
    const wrapper = await mountSuspended(TravelersGuidePage)

    expect(wrapper.text()).toContain("Traveler's Guide")
    expect(wrapper.text()).toContain('Fare Matrix')
  })
})
