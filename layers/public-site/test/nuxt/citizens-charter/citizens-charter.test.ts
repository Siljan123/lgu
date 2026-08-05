import { describe, it, expect } from 'vitest'
import { useCitizensCharterData } from '../../../app/composables/useCitizensCharter'

describe('useCitizensCharterData dynamic composable', () => {
  it('provides grouped departments with services', () => {
    const { departmentsData, selectedService } = useCitizensCharterData()
    expect(departmentsData.length).toBeGreaterThanOrEqual(3)

    // MEEDMO Department
    const meedmo = departmentsData.find(d => d.id === 'meedmo')
    expect(meedmo).toBeDefined()
    expect(meedmo?.services).toHaveLength(2)

    // Default selected service
    expect(selectedService.value.serviceRendered).toBe('Complaints and Assistance Desk')
  })

  it('filters services based on search query', () => {
    const { searchQuery, filteredDepartments } = useCitizensCharterData()
    
    searchQuery.value = 'Consumer'
    expect(filteredDepartments.value).toHaveLength(1)
    expect(filteredDepartments.value[0].services[0].serviceRendered).toBe('Consumer Welfare Assistance Desk')

    searchQuery.value = 'Business Permit'
    expect(filteredDepartments.value).toHaveLength(1)
    expect(filteredDepartments.value[0].shortCode).toBe('TREASURY')
  })

  it('allows dynamic selection of services', () => {
    const { selectService, selectedService } = useCitizensCharterData()

    selectService('real-property-tax-payment')
    expect(selectedService.value.serviceRendered).toBe('Real Property Tax (RPT) Payment')
    expect(selectedService.value.totalProcessingTime).toBe('12 Minutes')
  })
})
