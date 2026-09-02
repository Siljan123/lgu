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

  it('renders OfficialEditModal for a label node with label_name', async () => {
    const mockLabelNode: OfficialRow = {
      id: 'lbl-1',
      label_name: 'Sangguniang Bayan Members',
      first_name: null,
      middle_name: null,
      last_name: null,
      position_id: 'pos-3',
      position: {
        id: 'pos-3',
        title: 'Sangguniang Bayan Members',
        rank_order: 3,
      },
      is_label: true,
      contact: null,
      avatar_url: null,
      parent_id: 'off-1',
    }

    const wrapper = await mountSuspended(OfficialEditModal, {
      props: {
        open: true,
        official: mockLabelNode,
        positions: [{ id: 'pos-3', title: 'Sangguniang Bayan Members', rank_order: 3 }],
        allOfficials: [{ id: 'off-1', fullName: 'Hon. Grace A. Rodriguez', position: 'Municipal Mayor' }],
      },
    })
    expect(wrapper.text()).toContain('Edit Section Label')
    expect(wrapper.find('input[placeholder="First Name *"]').exists()).toBe(false)
  })

  it('renders superior officials in OfficialAddModal showing only label_name when is_label is true', async () => {
    const wrapper = await mountSuspended(OfficialAddModal, {
      props: {
        open: true,
        positions: [
          { id: 'pos-1', title: 'Municipal Mayor', rank_order: 1 },
          { id: 'pos-4', title: 'Sangguniang Bayan Member', rank_order: 4 },
        ],
        allOfficials: [
          { id: 'off-1', fullName: 'Hon. Grace A. Rodriguez', position: 'Municipal Mayor', is_label: false },
          { id: 'lbl-1', fullName: 'Sangguniang Bayan Members', position: 'Sangguniang Bayan Members', is_label: true, label_name: 'Sangguniang Bayan Members' },
        ],
      },
    })
    const select = wrapper.find('select')
    const options = select.findAll('option')
    
    // First option is disabled placeholder
    expect(options[1]?.text()).toBe('Hon. Grace A. Rodriguez - Municipal Mayor')
    // Label node should only show label_name, not label_name (position)
    expect(options[2]?.text()).toBe('Sangguniang Bayan Members')
    expect(options[2]?.text()).not.toContain('(Sangguniang Bayan Members)')
  })

  it('auto-selects matching position when adding official under a label node', async () => {
    const wrapper = await mountSuspended(OfficialAddModal, {
      props: {
        open: true,
        selectedParentId: 'lbl-1',
        positions: [
          { id: 'pos-1', title: 'Municipal Mayor', rank_order: 1 },
          { id: 'pos-4', title: 'Sangguniang Bayan Member', rank_order: 4 },
        ],
        allOfficials: [
          { id: 'off-1', fullName: 'Hon. Grace A. Rodriguez', position: 'Municipal Mayor', is_label: false },
          { id: 'lbl-1', fullName: 'Sangguniang Bayan Members', position: 'Sangguniang Bayan Members', is_label: true, label_name: 'Sangguniang Bayan Members' },
        ],
      },
    })
    const positionSelect = wrapper.findAll('select')[1]
    expect((positionSelect?.element as HTMLSelectElement).value).toBe('pos-4')
  })
})
