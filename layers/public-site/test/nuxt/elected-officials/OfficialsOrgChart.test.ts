import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import OfficialsOrgChart from '../../../app/components/elected-officials/OfficialsOrgChart.vue'
import type { OrganizationChartNode } from '../../../types/official'

describe('OfficialsOrgChart Component', () => {
  const mockTreeRoot: OrganizationChartNode = {
    id: 'mayor',
    title: 'Municipal Mayor',
    member: [
      {
        id: 'mayor-1',
        name: 'Hon. Juan Dela Cruz',
        add: 'Municipal Mayor',
      },
    ],
    children: [
      {
        id: 'vice-mayor',
        title: 'Municipal Vice Mayor',
        member: [
          {
            id: 'vm-1',
            name: 'Hon. Maria Santos',
            add: 'Municipal Vice Mayor',
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
})
