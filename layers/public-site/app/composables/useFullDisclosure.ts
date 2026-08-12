import { ref, computed } from 'vue'

export interface DisclosureCategory {
  id: string
  title: string
  description: string
  office: string
  iconName?: string
}

export interface FinancialBreakdownItem {
  label: string
  amount: string
  status?: string
}

export interface DisclosureDocument {
  id: string
  categoryId: string
  categoryTitle: string
  categoryDescription: string
  title: string
  year: number
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Annual'
  periodCovered: string
  publishedBy: string
  publishedDate: string
  fileSize: string
  pdfUrl: string
  certificationOfficer?: string
  certifyingOfficer?: string
  approvingOfficer?: { name: string; title: string }
  summaryHighlights: string[]
  financialBreakdown: FinancialBreakdownItem[]
}

export const DISCLOSURE_CATEGORIES: DisclosureCategory[] = [
  {
    id: 'annual-budget',
    title: 'Annual Budget',
    description: 'The approved annual budget of the Municipality, detailing planned expenditures across all local government programs and services.',
    office: 'Municipal Budget Office'
  },
  {
    id: 'sre',
    title: 'Statement of Receipts and Expenditures (SRE)',
    description: "A quarterly report showing the Municipality's actual income and spending, ensuring public funds are accounted for and properly utilized.",
    office: "Municipal Treasurer's Office"
  },
  {
    id: 'development-fund',
    title: '20% Development Fund Utilization',
    description: 'A report on how the mandatory 20% share of the Internal Revenue Allotment (IRA) was used to fund local development projects.',
    office: 'Municipal Planning and Development Office'
  },
  {
    id: 'sef',
    title: 'Special Education Fund (SEF) Utilization',
    description: 'A report detailing the use of education-related tax revenues to support school programs and facilities within the Municipality.',
    office: 'Local School Board / Municipal Treasurer'
  },
  {
    id: 'ldrrmf',
    title: 'Local Disaster Risk Reduction and Management Fund (LDRRMF) Utilization',
    description: 'A report on the allocation and use of funds set aside for disaster preparedness, response, and mitigation programs.',
    office: 'MDRRMO / Municipal Accountant'
  },
  {
    id: 'app',
    title: 'Annual Procurement Plan',
    description: 'A list of goods, services, and infrastructure projects the Municipality plans to procure within the fiscal year.',
    office: 'Bids and Awards Committee (BAC)'
  },
  {
    id: 'bids',
    title: 'Bids and Public Offerings',
    description: 'Public notices of ongoing and completed bidding activities for government contracts and procurement.',
    office: 'Bids and Awards Committee Secretariat'
  },
  {
    id: 'gad',
    title: 'Gender and Development (GAD) Fund Utilization',
    description: 'A report on programs and expenditures supporting gender equality and women\'s empowerment initiatives.',
    office: 'Municipal Social Welfare & Development Office'
  },
  {
    id: 'fdp-summary',
    title: 'Full Disclosure Summary Report',
    description: 'A consolidated quarterly summary covering all the reports above, submitted to DILG as part of the Full Disclosure Policy compliance requirement.',
    office: 'Office of the Municipal Mayor / DILG Focal'
  }
]

