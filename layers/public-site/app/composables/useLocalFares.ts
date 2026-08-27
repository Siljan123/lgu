export interface LocalFare {
  id: string
  from: string
  to: string
  mode: string
  fare: string
  discountedFare?: string
  estimatedTime?: string
  route_path: string
}

type BaseFare = Omit<LocalFare, 'route_path'>

const RAW_FARES: BaseFare[] = [
  {
    id: '1',
    from: 'Poblacion',
    to: 'New Terminal Hubang',
    mode: 'Tricycle/Bao-Bao',
    fare: '₱15',
    discountedFare: '₱12',
    estimatedTime: '10-15 mins',
  },
  {
    id: '2',
    from: 'New Terminal Hubang',
    to: 'Poblacion Public Market',
    mode: 'Tricycle/Bao-Bao',
    fare: '₱15',
    discountedFare: '₱12',
    estimatedTime: '10 mins',
  },
  {
    id: '3',
    from: 'Poblacion',
    to: 'Mt. Magdiwata Base (Brgy. San Isidro)',
    mode: 'Habal-habal',
    fare: '₱60',
    discountedFare: '₱50',
  },
  {
    id: '4',
    from: 'New Terminal Hubang',
    to: 'Agusan Marsh Gateway (Sabang Gibong)',
    mode: 'Multicab',
    fare: '₱80',
    discountedFare: '₱65',
    estimatedTime: '45-60 mins'
  },
  {
    id: '5',
    from: 'Poblacion',
    to: 'Giant Toog Tree (Brgy. Alegria)',
    mode: 'Tricycle / Multicab',
    fare: '₱35',
    discountedFare: '₱28',
    estimatedTime: '20 mins'
  },
  {
    id: '6',
    from: 'Poblacion',
    to: 'Brgy. Ladgadan',
    mode: 'Tricycle',
    fare: '₱20',
    discountedFare: '₱16',
    estimatedTime: '15 mins'
  },
  {
    id: '7',
    from: 'Poblacion',
    to: 'Brgy. Caimpuogan',
    mode: 'Multicab',
    fare: '₱25',
    discountedFare: '₱20',
    estimatedTime: '15-20 mins'
  },
  {
    id: '8',
    from: 'Poblacion',
    to: 'Brgy. Karaos',
    mode: 'Tricycle',
    fare: '₱25',
    discountedFare: '₱20',
    estimatedTime: '15 mins'
  },
  {
    id: '9',
    from: 'New Terminal Hubang',
    to: 'Neighboring Municipal Boundary',
    mode: 'UV Express Van',
    fare: '₱120',
    discountedFare: '₱100',
    estimatedTime: '40 mins'
  }
]

const STATIC_LOCAL_FARES: LocalFare[] = RAW_FARES.map(fare => {
  const locationSuffix = ', San Francisco, Agusan del Sur, Philippines'
  const origin = encodeURIComponent(`${fare.from}${locationSuffix}`)
  const destination = encodeURIComponent(`${fare.to}${locationSuffix}`)
  return {
    ...fare,
    route_path: `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
  }
})

export function useLocalFares() {
  const { data: fares, pending, error, refresh } = useAsyncData<LocalFare[]>(
    'local-fares',
    async () => {
      return STATIC_LOCAL_FARES
    },
    {
      default: () => STATIC_LOCAL_FARES
    }
  )

  const searchQuery = ref('')
  const selectedOrigin = ref<string>('All')
  const selectedMode = ref<string>('All')

  const fromLocations = computed(() => [
    'All',
    ...new Set((fares.value ?? []).map(f => f.from))
  ])

  const availableModes = computed(() => [
    'All',
    ...new Set((fares.value ?? []).map(f => f.mode))
  ])

  const filteredFares = computed(() => {
    const list = fares.value ?? []
    const query = searchQuery.value.trim().toLowerCase()

    return list.filter(f => {
      const matchesOrigin =
        selectedOrigin.value === 'All' || f.from === selectedOrigin.value
      const matchesMode =
        selectedMode.value === 'All' || f.mode === selectedMode.value
      const matchesQuery =
        !query ||
        f.from.toLowerCase().includes(query) ||
        f.to.toLowerCase().includes(query) ||
        f.mode.toLowerCase().includes(query)
 

      return matchesOrigin && matchesMode && matchesQuery
    })
  })

  function filterByFrom(from: string) {
    return computed(() =>
      (fares.value ?? []).filter(f => f.from === from)
    )
  }

  return {
    fares,
    pending,
    error,
    refresh,
    searchQuery,
    selectedOrigin,
    selectedMode,
    fromLocations,
    availableModes,
    filteredFares,
    filterByFrom
  }
}