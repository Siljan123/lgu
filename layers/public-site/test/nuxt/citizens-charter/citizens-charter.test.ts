import { describe, it, expect } from 'vitest'
import { useCitizensCharterData } from '../../../app/composables/useCitizensCharter'

describe('useCitizensCharterData dynamic composable', () => {
  it('provides grouped departments with services and default selected department', () => {
    const { departmentsData, selectedDepartment, selectedDepartmentId } = useCitizensCharterData()
    expect(departmentsData.length).toBeGreaterThanOrEqual(3)

    // Default selected department ID is 'meedmo'
    expect(selectedDepartmentId.value).toBe('meedmo')
    expect(selectedDepartment.value.shortCode).toBe('MEEDMO')
    expect(selectedDepartment.value.services).toHaveLength(2)
  })

  it('filters departments and services based on search query', () => {
    const { searchQuery, filteredDepartments } = useCitizensCharterData()
    
    searchQuery.value = 'Consumer'
    expect(filteredDepartments.value).toHaveLength(1)
    expect(filteredDepartments.value[0].services[0].serviceRendered).toBe('Consumer Welfare Assistance Desk')

    searchQuery.value = 'TREASURY'
    expect(filteredDepartments.value).toHaveLength(1)
    expect(filteredDepartments.value[0].shortCode).toBe('TREASURY')
  })

  it('allows dynamic selection of departments and services', () => {
    const { selectDepartment, selectedDepartment, selectService, selectedService, selectedDepartmentId } = useCitizensCharterData()

    selectDepartment('treasury')
    expect(selectedDepartmentId.value).toBe('treasury')
    expect(selectedDepartment.value.shortCode).toBe('TREASURY')
    expect(selectedDepartment.value.services).toHaveLength(2)

    selectService('tax-declaration-issuance')
    expect(selectedDepartmentId.value).toBe('assessor')
    expect(selectedService.value.serviceRendered).toBe('Issuance of Certified True Copy of Tax Declaration')
  })
})

