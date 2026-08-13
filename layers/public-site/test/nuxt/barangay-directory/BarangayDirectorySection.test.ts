import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BarangayDirectorySection from '../../../app/components/barangay-directory/BarangayDirectorySection.vue'

describe('BarangayDirectorySection Component', () => {
  it('renders sidebar and main details section with child components when a barangay is selected', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySection)

    expect(wrapper.text()).toContain('List of Barangays')
    expect(wrapper.text()).toContain('Barangay Officials')
  })
})
