import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BarangayOfficialsOrgChart from '../../../app/components/barangay-directory/BarangayOfficialsOrgChart.vue'
import type { BarangayOfficial } from '../../../app/composables/useBarangayDirectory'

describe('BarangayOfficialsOrgChart Component', () => {
  const mockOfficials: BarangayOfficial[] = [
    { id: 'al-1', name: 'Hon. Rodrigo M. Santos', title: 'Punong Barangay', role: 'captain' },
    { id: 'al-2', name: 'Maria Elena V. Torres', title: 'Barangay Secretary', role: 'secretary' },
    { id: 'al-3', name: 'Jose Bernardo Cruz', title: 'Barangay Treasurer', role: 'treasurer' },
    { id: 'al-4', name: 'Hon. Danilo R. Flores', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
    { id: 'al-5', name: 'Hon. Grace P. Mendoza', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance & Appropriation' },
    { id: 'al-11', name: 'Hon. Joshua K. Perez', title: 'SK Chairperson', role: 'sk_chairperson', committee: 'Youth & Sports Development' }
  ]

  it('renders barangay officials hierarchy including captain, secretary, treasurer, kagawads and SK chairperson', async () => {
    const wrapper = await mountSuspended(BarangayOfficialsOrgChart, {
      props: {
        officials: mockOfficials,
        barangayName: 'Alegria'
      }
    })

    expect(wrapper.text()).toContain('Barangay Officials')
    expect(wrapper.text()).toContain('Sangguniang Barangay Leadership of Alegria')
    expect(wrapper.text()).toContain('Hon. Rodrigo M. Santos')
    expect(wrapper.text()).toContain('Maria Elena V. Torres')
    expect(wrapper.text()).toContain('Jose Bernardo Cruz')
    expect(wrapper.text()).toContain('Hon. Danilo R. Flores')
    expect(wrapper.text()).toContain('Hon. Grace P. Mendoza')
    expect(wrapper.text()).toContain('Hon. Joshua K. Perez')
    expect(wrapper.text()).toContain('Sangguniang Kabataan (SK) Chairperson')
  })

  it('renders default fallback labels when specific role officials are missing', async () => {
    const wrapper = await mountSuspended(BarangayOfficialsOrgChart, {
      props: {
        officials: [],
        barangayName: 'Sample Barangay'
      }
    })

    expect(wrapper.text()).toContain('Hon. Barangay Captain')
    expect(wrapper.text()).toContain('Barangay Secretary')
    expect(wrapper.text()).toContain('Barangay Treasurer')
  })
})
