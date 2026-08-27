import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MunicipalOrgChart from '../../../app/components/organization/MunicipalOrgChart.vue'
import MunicipalOrgSidebar from '../../../app/components/organization/MunicipalOrgSidebar.vue'
import MunicipalOrgAddModal from '../../../app/components/organization/MunicipalOrgAddModal.vue'
import MunicipalOrgEditModal from '../../../app/components/organization/MunicipalOrgEditModal.vue'
import { useMunicipalOrganization } from '../../../app/composables/useMunicipalOrganization'
import type { MunicipalDepartmentNode } from '../../../types/organization'

const mockDefaultMunicipalOrg: MunicipalDepartmentNode = {
  id: 'mayor-root',
  title: 'Office of the Municipal Mayor',
  acronym: 'LCE',
  category: 'executive',
  member: [
    {
      id: 'mayor-emp',
      name: 'Hon. Grace A. Rodriguez',
      role: 'Municipal Mayor',
      position: 'Municipal Mayor (Local Chief Executive)',
      contact: '+63 912 345 6789',
    },
  ],
  children: [
    {
      id: 'hrmo',
      title: 'Human Resource Management Office',
      acronym: 'HRMO',
      member: [{ id: 'm-hrmo', name: 'Atty. Manuel T. Cordero', role: 'Department Head' }],
    },
    {
      id: 'mho',
      title: 'Municipal Health Office',
      acronym: 'MHO',
      member: [{ id: 'm-mho', name: 'Dr. Alberto K. Sanchez', role: 'Department Head' }],
    },
    {
      id: 'meo',
      title: 'Municipal Engineering Office',
      acronym: 'MEO',
      member: [{ id: 'm-meo', name: 'Engr. Marcos R. Peralta', role: 'Department Head' }],
    },
    {
      id: 'mto',
      title: "Municipal Treasurer's Office",
      acronym: 'MTO',
      member: [{ id: 'm-mto', name: 'Eleanor V. Santos, CPA', role: 'Department Head' }],
    },
    {
      id: 'mdrrmo',
      title: 'Municipal Disaster Risk Reduction and Management Office',
      acronym: 'MDRRMO',
      member: [{ id: 'm-mdrrmo', name: 'Capt. Fernando B. Magsaysay', role: 'Department Head' }],
    },
  ],
}

describe('MunicipalOrgChart Component', () => {
  it('renders Municipal Mayor as root node', async () => {
    const wrapper = await mountSuspended(MunicipalOrgChart, {
      props: {
        treeRoot: mockDefaultMunicipalOrg,
        pending: false,
      },
    })
    expect(wrapper.text()).toContain('Office of the Municipal Mayor')
    expect(wrapper.text()).toContain('Hon. Grace A. Rodriguez')
  })

  it('renders municipal departments and officials', async () => {
    const wrapper = await mountSuspended(MunicipalOrgChart, {
      props: {
        treeRoot: mockDefaultMunicipalOrg,
        pending: false,
      },
    })

    const expectedOffices = [
      'Office of the Municipal Mayor',
      'Human Resource Management Office',
      'Municipal Health Office',
      'Municipal Engineering Office',
      "Municipal Treasurer's Office",
      'Municipal Disaster Risk Reduction and Management Office',
    ]

    for (const office of expectedOffices) {
      expect(wrapper.text()).toContain(office)
    }

    // Verify sample official names
    expect(wrapper.text()).toContain('Hon. Grace A. Rodriguez')
    expect(wrapper.text()).toContain('Atty. Manuel T. Cordero')
    expect(wrapper.text()).toContain('Dr. Alberto K. Sanchez')
    expect(wrapper.text()).toContain('Engr. Marcos R. Peralta')
    expect(wrapper.text()).toContain('Eleanor V. Santos, CPA')
    expect(wrapper.text()).toContain('Capt. Fernando B. Magsaysay')
  })

  it('renders loading state when pending is true', async () => {
    const wrapper = await mountSuspended(MunicipalOrgChart, {
      props: {
        treeRoot: null,
        pending: true,
      },
    })

    expect(wrapper.text()).toContain('Loading organizational structure')
  })

  it('renders error state when error is present', async () => {
    const wrapper = await mountSuspended(MunicipalOrgChart, {
      props: {
        treeRoot: null,
        pending: false,
        error: new Error('Network error'),
      },
    })

    expect(wrapper.text()).toContain('Unable to load organizational structure')
  })
})

