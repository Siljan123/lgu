import { ref, computed } from 'vue'

export interface ProgramHighlight {
  title: string
  description: string
  iconName?: string
}

export interface EventFestival {
  id: string
  name: string
  tagline: string
  category: 'Cultural & Indigenous' | 'Civic & Historical' | 'Environmental & Conservation' | 'Trade & Agriculture'
  whenHeld: string
  peakDay?: string
  venue: string
  shortDescription: string
  fullDescription: string
  programHighlights: ProgramHighlight[]
  whyItMatters: string
  howToAttend: string
  isFlagship: boolean
  image: string
  organizer: string
  contactInfo?: string
  tags: string[]
}

export interface RecurringEvent {
  id: string
  title: string
  category: string
  schedule: string
  venue: string
  shortDescription: string
  organizer: string
  badge: string
}

export const useEventsFestivals = () => {
  const searchQuery = ref('')
  const selectedCategory = ref<string>('All')
  const activeEventId = ref<string | null>(null)

  const eventsData: EventFestival[] = [
    {
      id: 'diwata-magdiwata-festival',
      name: 'Diwata / Magdiwata Festival',
      tagline: 'Flagship Cultural & Environmental Celebration of San Francisco',
      category: 'Cultural & Indigenous',
      whenHeld: 'Annually, June 18–21',
      peakDay: 'June 21',
      venue: 'Poblacion, San Francisco — Municipal Grounds & Main Thoroughfares',
      shortDescription: "A four-day cultural and environmental festival honoring Mt. Magdiwata and the town's Manobo heritage, culminating in San Francisco's founding anniversary on June 21.",
      fullDescription: "The Diwata Festival — also held under the name Magdiwata Festival — is San Francisco's biggest annual celebration, rooted in the community's belief in diwata (nature spirits) and its deep bond with Mt. Magdiwata, the watershed mountain that supplies the town's drinking water. Tribal elders open the festival with rituals and offerings invoking blessings for protection, abundance, and harmony with nature, followed by days of street dancing, cultural showcases, and environmental advocacy. The celebration culminates on June 21, which also marks the anniversary of San Francisco's founding as a regular municipality in 1959.",
      programHighlights: [
        {
          title: 'Tribal Street Dancing',
          description: 'Performers in Manobo-inspired costumes dance through the town\'s main streets to traditional rhythms.',
          iconName: 'Sparkles'
        },
        {
          title: 'Ritual Offerings',
          description: 'Opening ceremonies led by tribal elders (baylan), invoking ancestral blessings for abundance and safety.',
          iconName: 'Flame'
        },
        {
          title: 'Magdiwata Environmental Summit',
          description: 'Talks and forums on watershed protection, bringing together local officials, environmentalists, and community stakeholders.',
          iconName: 'Mountain'
        },
        {
          title: 'Indigenous Artistry & Trade Fair',
          description: 'Stalls featuring local weaves, crafts, and Irosin stone-carved artifacts created by local artisans.',
          iconName: 'ShoppingBag'
        },
        {
          title: 'Trashion Show',
          description: 'A creative fashion show made entirely from recycled materials, spotlighting community sustainability.',
          iconName: 'Recycle'
        },
        {
          title: 'Tree-Planting Activity',
          description: 'A community-wide environmental action tied directly to Mt. Magdiwata watershed conservation.',
          iconName: 'TreePine'
        },
        {
          title: 'Cultural Night & Concerts',
          description: 'Evening programs featuring local musical acts, indigenous performing groups, and guest artists.',
          iconName: 'Music'
        }
      ],
      whyItMatters: "Beyond the festivities, the Diwata/Magdiwata Festival doubles as a platform for environmental advocacy — the mountain it's named for is San Francisco's sole source of potable water, so the festival ties cultural pride directly to watershed conservation.",
      howToAttend: "Free and open to the public; street dancing and main events are held along the town's central thoroughfares and municipal grounds. Check the Municipal Tourism Office or the town's official Facebook page for the exact yearly schedule, as dates can shift slightly year to year.",
      isFlagship: true,
      image: '/images/destinations/mt_magdiwata.jpg',
      organizer: 'Municipal Tourism Office & LGU San Francisco',
      contactInfo: 'tourism@sanfrancisco-ads.gov.ph',
      tags: ['Flagship Festival', 'Manobo Heritage', 'Mt. Magdiwata Watershed', 'Founding Anniversary']
    }
  ]

  const recurringEventsData: RecurringEvent[] = [
    {
      id: 'barangay-fiestas',
      title: 'Barangay-Level Fiestas',
      category: 'Community & Faith',
      schedule: 'Dates vary by barangay throughout the year',
      venue: 'Respective Barangay Halls & Parish Plazas',
      shortDescription: 'Local barangay celebrations featuring patron saint honorings, sports tournaments, community feasts, and local talent nights across all 27 barangays.',
      organizer: 'Barangay Councils & Parish Committees',
      badge: 'Recurring Observance'
    },
    {
      id: 'independence-day',
      title: 'Independence Day Activities',
      category: 'Civic & Historical',
      schedule: 'Annually, June 12',
      venue: 'San Francisco Municipal Hall Grounds',
      shortDescription: 'Civic parade, flag-raising ceremony, commemorative speeches, and cultural presentations marking Philippine Independence.',
      organizer: 'LGU Executive Committee & Municipal Tourism Office',
      badge: 'National Holiday'
    },
    {
      id: 'year-end-christmas',
      title: 'Year-End & Christmas Season Town Programs',
      category: 'Civic & Cultural',
      schedule: 'Annually, December 1 – January 1',
      venue: 'Poblacion Municipal Park & Plaza',
      shortDescription: 'Nightly light displays, Christmas tree lighting ceremony, holiday food stalls, and community gift-giving activities.',
      organizer: 'LGU San Francisco Social Welfare & Tourism Office',
      badge: 'Holiday Season'
    },
    {
      id: 'agri-trade-fairs',
      title: 'LGU Agricultural & Trade Fairs',
      category: 'Trade & Agriculture',
      schedule: 'Seasonal / Agri-Tourism Month',
      venue: 'San Francisco Public Market Grounds & Municipal Gymnasium',
      shortDescription: 'Exhibition of local agricultural produce, livestock showcases, agri-tech forums, and organic farming workshops for Agusan del Sur farmers.',
      organizer: 'Municipal Agriculture Office & Department of Trade',
      badge: 'LGU Trade Fair'
    }
  ]

  const categories = [
    'All',
    'Cultural & Indigenous',
    'Civic & Historical',
    'Environmental & Conservation',
    'Trade & Agriculture'
  ]

  const filteredEvents = computed(() => {
    return eventsData.filter(event => {
      const matchesCategory = selectedCategory.value === 'All'
        || event.category === selectedCategory.value

      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !query
        || event.name.toLowerCase().includes(query)
        || event.shortDescription.toLowerCase().includes(query)
        || event.venue.toLowerCase().includes(query)
        || event.tags.some(tag => tag.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  })

  const selectedEvent = computed(() => {
    if (!activeEventId.value) return null
    return eventsData.find(e => e.id === activeEventId.value) || null
  })

  const selectEvent = (eventOrId: EventFestival | string | null) => {
    if (!eventOrId) {
      activeEventId.value = null
    } else if (typeof eventOrId === 'string') {
      activeEventId.value = eventOrId
    } else {
      activeEventId.value = eventOrId.id
    }
  }

  const selectCategory = (cat: string) => {
    selectedCategory.value = cat
  }

  return {
    eventsData,
    recurringEventsData,
    categories,
    searchQuery,
    selectedCategory,
    activeEventId,
    selectedEvent,
    filteredEvents,
    selectEvent,
    selectCategory
  }
}
