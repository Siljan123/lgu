import { describe, it, expect } from 'vitest'
import { useEventsFestivals, FESTIVALS, EVENTS } from '../../../app/composables/useEventsFestivals'

describe('useEventsFestivals composable', () => {
  it('provides static FESTIVALS dataset including Magdiwata Festival', () => {
    const { festivalsData, getFestivalById } = useEventsFestivals()
    
    expect(festivalsData.length).toBeGreaterThanOrEqual(1)
    const flagship = festivalsData.find(f => f.slug === 'diwata-magdiwata-festival')
    expect(flagship).toBeDefined()
    expect(flagship?.name).toBe('Magdiwata Festival')
    expect(flagship?.isFlagship).toBe(true)
    expect(flagship?.category).toBe('Cultural & Indigenous')
    expect(flagship?.whenHeld).toContain('June 18–21')

    const festivalById = getFestivalById('diwata-magdiwata-festival')
    expect(festivalById?.slug).toBe('diwata-magdiwata-festival')
  })

  it('provides dynamic scheduled EVENTS dataset and eventsForFestival helper', () => {
    const { allEvents, eventsForFestival, generalUpcomingEvents } = useEventsFestivals()

    expect(allEvents.length).toBeGreaterThan(0)
    
    const diwataEvents = eventsForFestival('diwata-magdiwata-festival')
    expect(diwataEvents.length).toBeGreaterThan(0)
    expect(diwataEvents.some(e => e.title.includes('Street Dancing'))).toBe(true)

    const generalEvents = generalUpcomingEvents.value
    expect(generalEvents.some(e => e.title.includes('Independence Day'))).toBe(true)
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

  it('filters festivals correctly by category', () => {
    const { selectCategory, selectedCategory, filteredEvents } = useEventsFestivals()

    selectCategory('Cultural & Indigenous')
    expect(selectedCategory.value).toBe('Cultural & Indigenous')
    expect(filteredEvents.value.length).toBeGreaterThanOrEqual(1)
    expect(filteredEvents.value[0].name).toBe('Magdiwata Festival')

    selectCategory('Trade & Agriculture')
    expect(filteredEvents.value).toHaveLength(0)
  })

  it('filters festivals correctly by search query', () => {
    const { searchQuery, filteredEvents } = useEventsFestivals()

    searchQuery.value = 'Manobo'
    expect(filteredEvents.value.length).toBeGreaterThanOrEqual(1)

    searchQuery.value = 'NonExistentQueryString'
    expect(filteredEvents.value).toHaveLength(0)
  })

  it('manages active event selection', () => {
    const { selectEvent, selectedEvent } = useEventsFestivals()

    selectEvent('diwata-magdiwata-festival')
    expect(selectedEvent.value?.id).toBe('diwata-magdiwata-festival')
    expect(selectedEvent.value?.name).toBe('Magdiwata Festival')

    selectEvent(null)
    expect(selectedEvent.value).toBeNull()
  })
})
