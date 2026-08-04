import { describe, expect, it } from 'vitest'
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'

// The page file is default exported from its path in Nuxt, we can import it directly to test it.
import HistoryPage from '../../../../app/pages/(lgu-profile)/history/index.vue'

describe('History Page', () => {
  it('renders history page correctly with its sections', async () => {
    mockComponent('Footer', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-footer' }, 'Footer')
      }
    })))
    
    const component = await mountSuspended(HistoryPage)
    
    // Check if hero section title and description are rendered
    expect(component.text()).toContain('The History of')
    expect(component.text()).toContain('San Francisco')
    
    // Check if history content section is rendered
    expect(component.text()).toContain('The birth of San Francisco')
    
    // Check if footer mock is rendered
    expect(component.find('#mock-footer').exists()).toBe(true)
  })
})
