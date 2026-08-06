import { ref, computed } from 'vue'

export interface Destination {
  id: string
  name: string
  category: 'Heritage & Culture' | 'Adventure & Outdoor' | 'Wildlife & Conservation' | 'Natural Attractions'
  secondaryCategory?: string
  barangay: string
  shortDescription: string
  fullDescription: string
  highlights: string[]
  howToGetThere: string
  bestTimeToVisit: string
  accessNotes: string
  image: string
  coordinates?: { lat: number; lng: number }
}

export const useDestinations = () => {
  const searchQuery = ref('')
  const selectedCategory = ref<string>('All')
  const activeDestinationId = ref<string | null>(null)

  const destinationsData: Destination[] = [
    {
      id: 'toog-tree-of-alegria',
      name: 'Toog Tree of Alegria',
      category: 'Heritage & Culture',
      secondaryCategory: 'Natural Attractions',
      barangay: 'Alegria',
      shortDescription: 'A 300-year-old Philippine rosewood tree, believed to be the oldest and tallest of its kind in the country — standing proudly along the national highway.',
      fullDescription: 'Rising over 50 meters along the roadside in Barangay Alegria, the Toog Tree (Petersianthus quadrialatus) is one of San Francisco\'s most iconic natural landmarks. Estimated at three centuries old, it holds deep spiritual significance for the town\'s Indigenous communities, who regard it as a sacred tree. Over the years it has drawn conservationists, travel bloggers, and curious travelers passing through Agusan del Sur, and remains a living symbol of the town\'s connection to its natural and cultural heritage.',
      highlights: [
        'One of the tallest and oldest trees of its species in the Philippines',
        'Deep cultural and spiritual significance to local Indigenous peoples',
        'Easily accessible roadside landmark — no hike required',
        'A living heritage site currently under conservation care'
      ],
      howToGetThere: 'Located along the national highway in Barangay Alegria. Any Butuan–Davao-bound bus, van, or jeepney passing through San Francisco can drop passengers near the site.',
      bestTimeToVisit: 'Anytime — early morning offers the best light for photos.',
      accessNotes: 'Free entry, open 24 hours. As a protected heritage tree with ongoing conservation efforts, visitors are asked to view and photograph it respectfully rather than climb or disturb the trunk.',
      image: '/images/destinations/toog_tree_alegria.jpg',
      coordinates: { lat: 8.528, lng: 125.987 }
    },
    {
      id: 'mt-magdiwata',
      name: 'Mt. Magdiwata',
      category: 'Adventure & Outdoor',
      secondaryCategory: 'Natural Attractions',
      barangay: 'San Isidro',
      shortDescription: 'A watershed mountain rising about 590 meters above the town, offering panoramic views of San Francisco and the Agusan Marsh — a favorite among local and visiting hikers.',
      fullDescription: 'Mt. Magdiwata is San Francisco\'s signature hiking destination and the primary source of potable water for the town. Cloaked in tropical forest and home to native birds and wildlife, the mountain holds spiritual importance to the Manobo people, who consider it home to a diwata (spirit). Hikers who reach the summit plateau are rewarded with sweeping views of the Agusan Marsh and surrounding lowlands — a rare vantage point over one of Mindanao\'s most important wetland ecosystems.',
      highlights: [
        'Panoramic summit views of the Agusan Marsh',
        'Forest trails with native birdlife and wildlife',
        'Culturally significant to the Manobo community',
        'A protected watershed reserve supplying the town\'s water'
      ],
      howToGetThere: 'Trailhead near Barangay San Isidro. From the town center, take a tricycle or habal-habal to the jump-off point.',
      bestTimeToVisit: 'Early morning, when trails are cooler and the summit often catches a scenic mist.',
      accessNotes: 'Mt. Magdiwata is a declared watershed forest reserve, so access is coordinated rather than open trail. Visitors should arrange their climb through the Municipal Tourism Office or the San Francisco Mountaineers\' Club.',
      image: '/images/destinations/mt_magdiwata.jpg',
      coordinates: { lat: 8.498, lng: 125.965 }
    },
    {
      id: 'agusan-marsh-wildlife-sanctuary',
      name: 'Agusan Marsh Wildlife Sanctuary — San Francisco Gateway',
      category: 'Wildlife & Conservation',
      secondaryCategory: 'Natural Attractions',
      barangay: 'Caimpugan / New Visayas',
      shortDescription: 'San Francisco serves as one of the gateway municipalities to the Agusan Marsh Wildlife Sanctuary, a protected wetland reachable through Barangays Caimpugan and New Visayas.',
      fullDescription: 'The Agusan Marsh is one of the largest and most ecologically important wetlands in the Philippines, home to migratory birds, diverse aquatic life, and communities that have long lived in harmony with the marsh\'s rhythms. Through Barangays Caimpugan and New Visayas, San Francisco offers visitors an accessible entry point into this vast wetland sanctuary, where boat trips reveal floating settlements, flooded forests, and rich birdlife found in few other places in the country.',
      highlights: [
        'Gateway access to one of the Philippines\' major wetland sanctuaries',
        'Boat trips through flooded forests and open marsh',
        'Birdwatching and wetland biodiversity',
        'Glimpse of floating riverside communities and their way of life'
      ],
      howToGetThere: 'Access points via Barangay Caimpugan or Barangay New Visayas; boat transport is arranged locally.',
      bestTimeToVisit: 'Dry season, when water levels make boat access easier and more predictable.',
      accessNotes: 'Best arranged through the Municipal Tourism Office or a local guide familiar with the marsh\'s protected areas.',
      image: '/images/destinations/agusan_marsh.jpg',
      coordinates: { lat: 8.412, lng: 125.882 }
    },
    {
      id: 'irosin-stone-crafts',
      name: 'Irosin Stone Crafts',
      category: 'Heritage & Culture',
      secondaryCategory: 'Local Livelihood',
      barangay: 'San Francisco Artisan Workshops',
      shortDescription: 'A centuries-old Indigenous stone-carving tradition, passed down through generations of San Francisco\'s local families.',
      fullDescription: 'For hundreds of years, Indigenous families in San Francisco have practiced Irosin stone craft — a cottage industry of carving and shaping stone into decorative and functional pieces. The craftsmanship reflects generations of accumulated skill and cultural identity, and has drawn enough scholarly attention that the tradition has been floated for consideration under the UNESCO Creative Cities Network. Visiting artisans offers a window into a living tradition rather than a static museum piece.',
      highlights: [
        'Generations-old Indigenous cottage industry',
        'Recognized craftsmanship, considered for UNESCO Creative Cities recognition',
        'Opportunity to meet artisans and see the craft in progress',
        'Locally made stone pieces available to purchase'
      ],
      howToGetThere: 'Inquire at the Municipal Tourism Office for current artisan workshops open to visitors.',
      bestTimeToVisit: 'Anytime — best coordinated in advance with local artisans.',
      accessNotes: 'Best experienced with a local guide or through the Municipal Tourism Office, both for authentic engagement and to support the artisans directly.',
      image: '/images/destinations/irosin_stone_crafts.jpg',
      coordinates: { lat: 8.502, lng: 125.975 }
    }
  ]

  const categories = [
    'All',
    'Natural Attractions',
    'Heritage & Culture',
    'Adventure & Outdoor',
    'Wildlife & Conservation'
  ]

  // Filtered destinations list
  const filteredDestinations = computed(() => {
    return destinationsData.filter(item => {
      const matchesCategory = selectedCategory.value === 'All'
        || item.category === selectedCategory.value
        || item.secondaryCategory === selectedCategory.value

      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !query
        || item.name.toLowerCase().includes(query)
        || item.barangay.toLowerCase().includes(query)
        || item.shortDescription.toLowerCase().includes(query)
        || item.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  })

  const selectedDestination = computed(() => {
    if (!activeDestinationId.value) return null
    return destinationsData.find(d => d.id === activeDestinationId.value) || null
  })

  const selectDestination = (destinationOrId: Destination | string | null) => {
    if (!destinationOrId) {
      activeDestinationId.value = null
    } else if (typeof destinationOrId === 'string') {
      activeDestinationId.value = destinationOrId
    } else {
      activeDestinationId.value = destinationOrId.id
    }
  }

  const getDestinationById = (id: string): Destination | undefined => {
    return destinationsData.find(d => d.id === id)
  }

  const selectCategory = (cat: string) => {
    selectedCategory.value = cat
  }

  return {
    destinationsData,
    categories,
    searchQuery,
    selectedCategory,
    activeDestinationId,
    selectedDestination,
    filteredDestinations,
    selectDestination,
    getDestinationById,
    selectCategory
  }
}
