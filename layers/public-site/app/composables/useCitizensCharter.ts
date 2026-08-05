import { ref, computed } from 'vue'

export interface CharterStep {
  stepNo: string
  clientStep: string
  serviceProviderStep: string
  processingTime: string
  responsiblePersons: string[]
}

export interface CharterService {
  id: string
  departmentId: string
  departmentName: string
  serviceRendered: string
  availability: string
  requirements: string
  fees: string
  totalProcessingTime: string
  steps: CharterStep[]
}

export interface DepartmentGroup {
  id: string
  name: string
  shortCode: string
  services: CharterService[]
}

export const useCitizensCharterData = () => {
  const searchQuery = ref('')
  const selectedServiceId = ref('complaints-and-assistance')

  const departmentsData: DepartmentGroup[] = [
    {
      id: 'meedmo',
      name: 'Economic Enterprise Development & Management (MEEDMO)',
      shortCode: 'MEEDMO',
      services: [
        {
          id: 'complaints-and-assistance',
          departmentId: 'meedmo',
          departmentName: 'Municipal Economic Enterprise Development and Management Office',
          serviceRendered: 'Complaints and Assistance Desk',
          availability: 'Monday to Friday, 8:00 AM to 5:00 PM (no noon break)',
          requirements: 'None',
          fees: 'None',
          totalProcessingTime: '30 Minutes',
          steps: [
            {
              stepNo: 'STEP 1',
              clientStep: 'Fill up the Visitors Log',
              serviceProviderStep: 'Interview the client',
              processingTime: '10 Minutes',
              responsiblePersons: [
                'Rachelle T. Quintero',
                'Elona Jane Aranda',
                'Cheryl De Jesus'
              ]
            },
            {
              stepNo: 'STEP 2',
              clientStep: 'Proceed to the Head Officer for Discussion',
              serviceProviderStep: 'Discuss the concern and give recommendations',
              processingTime: '20 Minutes',
              responsiblePersons: [
                'Bernie C. Porlares',
                'Philip Ryan G. Espinosa'
              ]
            }
          ]
        },
        {
          id: 'consumer-welfare-assistance',
          departmentId: 'meedmo',
          departmentName: 'Municipal Economic Enterprise Development and Management Office',
          serviceRendered: 'Consumer Welfare Assistance Desk',
          availability: 'Monday to Friday, 8:00 AM to 5:00 PM (no noon break)',
          requirements: 'None',
          fees: 'None',
          totalProcessingTime: '40 Minutes',
          steps: [
            {
              stepNo: 'STEP 1',
              clientStep: 'Reweight the purchased product; if a complaint arises, complete the monitoring form.',
              serviceProviderStep: 'Receive and examine the complaint',
              processingTime: '10 Minutes',
              responsiblePersons: [
                'Estela P. Aro',
                'Josephine Ganabe'
              ]
            },
            {
              stepNo: 'STEP 2',
              clientStep: "If a complaint arises, the customer's assistance personnel will visit the vendor's location.",
              serviceProviderStep: 'If the vendor accepts their mistake and changes the product to the exact weight, instruct the customer to receive the product and warn the vendor for their offense. If the customer does not accept the negotiation, their complaint will be forwarded to the relevant office.',
              processingTime: '30 Minutes',
              responsiblePersons: [
                'Estela P. Aro',
                'Josephine Ganabe'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'treasury',
      name: 'Office of the Municipal Treasurer (OMT)',
      shortCode: 'TREASURY',
      services: [
        {
          id: 'business-permit-payment',
          departmentId: 'treasury',
          departmentName: 'Office of the Municipal Treasurer',
          serviceRendered: 'Business Permit Fee Payment & Tax Clearance',
          availability: 'Monday to Friday, 8:00 AM to 5:00 PM (no noon break)',
          requirements: 'Assessment Form, Previous Official Receipt',
          fees: 'Based on Revenue Code Assessment',
          totalProcessingTime: '15 Minutes',
          steps: [
            {
              stepNo: 'STEP 1',
              clientStep: 'Submit Tax Assessment Order & Business Application Form',
              serviceProviderStep: 'Verify record in Tax Management System and compute total fees',
              processingTime: '5 Minutes',
              responsiblePersons: ['Revenue Collection Officer II']
            },
            {
              stepNo: 'STEP 2',
              clientStep: 'Pay corresponding fees at Cashier Window',
              serviceProviderStep: 'Issue Official Receipt (OR) & Tax Clearance Certificate',
              processingTime: '10 Minutes',
              responsiblePersons: ['Municipal Cashier I']
            }
          ]
        },
        {
          id: 'real-property-tax-payment',
          departmentId: 'treasury',
          departmentName: 'Office of the Municipal Treasurer',
          serviceRendered: 'Real Property Tax (RPT) Payment',
          availability: 'Monday to Friday, 8:00 AM to 5:00 PM (no noon break)',
          requirements: 'Tax Declaration or Previous RPT Official Receipt',
          fees: 'Varies according to Assessed Property Value',
          totalProcessingTime: '12 Minutes',
          steps: [
            {
              stepNo: 'STEP 1',
              clientStep: 'Present Tax Declaration or Previous Official Receipt',
              serviceProviderStep: 'Retrieve electronic property ledger and compute current tax due',
              processingTime: '4 Minutes',
              responsiblePersons: ['RPT Inspector I']
            },
            {
              stepNo: 'STEP 2',
              clientStep: 'Pay assessed tax amount',
              serviceProviderStep: 'Process payment and print Official Receipt',
              processingTime: '8 Minutes',
              responsiblePersons: ['Collecting Officer']
            }
          ]
        }
      ]
    },
    {
      id: 'assessor',
      name: 'Office of the Municipal Assessor (OMA)',
      shortCode: 'ASSESSOR',
      services: [
        {
          id: 'tax-declaration-issuance',
          departmentId: 'assessor',
          departmentName: 'Office of the Municipal Assessor',
          serviceRendered: 'Issuance of Certified True Copy of Tax Declaration',
          availability: 'Monday to Friday, 8:00 AM to 5:00 PM (no noon break)',
          requirements: 'Valid ID, Real Property Tax Clearance',
          fees: 'PHP 100.00 per copy',
          totalProcessingTime: '20 Minutes',
          steps: [
            {
              stepNo: 'STEP 1',
              clientStep: 'Fill out Request Slip and submit RPT Clearance',
              serviceProviderStep: 'Verify property record in Cadastral Database',
              processingTime: '8 Minutes',
              responsiblePersons: ['Assessment Clerk II']
            },
            {
              stepNo: 'STEP 2',
              clientStep: 'Present Official Receipt of payment',
              serviceProviderStep: 'Print Certified Copy, affix official seal and signature of Municipal Assessor',
              processingTime: '12 Minutes',
              responsiblePersons: ['Assistant Municipal Assessor']
            }
          ]
        }
      ]
    }
  ]

  // Flattened all services list
  const allServices = computed(() => {
    return departmentsData.flatMap(dept => dept.services)
  })

  // Currently selected service detail object
  const selectedService = computed(() => {
    return allServices.value.find(s => s.id === selectedServiceId.value) || allServices.value[0]
  })

  // Filtered departments based on search query
  const filteredDepartments = computed(() => {
    if (!searchQuery.value.trim()) return departmentsData

    const q = searchQuery.value.toLowerCase().trim()
    return departmentsData
      .map(dept => {
        const matchingServices = dept.services.filter(s =>
          s.serviceRendered.toLowerCase().includes(q) ||
          s.departmentName.toLowerCase().includes(q)
        )
        return {
          ...dept,
          services: matchingServices
        }
      })
      .filter(dept => dept.services.length > 0)
  })

  const selectService = (id: string) => {
    selectedServiceId.value = id
  }

  return {
    searchQuery,
    selectedServiceId,
    selectedService,
    departmentsData,
    filteredDepartments,
    selectService
  }
}
