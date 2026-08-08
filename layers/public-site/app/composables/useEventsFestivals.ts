import { ref, computed } from 'vue'

export interface ProgramHighlight {
  title: string
  description: string
  iconName?: string
}

export interface Festival {
  id: string
  slug: string
  name: string
  tagline: string
  category: 'Cultural & Indigenous' | 'Civic & Historical' | 'Environmental & Conservation' | 'Trade & Agriculture'
  whenHeld: string
  peakDay?: string
  venue?: string
  shortDescription: string
  fullDescription: string
  highlights: ProgramHighlight[]
  whyItMatters: string
  howToAttend: string
  isFlagship: boolean
  image: string
  organizer: string
  contactInfo?: string
  tags: string[]
}

// Alias for backward compatibility
export type EventFestival = Festival

export interface EventItem {
  id: string
  title: string
  shortDescription: string
  fullDescription?: string
  category: 'Cultural & Indigenous' | 'Civic & Historical' | 'Environmental & Conservation' | 'Trade & Agriculture' | 'Community & Faith'
  startDate: string
  endDate?: string
  location: string
  isFeatured?: boolean
  relatedFestivalSlug?: string
  organizer?: string
  badge?: string
  image?: string
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

export const FESTIVALS: Festival[] = [
  {
    id: 'diwata-magdiwata-festival',
    slug: 'diwata-magdiwata-festival',
    name: 'Magdiwata Festival',
    tagline: 'Cultural & Environmental Celebration of San Francisco',
    category: 'Cultural & Indigenous',
    whenHeld: 'Annually, June 18–21',
    peakDay: 'June 21',
    venue: 'Poblacion, San Francisco — Municipal Grounds & Main Thoroughfares',
    shortDescription: "A four-day cultural and environmental festival honoring Mt. Magdiwata and the town's Manobo heritage, culminating in San Francisco's founding anniversary on June 21.",
    fullDescription: "The Diwata Festival — also held under the name Magdiwata Festival — is San Francisco's biggest annual celebration, rooted in the community's belief in diwata (nature spirits) and its deep bond with Mt. Magdiwata, the watershed mountain that supplies the town's drinking water. Tribal elders open the festival with rituals and offerings invoking blessings for protection, abundance, and harmony with nature, followed by days of street dancing, cultural showcases, and environmental advocacy. The celebration culminates on June 21, which also marks the anniversary of San Francisco's founding as a regular municipality in 1959.",
    highlights: [
      {
        title: 'Tribal Street Dancing',
        description: 'Performers in Manobo-inspired costumes dance through the town\'s main streets to traditional rhythms.',
        iconName: 'Sparkles'
      },
      {
        title: 'Ritual Offerings (Baylan)',
        description: 'Opening ceremonies led by tribal elders, invoking ancestral blessings for abundance and safety.',
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
        title: 'Trashion Show & Tree Planting',
        description: 'A creative fashion show made from recycled materials and community reforestation activities.',
        iconName: 'Recycle'
      }
    ],
    whyItMatters: "Beyond the festivities, the Magdiwata Festival doubles as a platform for environmental advocacy — the mountain it's named for is San Francisco's sole source of potable water, so the festival ties cultural pride directly to watershed conservation.",
    howToAttend: "Free and open to the public; street dancing and main events are held along the town's central thoroughfares and municipal grounds. Check the Municipal Tourism Office or official LGU portal for exact yearly schedules.",
    isFlagship: true,
    image: '/images/destinations/mt_magdiwata.jpg',
    organizer: 'Municipal Tourism Office & LGU San Francisco',
    contactInfo: 'tourism@sanfrancisco-ads.gov.ph',
    tags: ['Flagship Festival', 'Manobo Heritage', 'Mt. Magdiwata Watershed', 'Founding Anniversary']
  },
  {
    id: 'kahimunan-heritage-festival',
    slug: 'kahimunan-heritage-festival',
    name: 'Kahimunan Cultural Heritage Gathering',
    tagline: 'Traditional Tribal Assembly of Elders, Music, and Indigenous Rituals',
    category: 'Cultural & Indigenous',
    whenHeld: 'Annually, Mid-January',
    peakDay: 'January 18',
    venue: 'Barangay Caimpuogan & Indigenous Cultural Grounds',
    shortDescription: 'A sacred Manobo gathering celebrating peace, thanksgiving, and oral traditions through native dances, chanting, and craft exhibitions.',
    fullDescription: 'Kahimunan — meaning "gathering" in Manobo — is an indigenous cultural celebration observed by the Lumad tribal communities in San Francisco and surrounding Agusan del Sur municipalities. The gathering features sacred chanting (Hudhud), traditional musical instruments (Agung and Kubing), and authentic tribal sports competitions.',
    highlights: [
      {
        title: 'Tribal Chanting & Hudhud Storytelling',
        description: 'Elders recite historic lore and oral genealogies handed down through generations.',
        iconName: 'Music'
      },
      {
        title: 'Agung & Bamboo Percussion Competition',
        description: 'Rhythmic musical showcases using traditional indigenous gongs and bamboo flutes.',
        iconName: 'Sparkles'
      },
      {
        title: 'Traditional Indigenous Sports',
        description: 'Demonstrations of indigenous archery, spear throwing, and balance games.',
        iconName: 'Award'
      }
    ],
    whyItMatters: 'Kahimunan preserves the endangered oral traditions, music, and social cohesion of the native Manobo people in Agusan del Sur.',
    howToAttend: 'Visitors are welcomed at public cultural viewing areas. Respectful attire and adherence to tribal photo protocols are requested.',
    isFlagship: false,
    image: '/images/destinations/agusan_marsh.jpg',
    organizer: 'San Francisco Tribal Council',
    contactInfo: 'tribal@sanfrancisco-ads.gov.ph',
    tags: ['Indigenous Gathering', 'Lumad Culture', 'Manobo Traditions', 'Agusan del Sur']
  }
]

export const EVENTS: EventItem[] = [
  {
    id: 'diwata-street-dancing-competition',
    title: 'Manobo Tribal Street Dancing Competition',
    shortDescription: 'Choreographed street dance performances in vibrant Manobo costumes celebrating Mt. Magdiwata.',
    fullDescription: 'The headline highlight of the Diwata Festival, featuring contingents from schools and barangays performing synchronous indigenous dances along San Francisco\'s main highway.',
    category: 'Cultural & Indigenous',
    startDate: 'June 21, 2026',
    location: 'Main Highway & Municipal Ground Amphitheater',
    isFeatured: true,
    relatedFestivalSlug: 'diwata-magdiwata-festival',
    organizer: 'Municipal Tourism Office',
    badge: 'Festival Highlight',
    image: '/images/destinations/mt_magdiwata.jpg'
  },
  {
    id: 'magdiwata-environmental-summit',
    title: 'Mt. Magdiwata Watershed Protection Summit',
    shortDescription: 'Annual environmental conference and tree-planting pledge for watershed preservation.',
    fullDescription: 'Bringing together youth leaders, environmental groups, and LGU officials for forums on forest conservation and climate resilience.',
    category: 'Environmental & Conservation',
    startDate: 'June 19, 2026',
    endDate: 'June 20, 2026',
    location: 'San Francisco Municipal Gymnasium',
    isFeatured: false,
    relatedFestivalSlug: 'diwata-magdiwata-festival',
    organizer: 'MENRO San Francisco',
    badge: 'Eco Summit',
    image: '/images/destinations/mt_magdiwata.jpg'
  },
  {
    id: 'diwata-baylan-ritual',
    title: 'Opening Sacred Baylan Ritual & Offering',
    shortDescription: 'Tribal elders perform solemn rites invoking blessings for abundance and safe festivities.',
    fullDescription: 'Led by accredited Manobo Datus and Baylan spiritual leaders at the base of Mt. Magdiwata reserve.',
    category: 'Cultural & Indigenous',
    startDate: 'June 18, 2026',
    location: 'Mt. Magdiwata Eco-Park Foothills',
    isFeatured: false,
    relatedFestivalSlug: 'diwata-magdiwata-festival',
    organizer: 'San Francisco Tribal Council',
    badge: 'Tribal Rite',
    image: '/images/destinations/mt_magdiwata.jpg'
  },
  {
    id: 'independence-day-flag-ceremony',
    title: 'Philippine Independence Day Civic Parade',
    shortDescription: 'Flag-raising ceremony, civic-military parade, and commemorative speeches for Independence Day.',
    fullDescription: 'Annual civic gathering honoring Philippine national independence with government workforce, civic clubs, and local veterans.',
    category: 'Civic & Historical',
    startDate: 'June 12, 2026',
    location: 'LGU Municipal Hall Grounds',
    isFeatured: true,
    relatedFestivalSlug: undefined,
    organizer: 'LGU Executive Committee',
    badge: 'National Holiday',
    image: '/images/destinations/irosin_stone_crafts.jpg'
  },
  {
    id: 'inter-barangay-sports-cup',
    title: '27-Barangay Inter-Barangay Sports Tournament',
    shortDescription: 'Municipal basketball, volleyball, and athletic competitions engaging all 27 barangays.',
    fullDescription: 'A month-long sports tournament promoting youth wellness, sportsmanship, and inter-barangay fellowship.',
    category: 'Community & Faith',
    startDate: 'July 5, 2026',
    endDate: 'July 25, 2026',
    location: 'Municipal Gymnasium & Barangay Courts',
    isFeatured: false,
    relatedFestivalSlug: undefined,
    organizer: 'Municipal Sports Development Council',
    badge: 'Sports Cup',
    image: '/images/destinations/toog_tree_alegria.jpg'
  },
  {
    id: 'agusan-agri-trade-expo',
    title: 'Agusan del Sur Agricultural Produce & Craft Expo',
    shortDescription: 'Exhibition of local harvests, livestock, organic farming techniques, and stone carving crafts.',
    fullDescription: 'Farmers, agri-cooperatives, and artisan carvers display high-value crops and handcrafted items.',
    category: 'Trade & Agriculture',
    startDate: 'October 10, 2026',
    endDate: 'October 12, 2026',
    location: 'San Francisco Commercial Center Grounds',
    isFeatured: false,
    relatedFestivalSlug: undefined,
    organizer: 'Municipal Agriculture Office & DTI',
    badge: 'Trade Expo',
    image: '/images/destinations/irosin_stone_crafts.jpg'
  },
  {
    id: 'paskuhan-sa-san-francisco',
    title: 'Paskuhan sa San Francisco Town Christmas Lighting',
    shortDescription: 'Grand Christmas tree lighting, night food stalls, and holiday musical performances.',
    fullDescription: 'Month-long festive lights, holiday bazaars, and weekend concerts at the town plaza.',
    category: 'Civic & Historical',
    startDate: 'December 1, 2026',
    endDate: 'January 1, 2027',
    location: 'Poblacion Town Park & Plaza',
    isFeatured: true,
    relatedFestivalSlug: undefined,
    organizer: 'LGU Tourism & Social Welfare Office',
    badge: 'Holiday Season',
    image: '/images/destinations/toog_tree_alegria.jpg'
  }
]

export const useEventsFestivals = () => {
  const searchQuery = ref('')
  const selectedCategory = ref<string>('All')
  const activeEventId = ref<string | null>(null)

  const festivalsData = FESTIVALS

  // Maintaining eventsData alias to match Festival items for existing code compatibility
  const eventsData: EventFestival[] = FESTIVALS

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

  const eventsForFestival = (festivalSlug: string): EventItem[] => {
    return EVENTS.filter(e => e.relatedFestivalSlug === festivalSlug)
  }

  const generalUpcomingEvents = computed(() => {
    return EVENTS.filter(e => !e.relatedFestivalSlug)
  })

  const filteredEvents = computed(() => {
    return eventsData.filter(event => {
      const matchesCategory = selectedCategory.value === 'All'
        || event.category === selectedCategory.value

      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !query
        || event.name.toLowerCase().includes(query)
        || event.shortDescription.toLowerCase().includes(query)
        || (event.venue && event.venue.toLowerCase().includes(query))
        || event.tags.some(tag => tag.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  })

  const filteredUpcomingEvents = computed(() => {
    return EVENTS.filter(event => {
      const matchesCategory = selectedCategory.value === 'All'
        || event.category === selectedCategory.value

      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !query
        || event.title.toLowerCase().includes(query)
        || event.shortDescription.toLowerCase().includes(query)
        || event.location.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  })

  const getFestivalById = (idOrSlug: string): Festival | undefined => {
    return FESTIVALS.find(f => f.id === idOrSlug || f.slug === idOrSlug)
  }

  const getEventById = (id: string): EventItem | undefined => {
    return EVENTS.find(e => e.id === id)
  }

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
    festivalsData,
    eventsData,
    allEvents: EVENTS,
    recurringEventsData,
    categories,
    searchQuery,
    selectedCategory,
    activeEventId,
    selectedEvent,
    filteredEvents,
    filteredUpcomingEvents,
    generalUpcomingEvents,
    eventsForFestival,
    getFestivalById,
    getEventById,
    selectEvent,
    selectCategory
  }
}
