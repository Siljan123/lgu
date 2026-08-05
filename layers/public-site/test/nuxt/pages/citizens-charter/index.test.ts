import { describe, expect, it } from 'vitest'
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'
import CitizenCharterPage from '../../../../app/pages/(good-governance)/citizen-charter/index.vue'

describe('Citizen\'s Charter Page', () => {
  it('renders page layout with CitizensCharterSection and Footer components', async () => {
    mockComponent('CitizensCharterSection', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-citizens-charter-section' }, 'Citizens Charter Section')
      }
    })))

    mockComponent('Footer', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-footer' }, 'Footer')
      }
    })))

    const wrapper = await mountSuspended(CitizenCharterPage)

    expect(wrapper.find('#mock-citizens-charter-section').exists()).toBe(true)
    expect(wrapper.find('#mock-footer').exists()).toBe(true)
  })
})

