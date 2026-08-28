import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import OrdinanceStats from '../../../app/components/ordinances/OrdinanceStats.vue'
import type { LegalDocument, LegalDocumentStats } from '../../../types/ordinance'

describe('OrdinanceStats Component', () => {
  const mockStats: LegalDocumentStats = {
    total: 42,
    ordinances: 24,
    executiveOrders: 12,
    resolutions: 6,
    active: 38,
    repealed: 2,
    amended: 2,
    draft: 0,
  }

  const mockLatestDoc: LegalDocument = {
    id: 'doc-latest-1',
    type: 'ordinance',
    document_number: 'ORD-2024-009',
    title: 'Municipal Environmental Sanitation Code 2024',
    description: 'Updated comprehensive municipal ordinance on sanitation policies.',
    pdf_url: '/sample-ordinance.pdf',
    date_issued: '2024-03-15',
    status: 'active',
    tags: ['Sanitation', 'Environment'],
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
  }

  it('renders 2x2 metric cards and latest document PDF preview card', async () => {
    const wrapper = await mountSuspended(OrdinanceStats, {
      props: {
        stats: mockStats,
        latestDocument: mockLatestDoc,
      },
    })

    // Metric counts
    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('24')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('6')

    // Metric labels
    expect(wrapper.text()).toContain('Total Records')
    expect(wrapper.text()).toContain('Ordinances')
    expect(wrapper.text()).toContain('Exec. Orders')
    expect(wrapper.text()).toContain('Resolutions')
  })
})
