import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CitizensCharterTable from '../../../app/components/citizens-charter/CitizensCharterTable.vue'

describe('CitizensCharterTable Component', () => {
  const mockSteps = [
    {
      stepNo: 'STEP 1',
      clientStep: 'Fill up the Visitors Log',
      serviceProviderStep: 'Interview the client',
      processingTime: '10 Minutes',
      responsiblePersons: ['Officer A', 'Officer B']
    },
    {
      stepNo: 'STEP 2',
      clientStep: 'Discussion with Head Officer',
      serviceProviderStep: 'Discuss concern and advise',
      processingTime: '20 Minutes',
      responsiblePersons: ['Head Officer C']
    }
  ]

  it('renders step table with headers, step details, and total processing time', async () => {
    const wrapper = await mountSuspended(CitizensCharterTable, {
      props: {
        steps: mockSteps,
        totalProcessingTime: '30 Minutes'
      }
    })

    // Check table headers
    expect(wrapper.text()).toContain('Steps for Client')
    expect(wrapper.text()).toContain('Service Provider Step')
    expect(wrapper.text()).toContain('Processing Time')
    expect(wrapper.text()).toContain('Responsible Person(s)')

    // Check step content
    expect(wrapper.text()).toContain('STEP 1')
    expect(wrapper.text()).toContain('Fill up the Visitors Log')
    expect(wrapper.text()).toContain('Interview the client')
    expect(wrapper.text()).toContain('Officer A')

    expect(wrapper.text()).toContain('STEP 2')
    expect(wrapper.text()).toContain('Discussion with Head Officer')
    expect(wrapper.text()).toContain('Head Officer C')

    // Check summary row
    expect(wrapper.text()).toContain('End of the Transaction')
    expect(wrapper.text()).toContain('30 Minutes')
  })
})
