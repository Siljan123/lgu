import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BarangayOfficialsOrgChart from '../../../app/components/barangay-directory/BarangayOfficialsOrgChart.vue'
import type { BarangayOfficial } from '../../../app/composables/useBarangayDirectory'

describe('BarangayOfficialsOrgChart Component', () => {
  const mockOfficials: BarangayOfficial[] = [
    { id: 'al-1', name: 'Hon. Rodrigo M. Santos', title: 'Punong Barangay (Captain)' },
    { id: 'al-2', name: 'Maria Elena V. Torres', title: 'Barangay Secretary' },
    { id: 'al-3', name: 'Jose Bernardo Cruz', title: 'Barangay Treasurer' },
    { id: 'al-4', name: 'Hon. Danilo R. Flores', title: 'Barangay Kagawad', committee: 'Peace & Order' },
    { id: 'al-5', name: 'Hon. Grace P. Mendoza', title: 'Barangay Kagawad', committee: 'Finance & Appropriation' },
    { id: 'al-11', name: 'Hon. Joshua K. Perez', title: 'SK Chairperson', committee: 'Youth & Sports Development' }
  ]


  it('renders an empty state with a First Label button when officials list is empty and isAdmin is true', async () => {
    const wrapper = await mountSuspended(BarangayOfficialsOrgChart, {
      props: {
        officials: [],
        barangayName: 'Sample Barangay',
        isAdmin: true
      }
    })

    expect(wrapper.text()).toContain('No Officials Added Yet')
    expect(wrapper.text()).toContain('First Label')
  })

  it('renders empty state without First Label button when isAdmin is false', async () => {
    const wrapper = await mountSuspended(BarangayOfficialsOrgChart, {
      props: {
        officials: [],
        barangayName: 'Sample Barangay',
        isAdmin: false
      }
    })

    expect(wrapper.text()).toContain('No Officials Added Yet')
    expect(wrapper.text()).not.toContain('First Label')
  })

  it('hides the position title of officials placed directly under a label', async () => {
    const hierarchy: BarangayOfficial[] = [
      { id: 'cap-1', name: 'Hon. Captain Root', title: 'Punong Barangay (Captain)', position_category: 'captain' },
      // Section label whose own title shows the shared position.
      { id: 'lbl-1', name: 'Kagawad Group', title: 'Kagawad Group', is_label: true, parent_id: 'cap-1', position_category: 'kagawad' },
      // Real official under the label — its own title should be suppressed.
      { id: 'kag-1', name: 'Hon. Child Person', title: 'Committee on Health Kagawad', parent_id: 'lbl-1', position_category: 'kagawad' }
    ]

    const wrapper = await mountSuspended(BarangayOfficialsOrgChart, {
      props: {
        officials: hierarchy,
        barangayName: 'Alegria'
      }
    })

    const text = wrapper.text()
    // The label keeps its own title (the shared position header).
    expect(text).toContain('Kagawad Group')
    // The child official's person details still render.
    expect(text).toContain('Hon. Child Person')
    // But the child's own position title bar is not rendered (it lives under the label).
    expect(text).not.toContain('Committee on Health Kagawad')
  })

  it('keeps the position title of officials that are not under a label', async () => {
    const hierarchy: BarangayOfficial[] = [
      { id: 'cap-2', name: 'Hon. Captain Two', title: 'Punong Barangay (Captain)', position_category: 'captain' },
      // Direct child of a real official (not a label) — its title must still show.
      { id: 'sec-2', name: 'Hon. Secretary Two', title: 'Barangay Secretary', parent_id: 'cap-2', position_category: 'secretary' }
    ]

    const wrapper = await mountSuspended(BarangayOfficialsOrgChart, {
      props: {
        officials: hierarchy,
        barangayName: 'Alegria'
      }
    })

    expect(wrapper.text()).toContain('Barangay Secretary')
  })

  it('toggles between maximize (full view) and minimize modes when clicking the toggle button', async () => {
    const wrapper = await mountSuspended(BarangayOfficialsOrgChart, {
      props: {
        officials: mockOfficials,
        barangayName: 'Alegria'
      }
    })

    // Initially in normal view, Maximize button should be visible in wrapper
    expect(wrapper.text()).toContain('Maximize')

    const maximizeBtn = wrapper.findAll('button').find(b => b.attributes('title')?.includes('Maximize'))
    expect(maximizeBtn).toBeDefined()

    // Click to maximize
    await maximizeBtn?.trigger('click')
    await new Promise(r => setTimeout(r, 50))
    expect(document.body.textContent).toContain('Minimize')

    // Click to minimize back from teleported modal in body
    const minimizeBtn = Array.from(document.body.querySelectorAll('button')).find(b => b.getAttribute('title')?.includes('Minimize'))
    expect(minimizeBtn).toBeDefined()
    minimizeBtn?.click()
    await new Promise(r => setTimeout(r, 50))
    expect(wrapper.text()).toContain('Maximize')
  })
})
