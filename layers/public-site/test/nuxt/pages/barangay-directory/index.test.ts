import { describe, expect, it } from 'vitest'
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'
import BarangayDirectoryPage from '../../../../app/pages/(lgu-profile)/barangay-directory/index.vue'

describe('Barangay Directory Page', () => {
  it('renders page layout with UiHeroSection and BarangayDirectorySection components', async () => {
    mockComponent('UiHeroSection', () => import('vue').then(m => m.defineComponent({
      props: ['title', 'description', 'imageSrc'],
      setup(props) {
        return () => m.h('div', { id: 'mock-ui-hero-section' }, props.title)
      }
    })))

    mockComponent('BarangayDirectorySection', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-barangay-directory-section' }, 'Barangay Directory Section')
      }
    })))

    const wrapper = await mountSuspended(BarangayDirectoryPage)

    expect(wrapper.find('#mock-ui-hero-section').exists()).toBe(true)
    expect(wrapper.find('#mock-ui-hero-section').text()).toContain('Barangay Directory')
    expect(wrapper.find('#mock-barangay-directory-section').exists()).toBe(true)
  })
})
