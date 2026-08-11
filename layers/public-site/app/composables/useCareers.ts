import { ref, computed } from 'vue'

export interface QualificationStandards {
  education: string
  experience: string
  training: string
  eligibility: string
  competencies: string[]
}

export interface VacantPosition {
  id: string
  itemNo: string
  positionTitle: string
  office: string
  officeCode: string
  salaryGrade: number
  monthlySalary: number
  employmentStatus: 'Permanent' | 'Coterminous' | 'Contractual'
  postingDate: string
  closingDate: string
  isOpen: boolean
  qualificationStandards: QualificationStandards
  duties: string[]
  requiredDocuments: string[]
}

export interface PromotedEmployee {
  id: string
  employeeName: string
  avatar?: string
  previousPosition: string
  promotedPosition: string
  department: string
  departmentCode: string
  effectiveDate: string
  cscResolution: string
  commendation: string
  year: number
}

export interface AwardRecognition {
  id: string
  awardTitle: string
  recipientName: string
  recipientType: 'Individual' | 'Office'
  awardingBody: string
  year: number
  category: 'CSC Honor Awards' | 'DILG Governance' | 'LGU PRAISE Excellence'
  citation: string
  badgeText: string
  image?: string
}

export const useCareersData = () => {
  const activeTab = ref<'vacancies' | 'promotions' | 'awards'>('vacancies')

  // Search & Filter state for Vacancies
  const vacancySearchQuery = ref('')
  const selectedOfficeFilter = ref('ALL')
  const selectedStatusFilter = ref('ALL')
  const selectedSalaryFilter = ref('ALL')
  const selectedJobModal = ref<VacantPosition | null>(null)
  const isJobModalOpen = ref(false)

  // Search & Filter state for Promotions
  const promotionSearchQuery = ref('')
  const promotionYearFilter = ref('ALL')

  // Search & Filter state for Awards
  const awardSearchQuery = ref('')
  const awardCategoryFilter = ref('ALL')

  // --- MOCK DATA: VACANT POSITIONS ---
  const vacancies: VacantPosition[] = [
    {
      id: 'vac-001',
      itemNo: 'MGB-HRMO-001-2026',
      positionTitle: 'Human Resource Management Officer V',
      office: 'Human Resource Management Office (HRMO)',
      officeCode: 'HRMO',
      salaryGrade: 24,
      monthlySalary: 93269,
      employmentStatus: 'Permanent',
      postingDate: 'February 1, 2026',
      closingDate: 'February 25, 2026',
      isOpen: true,
      qualificationStandards: {
        education: "Master's Degree relevant to the job or Master in Public Administration (MPA)",
        experience: '4 years of supervisory experience in human resource management and administrative development',
        training: '40 hours of supervisory management training learning and development interventions',
        eligibility: 'Career Service Professional / Second Level Eligibility',
        competencies: [
          'Strategic HR Management & Workforce Planning',
          'Civil Service Law & CSC Rules Administration',
          'Performance Management System (SPMS) Facilitation',
          'Organizational Development & Talent Management'
        ]
      },
      duties: [
        'Direct and supervise the formulation and execution of municipal HR policies, recruitment, selection, and placement.',
        'Oversee the Strategic Performance Management System (SPMS) and Learning and Development (L&D) interventions.',
        'Ensure compliance with Civil Service Commission (CSC) laws, rules, and regulations on appointment and merit principles.',
        'Advise the Municipal Mayor and Heads of Offices on organizational structure, staffing, and personnel relations.'
      ],
      requiredDocuments: [
        'Fully accomplished Personal Data Sheet (PDS) with recent passport-sized picture (CS Form No. 212, Revised 2017) and Work Experience Sheet',
        'Performance rating in the last rating period (if applicable)',
        'Authenticated copy of Civil Service Eligibility / PRC Board Rating & License',
        'Authenticated Copy of Transcript of Records (TOR) and Diploma',
        'Certificates of relevant training and seminars attended'
      ]
    },
    {
      id: 'vac-002',
      itemNo: 'MGB-ACCT-004-2026',
      positionTitle: 'Accountant II',
      office: 'Office of the Municipal Accountant',
      officeCode: 'ACCOUNTING',
      salaryGrade: 16,
      monthlySalary: 39672,
      employmentStatus: 'Permanent',
      postingDate: 'February 5, 2026',
      closingDate: 'February 28, 2026',
      isOpen: true,
      qualificationStandards: {
        education: "Bachelor's Degree in Accountancy (BS Accountancy)",
        experience: '1 year of relevant accounting or auditing experience',
        training: '4 hours of relevant training in government accounting and internal control systems',
        eligibility: 'RA 1080 (Certified Public Accountant - CPA)',
        competencies: [
          'eNGAS & Government Financial Management',
          'Financial Statement Analysis & Journal Voucher Processing',
          'COA Compliance & Disallowance Resolution',
          'Tax Withholding & Remittance Compliance'
        ]
      },
      duties: [
        'Prepare monthly and annual financial statements, trial balances, and supporting schedules in compliance with PPSAS.',
        'Review liquidation reports, disbursement vouchers, and payrolls for completeness and mathematical accuracy.',
        'Maintain book of accounts and ensure timely submission of financial reports to COA and the Municipal Treasurer.',
        'Assist in auditing municipal enterprise financial logs and asset inventories.'
      ],
      requiredDocuments: [
        'Fully accomplished CS Form No. 212 (PDS Rev. 2017) with Work Experience Sheet',
        'Authenticated CPA Board Rating and updated PRC License',
        'Authenticated Copy of Transcript of Records (TOR)',
        'Performance rating for the last rating period (if currently in government service)',
        'Certificate of Relevant Trainings'
      ]
    },
    {
      id: 'vac-003',
      itemNo: 'MGB-MENRO-002-2026',
      positionTitle: 'Environmental Management Specialist I',
      office: 'Municipal Environment and Natural Resources Office (MENRO)',
      officeCode: 'MENRO',
      salaryGrade: 11,
      monthlySalary: 27000,
      employmentStatus: 'Permanent',
      postingDate: 'January 28, 2026',
      closingDate: 'February 20, 2026',
      isOpen: true,
      qualificationStandards: {
        education: "Bachelor's Degree relevant to the job (BS Environmental Science, Forestry, Biology, or Civil/Chemical Engineering)",
        experience: 'None required (Entry Level)',
        training: 'None required',
        eligibility: 'Career Service Professional / Second Level Eligibility',
        competencies: [
          'Solid Waste Management Inspection (RA 9003)',
          'Environmental Impact Assessment & Inspection',
          'Community Extension & Resource Conservation Advocacy',
          'GIS & Environmental Data Collection'
        ]
      },
      duties: [
        'Conduct field inspections of commercial establishments for compliance with RA 9003 and local environmental ordinances.',
        'Assist in tree planting, watershed preservation, and coastal/river clean-up drives across barangays.',
        'Draft technical evaluation reports on barangay eco-waste management operations and material recovery facilities.',
        'Educate local communities and business owners on eco-bricking and waste segregation at source.'
      ],
      requiredDocuments: [
        'Accomplished PDS CS Form 212 (Revised 2017) with Work Experience Sheet',
        'Authenticated Copy of Transcript of Records (TOR)',
        'Certificate of CSC Professional Eligibility / RA 1080 if applicable',
        'Clean Barangay & NBI Clearance'
      ]
    },
    {
      id: 'vac-004',
      itemNo: 'MGB-IT-003-2026',
      positionTitle: 'Computer Programmer II',
      office: "Information Technology & Management Division (Mayor's Office)",
      officeCode: 'ITMD',
      salaryGrade: 15,
      monthlySalary: 36619,
      employmentStatus: 'Permanent',
      postingDate: 'February 2, 2026',
      closingDate: 'March 2, 2026',
      isOpen: true,
      qualificationStandards: {
        education: "Bachelor's Degree in Computer Science, Information Technology, or Software Engineering",
        experience: '1 year of relevant software development or web applications experience',
        training: '4 hours of relevant training in modern web frameworks (Vue/Nuxt, Node, SQL databases)',
        eligibility: 'Career Service Professional / EDP Specialist Eligibility / Second Level Eligibility',
        competencies: [
          'Full-Stack Web Development (Vue/TypeScript/SQL)',
          'RESTful API Integration & LGU e-Services Portal',
          'Database Design & Query Optimization',
          'Cybersecurity Standards & Data Privacy Act Compliance'
        ]
      },
      duties: [
        'Develop, maintain, and secure the San Francisco Municipal web applications, e-Services, and internal portal systems.',
        'Integrate online payment gateways and digital citizen queues for treasury, civil registry, and business permits.',
        'Optimize database queries and ensure routine data backup and disaster recovery mechanisms.',
        'Troubleshoot technical software issues and conduct end-user training for municipal staff.'
      ],
      requiredDocuments: [
        'Accomplished PDS CS Form 212 (Revised 2017) with Work Experience Sheet',
        'Authenticated Copy of TOR & Diploma',
        'Certificate of CSC Professional Eligibility / EDP Specialist Eligibility',
        'Portfolio / Github repository links or list of developed applications'
      ]
    },
    {
      id: 'vac-005',
      itemNo: 'MGB-MHO-008-2026',
      positionTitle: 'Midwife I',
      office: 'Municipal Health Office (MHO)',
      officeCode: 'MHO',
      salaryGrade: 9,
      monthlySalary: 21211,
      employmentStatus: 'Permanent',
      postingDate: 'January 20, 2026',
      closingDate: 'February 15, 2026',
      isOpen: true,
      qualificationStandards: {
        education: 'Completion of Midwifery Course',
        experience: 'None required',
        training: 'None required',
        eligibility: 'RA 1080 (Registered Midwife)',
        competencies: [
          'Maternal & Child Health Care Delivery',
          'Expanded Program on Immunization (EPI)',
          'Vital Signs & Pre-natal Assessment',
          'Barangay Health Center Record Keeping'
        ]
      },
      duties: [
        'Provide prenatal, natal, and postnatal health services to mothers in assigned rural health units and barangay health stations.',
        'Administer routine childhood immunizations and record growth parameters under the DOH expanded immunization program.',
        'Assist in community health nutrition programs and family planning education drives.',
        'Prepare monthly health reports for submission to the Municipal Health Officer.'
      ],
      requiredDocuments: [
        'Accomplished PDS CS Form 212 (Revised 2017)',
        'Authenticated PRC Midwife License & Board Rating Certificate',
        'Authenticated Copy of Transcript of Records / Midwifery Diploma',
        'Valid Medical Fitness Certificate'
      ]
    },
    {
      id: 'vac-006',
      itemNo: 'MGB-ENG-005-2026',
      positionTitle: 'Civil Engineer II',
      office: 'Office of the Municipal Engineer',
      officeCode: 'ENGINEERING',
      salaryGrade: 16,
      monthlySalary: 39672,
      employmentStatus: 'Permanent',
      postingDate: 'February 10, 2026',
      closingDate: 'March 10, 2026',
      isOpen: true,
      qualificationStandards: {
        education: "Bachelor's Degree in Civil Engineering",
        experience: '1 year of relevant experience in structural construction and public infrastructure supervision',
        training: '4 hours of relevant training in National Building Code enforcement and AutoCAD/BIM structural drafting',
        eligibility: 'RA 1080 (Registered Civil Engineer)',
        competencies: [
          'Structural Blueprint Reading & Cost Estimation',
          'National Building Code (PD 1096) Inspection',
          'Public Infrastructure Project Monitoring',
          'AutoCAD & Structural Calculation'
        ]
      },
      duties: [
        'Inspect construction and renovation of municipal roads, bridges, public markets, and disaster evacuation centers.',
        'Review building permit applications for structural safety compliance under the National Building Code.',
        'Prepare detailed engineering estimates, bill of quantities (BOQ), and scope of work for infrastructure biddings.',
        'Supervise field site engineers and monitor project timeline adherence.'
      ],
      requiredDocuments: [
        'Accomplished PDS CS Form 212 (Revised 2017) with Work Experience Sheet',
        'Authenticated PRC Civil Engineer License & Board Rating',
        'Authenticated Copy of Transcript of Records (TOR)',
        'Certificates of relevant engineering seminars and training'
      ]
    }
  ]

  // --- MOCK DATA: PROMOTIONS ---
  const promotions: PromotedEmployee[] = [
    {
      id: 'pro-001',
      employeeName: 'Engr. Maria Clara D. Santos',
      previousPosition: 'Civil Engineer I (SG 12)',
      promotedPosition: 'Civil Engineer III / Division Head (SG 19)',
      department: 'Office of the Municipal Engineer',
      departmentCode: 'ENGINEERING',
      effectiveDate: 'January 15, 2026',
      cscResolution: 'CSC KSS Appointment No. 2026-0892',
      commendation: 'Promoted in recognition of exemplary leadership in completing 12 Barangay Infrastructure projects ahead of schedule and introducing digital building permit tracking.',
      year: 2026
    },
    {
      id: 'pro-002',
      employeeName: 'Dr. Alejandro V. Roxas, MD',
      previousPosition: 'Medical Officer III (SG 21)',
      promotedPosition: 'Municipal Health Officer I (SG 24)',
      department: 'Municipal Health Office',
      departmentCode: 'MHO',
      effectiveDate: 'December 1, 2025',
      cscResolution: 'CSC KSS Appointment No. 2025-1104',
      commendation: 'Advanced for leading the municipality to achieving 98.4% child immunization coverage and expanding 24/7 emergency response stations in upland barangays.',
      year: 2025
    },
    {
      id: 'pro-003',
      employeeName: 'Grace Lin-Gomez, CPA',
      previousPosition: 'Accountant I (SG 12)',
      promotedPosition: 'Accountant III (SG 19)',
      department: 'Office of the Municipal Accountant',
      departmentCode: 'ACCOUNTING',
      effectiveDate: 'January 20, 2026',
      cscResolution: 'CSC KSS Appointment No. 2026-0145',
      commendation: 'Promoted for maintaining zero COA Audit Observation Memorandums (AOM) for 3 consecutive years and digitizing municipal asset ledgers.',
      year: 2026
    },
    {
      id: 'pro-004',
      employeeName: 'Renato T. Dela Cruz',
      previousPosition: 'Administrative Aide IV (SG 4)',
      promotedPosition: 'Administrative Assistant II (SG 8)',
      department: 'Human Resource Management Office',
      departmentCode: 'HRMO',
      effectiveDate: 'November 10, 2025',
      cscResolution: 'CSC KSS Appointment No. 2025-0988',
      commendation: 'Recognized for outstanding record management, processing personnel benefits seamlessly, and supporting HRMO digital archiving.',
      year: 2025
    },
    {
      id: 'pro-005',
      employeeName: 'Arch. Josephine B. Luna',
      previousPosition: 'Architect I (SG 12)',
      promotedPosition: 'Supervising Architect (SG 22)',
      department: 'Municipal Planning & Development Office',
      departmentCode: 'MPDO',
      effectiveDate: 'February 1, 2026',
      cscResolution: 'CSC KSS Appointment No. 2026-0312',
      commendation: 'Promoted for designing the eco-friendly Municipal Cultural Center and updating San Francisco Comprehensive Land Use Plan (CLUP 2025-2035).',
      year: 2026
    }
  ]

  // --- MOCK DATA: AWARDS & RECOGNITIONS ---
  const awards: AwardRecognition[] = [
    {
      id: 'award-001',
      awardTitle: 'Civil Service Commission PAGASA Award (Regional Finalist)',
      recipientName: 'Human Resource Management Office (HRMO) Team',
      recipientType: 'Office',
      awardingBody: 'Civil Service Commission Regional Office XIII (Caraga)',
      year: 2025,
      category: 'CSC Honor Awards',
      citation: 'Conferred for outstanding group contribution in establishing the Automated Personnel Merit & Fitness Portal, significantly streamlining recruitment transparency across Agusan del Sur.',
      badgeText: 'CSC Regional Winner'
    },
    {
      id: 'award-002',
      awardTitle: 'DILG Seal of Good Local Governance (SGLG) Exemplary Contributor',
      recipientName: 'Office of the Municipal Planning & Development Coordinator (MPDC)',
      recipientType: 'Office',
      awardingBody: 'Department of the Interior and Local Government (DILG)',
      year: 2025,
      category: 'DILG Governance',
      citation: 'Honored for achieving 100% compliance across all 10 SGLG governance areas, including Financial Administration, Disaster Preparedness, and Social Protection.',
      badgeText: 'National SGLG Awardee'
    },
    {
      id: 'award-003',
      awardTitle: 'Model Public Servant of the Year (PRAISE Award)',
      recipientName: 'Dr. Maria Consuelo Reyes',
      recipientType: 'Individual',
      awardingBody: 'LGU San Francisco HRMO PRAISE Committee',
      year: 2025,
      category: 'LGU PRAISE Excellence',
      citation: 'Awarded for extraordinary dedication in spearheading the Mobile Birthing Clinic project that served over 1,400 expectant mothers in remote indigenous barangays.',
      badgeText: 'PRAISE Outstanding Employee'
    },
    {
      id: 'award-004',
      awardTitle: 'Digital Governance Innovation Award',
      recipientName: 'Information Technology & Management Division',
      recipientType: 'Office',
      awardingBody: 'DICT & National ICT Confederation of the Philippines',
      year: 2025,
      category: 'DILG Governance',
      citation: 'Recognized for pioneering the LGU e-Services Portal, reducing citizen waiting time by 75% for business permits and real property clearances.',
      badgeText: 'DICT Excellence Award'
    },
    {
      id: 'award-005',
      awardTitle: 'Exemplary Environmental Governance Award',
      recipientName: 'Municipal Environment & Natural Resources Office (MENRO)',
      recipientType: 'Office',
      awardingBody: 'DENR Caraga Regional Office',
      year: 2025,
      category: 'LGU PRAISE Excellence',
      citation: 'Commended for achieving zero open dumpsites and instituting the Barangay Materials Recovery Facility (MRF) Incentive Program in San Francisco.',
      badgeText: 'DENR Eco Honor'
    }
  ]

  // --- COMPUTED FILTERS ---

  const filteredVacancies = computed(() => {
    return vacancies.filter(v => {
      const matchSearch =
        !vacancySearchQuery.value ||
        v.positionTitle.toLowerCase().includes(vacancySearchQuery.value.toLowerCase()) ||
        v.office.toLowerCase().includes(vacancySearchQuery.value.toLowerCase()) ||
        v.itemNo.toLowerCase().includes(vacancySearchQuery.value.toLowerCase())

      const matchOffice =
        selectedOfficeFilter.value === 'ALL' || v.officeCode === selectedOfficeFilter.value

      const matchStatus =
        selectedStatusFilter.value === 'ALL' || v.employmentStatus === selectedStatusFilter.value

      const matchSalary =
        selectedSalaryFilter.value === 'ALL' ||
        (selectedSalaryFilter.value === 'ENTRY' && v.salaryGrade <= 11) ||
        (selectedSalaryFilter.value === 'MID' && v.salaryGrade >= 12 && v.salaryGrade <= 18) ||
        (selectedSalaryFilter.value === 'EXEC' && v.salaryGrade >= 19)

      return matchSearch && matchOffice && matchStatus && matchSalary
    })
  })

  const filteredPromotions = computed(() => {
    return promotions.filter(p => {
      const matchSearch =
        !promotionSearchQuery.value ||
        p.employeeName.toLowerCase().includes(promotionSearchQuery.value.toLowerCase()) ||
        p.department.toLowerCase().includes(promotionSearchQuery.value.toLowerCase()) ||
        p.promotedPosition.toLowerCase().includes(promotionSearchQuery.value.toLowerCase())

      const matchYear =
        promotionYearFilter.value === 'ALL' || p.year.toString() === promotionYearFilter.value

      return matchSearch && matchYear
    })
  })

  const filteredAwards = computed(() => {
    return awards.filter(a => {
      const matchSearch =
        !awardSearchQuery.value ||
        a.awardTitle.toLowerCase().includes(awardSearchQuery.value.toLowerCase()) ||
        a.recipientName.toLowerCase().includes(awardSearchQuery.value.toLowerCase()) ||
        a.awardingBody.toLowerCase().includes(awardSearchQuery.value.toLowerCase())

      const matchCat =
        awardCategoryFilter.value === 'ALL' || a.category === awardCategoryFilter.value

      return matchSearch && matchCat
    })
  })

  // Modal actions
  const openJobModal = (position: VacantPosition) => {
    selectedJobModal.value = position
    isJobModalOpen.value = true
  }

  const closeJobModal = () => {
    isJobModalOpen.value = false
    selectedJobModal.value = null
  }

  return {
    activeTab,
    vacancies,
    promotions,
    awards,

    // Vacancies state & computed
    vacancySearchQuery,
    selectedOfficeFilter,
    selectedStatusFilter,
    selectedSalaryFilter,
    filteredVacancies,
    selectedJobModal,
    isJobModalOpen,
    openJobModal,
    closeJobModal,

    // Promotions state & computed
    promotionSearchQuery,
    promotionYearFilter,
    filteredPromotions,

    // Awards state & computed
    awardSearchQuery,
    awardCategoryFilter,
    filteredAwards
  }
}
