import { ref, computed } from 'vue'
import type {
  LegalDocument,
  DocumentType,
  DocumentStatus,
  CreateLegalDocumentPayload,
  UpdateLegalDocumentPayload,
  LegalDocumentStats,
} from '../../types/ordinance'

export function useOrdinances() {
  const searchQuery = ref('')
  const selectedType = ref<DocumentType | 'all'>('all')
  const selectedStatus = ref<DocumentStatus | 'all'>('all')
  const selectedYear = ref<string>('all')
  const selectedTag = ref<string>('all')
  const selectedDocument = ref<LegalDocument | null>(null)
  const isMutating = ref(false)

  // Fetch documents directly from Nuxt Server API (live Supabase database)
  const {
    data: fetchedDocuments,
    pending,
    error,
    refresh,
  } = useAsyncData<LegalDocument[]>(
    'legal-documents-list',
    () => $fetch<LegalDocument[]>('/api/ordinances'),
    { default: () => [] }
  )

  // Live database documents list
  const rawDocuments = computed<LegalDocument[]>(() => {
    return fetchedDocuments.value || []
  })

  // Distinct available years from live documents
  const availableYears = computed<string[]>(() => {
    const years = new Set<string>()
    for (const doc of rawDocuments.value) {
      if (doc.date_issued) {
        const y = doc.date_issued.slice(0, 4)
        if (y) years.add(y)
      }
    }
    const sorted = Array.from(years).sort((a, b) => b.localeCompare(a))
    return ['all', ...sorted]
  })

  // Distinct available tags from live documents
  const availableTags = computed<string[]>(() => {
    const tagsSet = new Set<string>()
    for (const doc of rawDocuments.value) {
      if (Array.isArray(doc.tags)) {
        for (const t of doc.tags) {
          if (t && t.trim()) tagsSet.add(t.trim())
        }
      }
    }
    const sorted = Array.from(tagsSet).sort()
    return ['all', ...sorted]
  })

  // Reactive filtered documents list
  const filteredDocuments = computed<LegalDocument[]>(() => {
    return rawDocuments.value.filter((doc) => {
      // Type filter
      if (selectedType.value !== 'all' && doc.type !== selectedType.value) {
        return false
      }

      // Status filter
      if (selectedStatus.value !== 'all' && doc.status !== selectedStatus.value) {
        return false
      }

      // Year filter
      if (selectedYear.value !== 'all') {
        const docYear = (doc.date_issued || '').slice(0, 4)
        if (docYear !== selectedYear.value) {
          return false
        }
      }

      // Tag filter
      if (selectedTag.value !== 'all') {
        if (!Array.isArray(doc.tags) || !doc.tags.includes(selectedTag.value)) {
          return false
        }
      }

      // Search query filter
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim()
        const matchesTitle = doc.title?.toLowerCase().includes(q)
        const matchesNumber = doc.document_number?.toLowerCase().includes(q)
        const matchesDesc = doc.description?.toLowerCase().includes(q)
        const matchesTags = Array.isArray(doc.tags) && doc.tags.some((t) => t.toLowerCase().includes(q))

        if (!matchesTitle && !matchesNumber && !matchesDesc && !matchesTags) {
          return false
        }
      }

      return true
    })
  })

  // Summary statistics calculated from live database data
  const stats = computed<LegalDocumentStats>(() => {
    const docs = rawDocuments.value
    let ordinances = 0
    let executiveOrders = 0
    let resolutions = 0
    let active = 0
    let repealed = 0
    let amended = 0
    let draft = 0

    for (const d of docs) {
      if (d.type === 'ordinance') ordinances++
      else if (d.type === 'executive_order') executiveOrders++
      else if (d.type === 'resolution') resolutions++

      if (d.status === 'active') active++
      else if (d.status === 'repealed') repealed++
      else if (d.status === 'amended') amended++
      else if (d.status === 'draft') draft++
    }

    return {
      total: docs.length,
      ordinances,
      executiveOrders,
      resolutions,
      active,
      repealed,
      amended,
      draft,
    }
  })

  // Active filters count
  const activeFiltersCount = computed(() => {
    let count = 0
    if (selectedType.value !== 'all') count++
    if (selectedStatus.value !== 'all') count++
    if (selectedYear.value !== 'all') count++
    if (selectedTag.value !== 'all') count++
    if (searchQuery.value.trim() !== '') count++
    return count
  })

  // Filter setters
  function selectType(type: DocumentType | 'all') {
    selectedType.value = type
  }

  function selectStatus(status: DocumentStatus | 'all') {
    selectedStatus.value = status
  }

  function selectYear(year: string) {
    selectedYear.value = year
  }

  function selectTag(tag: string) {
    selectedTag.value = tag
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedType.value = 'all'
    selectedStatus.value = 'all'
    selectedYear.value = 'all'
    selectedTag.value = 'all'
  }

  function openDocument(doc: LegalDocument) {
    selectedDocument.value = doc
  }

  function closeDocument() {
    selectedDocument.value = null
  }

  // CRUD Actions
  async function createDocument(payload: CreateLegalDocumentPayload): Promise<LegalDocument> {
    isMutating.value = true
    try {
      const res = await $fetch<LegalDocument>('/api/ordinances', {
        method: 'POST',
        body: payload,
      })
      await refresh()
      return res
    } catch (err) {
      console.error('Failed to create legal document:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  async function updateDocument(id: string, payload: UpdateLegalDocumentPayload): Promise<LegalDocument> {
    isMutating.value = true
    try {
      const res = await $fetch<LegalDocument>(`/api/ordinances/${id}`, {
        method: 'PUT',
        body: payload,
      })
      await refresh()
      return res
    } catch (err) {
      console.error('Failed to update legal document:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  async function deleteDocument(id: string): Promise<boolean> {
    isMutating.value = true
    try {
      await $fetch(`/api/ordinances/${id}`, {
        method: 'DELETE',
      })
      if (selectedDocument.value?.id === id) {
        selectedDocument.value = null
      }
      await refresh()
      return true
    } catch (err) {
      console.error('Failed to delete legal document:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  async function uploadPdf(file: File): Promise<{ publicUrl: string; filename: string; fileSize: number }> {
    isMutating.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await $fetch<{
        success: boolean
        publicUrl: string
        filename: string
        fileSize: number
      }>('/api/ordinances/upload', {
        method: 'POST',
        body: formData,
      })

      return res
    } catch (err) {
      console.error('Failed to upload legal document PDF:', err)
      throw err
    } finally {
      isMutating.value = false
    }
  }

  return {
    rawDocuments,
    filteredDocuments,
    stats,
    searchQuery,
    selectedType,
    selectedStatus,
    selectedYear,
    selectedTag,
    availableYears,
    availableTags,
    selectedDocument,
    activeFiltersCount,
    pending,
    error,
    isMutating,
    refresh,
    selectType,
    selectStatus,
    selectYear,
    selectTag,
    resetFilters,
    openDocument,
    closeDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    uploadPdf,
  }
}
