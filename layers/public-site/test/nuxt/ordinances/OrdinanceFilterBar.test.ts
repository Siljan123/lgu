import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import OrdinanceFilterBar from '../../../app/components/ordinances/OrdinanceFilterBar.vue'
import type { LegalDocumentStats } from '../../../types/ordinance'

describe('OrdinanceFilterBar Component', () => {
  const mockStats: LegalDocumentStats = {
    total: 35,
    ordinances: 20,
    executiveOrders: 10,
    resolutions: 5,
    active: 30,
    repealed: 2,
    amended: 3,
    draft: 0,
  }

  it('renders search input, iconic filter button, and filter selects', async () => {
    const wrapper = await mountSuspended(OrdinanceFilterBar, {
      props: {
        searchQuery: '',
        selectedType: 'all',
        selectedStatus: 'all',
        selectedYear: 'all',
        selectedTag: 'all',
        availableYears: ['all', '2024', '2023'],
        availableTags: ['all', 'Environment', 'Budget'],
        stats: mockStats,
        activeFiltersCount: 0,
        isAdmin: true,
      },
    })

    // Verify search input
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)

    // Verify iconic filter button
    expect(wrapper.text()).toContain('All Types')
    expect(wrapper.text()).toContain('35')

    // Verify action button
    expect(wrapper.text()).toContain('New Document')
  })

  it('renders active reset button when activeFiltersCount > 0', async () => {
    const wrapper = await mountSuspended(OrdinanceFilterBar, {
      props: {
        searchQuery: 'waste',
        selectedType: 'ordinance',
        selectedStatus: 'active',
        selectedYear: '2024',
        selectedTag: 'all',
        availableYears: ['all', '2024'],
        availableTags: ['all'],
        stats: mockStats,
        activeFiltersCount: 4,
        isAdmin: false,
      },
    })

    expect(wrapper.text()).toContain('Reset')
    expect(wrapper.text()).toContain('Ordinances')
    expect(wrapper.text()).toContain('20')
  })
})
