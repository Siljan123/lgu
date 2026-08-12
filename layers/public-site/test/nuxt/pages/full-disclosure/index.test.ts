import { describe, expect, it } from 'vitest'
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'
import FullDisclosurePage from '../../../../app/pages/(good-governance)/full-disclosure/index.vue'
import { useFullDisclosure, DISCLOSURE_CATEGORIES } from '../../../../app/composables/useFullDisclosure'
import { usePdfDownloader } from '../../../../app/composables/usePdfDownloader'
import { useMunicipalOfficials } from '../../../../app/composables/useMunicipalOfficials'

describe('useMunicipalOfficials Composable', () => {
  it('provides default municipal officials including Mayor and Department Heads', () => {
    const { mayor, getOfficialByOffice } = useMunicipalOfficials()
    expect(mayor.value.name).toBe('Hon. Grace A. Rodriguez')
    expect(mayor.value.title).toBe('Municipal Mayor')

    const treasurer = getOfficialByOffice("Municipal Treasurer's Office")
    expect(treasurer.name).toBe('Eleanor V. Santos, CPA')
    expect(treasurer.title).toBe('Municipal Treasurer')
  })

  it('allows updating municipal officials dynamically', () => {
    const { mayor, updateOfficial } = useMunicipalOfficials()
    updateOfficial('mayor', { name: 'Hon. Maria Santos' })
    expect(mayor.value.name).toBe('Hon. Maria Santos')
  })
})

describe('useFullDisclosure Composable', () => {
  it('initializes with 9 default categories', () => {
    const { categories } = useFullDisclosure()
    expect(categories.value).toHaveLength(9)
    expect(categories.value.map(c => c.id)).toEqual([
      'annual-budget',
      'sre',
      'development-fund',
      'sef',
      'ldrrmf',
      'app',
      'bids',
      'gad',
      'fdp-summary'
    ])
  })

  it('provides documents with accurate metadata and financial breakdowns', () => {
    const { filteredDocuments } = useFullDisclosure()
    const sreDoc = filteredDocuments.value.find(d => d.id === 'doc-sre-2026-q1')

    expect(sreDoc).toBeDefined()
    expect(sreDoc?.title).toBe('Statement of Receipts and Expenditures — Q1 2026')
    expect(sreDoc?.publishedBy).toBe("Municipal Treasurer's Office")
    expect(sreDoc?.periodCovered).toBe('January to March 2026')
    expect(sreDoc?.certificationOfficer).toContain('Eleanor V. Santos')
    expect(sreDoc?.summaryHighlights.length).toBeGreaterThan(0)
    expect(sreDoc?.financialBreakdown.length).toBeGreaterThan(0)
  })

  it('filters documents by year', () => {
    const { selectedYear, filteredDocuments } = useFullDisclosure()
    selectedYear.value = '2026'
    expect(filteredDocuments.value.every(doc => doc.year === 2026)).toBe(true)
    expect(filteredDocuments.value.length).toBeGreaterThan(0)
  })

  it('filters documents by quarter', () => {
    const { selectedQuarter, filteredDocuments } = useFullDisclosure()
    selectedQuarter.value = 'Q1'
    expect(filteredDocuments.value.every(doc => doc.quarter === 'Q1')).toBe(true)
  })

  it('filters documents by category', () => {
    const { selectedCategory, filteredDocuments } = useFullDisclosure()
    selectedCategory.value = 'sre'
    expect(filteredDocuments.value.every(doc => doc.categoryId === 'sre')).toBe(true)
  })

  it('filters documents by search query', () => {
    const { searchQuery, filteredDocuments } = useFullDisclosure()
    searchQuery.value = 'Treasurer'
    expect(filteredDocuments.value.every(doc => doc.publishedBy.includes("Treasurer") || doc.title.includes("Treasurer"))).toBe(true)
  })

  it('resets all active filters correctly', () => {
    const { selectedYear, selectedQuarter, selectedCategory, searchQuery, activeFiltersCount, resetFilters } = useFullDisclosure()
    selectedYear.value = '2025'
    selectedQuarter.value = 'Q4'
    selectedCategory.value = 'sre'
    searchQuery.value = 'Receipts'

    expect(activeFiltersCount.value).toBe(4)

    resetFilters()

    expect(selectedYear.value).toBe('All')
    expect(selectedQuarter.value).toBe('All')
    expect(selectedCategory.value).toBe('All')
    expect(searchQuery.value).toBe('')
    expect(activeFiltersCount.value).toBe(0)
  })
})

describe('usePdfDownloader Composable', () => {
  it('initializes with default states', () => {
    const { downloadingId, downloadSuccessId, isDownloading } = usePdfDownloader()
    expect(downloadingId.value).toBeNull()
    expect(downloadSuccessId.value).toBeNull()
    expect(isDownloading.value).toBe(false)
  })

  it('handles download flow with complete document data from useFullDisclosure', async () => {
    const { filteredDocuments } = useFullDisclosure()
    const doc = filteredDocuments.value[0]
    const { downloadingId, downloadSuccessId, isDownloading, downloadPdf } = usePdfDownloader()

    const downloadPromise = downloadPdf(doc)
    expect(downloadingId.value).toBe(doc.id)
    expect(isDownloading.value).toBe(true)

    await downloadPromise

    expect(downloadingId.value).toBeNull()
    expect(isDownloading.value).toBe(false)
    expect(downloadSuccessId.value).toBe(doc.id)
  })
})

describe('Full Disclosure Page', () => {
  it('renders page layout with UiHeroSection, DisclosurePolicySection, and Footer', async () => {
    mockComponent('UiHeroSection', () => import('vue').then(m => m.defineComponent({
      props: ['title', 'description'],
      setup(props) {
        return () => m.h('div', { id: 'mock-hero-section' }, `${props.title} - ${props.description}`)
      }
    })))

    mockComponent('DisclosurePolicySection', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-disclosure-section' }, 'Disclosure Section')
      }
    })))

    mockComponent('Footer', () => import('vue').then(m => m.defineComponent({
      setup() {
        return () => m.h('div', { id: 'mock-footer' }, 'Footer')
      }
    })))

    const wrapper = await mountSuspended(FullDisclosurePage)

    expect(wrapper.find('#mock-hero-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Full Disclosure Policy')
    expect(wrapper.find('#mock-disclosure-section').exists()).toBe(true)
    expect(wrapper.find('#mock-footer').exists()).toBe(true)
  })
})