export const MOCK_DISCLOSURE_DOCUMENTS: DisclosureDocument[] = [
  // 2026 Q1 Documents
  {
    id: 'doc-sre-2026-q1',
    categoryId: 'sre',
    categoryTitle: 'Statement of Receipts and Expenditures (SRE)',
    categoryDescription: "A quarterly report showing the Municipality's actual income and spending, ensuring public funds are accounted for and properly utilized.",
    title: 'Statement of Receipts and Expenditures — Q1 2026',
    year: 2026,
    quarter: 'Q1',
    periodCovered: 'January to March 2026',
    publishedBy: "Municipal Treasurer's Office",
    publishedDate: 'April 15, 2026',
    fileSize: '2.4 MB',
    pdfUrl: '#',
    certificationOfficer: 'Eleanor V. Santos, CPA (Municipal Treasurer)',
    certifyingOfficer: 'Eleanor V. Santos, CPA (Municipal Treasurer)',
    summaryHighlights: [
      'Total revenue collections exceeded Q1 targets by 8.4% due to enhanced business tax collections.',
      'Operational spending maintained under approved budget ceiling across all municipal departments.',
      'Full compliance with DILG quarterly submission schedule.'
    ],
    financialBreakdown: [
      { label: 'Local Tax Revenue', amount: 'PHP 45,280,000.00', status: 'Collected' },
      { label: 'Internal Revenue Allotment (NTA)', amount: 'PHP 128,450,000.00', status: 'Received' },
      { label: 'Non-Tax Revenue & Permits', amount: 'PHP 12,320,000.00', status: 'Collected' },
      { label: 'Personal Services (Salaries & Benefits)', amount: 'PHP 62,100,000.00', status: 'Disbursed' },
      { label: 'Maintenance & Other Operating Expenses (MOOE)', amount: 'PHP 41,800,000.00', status: 'Disbursed' },
      { label: 'Capital Outlay & Equipment', amount: 'PHP 18,500,000.00', status: 'Disbursed' }
    ]
  },
  {
    id: 'doc-fdp-2026-q1',
    categoryId: 'fdp-summary',
    categoryTitle: 'Full Disclosure Summary Report',
    categoryDescription: 'A consolidated quarterly summary covering all the reports above, submitted to DILG as part of the Full Disclosure Policy compliance requirement.',
    title: 'Full Disclosure Summary Report — Q1 2026',
    year: 2026,
    quarter: 'Q1',
    periodCovered: 'January to March 2026',
    publishedBy: 'Office of the Municipal Mayor',
    publishedDate: 'April 20, 2026',
    fileSize: '1.8 MB',
    pdfUrl: '#',
    certificationOfficer: 'Hon. Grace A. Rodriguez (Municipal Mayor)',
    certifyingOfficer: 'Hon. Grace A. Rodriguez (Municipal Mayor)',
    summaryHighlights: [
      'Consolidated compliance score of 100% on DILG Full Disclosure Portal.',
      'All 9 mandatory quarterly disclosure reports posted physically and digitally within 20 days post-quarter.',
      'Zero audit disallowance reported for Q1 2026.'
    ],
    financialBreakdown: [
      { label: 'General Fund Executed Balance', amount: 'PHP 186,050,000.00', status: 'Balanced' },
      { label: 'Special Education Fund Executed Balance', amount: 'PHP 14,200,000.00', status: 'Balanced' },
      { label: '20% Development Fund Executed Balance', amount: 'PHP 25,690,000.00', status: 'Balanced' },
      { label: 'LDRRM Fund Executed Balance', amount: 'PHP 9,300,000.00', status: 'Balanced' }
    ]
  },
  {
    id: 'doc-dev-2026-q1',
    categoryId: 'development-fund',
    categoryTitle: '20% Development Fund Utilization',
    categoryDescription: 'A report on how the mandatory 20% share of the Internal Revenue Allotment (IRA) was used to fund local development projects.',
    title: '20% Development Fund Utilization — Q1 2026',
    year: 2026,
    quarter: 'Q1',
    periodCovered: 'January to March 2026',
    publishedBy: 'Municipal Planning and Development Office',
    publishedDate: 'April 18, 2026',
    fileSize: '3.1 MB',
    pdfUrl: '#',
    certificationOfficer: 'Engr. Marcos R. Peralta (MPDC)',
    certifyingOfficer: 'Engr. Marcos R. Peralta (MPDC)',
    summaryHighlights: [
      'Completion of Phase 2 Municipal Drainage Infrastructure in Brgy. Hubang.',
      'Concreting of Barangay Farm-to-Market Access Road in Brgy. Alegria.',
      'Solar-powered street lighting installation along National Highway corridor.'
    ],
    financialBreakdown: [
      { label: 'Barangay Infrastructure Development', amount: 'PHP 12,400,000.00', status: 'Completed' },
      { label: 'Agricultural Assistance & Solar Facilities', amount: 'PHP 8,290,000.00', status: 'Ongoing' },
      { label: 'Environmental Management Infrastructure', amount: 'PHP 5,000,000.00', status: 'Ongoing' }
    ]
  },
  {
    id: 'doc-sef-2026-q1',
    categoryId: 'sef',
    categoryTitle: 'Special Education Fund (SEF) Utilization',
    categoryDescription: 'A report detailing the use of education-related tax revenues to support school programs and facilities within the Municipality.',
    title: 'Special Education Fund (SEF) Utilization — Q1 2026',
    year: 2026,
    quarter: 'Q1',
    periodCovered: 'January to March 2026',
    publishedBy: 'Local School Board / Municipal Treasurer',
    publishedDate: 'April 14, 2026',
    fileSize: '1.5 MB',
    pdfUrl: '#',
    certificationOfficer: 'Dr. Remedios C. Tan (DepEd District Supervisor / Co-Chair)',
    certifyingOfficer: 'Dr. Remedios C. Tan (DepEd District Supervisor / Co-Chair)',
    summaryHighlights: [
      'Funding for 45 LGU-subsidized public school teaching assistants.',
      'Procurement of 120 desktop computers for municipal high school digital hubs.',
      'School building repair and electrification projects across 6 barangay elementary schools.'
    ],
    financialBreakdown: [
      { label: 'Instructional Materials & Digital Labs', amount: 'PHP 5,600,000.00', status: 'Procured' },
      { label: 'School Building Rehabilitation', amount: 'PHP 4,800,000.00', status: 'In Progress' },
      { label: 'DepEd Student Sports & Cultural Programs', amount: 'PHP 3,800,000.00', status: 'Disbursed' }
    ]
  },
  {
    id: 'doc-ldrrmf-2026-q1',
    categoryId: 'ldrrmf',
    categoryTitle: 'Local Disaster Risk Reduction and Management Fund (LDRRMF) Utilization',
    categoryDescription: 'A report on the allocation and use of funds set aside for disaster preparedness, response, and mitigation programs.',
    title: 'Local Disaster Risk Reduction and Management Fund (LDRRMF) Utilization — Q1 2026',
    year: 2026,
    quarter: 'Q1',
    periodCovered: 'January to March 2026',
    publishedBy: 'MDRRMO / Municipal Accountant',
    publishedDate: 'April 12, 2026',
    fileSize: '2.0 MB',
    pdfUrl: '#',
    certificationOfficer: 'Capt. Fernando B. Magsaysay (MDRRM Officer)',
    certifyingOfficer: 'Capt. Fernando B. Magsaysay (MDRRM Officer)',
    summaryHighlights: [
      'Acquisition of 2 heavy-duty rescue boats and flood early warning sirens.',
      'Pre-positioning of 5,000 emergency relief packs in central warehouse.',
      'Quarterly barangay disaster preparedness drill conducted across all 27 barangays.'
    ],
    financialBreakdown: [
      { label: 'Disaster Prevention & Mitigation (70%)', amount: 'PHP 6,510,000.00', status: 'Allocated' },
      { label: 'Quick Response Fund (QRF - 30%)', amount: 'PHP 2,790,000.00', status: 'Reserved' }
    ]
  },
  {
    id: 'doc-app-2026-annual',
    categoryId: 'app',
    categoryTitle: 'Annual Procurement Plan',
    categoryDescription: 'A list of goods, services, and infrastructure projects the Municipality plans to procure within the fiscal year.',
    title: 'Annual Procurement Plan — FY 2026',
    year: 2026,
    quarter: 'Annual',
    periodCovered: 'Fiscal Year 2026',
    publishedBy: 'Bids and Awards Committee (BAC)',
    publishedDate: 'January 10, 2026',
    fileSize: '4.7 MB',
    pdfUrl: '#',
    certificationOfficer: 'Atty. Manuel T. Cordero (BAC Chairperson)',
    certifyingOfficer: 'Atty. Manuel T. Cordero (BAC Chairperson)',
    summaryHighlights: [
      'Comprehensive procurement program for goods, consulting services, and civil works.',
      'Estimated total contract value of PHP 245 Million across 142 bidding packages.',
      'Adherence to RA 9184 Government Procurement Reform Act.'
    ],
    financialBreakdown: [
      { label: 'Civil Works & Public Infrastructure', amount: 'PHP 135,000,000.00', status: 'Approved' },
      { label: 'Goods, Supplies & Equipment', amount: 'PHP 85,000,000.00', status: 'Approved' },
      { label: 'Consulting & Specialized Services', amount: 'PHP 25,000,000.00', status: 'Approved' }
    ]
  },
  {
    id: 'doc-budget-2026-annual',
    categoryId: 'annual-budget',
    categoryTitle: 'Annual Budget',
    categoryDescription: 'The approved annual budget of the Municipality, detailing planned expenditures across all local government programs and services.',
    title: 'Executive Budget & Appropriation Ordinance — FY 2026',
    year: 2026,
    quarter: 'Annual',
    periodCovered: 'Fiscal Year 2026',
    publishedBy: 'Municipal Budget Office',
    publishedDate: 'January 05, 2026',
    fileSize: '5.2 MB',
    pdfUrl: '#',
    certificationOfficer: 'Corazon L. Reyes (Municipal Budget Officer)',
    certifyingOfficer: 'Corazon L. Reyes (Municipal Budget Officer)',
    summaryHighlights: [
      'Enacted under Sangguniang Bayan Appropriation Ordinance No. 2025-08.',
      'Total General Fund budget of PHP 642,500,000.00.',
      'Priority sector allocation: Economic Services (38%), Social Services (34%), General Public Services (28%).'
    ],
    financialBreakdown: [
      { label: 'Economic Services Sector', amount: 'PHP 244,150,000.00', status: 'Appropriated' },
      { label: 'Social Welfare & Health Sector', amount: 'PHP 218,450,000.00', status: 'Appropriated' },
      { label: 'General Administrative Services', amount: 'PHP 179,900,000.00', status: 'Appropriated' }
    ]
  },
  {
    id: 'doc-bids-2026-q1',
    categoryId: 'bids',
    categoryTitle: 'Bids and Public Offerings',
    categoryDescription: 'Public notices of ongoing and completed bidding activities for government contracts and procurement.',
    title: 'Bids and Public Offerings Summary — Q1 2026',
    year: 2026,
    quarter: 'Q1',
    periodCovered: 'January to March 2026',
    publishedBy: 'Bids and Awards Committee Secretariat',
    publishedDate: 'March 31, 2026',
    fileSize: '1.9 MB',
    pdfUrl: '#',
    certificationOfficer: 'Sec. Maria Luisa B. Gomez (BAC Secretariat Head)',
    certifyingOfficer: 'Sec. Maria Luisa B. Gomez (BAC Secretariat Head)',
    summaryHighlights: [
      'Public posting of 28 invitations to bid via PhilGEPS and LGU Portal.',
      'Awarding of 22 competitive contracts totaling PHP 48.5 Million.',
      'Zero failure of bidding recorded for Q1 2026.'
    ],
    financialBreakdown: [
      { label: 'Awarded Public Infrastructure Contracts', amount: 'PHP 32,100,000.00', status: 'Awarded' },
      { label: 'Awarded Goods & Equipment Supply', amount: 'PHP 16,400,000.00', status: 'Awarded' }
    ]
  },
  {
    id: 'doc-gad-2026-q1',
    categoryId: 'gad',
    categoryTitle: 'Gender and Development (GAD) Fund Utilization',
    categoryDescription: 'A report on programs and expenditures supporting gender equality and women\'s empowerment initiatives.',
    title: 'Gender and Development (GAD) Fund Utilization — Q1 2026',
    year: 2026,
    quarter: 'Q1',
    periodCovered: 'January to March 2026',
    publishedBy: 'Municipal Social Welfare & Development Office',
    publishedDate: 'April 16, 2026',
    fileSize: '1.6 MB',
    pdfUrl: '#',
    certificationOfficer: 'Teresa S. Aquino (MSWDO Head / GAD Focal Person)',
    certifyingOfficer: 'Teresa S. Aquino (MSWDO Head / GAD Focal Person)',
    summaryHighlights: [
      'Implementation of Municipal Women Livelihood Training Program.',
      'Upgrade of Maternal and Child Health Center facilities in 4 rural barangays.',
      'Anti-VAWC campaign and legal assistance desks in all municipal barangay halls.'
    ],
    financialBreakdown: [
      { label: 'Women Livelihood & Empowerment Programs', amount: 'PHP 4,200,000.00', status: 'Utilized' },
      { label: 'Maternal & Child Health Care Upgrades', amount: 'PHP 3,800,000.00', status: 'Utilized' },
      { label: 'Anti-VAWC & Gender Sensitivity Seminars', amount: 'PHP 1,500,000.00', status: 'Utilized' }
    ]
  },

  // 2025 Documents
  {
    id: 'doc-sre-2025-q4',
    categoryId: 'sre',
    categoryTitle: 'Statement of Receipts and Expenditures (SRE)',
    categoryDescription: "A quarterly report showing the Municipality's actual income and spending, ensuring public funds are accounted for and properly utilized.",
    title: 'Statement of Receipts and Expenditures — Q4 2025',
    year: 2025,
    quarter: 'Q4',
    periodCovered: 'October to December 2025',
    publishedBy: "Municipal Treasurer's Office",
    publishedDate: 'January 15, 2026',
    fileSize: '2.3 MB',
    pdfUrl: '#',
    certificationOfficer: 'Eleanor V. Santos, CPA (Municipal Treasurer)',
    certifyingOfficer: 'Eleanor V. Santos, CPA (Municipal Treasurer)',
    summaryHighlights: [
      'Year-end financial reconciliation completed with COA Audit team.',
      'Achieved 102% total annual revenue collection target for FY 2025.'
    ],
    financialBreakdown: [
      { label: 'Total Q4 Revenue Receipts', amount: 'PHP 154,200,000.00', status: 'Collected' },
      { label: 'Total Q4 Operations Spending', amount: 'PHP 142,800,000.00', status: 'Disbursed' }
    ]
  },
  {
    id: 'doc-sre-2025-q3',
    categoryId: 'sre',
    categoryTitle: 'Statement of Receipts and Expenditures (SRE)',
    categoryDescription: "A quarterly report showing the Municipality's actual income and spending, ensuring public funds are accounted for and properly utilized.",
    title: 'Statement of Receipts and Expenditures — Q3 2025',
    year: 2025,
    quarter: 'Q3',
    periodCovered: 'July to September 2025',
    publishedBy: "Municipal Treasurer's Office",
    publishedDate: 'October 15, 2025',
    fileSize: '2.2 MB',
    pdfUrl: '#',
    certificationOfficer: 'Eleanor V. Santos, CPA (Municipal Treasurer)',
    certifyingOfficer: 'Eleanor V. Santos, CPA (Municipal Treasurer)',
    summaryHighlights: [
      'Third quarter financial performance report certified by Municipal Accountant.',
      'On-track execution of general fund appropriations.'
    ],
    financialBreakdown: [
      { label: 'Q3 Local Revenue Receipts', amount: 'PHP 38,900,000.00', status: 'Collected' },
      { label: 'Q3 National Tax Allotment Share', amount: 'PHP 121,500,000.00', status: 'Received' }
    ]
  },
  {
    id: 'doc-budget-2025-annual',
    categoryId: 'annual-budget',
    categoryTitle: 'Annual Budget',
    categoryDescription: 'The approved annual budget of the Municipality, detailing planned expenditures across all local government programs and services.',
    title: 'Approved Annual Budget — FY 2025',
    year: 2025,
    quarter: 'Annual',
    periodCovered: 'Fiscal Year 2025',
    publishedBy: 'Municipal Budget Office',
    publishedDate: 'January 08, 2025',
    fileSize: '4.8 MB',
    pdfUrl: '#',
    certificationOfficer: 'Corazon L. Reyes (Municipal Budget Officer)',
    certifyingOfficer: 'Corazon L. Reyes (Municipal Budget Officer)',
    summaryHighlights: [
      'Annual Appropriation Ordinance No. 2024-12 enacted by Sangguniang Bayan.',
      'Total approved operating budget of PHP 595,000,000.00.'
    ],
    financialBreakdown: [
      { label: 'General Administration', amount: 'PHP 165,000,000.00', status: 'Executed' },
      { label: 'Social & Health Infrastructure', amount: 'PHP 210,000,000.00', status: 'Executed' },
      { label: 'Economic & Agricultural Development', amount: 'PHP 220,000,000.00', status: 'Executed' }
    ]
  },
  {
    id: 'doc-fdp-2025-q4',
    categoryId: 'fdp-summary',
    categoryTitle: 'Full Disclosure Summary Report',
    categoryDescription: 'A consolidated quarterly summary covering all the reports above, submitted to DILG as part of the Full Disclosure Policy compliance requirement.',
    title: 'Full Disclosure Summary Report — Q4 2025',
    year: 2025,
    quarter: 'Q4',
    periodCovered: 'October to December 2025',
    publishedBy: 'Office of the Municipal Mayor',
    publishedDate: 'January 22, 2026',
    fileSize: '1.9 MB',
    pdfUrl: '#',
    certificationOfficer: 'Hon. Grace A. Rodriguez (Municipal Mayor)',
    certifyingOfficer: 'Hon. Grace A. Rodriguez (Municipal Mayor)',
    summaryHighlights: [
      'Full quarterly compliance confirmation issued by DILG Regional Office XIII.'
    ],
    financialBreakdown: [
      { label: 'Consolidated General Fund Balance', amount: 'PHP 172,400,000.00', status: 'Balanced' }
    ]
  },
  {
    id: 'doc-dev-2025-q4',
    categoryId: 'development-fund',
    categoryTitle: '20% Development Fund Utilization',
    categoryDescription: 'A report on how the mandatory 20% share of the Internal Revenue Allotment (IRA) was used to fund local development projects.',
    title: '20% Development Fund Utilization — Q4 2025',
    year: 2025,
    quarter: 'Q4',
    periodCovered: 'October to December 2025',
    publishedBy: 'Municipal Planning and Development Office',
    publishedDate: 'January 18, 2026',
    fileSize: '2.9 MB',
    pdfUrl: '#',
    certificationOfficer: 'Engr. Marcos R. Peralta (MPDC)',
    certifyingOfficer: 'Engr. Marcos R. Peralta (MPDC)',
    summaryHighlights: [
      'Quarterly development projects milestone report submitted to Municipal Development Council.'
    ],
    financialBreakdown: [
      { label: 'Infrastructure & Water System Projects', amount: 'PHP 22,500,000.00', status: 'Completed' }
    ]
  },

  // 2024 Documents
  {
    id: 'doc-budget-2024-annual',
    categoryId: 'annual-budget',
    categoryTitle: 'Annual Budget',
    categoryDescription: 'The approved annual budget of the Municipality, detailing planned expenditures across all local government programs and services.',
    title: 'Approved Annual Budget — FY 2024',
    year: 2024,
    quarter: 'Annual',
    periodCovered: 'Fiscal Year 2024',
    publishedBy: 'Municipal Budget Office',
    publishedDate: 'January 12, 2024',
    fileSize: '4.5 MB',
    pdfUrl: '#',
    certificationOfficer: 'Corazon L. Reyes (Municipal Budget Officer)',
    certifyingOfficer: 'Corazon L. Reyes (Municipal Budget Officer)',
    summaryHighlights: [
      'Sangguniang Bayan Ordinance No. 2023-11 approved budget for FY 2024.'
    ],
    financialBreakdown: [
      { label: 'Total Annual Appropriations', amount: 'PHP 540,000,000.00', status: 'Closed' }
    ]
  },
  {
    id: 'doc-sre-2024-annual',
    categoryId: 'sre',
    categoryTitle: 'Statement of Receipts and Expenditures (SRE)',
    categoryDescription: "A quarterly report showing the Municipality's actual income and spending, ensuring public funds are accounted for and properly utilized.",
    title: 'Statement of Receipts and Expenditures — Annual 2024',
    year: 2024,
    quarter: 'Annual',
    periodCovered: 'January to December 2024',
    publishedBy: "Municipal Treasurer's Office",
    publishedDate: 'January 30, 2025',
    fileSize: '3.4 MB',
    pdfUrl: '#',
    certificationOfficer: 'Eleanor V. Santos, CPA (Municipal Treasurer)',
    certifyingOfficer: 'Eleanor V. Santos, CPA (Municipal Treasurer)',
    summaryHighlights: [
      'COA audited annual Statement of Receipts and Expenditures for FY 2024.'
    ],
    financialBreakdown: [
      { label: 'Total Actual Revenue Receipts', amount: 'PHP 552,300,000.00', status: 'Audited' },
      { label: 'Total Actual Expenditures', amount: 'PHP 518,900,000.00', status: 'Audited' }
    ]
  },
  {
    id: 'doc-app-2024-annual',
    categoryId: 'app',
    categoryTitle: 'Annual Procurement Plan',
    categoryDescription: 'A list of goods, services, and infrastructure projects the Municipality plans to procure within the fiscal year.',
    title: 'Annual Procurement Plan — FY 2024',
    year: 2024,
    quarter: 'Annual',
    periodCovered: 'Fiscal Year 2024',
    publishedBy: 'Bids and Awards Committee (BAC)',
    publishedDate: 'January 15, 2024',
    fileSize: '4.1 MB',
    pdfUrl: '#',
    certificationOfficer: 'Atty. Manuel T. Cordero (BAC Chairperson)',
    certifyingOfficer: 'Atty. Manuel T. Cordero (BAC Chairperson)',
    summaryHighlights: [
      'Annual procurement audit report for FY 2024 submitted to BAC Secretariat.'
    ],
    financialBreakdown: [
      { label: 'Total Procured Contracts Value', amount: 'PHP 210,000,000.00', status: 'Procured' }
    ]
  }
]

