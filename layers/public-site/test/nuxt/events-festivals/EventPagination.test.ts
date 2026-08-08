import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EventPagination from '../../../app/components/events-festivals/EventPagination.vue'

describe('EventPagination Component', () => {
  it('renders item count summary and page navigation controls when totalPages > 1', async () => {
    const wrapper = await mountSuspended(EventPagination, {
      props: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 15,
        itemsPerPage: 6
      }
    })

    expect(wrapper.text()).toContain('Showing 1 to 6 of 15 scheduled events')
    expect(wrapper.findAll('button')).toHaveLength(5) // Prev + 3 pages + Next
  })

  it('does not render pagination bar when totalPages <= 1', async () => {
    const wrapper = await mountSuspended(EventPagination, {
      props: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 4,
        itemsPerPage: 6
      }
    })

    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('emits update:currentPage when page number button is clicked', async () => {
    const wrapper = await mountSuspended(EventPagination, {
      props: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 15,
        itemsPerPage: 6
      }
    })

    const page2Button = wrapper.findAll('button').find(b => b.text().trim() === '2')
    expect(page2Button).toBeDefined()
    await page2Button?.trigger('click')

    const emitted = wrapper.emitted('update:currentPage')
    expect(emitted).toBeDefined()
    expect(emitted?.[0]).toEqual([2])
  })
})
