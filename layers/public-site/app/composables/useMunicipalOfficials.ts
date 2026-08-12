import { ref, computed } from 'vue'

export interface MunicipalOfficial {
  id: string
  name: string
  title: string
  department?: string
  role: 'mayor' | 'vice-mayor' | 'treasurer' | 'budget-officer' | 'mpdc' | 'accountant' | 'bac-chair' | 'mswdo' | 'mdrrmo'
}

export const DEFAULT_MUNICIPAL_OFFICIALS: Record<string, MunicipalOfficial> = {
  mayor: {
    id: 'mayor',
    name: 'Hon. Grace A. Rodriguez',
    title: 'Municipal Mayor',
    role: 'mayor'
  },
  viceMayor: {
    id: 'vice-mayor',
    name: 'Hon. Roberto M. Plaza',
    title: 'Municipal Vice Mayor',
    role: 'vice-mayor'
  },
  treasurer: {
    id: 'treasurer',
    name: 'Eleanor V. Santos, CPA',
    title: 'Municipal Treasurer',
    department: "Municipal Treasurer's Office",
    role: 'treasurer'
  },
  budgetOfficer: {
    id: 'budget-officer',
    name: 'Corazon L. Reyes',
    title: 'Municipal Budget Officer',
    department: 'Municipal Budget Office',
    role: 'budget-officer'
  },
  mpdc: {
    id: 'mpdc',
    name: 'Engr. Marcos R. Peralta',
    title: 'Municipal Planning & Development Coordinator',
    department: 'Municipal Planning & Development Office',
    role: 'mpdc'
  },
  accountant: {
    id: 'accountant',
    name: 'Renato S. Alcantara, CPA',
    title: 'Municipal Accountant',
    department: "Municipal Accountant's Office",
    role: 'accountant'
  },
  bacChair: {
    id: 'bac-chair',
    name: 'Atty. Manuel T. Cordero',
    title: 'Bids and Awards Committee Chairperson',
    department: 'Bids and Awards Committee (BAC)',
    role: 'bac-chair'
  },
  mswdo: {
    id: 'mswdo',
    name: 'Teresa S. Aquino',
    title: 'MSWDO Head / GAD Focal Person',
    department: 'Municipal Social Welfare & Development Office',
    role: 'mswdo'
  },
  mdrrmo: {
    id: 'mdrrmo',
    name: 'Capt. Fernando B. Magsaysay',
    title: 'MDRRM Officer',
    department: 'Municipal Disaster Risk Reduction & Management Office',
    role: 'mdrrmo'
  }
}

export const useMunicipalOfficials = () => {
  const officials = ref<Record<string, MunicipalOfficial>>(DEFAULT_MUNICIPAL_OFFICIALS)

  const mayor = computed(() => officials.value.mayor)
  const viceMayor = computed(() => officials.value.viceMayor)

  const updateOfficial = (key: string, newOfficial: Partial<MunicipalOfficial>) => {
    if (officials.value[key]) {
      officials.value[key] = {
        ...officials.value[key],
        ...newOfficial
      }
    }
  }

  const getOfficialByOffice = (officeName: string): MunicipalOfficial => {
    const lower = officeName.toLowerCase()
    if (lower.includes('treasurer')) return officials.value.treasurer
    if (lower.includes('budget')) return officials.value.budgetOfficer
    if (lower.includes('planning') || lower.includes('mpdo')) return officials.value.mpdc
    if (lower.includes('accountant')) return officials.value.accountant
    if (lower.includes('bids') || lower.includes('bac')) return officials.value.bacChair
    if (lower.includes('social') || lower.includes('mswdo') || lower.includes('gad')) return officials.value.mswdo
    if (lower.includes('disaster') || lower.includes('mdrrm')) return officials.value.mdrrmo
    return officials.value.mayor
  }

  return {
    officials,
    mayor,
    viceMayor,
    updateOfficial,
    getOfficialByOffice
  }
}
