import { describe, expect, it } from 'vitest'
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'

// The page file is default exported from its path in Nuxt, we can import it directly to test it.
import HistoryPage from '../../../../app/pages/(lgu-profile)/history/index.vue'

describe('History Page', () => {
  it('renders history page correctly with its sections', async () => {
    // We can use mockComponent if we want to isolate, but integration test of the page with its child components is often desired.
    // However, `Footer` component might not exist in the test environment if it's from another layer or we want to mock it.
    mockComponent('Footer', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-footer' }, 'Footer')
      }
    })))
    
    const component = await mountSuspended(HistoryPage)
    
    // Check if hero and history content is there (integration rendering)
    expect(component.text()).toContain('The History ofSan Francisco')
    expect(component.text()).toContain('The birth of San Francisco')
    
    // Check if footer mock is rendered
    expect(component.find('#mock-footer').exists()).toBe(true)
  })
})
