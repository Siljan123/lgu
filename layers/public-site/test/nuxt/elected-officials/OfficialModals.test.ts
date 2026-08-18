import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import OfficialAddModal from '../../../app/components/elected-officials/OfficialAddModal.vue'
import OfficialEditModal from '../../../app/components/elected-officials/OfficialEditModal.vue'
import OfficialDeleteModal from '../../../app/components/elected-officials/OfficialDeleteModal.vue'
import OfficialDetailsModal from '../../../app/components/elected-officials/OfficialDetailsModal.vue'
import type { OfficialRow } from '../../../types/official'

describe('Elected Officials Modals', () => {
  const mockOfficial: OfficialRow = {
    id: 'off-1',
    first_name: 'Grace',
    middle_name: 'A.',
    last_name: 'Rodriguez',
    position_id: 'pos-1',
    position: {
      id: 'pos-1',
      title: 'Municipal Mayor',
      rank_order: 1,
    },
    contact: '0917-234-5601',
    image_url: null,
    parent_id: null,
  }

  it('renders OfficialAddModal when open', async () => {
    const wrapper = await mountSuspended(OfficialAddModal, {
      props: {
        open: true,
        positions: [{ id: 'pos-1', title: 'Municipal Mayor', rank_order: 1 }],
        allOfficials: [{ id: 'off-1', fullName: 'Hon. Grace A. Rodriguez', position: 'Municipal Mayor' }],
      },
    })
    expect(wrapper.text()).toContain('Add Elected Official')
  })

  it('renders OfficialEditModal with pre-populated official data', async () => {
    const wrapper = await mountSuspended(OfficialEditModal, {
      props: {
        open: true,
        official: mockOfficial,
        positions: [{ id: 'pos-1', title: 'Municipal Mayor', rank_order: 1 }],
        allOfficials: [{ id: 'off-1', fullName: 'Hon. Grace A. Rodriguez', position: 'Municipal Mayor' }],
      },
    })
    expect(wrapper.text()).toContain('Edit Elected Official')
    const firstNameInput = wrapper.find('input[placeholder="First Name *"]')
    expect((firstNameInput.element as HTMLInputElement).value).toBe('Grace')
  })

  it('renders OfficialDeleteModal with confirmation message', async () => {
    const wrapper = await mountSuspended(OfficialDeleteModal, {
      props: {
        open: true,
        official: mockOfficial,
      },
    })
    expect(wrapper.text()).toContain('Delete Elected Official?')
    expect(wrapper.text()).toContain('Grace A. Rodriguez')
  })

  it('renders OfficialDetailsModal with complete profile info', async () => {
    const wrapper = await mountSuspended(OfficialDetailsModal, {
      props: {
        open: true,
        official: mockOfficial,
        parentOfficialName: null,
        subordinates: [{ id: 'off-2', fullName: 'Hon. Roberto M. Plaza', position: 'Municipal Vice Mayor' }],
      },
    })
    expect(wrapper.text()).toContain('Grace A. Rodriguez')
    expect(wrapper.text()).toContain('Municipal Mayor')
    expect(wrapper.text()).toContain('0917-234-5601')
    expect(wrapper.text()).toContain('Hon. Roberto M. Plaza')
  })
})
