import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import OfficialsOrgChart from '../../../app/components/elected-officials/OfficialsOrgChart.vue'
import type { OfficialNode } from '../../../types/official'

describe('OfficialsOrgChart Component', () => {
  const mockTreeRoot: OfficialNode = {
    id: 'mayor',
    title: 'Municipal Mayor',
    member: [
      {
        id: 'mayor-1',
        name: 'Hon. Grace A. Rodriguez',
        first_name: 'Grace',
        last_name: 'Rodriguez',
        position_id: 'pos-1',
        add: 'Municipal Mayor',
        contact: '0917-234-5601',
      },
    ],
    children: [
      {
        id: 'vice-mayor',
        title: 'Municipal Vice Mayor',
        member: [
          {
            id: 'vm-1',
            name: 'Hon. Roberto M. Plaza',
            first_name: 'Roberto',
            last_name: 'Plaza',
            position_id: 'pos-2',
            add: 'Municipal Vice Mayor',
            contact: '0917-234-5602',
          },
        ],
      },
    ],
  }

  it('renders elected officials org chart with tree root data', async () => {
    const wrapper = await mountSuspended(OfficialsOrgChart, {
      props: {
        treeRoot: mockTreeRoot,
        pending: false,
      },
    })
    expect(wrapper.text()).toContain('Municipal Mayor')
    expect(wrapper.text()).toContain('Hon. Grace A. Rodriguez')
    expect(wrapper.text()).toContain('Hon. Roberto M. Plaza')
  })

  it('renders loading state when pending is true', async () => {
    const wrapper = await mountSuspended(OfficialsOrgChart, {
      props: {
        treeRoot: null,
        pending: true,
      },
    })

    expect(wrapper.text()).toContain('Loading elected officials')
  })

  it('renders error state when error is present', async () => {
    const wrapper = await mountSuspended(OfficialsOrgChart, {
      props: {
        treeRoot: null,
        pending: false,
        error: new Error('Network error'),
      },
    })

    expect(wrapper.text()).toContain("Couldn't load elected officials")
  })

  it('contains CRUD action buttons on cards', async () => {
    const wrapper = await mountSuspended(OfficialsOrgChart, {
      props: {
        treeRoot: mockTreeRoot,
        pending: false,
      },
    })

    const buttons = wrapper.findAll('button.action-btn')
    expect(buttons.length).toBeGreaterThan(0)
  })
})

