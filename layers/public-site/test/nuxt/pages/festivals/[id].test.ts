import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DedicatedFestivalPage from '../../../../app/pages/(tourism)/events-festivals/festivals/[id].vue'

describe('Dedicated Festival Detail Page', () => {
  it('renders full festival identity, about heritage, recurring highlights, and live scheduled events', async () => {
    const wrapper = await mountSuspended(DedicatedFestivalPage, {
      route: {
        params: { id: 'diwata-magdiwata-festival' }
      }
    })

    expect(wrapper.text()).toContain('Magdiwata Festival')
    expect(wrapper.text()).toContain('Cultural & Environmental Celebration of San Francisco')
    expect(wrapper.text()).toContain('About this festival')
    expect(wrapper.text()).toContain('Tribal Street Dancing')
    expect(wrapper.text()).toContain('Scheduled Activities for Magdiwata Festival')
    expect(wrapper.text()).toContain('Manobo Tribal Street Dancing Competition')
    expect(wrapper.text()).toContain('Back to Events & Festivals')
  })
})
