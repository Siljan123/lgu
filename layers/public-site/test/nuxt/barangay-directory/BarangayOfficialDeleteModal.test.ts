import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BarangayOfficialDeleteModal from '../../../app/components/barangay-directory/BarangayOfficialDeleteModal.vue'
import type { BarangayOfficial } from '../../../app/composables/useBarangayDirectory'

describe('BarangayOfficialDeleteModal Component', () => {
  const mockOfficials: BarangayOfficial[] = [
    { id: 'lbl-1', name: 'Kagawad Group', title: 'Kagawad Group', is_label: true },
    { id: 'kag-1', name: 'Hon. Danilo R. Flores', title: 'Barangay Kagawad', parent_id: 'lbl-1' },
    { id: 'kag-2', name: 'Hon. Grace P. Mendoza', title: 'Barangay Kagawad', parent_id: 'lbl-1' },
    { id: 'sub-1', name: 'Juan Dela Cruz', title: 'Committee Clerk', parent_id: 'kag-1' }
  ]

  it('renders section label deletion modal with cascading child warnings', async () => {
    const wrapper = await mountSuspended(BarangayOfficialDeleteModal, {
      props: {
        open: true,
        official: mockOfficials[0],
        allOfficials: mockOfficials
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Delete Section Label?')
    expect(text).toContain('Kagawad Group')
    expect(text).toContain('All officials under this label will be deleted')
    expect(text).toContain('Hon. Danilo R. Flores')
    expect(text).toContain('Hon. Grace P. Mendoza')
    expect(text).toContain('Juan Dela Cruz')
    expect(text).toContain('Delete All')
  })

  it('renders simple delete modal for a leaf official without child nodes', async () => {
    const wrapper = await mountSuspended(BarangayOfficialDeleteModal, {
      props: {
        open: true,
        official: mockOfficials[2], // kag-2 has no children
        allOfficials: mockOfficials
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Delete Barangay Official?')
    expect(text).toContain('Hon. Grace P. Mendoza')
    expect(text).not.toContain('All Child Officials Will Be Deleted')
    expect(text).toContain('Delete Official')
  })

  it('emits confirm event with official id when confirm button is clicked', async () => {
    const wrapper = await mountSuspended(BarangayOfficialDeleteModal, {
      props: {
        open: true,
        official: mockOfficials[0],
        allOfficials: mockOfficials
      }
    })

    const deleteBtn = wrapper.findAll('button').find(b => b.text().includes('Delete'))
    expect(deleteBtn).toBeDefined()
    await deleteBtn?.trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')?.[0]).toEqual(['lbl-1'])
  })
})
