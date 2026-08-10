export interface TransportOption {
  id: string
  mode: 'Air' | 'Land' | 'Sea'
  title: string
  hub: string
  distanceTime: string
  description: string
  steps: string[]
  recommendedFor: string
  badge?: string
}

export interface TerminalHubInfo {
  name: string
  location: string
  barangay: string
  operatingHours: string
  bays: {
    name: string
    destinations: string
    vehicles: string
  }[]
  amenities: string[]
  travelTip: string
}

export interface RulePermitItem {
  id: string
  category: 'Environment & Watershed' | 'Wildlife Protection' | 'Media & Drones' | 'Public Safety'
  title: string
  permitName: string
  issuingAgency: string
  requirement: string
  feeInfo: string
  details: string[]
  importantNotice?: string
}

export interface EmergencyContact {
  id: string
  agency: string
  role: string
  phone: string
  mobile?: string
  email?: string
  location: string
  availableHours: string
  iconName: string
}

const GETTING_THERE_OPTIONS: TransportOption[] = [
  {
    id: 'air-butuan',
    mode: 'Air',
    title: 'Via Butuan Bancasi Airport (BXU)',
    hub: 'Butuan City, Agusan del Norte (85 km North)',
    distanceTime: 'Approx. 1.5 to 2 hours overland',
    description: 'The closest commercial airport to San Francisco with daily flights from Manila and Cebu.',
    steps: [
      'Take a taxi or tricycle from Bancasi Airport to the Butuan Integrated Bus Terminal (Ampayon).',
      'Board an air-conditioned or non-aircon Bachelor Express bus bound for Davao, Mangagoy, or San Francisco.',
      'Alight at the San Francisco Intermodal Transport Terminal (New Terminal) in Brgy. Hubang.'
    ],
    recommendedFor: 'Travelers flying in from Manila, Cebu, or major Luzon/Visayas cities.',
    badge: 'Fastest Route'
  },
  {
    id: 'air-davao',
    mode: 'Air',
    title: 'Via Francisco Bangoy International Airport (DVO)',
    hub: 'Davao City (210 km South)',
    distanceTime: 'Approx. 4 to 4.5 hours overland',
    description: 'Major international gateway with frequent domestic flights and direct international connections.',
    steps: [
      'Take a taxi from Davao Airport to Ecoland Bus Terminal in Davao City.',
      'Board a Bachelor Express bus operating the Davao-Butuan route via San Francisco.',
      'Disembark directly at San Francisco Intermodal Terminal in Brgy. Hubang.'
    ],
    recommendedFor: 'International visitors or travelers exploring Southern Mindanao.'
  },
  {
    id: 'air-surigao',
    mode: 'Air',
    title: 'Via Surigao Airport (SUG)',
    hub: 'Surigao City (160 km North)',
    distanceTime: 'Approx. 3.5 hours overland',
    description: 'Convenient air entry point for travelers visiting Siargao or Northern Caraga.',
    steps: [
      'Proceed to Surigao Integrated Bus Terminal.',
      'Take a southbound bus or UV Express van bound for Butuan/San Francisco.',
      'Transfer or continue directly to San Francisco Intermodal Hub in Brgy. Hubang.'
    ],
    recommendedFor: 'Island hoppers coming from Siargao or Surigao del Norte.'
  },
  {
    id: 'land-bus-van',
    mode: 'Land',
    title: 'Direct Bus & Passenger Vans (AH26 Asian Highway)',
    hub: 'San Francisco Intermodal Terminal, Brgy. Hubang',
    distanceTime: 'Continuous 24/7 Highway Transit',
    description: 'San Francisco serves as the central land transportation crossroad of Agusan del Sur.',
    steps: [
      'Air-conditioned and regular buses run hourly along the Davao-Butuan highway corridor.',
      'UV Express shuttle vans operate daily routes connecting San Francisco with neighboring municipalities.',
      'All commercial passenger buses and vans stop at the New Terminal in Brgy. Hubang.'
    ],
    recommendedFor: 'Budget travelers, regional commuters, and overland road trips.'
  },
  {
    id: 'sea-ports',
    mode: 'Sea',
    title: 'Via Ferry Ports (Nasipit & Surigao)',
    hub: 'Nasipit Port (105 km) / Surigao City Port (165 km)',
    distanceTime: 'Approx. 2.5 to 4 hours overland transfer',
    description: 'Ferry and RoRo vessel routes linking Cebu, Bohol, and Manila to Caraga Region.',
    steps: [
      'Disembark at Nasipit Seaport (Agusan del Norte) or Surigao Seaport.',
      'Board direct vans or buses connecting to San Francisco, Agusan del Sur.',
      'Arrive at San Francisco Intermodal Terminal in Brgy. Hubang.'
    ],
    recommendedFor: 'RoRo travelers carrying private vehicles or cargo.'
  }
]

