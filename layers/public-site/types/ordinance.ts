export type DocumentType = 'ordinance' | 'executive_order' | 'resolution'

export type DocumentStatus = 'active' | 'repealed' | 'amended' | 'draft'

export interface LegalDocument {
  id: string
  type: DocumentType
  document_number: string
  title: string
  description?: string | null
  pdf_url: string
  date_issued: string
  status: DocumentStatus
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CreateLegalDocumentPayload {
  type: DocumentType
  document_number: string
  title: string
  description?: string | null
  pdf_url: string
  date_issued: string
  status?: DocumentStatus
  tags?: string[]
}

export interface UpdateLegalDocumentPayload {
  id: string
  type?: DocumentType
  document_number?: string
  title?: string
  description?: string | null
  pdf_url?: string
  date_issued?: string
  status?: DocumentStatus
  tags?: string[]
}

export interface LegalDocumentFilterState {
  search: string
  type: DocumentType | 'all'
  status: DocumentStatus | 'all'
  year: string
  tag: string
}

export interface LegalDocumentStats {
  total: number
  ordinances: number
  executiveOrders: number
  resolutions: number
  active: number
  repealed: number
  amended: number
  draft: number
}
