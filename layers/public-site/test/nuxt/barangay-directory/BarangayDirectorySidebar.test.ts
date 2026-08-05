import { describe, expect, it, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BarangayDirectorySidebar from '../../../app/components/barangay-directory/BarangayDirectorySidebar.vue'
import { useBarangayDirectory } from '../../../app/composables/useBarangayDirectory'

describe('BarangayDirectorySidebar Component', () => {
  beforeEach(() => {
    const { setSearchQuery } = useBarangayDirectory()
    setSearchQuery('')
  })

  it('renders barangay directory list and allows searching', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySidebar)

    expect(wrapper.text()).toContain('List of Barangays')
    expect(wrapper.text()).toContain('Alegria')
    expect(wrapper.text()).toContain('Bayugan 2')

    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)

    await searchInput.setValue('Alegria')
    expect(wrapper.text()).toContain('Alegria')
    expect(wrapper.text()).not.toContain('Bayugan 2')

    const clearButton = wrapper.find('button[aria-label="Clear search"]')
    expect(clearButton.exists()).toBe(true)
    await clearButton.trigger('click')

    expect(wrapper.text()).toContain('Bayugan 2')
  })

  it('shows no barangays found message when search query has no match', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySidebar)

    const searchInput = wrapper.find('input[type="text"]')
    await searchInput.setValue('NonExistentBarangay12345')

    expect(wrapper.text()).toContain('No barangays found matching "NonExistentBarangay12345"')
  })

  it('handles barangay selection when clicked', async () => {
    const wrapper = await mountSuspended(BarangayDirectorySidebar)

    const barangayButtons = wrapper.findAll('button')
    const alegriaButton = barangayButtons.find(b => b.text().includes('Alegria'))
    expect(alegriaButton).toBeDefined()

    await alegriaButton?.trigger('click')

    const { selectedBarangayId } = useBarangayDirectory()
    expect(selectedBarangayId.value).toBe('alegria')
  })
})
