import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DestinationDetailPage from '../../../../app/pages/(tourism)/destinations/[id].vue'

describe('Destination Landmark Detail Page', () => {
  it('renders full landmark details, overview, and highlights for a valid destination param', async () => {
    const wrapper = await mountSuspended(DestinationDetailPage, {
      route: {
        params: { id: 'mt-magdiwata' }
      }
    })

    expect(wrapper.text()).toContain('Mt. Magdiwata')
    expect(wrapper.text()).toContain('Brgy. San Isidro')
    expect(wrapper.text()).toContain('Adventure & Outdoor')
    expect(wrapper.text()).toContain('Key Site Highlights')
    expect(wrapper.text()).toContain('Panoramic summit views of the Agusan Marsh')
    expect(wrapper.text()).toContain('How to get there')
    expect(wrapper.text()).toContain('Best time to visit')
    expect(wrapper.text()).toContain('Access notes')
  })
})