export const useFullDisclosure = () => {
  const selectedYear = ref<string>('All')
  const selectedQuarter = ref<string>('All')
  const selectedCategory = ref<string>('All')
  const searchQuery = ref<string>('')

  const availableYears = ['All', '2026', '2025', '2024']
  const availableQuarters = ['All', 'Q1', 'Q2', 'Q3', 'Q4', 'Annual']

  // Category map for quick lookup
  const categories = ref<DisclosureCategory[]>(DISCLOSURE_CATEGORIES)
  const rawDocuments = ref<DisclosureDocument[]>(MOCK_DISCLOSURE_DOCUMENTS)

  // Document count per category ID
  const categoryDocumentCounts = computed(() => {
    const counts: Record<string, number> = {}
    categories.value.forEach(cat => {
      counts[cat.id] = rawDocuments.value.filter(doc => doc.categoryId === cat.id).length
    })
    return counts
  })

  // Filtered documents list
  const filteredDocuments = computed(() => {
    return rawDocuments.value.filter(doc => {
      // Year filter
      if (selectedYear.value !== 'All' && doc.year.toString() !== selectedYear.value) {
        return false
      }

      // Quarter filter
      if (selectedQuarter.value !== 'All' && doc.quarter !== selectedQuarter.value) {
        return false
      }

      // Category filter
      if (selectedCategory.value !== 'All' && doc.categoryId !== selectedCategory.value) {
        return false
      }

      // Search query filter
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim()
        const matchesTitle = doc.title.toLowerCase().includes(q)
        const matchesCategory = doc.categoryTitle.toLowerCase().includes(q)
        const matchesOffice = doc.publishedBy.toLowerCase().includes(q)
        const matchesPeriod = doc.periodCovered.toLowerCase().includes(q)

        if (!matchesTitle && !matchesCategory && !matchesOffice && !matchesPeriod) {
          return false
        }
      }

      return true
    })
  })

  const activeFiltersCount = computed(() => {
    let count = 0
    if (selectedYear.value !== 'All') count++
    if (selectedQuarter.value !== 'All') count++
    if (selectedCategory.value !== 'All') count++
    if (searchQuery.value.trim() !== '') count++
    return count
  })

  const resetFilters = () => {
    selectedYear.value = 'All'
    selectedQuarter.value = 'All'
    selectedCategory.value = 'All'
    searchQuery.value = ''
  }

  const selectCategory = (categoryId: string) => {
    if (selectedCategory.value === categoryId) {
      selectedCategory.value = 'All'
    } else {
      selectedCategory.value = categoryId
    }
  }

  return {
    categories,
    selectedYear,
    selectedQuarter,
    selectedCategory,
    searchQuery,
    availableYears,
    availableQuarters,
    categoryDocumentCounts,
    filteredDocuments,
    activeFiltersCount,
    resetFilters,
    selectCategory
  }
}
