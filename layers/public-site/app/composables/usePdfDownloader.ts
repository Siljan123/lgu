import { ref } from 'vue'
import type { DisclosureDocument } from './useFullDisclosure'
import { useMunicipalOfficials } from './useMunicipalOfficials'

export const usePdfDownloader = () => {
  const downloadingId = ref<string | null>(null)
  const downloadSuccessId = ref<string | null>(null)
  const isDownloading = ref(false)
  const { mayor, getOfficialByOffice } = useMunicipalOfficials()

  const downloadPdf = async (doc: DisclosureDocument) => {
    if (isDownloading.value) return

    downloadingId.value = doc.id
    isDownloading.value = true

    try {
      // Simulate realistic download latency for feedback
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (doc.pdfUrl && doc.pdfUrl !== '#') {
        const link = document.createElement('a')
        link.href = doc.pdfUrl
        link.download = `${doc.title.replace(/[^a-zA-Z0-9_\-—]/g, '_')}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // Dynamic Signatories
        const certifierName = doc.certifyingOfficer || getOfficialByOffice(doc.publishedBy).name
        const certifierTitle = doc.publishedBy
        const approverName = doc.approvingOfficer?.name || mayor.value?.name
        const approverTitle = doc.approvingOfficer?.title || mayor.value?.title

        // Construct comprehensive, accurate PDF document from useFullDisclosure.ts data
        const titleText = doc.title.toUpperCase()
        const categoryText = `${doc.categoryTitle} (${doc.categoryId})`
        const officeText = doc.publishedBy
        const periodText = doc.periodCovered
        const yearQuarterText = `${doc.year} ${doc.quarter}`
        const dateText = doc.publishedDate
        const descText = doc.categoryDescription

        const highlightsText = (doc.summaryHighlights || [])
          .map((h, i) => `  [${i + 1}] ${h}`)
          .join('\n')

        const breakdownText = (doc.financialBreakdown || [])
          .map((b) => `  * ${b.label}: ${b.amount} [${b.status || 'Verified'}]`)
          .join('\n')

        const fullReportText = `
================================================================================
REPUBLIC OF THE PHILIPPINES
PROVINCE OF AGUSAN DEL SUR
MUNICIPALITY OF SAN FRANCISCO
DILG FULL DISCLOSURE POLICY COMPLIANCE REPORT
================================================================================

DOCUMENT TITLE       : ${titleText}
CATEGORY             : ${categoryText}
CATEGORY PURPOSE     : ${descText}
PUBLISHED BY         : ${officeText}
PERIOD COVERED       : ${periodText}
FISCAL PERIOD        : ${yearQuarterText}
PUBLICATION DATE     : ${dateText}
DOCUMENT CONTROL ID  : ${doc.id.toUpperCase()}
FILE SIZE METADATA   : ${doc.fileSize}

--------------------------------------------------------------------------------
EXECUTIVE HIGHLIGHTS & ACCOMPLISHMENTS:
--------------------------------------------------------------------------------
${highlightsText}

--------------------------------------------------------------------------------
FINANCIAL ALLOCATION & UTILIZATION BREAKDOWN:
--------------------------------------------------------------------------------
${breakdownText}

--------------------------------------------------------------------------------
DILG COMPLIANCE CERTIFICATION:
--------------------------------------------------------------------------------
I hereby certify that the financial and operational information presented in
this report is true, correct, and completely aligned with the official books of
accounts and records of the Local Government Unit of San Francisco, Agusan del
Sur in strict adherence to RA 9485 & DILG Full Disclosure Policy guidelines.

PREPARED & CERTIFIED CORRECT BY:
${certifierName}
${certifierTitle}

APPROVED FOR PUBLIC RELEASE:
${approverName}
${approverTitle}, LGU San Francisco, Agusan del Sur
================================================================================
`.trim()

        // Create PDF Stream Blob with exact text data embedded
        const pdfHeader = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj 4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Courier>>endobj 5 0 obj<</Length ${fullReportText.length + 200}>>stream\nBT /F1 9 Tf 36 750 Td 12 TL\n`
        
        const escapedContent = fullReportText
          .replace(/\\/g, '\\\\')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .split('\n')
          .map(line => `(${line}) '`)
          .join('\n')

        const pdfFooter = `\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000238 00000 n \n0000000304 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n600\n%%EOF`

        const pdfData = pdfHeader + escapedContent + pdfFooter
        const blob = new Blob([pdfData], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${doc.title.replace(/[^a-zA-Z0-9_\-—]/g, '_')}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      downloadSuccessId.value = doc.id
      setTimeout(() => {
        if (downloadSuccessId.value === doc.id) {
          downloadSuccessId.value = null
        }
      }, 2500)
    } catch (error) {
      console.error('Failed to download PDF document:', error)
    } finally {
      downloadingId.value = null
      isDownloading.value = false
    }
  }

  return {
    downloadingId,
    downloadSuccessId,
    isDownloading,
    downloadPdf
  }
}
