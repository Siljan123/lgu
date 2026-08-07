import { describe, it, expect } from 'vitest'
import { useEventsFestivals } from '../../../app/composables/useEventsFestivals'

describe('useEventsFestivals composable', () => {
  it('provides the flagship Diwata / Magdiwata Festival data', () => {
    const { eventsData } = useEventsFestivals()
    
    expect(eventsData).toHaveLength(1)
    const flagship = eventsData[0]
    expect(flagship.name).toBe('Diwata / Magdiwata Festival')
    expect(flagship.isFlagship).toBe(true)
    expect(flagship.category).toBe('Cultural & Indigenous')
    expect(flagship.whenHeld).toContain('June 18–21')
    expect(flagship.venue).toContain('Poblacion, San Francisco')
    expect(flagship.programHighlights).toHaveLength(7)
  })

  it('provides the recurring events roadmap dataset', () => {
    const { recurringEventsData } = useEventsFestivals()

    expect(recurringEventsData).toHaveLength(4)
    const titles = recurringEventsData.map(e => e.title)
    expect(titles).toContain('Barangay-Level Fiestas')
    expect(titles).toContain('Independence Day Activities')
    expect(titles).toContain('Year-End & Christmas Season Town Programs')
    expect(titles).toContain('LGU Agricultural & Trade Fairs')
  })

  it('filters events correctly by category', () => {
    const { selectCategory, selectedCategory, filteredEvents } = useEventsFestivals()

    selectCategory('Cultural & Indigenous')
    expect(selectedCategory.value).toBe('Cultural & Indigenous')
    expect(filteredEvents.value).toHaveLength(1)
    expect(filteredEvents.value[0].name).toBe('Diwata / Magdiwata Festival')

    selectCategory('Trade & Agriculture')
    expect(filteredEvents.value).toHaveLength(0)
  })

  it('filters events correctly by search query', () => {
    const { searchQuery, filteredEvents } = useEventsFestivals()

    searchQuery.value = 'Manobo'
    expect(filteredEvents.value).toHaveLength(1)

    searchQuery.value = 'NonExistentQueryString'
    expect(filteredEvents.value).toHaveLength(0)
  })

  it('manages active event selection', () => {
    const { selectEvent, selectedEvent } = useEventsFestivals()

    selectEvent('diwata-magdiwata-festival')
    expect(selectedEvent.value?.id).toBe('diwata-magdiwata-festival')
    expect(selectedEvent.value?.name).toBe('Diwata / Magdiwata Festival')

    selectEvent(null)
    expect(selectedEvent.value).toBeNull()
  })
})
