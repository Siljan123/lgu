import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WhereToStayList from '../../../app/components/where-to-stay-eat/WhereToStayList.vue'
import type { Establishment } from '../../../app/composables/useWhereToStayEat'

const sampleList: Establishment[] = [
  {
    id: 'h1',
    name: 'Grand Hotel',
    category: 'Hotel',
    address: 'National Highway, Barangay 1',
    contactNo: '09123456789',
    barangay: 'Barangay 1',
    operatingHours: '24/7',
    coordinates: { lat: 8.5042, lng: 125.9786 },
    image: 'https://example.com/photo.jpg'
  },
  {
    id: 'h2',
    name: 'Local Diner',
    category: 'Fastfood',
    address: 'Purok 3, Barangay 2',
    barangay: 'Barangay 2',
    coordinates: { lat: 8.5050, lng: 125.9790 }
  }
]

describe('WhereToStayList Component', () => {
  it('renders cards view grid by default when viewMode is grid', async () => {
    const wrapper = await mountSuspended(WhereToStayList, {
      props: {
        establishments: sampleList,
        totalCount: 2,
        currentPage: 1,
        itemsPerPage: 9,
        viewMode: 'grid',
        currentCategory: 'All'
      }
    })

    expect(wrapper.text()).toContain('Grand Hotel')
    expect(wrapper.text()).toContain('Local Diner')
    expect(wrapper.text()).toContain('No Image Available')
    expect(wrapper.text()).toContain('Focus on Map / View 360°')
  })

  it('renders table view when viewMode is table', async () => {
    const wrapper = await mountSuspended(WhereToStayList, {
      props: {
        establishments: sampleList,
        totalCount: 2,
        currentPage: 1,
        itemsPerPage: 9,
        viewMode: 'table',
        currentCategory: 'All'
      }
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.text()).toContain('Grand Hotel')
    expect(wrapper.text()).toContain('Local Diner')
    expect(wrapper.text()).toContain('09123456789')
  })

  it('renders empty state when establishments list is empty', async () => {
    const wrapper = await mountSuspended(WhereToStayList, {
      props: {
        establishments: [],
        totalCount: 0,
        currentPage: 1,
        itemsPerPage: 9,
        viewMode: 'grid',
        currentCategory: 'All'
      }
    })

    expect(wrapper.text()).toContain('No establishments found')
  })

  it('emits select event when Focus on Map button is clicked', async () => {
    const wrapper = await mountSuspended(WhereToStayList, {
      props: {
        establishments: sampleList,
        totalCount: 2,
        currentPage: 1,
        itemsPerPage: 9,
        viewMode: 'grid',
        currentCategory: 'All'
      }
    })

    const focusButton = wrapper.findAll('button').find(b => b.text().includes('Focus on Map'))
    expect(focusButton).toBeDefined()
    await focusButton?.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([sampleList[0]])
  })
})
