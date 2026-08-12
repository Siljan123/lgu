import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DemographicsSection from '../../../app/components/quick-facts-demographics/DemographicsSection.vue'

describe('DemographicsSection Component', () => {
  it('renders Demographics & Municipal Data heading and profile facts', async () => {
    const wrapper = await mountSuspended(DemographicsSection)

    expect(wrapper.text()).toContain('Demographics & Municipal Data')
    expect(wrapper.text()).toContain('San Francisco')
    expect(wrapper.text()).toContain('Municipality of San Francisco')
    expect(wrapper.text()).toContain('Solomon T. Rufila')
    expect(wrapper.text()).toContain('Caraga (Region XIII)')
  })

  it('renders population census history table with growth rates and progress distribution bars', async () => {
    const wrapper = await mountSuspended(DemographicsSection)

    expect(wrapper.text()).toContain('Demographics')
    expect(wrapper.text()).toContain('1960')
    expect(wrapper.text()).toContain('11,324')
    expect(wrapper.text()).toContain('2020')
    expect(wrapper.text()).toContain('80,760')
    expect(wrapper.text()).toContain('+7.18%')
    expect(wrapper.text()).toContain('+1.61%')

    const tableRows = wrapper.findAll('tbody tr')
    expect(tableRows.length).toBe(11)

    const municipalImg = wrapper.find('img')
    expect(municipalImg.exists()).toBe(true)
    expect(municipalImg.attributes('src')).toBe('/images/municipal_hall.jpg')
  })
})