describe('MunicipalOrgSidebar Component', () => {
  const mockOffices = [
    {
      id: 'mayor-root',
      title: 'Municipal Mayor',
      acronym: 'LCE',
      depth: 0,
      childrenCount: 17,
      category: 'executive',
    },
    {
      id: 'meo',
      title: 'Municipal Engineering Office',
      acronym: 'MEO',
      depth: 1,
      childrenCount: 0,
      category: 'technical',
    },
    {
      id: 'mho',
      title: 'Municipal Health Office',
      acronym: 'MHO',
      depth: 1,
      childrenCount: 0,
      category: 'social',
    },
  ]

  it('renders office items with acronyms and counts', async () => {
    const wrapper = await mountSuspended(MunicipalOrgSidebar, {
      props: {
        offices: mockOffices,
        categorizedOffices: [],
        selectedOfficeId: 'mayor-root',
      },
    })
  })

})
describe('useMunicipalOrganization Composable', () => {
  it('manages selected office and view modes when switching offices', () => {
    const { selectOffice, selectedOfficeId, viewMode } = useMunicipalOrganization()
    
    // Select an office
    selectOffice('hrmo')
    expect(selectedOfficeId.value).toBe('hrmo')
    expect(viewMode.value).toBe('focused')

    // Reset back
    selectOffice('mayor-root')
    expect(selectedOfficeId.value).toBe('mayor-root')
  })
})


describe('MunicipalOrgEditModal Component', () => {
  it('renders dynamic position select and parses member first name, middle name, last name, and contact', async () => {
    const mockPositions = ['Division Chief', 'Municipal Agriculturist', 'Section Head']
    const mockNode = {
      id: 'test-node-1',
      title: 'Human Resource Management Office',
      acronym: 'HRMO',
      member: [
        {
          id: 'emp-1',
          name: 'Lucia M. Balagtas',
          first_name: 'Lucia',
          middle_name: 'M.',
          last_name: 'Balagtas',
          contact: '+63 912 345 6789',
          position: 'Municipal HRMO Officer',
        },
      ],
    }

    const wrapper = await mountSuspended(MunicipalOrgEditModal, {
      props: {
        open: true,
        node: mockNode,
        positions: mockPositions,
      },
    })

    const positionSelect = wrapper.find('select')
    expect(positionSelect.exists()).toBe(true)

    const options = positionSelect.findAll('option')
    const optionTexts = options.map((o) => o.text())

    // It includes the existing position even if not in original array
    expect(optionTexts).toContain('Municipal HRMO Officer')
    for (const pos of mockPositions) {
      expect(optionTexts).toContain(pos)
    }

    // Verify separate name and contact inputs are populated
    const inputs = wrapper.findAll('input')
    const inputValues = inputs.map((i) => (i.element as HTMLInputElement).value)
    expect(inputValues).toContain('Lucia')
    expect(inputValues).toContain('M.')
    expect(inputValues).toContain('Balagtas')
    expect(inputValues).toContain('+63 912 345 6789')
  })
})

describe('MunicipalOrgChart Independent Root Structures', () => {
  it('renders independent root offices side-by-side on the same canvas', async () => {
    const mockRoot1 = {
      id: 'root-1',
      title: 'Office of the Municipal Mayor',
      acronym: 'MO',
      member: [{ id: 'm1', name: 'Mayor Grace' }],
      children: [],
    }
    const mockRoot2 = {
      id: 'root-2',
      title: 'Sangguniang Bayan',
      acronym: 'SB',
      member: [{ id: 'm2', name: 'Vice Mayor' }],
      children: [],
    }

    const wrapper = await mountSuspended(MunicipalOrgChart, {
      props: {
        treeRoot: {
          ...mockRoot1,
          roots: [mockRoot1, mockRoot2],
        } as any,
      },
    })

    expect(wrapper.text()).toContain('Office of the Municipal Mayor')
    expect(wrapper.text()).toContain('Sangguniang Bayan')
    // Verify no fake wrapper card
    expect(wrapper.text()).not.toContain('lgu-main-root')
  })
})


