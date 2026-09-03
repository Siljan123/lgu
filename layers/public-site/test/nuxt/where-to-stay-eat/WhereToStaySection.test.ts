import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WhereToStaySection from '../../../app/components/where-to-stay-eat/WhereToStaySection.vue'

describe('WhereToStaySection Component', () => {
  it('renders section title, search bar, split map & streetview layout, and directory list', async () => {
    const wrapper = await mountSuspended(WhereToStaySection)

    expect(wrapper.text()).toContain('Interactive Directory Map & Street View')
    expect(wrapper.text()).toContain('Establishments Showcase')
    expect(wrapper.text()).toContain('Cards View')
    expect(wrapper.text()).toContain('Table View')
  })

  it('renders Detect Device GPS button', async () => {
    const wrapper = await mountSuspended(WhereToStaySection)

    const locateBtn = wrapper.findAll('button').find(b => b.text().includes('Location') || b.text().includes('GPS'))
    expect(locateBtn).toBeDefined()
  })

  it('toggles viewMode from Cards View to Table View when button is clicked', async () => {
    const wrapper = await mountSuspended(WhereToStaySection)

    const tableViewButton = wrapper.findAll('button').find(b => b.text().includes('Table View'))
    expect(tableViewButton).toBeDefined()

    await tableViewButton?.trigger('click')
    expect(wrapper.find('table').exists()).toBe(true)

    const cardsViewButton = wrapper.findAll('button').find(b => b.text().includes('Cards View'))
    expect(cardsViewButton).toBeDefined()

    await cardsViewButton?.trigger('click')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('displays Satellite GPS or IP Network label when GPS location is acquired', async () => {
    const originalGeo = Object.getOwnPropertyDescriptor(globalThis.navigator, 'geolocation')
    try {
      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: {
          getCurrentPosition: (success: (pos: any) => void) => {
            success({
              coords: { latitude: 8.5042, longitude: 125.9786, accuracy: 12 }
            })
          },
          watchPosition: () => 1,
          clearWatch: () => {}
        },
        configurable: true,
        writable: true
      })

      const wrapper = await mountSuspended(WhereToStaySection)
      const locateBtn = wrapper.findAll('button').find(b => b.text().includes('Use My Device GPS'))
      expect(locateBtn).toBeDefined()

      await locateBtn?.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Satellite GPS')
      expect(wrapper.text()).toContain('Satellite GPS Active')
    } finally {
      if (originalGeo) {
        Object.defineProperty(globalThis.navigator, 'geolocation', originalGeo)
      }
    }
  })
})

