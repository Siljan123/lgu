import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WhereToStayEatIndexPage from '../../../../app/pages/(tourism)/where-to-stay-eat/index.vue'

describe('Where to Stay & Eat Tourism Page', () => {
  it('renders hero section header and main interactive directory section', async () => {
    const wrapper = await mountSuspended(WhereToStayEatIndexPage)

    expect(wrapper.text()).toContain('Where to Stay and Eat')
    expect(wrapper.text()).toContain('Explore local accommodations')
    expect(wrapper.text()).toContain('Interactive Directory Map & Street View')
  })
})