const TERMINAL_HUB_INFO: TerminalHubInfo = {
  name: 'San Francisco Integrated Bus & Transport Terminal',
  location: 'National Highway AH26, Barangay Hubang',
  barangay: 'Brgy. Hubang, San Francisco, Agusan del Sur',
  operatingHours: '24 Hours Daily / 7 Days a Week',
  bays: [
    {
      name: 'Bay A (Inter-Regional Buses)',
      destinations: 'Davao City, Butuan City, Cagayan de Oro, Surigao City, Tacloban/Manila',
      vehicles: 'Bachelor Express, Philtranco, PP Bus Lines'
    },
    {
      name: 'Bay B (Inter-Municipal Vans & Multicabs)',
      destinations: 'Trento, Prosperidad, Barobo, Bislig, Loreto, Talacogon',
      vehicles: 'UV Express Shuttle Vans, Public Multicabs'
    },
    {
      name: 'Bay C (Local Municipal TODA Bay)',
      destinations: 'Poblacion Town Proper, Brgy. Alegria, Brgy. San Isidro, Brgy. Ladgadan',
      vehicles: 'Motorized Tricycles (TODA), Habal-habal Motorcycles'
    }
  ],
  amenities: [
    '24/7 Security & PNP Tourist Assistance Desk',
    'Covered Passenger Waiting Lounges & Restrooms',
    'Ticket Outlets & Express Baggage Counters',
    'Food Stalls, Convenience Shops & ATMs nearby'
  ],
  travelTip: 'Standard regulated fare from New Terminal Hubang to Poblacion Town Proper is ₱15 via TODA tricycle. Negotiate habal-habal rates in advance for mountain destinations.'
}

