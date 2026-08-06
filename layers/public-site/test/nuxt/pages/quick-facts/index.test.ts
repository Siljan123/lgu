import { describe, expect, it } from 'vitest'
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'
import QuickFactsPage from '../../../../app/pages/(lgu-profile)/quick-facts/index.vue'

describe('Quick Facts Page', () => {
  it('renders page layout with UiHeroSection, QuickFacts, DemographicsSection, GeographySection, and Footer', async () => {
    mockComponent('UiHeroSection', () => import('vue').then(m => m.defineComponent({
      props: ['title', 'description'],
      setup(props) {
        return () => m.h('div', { id: 'mock-hero-section' }, `${props.title} - ${props.description}`)
      }
    })))

    mockComponent('QuickFactsDemographicsQuickFacts', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-quick-facts-component' }, 'Quick Facts Component')
      }
    })))

    mockComponent('QuickFactsDemographicsSection', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-demographics-section' }, 'Demographics Section')
      }
    })))

    mockComponent('QuickFactsDemographicsGeographySection', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-geography-section' }, 'Geography Section')
      }
    })))

    mockComponent('Footer', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-footer' }, 'Footer')
      }
    })))

    const wrapper = await mountSuspended(QuickFactsPage)

    expect(wrapper.find('#mock-hero-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Quick Facts')
    expect(wrapper.find('#mock-quick-facts-component').exists()).toBe(true)
    expect(wrapper.find('#mock-demographics-section').exists()).toBe(true)
    expect(wrapper.find('#mock-geography-section').exists()).toBe(true)
    expect(wrapper.find('#mock-footer').exists()).toBe(true)
  })
})
