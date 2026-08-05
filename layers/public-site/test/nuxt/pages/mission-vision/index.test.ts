import { describe, expect, it } from 'vitest'
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'
import MissionVisionPage from '../../../../app/pages/(good-governance)/mission-vision/index.vue'

describe('Mission & Vision Page', () => {
  it('renders page layout with UiHeroSection, MissionVision sub-components, and Footer', async () => {
    mockComponent('UiHeroSection', () => import('vue').then(m => m.defineComponent({
      props: ['title', 'description'],
      setup(props) {
        return () => m.h('div', { id: 'mock-hero-section' }, `${props.title} - ${props.description}`)
      }
    })))

    mockComponent('MissionVisionSection', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-vision-section' }, 'Vision Section')
      }
    })))

    mockComponent('MissionVisionMissionSection', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-mission-section' }, 'Mission Section')
      }
    })))

    mockComponent('MissionVisionCoreSection', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-core-section' }, 'Core Section')
      }
    })))

    mockComponent('Footer', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-footer' }, 'Footer')
      }
    })))

    const wrapper = await mountSuspended(MissionVisionPage)

    expect(wrapper.find('#mock-hero-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Vision & Mission')
    expect(wrapper.find('#mock-vision-section').exists()).toBe(true)
    expect(wrapper.find('#mock-mission-section').exists()).toBe(true)
    expect(wrapper.find('#mock-core-section').exists()).toBe(true)
    expect(wrapper.find('#mock-footer').exists()).toBe(true)
  })
})
