import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import OrdinanceTable from '../../../app/components/ordinances/OrdinanceTable.vue'
import type { LegalDocument } from '../../../types/ordinance'

describe('OrdinanceTable Component', () => {
  const mockDocuments: LegalDocument[] = [
    {
      id: 'doc-1',
      type: 'ordinance',
      document_number: 'ORD-2024-001',
      title: 'Comprehensive Environmental Protection and Waste Management Code',
      description: 'An ordinance enacting the ecological solid waste management guidelines and penalties.',
      pdf_url: '/sample.pdf',
      date_issued: '2024-01-15',
      status: 'active',
      tags: ['Environment', 'Waste Management', 'Sanitation'],
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: 'doc-2',
      type: 'executive_order',
      document_number: 'EO-2024-005',
      title: 'Creation of Municipal Disaster Risk Reduction Task Force',
      description: 'Reconstituting the emergency preparedness committee for flood mitigation.',
      pdf_url: '#',
      date_issued: '2024-02-10',
      status: 'amended',
      tags: ['Disaster', 'Emergency Response'],
      created_at: '2024-02-10T00:00:00Z',
      updated_at: '2024-02-10T00:00:00Z',
    },
  ]

  it('renders table headers, document numbers, titles, and status badges', async () => {
    const wrapper = await mountSuspended(OrdinanceTable, {
      props: {
        documents: mockDocuments,
        totalCount: 2,
        currentPage: 1,
        itemsPerPage: 10,
        isAdmin: true,
      },
    })

    // Check table headers
    expect(wrapper.text()).toContain('Document No.')
    expect(wrapper.text()).toContain('Title & Description')
    expect(wrapper.text()).toContain('Date Issued')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Actions')

    // Check document entries
    expect(wrapper.text()).toContain('ORD-2024-001')
    expect(wrapper.text()).toContain('Comprehensive Environmental Protection and Waste Management Code')
    expect(wrapper.text()).toContain('EO-2024-005')
    expect(wrapper.text()).toContain('Creation of Municipal Disaster Risk Reduction Task Force')

    // Check status badges
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('Amended')

    // Check range indicator in footer
    expect(wrapper.text()).toContain('Showing 1 to 2 of 2 records')
  })

  it('renders empty state when documents array is empty', async () => {
    const wrapper = await mountSuspended(OrdinanceTable, {
      props: {
        documents: [],
        totalCount: 0,
        currentPage: 1,
        itemsPerPage: 10,
        isAdmin: true,
      },
    })

    expect(wrapper.text()).toContain('No legal documents found')
    expect(wrapper.text()).toContain('Clear Filters')
  })
})