const RULES_PERMITS_DATA: RulePermitItem[] = [
  {
    id: 'mt-magdiwata-permit',
    category: 'Environment & Watershed',
    title: 'Mt. Magdiwata Watershed Sanctuary Trekking Clearance',
    permitName: 'Mt. Magdiwata Environmental Entry Pass',
    issuingAgency: 'Municipal Environment & Natural Resources Office (MENRO) / Tourism Office',
    requirement: 'Mandatory registration prior to ascending Mt. Magdiwata eco-trails.',
    feeInfo: '₱50 Environmental Fee / ₱500 Guide Fee per group (1:5 ratio)',
    details: [
      'All hikers must secure a trekking permit at the Municipal Tourism Office in Poblacion.',
      'Accredited local guides from San Francisco guide association are mandatory for all trekking groups.',
      'Single-use plastic bottles, open fires, and littering are strictly prohibited inside the watershed reservation.'
    ],
    importantNotice: 'Trekking without an official LGU permit or accredited guide is punishable under Municipal Watershed Protection Ordinance.'
  },
  {
    id: 'agusan-marsh-protocol',
    category: 'Wildlife Protection',
    title: 'Agusan Marsh Eco-Sanctuary Visitation Protocol',
    permitName: 'Agusan Marsh Ecotourism Access Pass',
    issuingAgency: 'Protected Area Management Board (PAMB) & Municipal Tourism Desk',
    requirement: 'Pre-booking required at least 48 hours before planned wetland tour.',
    feeInfo: '₱100 PAMB Entry Fee + Boat Rental Tariff',
    details: [
      'Visitors entering Sabang Gibong riverways must wear life vests at all times.',
      'Drone flying and loud noise near migratory bird roosting sites are restricted to protect wildlife.',
      'Discharge of trash or non-biodegradable materials into the marsh waters is subject to heavy fines.'
    ]
  },
  {
    id: 'drone-media-permit',
    category: 'Media & Drones',
    title: 'Commercial Aerial Photography & Drone Regulations',
    permitName: 'LGU Media Clearance & Flight Permit',
    issuingAgency: 'Municipal Tourism Office & Public Information Office (PIO)',
    requirement: 'Clearance required for commercial videography, documentary production, or heavy drone ops.',
    feeInfo: 'Free for non-commercial tourists; Permit required for commercial shoots',
    details: [
      'Recreational photography is permitted in public parks and town squares without fees.',
      'Commercial filming or drone coverage over municipal government buildings, watersheds, and sanctuaries requires LGU notice 3 days prior.',
      'Operators must comply with CAAP drone flight safety altitude ceilings (max 400ft AGL).'
    ]
  },
  {
    id: 'plastic-waste-ordinance',
    category: 'Public Safety',
    title: 'Solid Waste Management & Single-Use Plastic Ordinance',
    permitName: 'Municipal Ecological Compliance Standard',
    issuingAgency: 'Municipality of San Francisco LGU Enforcement Unit',
    requirement: 'Applicable to all residents, business establishments, and visiting tourists.',
    feeInfo: 'Non-compliance penalties: ₱500 to ₱2,500 fine',
    details: [
      'San Francisco strictly enforces a zero-littering and single-use plastic reduction policy in public spaces.',
      'Tourists are encouraged to carry reusable water bottles and fabric shopping bags during their stay.'
    ]
  }
]

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-tourism',
    agency: 'Municipal Tourism & Cultural Desk',
    role: 'Visitor Assistance, Tour Guidance & Permit Inquiries',
    phone: '(085) 839-0112',
    mobile: '0917-889-4321',
    email: 'tourism@sanfrancisco-ads.gov.ph',
    location: 'Municipal Hall Complex, Poblacion',
    availableHours: 'Mon - Fri: 8:00 AM - 5:00 PM (Hotline 24/7)',
    iconName: 'Building2'
  },
  {
    id: 'contact-mdrmmo',
    agency: 'San Francisco MDRRMO',
    role: 'Disaster Response, Rescue Operations & Emergency Relief',
    phone: '(085) 839-1234',
    mobile: '0912-345-6789',
    email: 'mdrrmo@sanfrancisco-ads.gov.ph',
    location: 'Emergency Operations Center, Brgy. Hubang',
    availableHours: '24 Hours Daily / 7 Days a Week',
    iconName: 'ShieldAlert'
  },
  {
    id: 'contact-pnp',
    agency: 'PNP San Francisco Municipal Station',
    role: 'Public Order, Crime Prevention & Tourist Police Desk',
    phone: '(085) 343-9876',
    mobile: '0998-598-7654',
    email: 'pnp_sanfran_ads@yahoo.com',
    location: 'Poblacion Police Station, San Francisco',
    availableHours: '24 Hours Daily / 7 Days a Week',
    iconName: 'ShieldCheck'
  },
  {
    id: 'contact-health',
    agency: 'Municipal Health Office & District Hospital',
    role: 'Medical Emergencies, First Aid & Health Consultations',
    phone: '(085) 839-5566',
    mobile: '0920-112-3344',
    location: 'Barangay Hubang Health Complex',
    availableHours: '24 Hours Emergency Room Services',
    iconName: 'HeartPulse'
  }
]

export function useTravelersGuide() {
  const gettingThereOptions = ref(GETTING_THERE_OPTIONS)
  const terminalHubInfo = ref(TERMINAL_HUB_INFO)
  const rulesAndPermits = ref(RULES_PERMITS_DATA)
  const emergencyContacts = ref(EMERGENCY_CONTACTS)

  function getOptionByMode(mode: 'Air' | 'Land' | 'Sea') {
    return computed(() =>
      gettingThereOptions.value.filter(opt => opt.mode === mode)
    )
  }

  return {
    gettingThereOptions,
    terminalHubInfo,
    rulesAndPermits,
    emergencyContacts,
    getOptionByMode
  }
}
