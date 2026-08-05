import { computed } from 'vue'

export interface BarangayOfficial {
  id: string
  name: string
  title: string
  role: 'captain' | 'secretary' | 'treasurer' | 'kagawad' | 'sk_chairperson'
  committee?: string
  avatar?: string
  contact?: string
}

export interface BarangayCoordinates {
  lat: number
  lng: number
  display: string
}

export interface BarangayItem {
  id: string
  name: string
  classification: 'Poblacion' | 'Urban' | 'Rural'
  postalCode: string
  population: number
  censusYear: string
  elevationASL: string
  elevationMeters: number
  coordinates: BarangayCoordinates
  landAreaSqKm: number
  hallAddress: string
  contactPhone: string
  contactEmail: string
  mapEmbedUrl?: string
  description?: string
  officials: BarangayOfficial[]
}

const BARANGAY_LIST_DATA: BarangayItem[] = [
  {
    id: 'alegria',
    name: 'Alegria',
    classification: 'Rural',
    postalCode: '8500',
    population: 3420,
    censusYear: '2025 Official Census',
    elevationASL: '65m ASL',
    elevationMeters: 65,
    coordinates: { lat: 8.5124, lng: 125.9512, display: '8.5124° N, 125.9512° E' },
    landAreaSqKm: 14.2,
    hallAddress: 'Purok 2, Brgy. Alegria',
    contactPhone: '+63 (085) 839-1001',
    contactEmail: 'brgy.alegria@sfads.gov.ph',
    description: 'Known for rich agricultural valleys, hillside agro-forestry projects, and community rubber plantations.',
    officials: [
      { id: 'al-1', name: 'Hon. Rodrigo M. Santos', title: 'Punong Barangay', role: 'captain' },
      { id: 'al-2', name: 'Maria Elena V. Torres', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'al-3', name: 'Jose Bernardo Cruz', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'al-4', name: 'Hon. Danilo R. Flores', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'al-5', name: 'Hon. Grace P. Mendoza', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance & Appropriation' },
      { id: 'al-6', name: 'Hon. Ernesto S. Ramos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture & Environment' },
      { id: 'al-7', name: 'Hon. Teresa L. Diaz', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health & Social Welfare' },
      { id: 'al-8', name: 'Hon. Wilfredo M. Navarro', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure & Public Works' },
      { id: 'al-9', name: 'Hon. Carmen G. Aquino', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education & Culture' },
      { id: 'al-10', name: 'Hon. Ramon T. Castillo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Laws & Rules' },
      { id: 'al-11', name: 'Hon. Joshua K. Perez', title: 'SK Chairperson', role: 'sk_chairperson', committee: 'Youth & Sports Development' }
    ]
  },
  {
    id: 'bayugan-2',
    name: 'Bayugan 2',
    classification: 'Rural',
    postalCode: '8500',
    population: 4890,
    censusYear: '2025 Official Census',
    elevationASL: '48m ASL',
    elevationMeters: 48,
    coordinates: { lat: 8.5311, lng: 125.9234, display: '8.5311° N, 125.9234° E' },
    landAreaSqKm: 18.6,
    hallAddress: 'Purok 1, Brgy. Bayugan 2',
    contactPhone: '+63 (085) 839-1002',
    contactEmail: 'brgy.bayugan2@sfads.gov.ph',
    description: 'A thriving agricultural community with vibrant rice-growing estates and irrigation canals.',
    officials: [
      { id: 'b2-1', name: 'Hon. Manuel L. Cordero', title: 'Punong Barangay', role: 'captain' },
      { id: 'b2-2', name: 'Analyn S. Bautista', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'b2-3', name: 'Renato C. Villanueva', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'b2-4', name: 'Hon. Samuel T. Garcia', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'b2-5', name: 'Hon. Marites B. Reyes', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance & Appropriation' },
      { id: 'b2-6', name: 'Hon. Carlos N. Rivera', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'b2-7', name: 'Hon. Josephine A. Luna', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'b2-8', name: 'Hon. Fernando E. Soriano', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'b2-9', name: 'Hon. Rowena M. Alonzo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'b2-10', name: 'Hon. Alejandro V. Valdez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'b2-11', name: 'Hon. Kimberly D. Ocampo', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'bitan-agan',
    name: 'Bitan-agan',
    classification: 'Rural',
    postalCode: '8500',
    population: 2950,
    censusYear: '2025 Official Census',
    elevationASL: '82m ASL',
    elevationMeters: 82,
    coordinates: { lat: 8.4892, lng: 125.9680, display: '8.4892° N, 125.9680° E' },
    landAreaSqKm: 11.5,
    hallAddress: 'National Highway, Brgy. Bitan-agan',
    contactPhone: '+63 (085) 839-1003',
    contactEmail: 'brgy.bitanagan@sfads.gov.ph',
    description: 'Scenic hillside barangay with lush coconut plantations and eco-tourism trails.',
    officials: [
      { id: 'ba-1', name: 'Hon. Gabriel P. Delgado', title: 'Punong Barangay', role: 'captain' },
      { id: 'ba-2', name: 'Cecilia M. Hernandez', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'ba-3', name: 'Arturo F. Pascual', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'ba-4', name: 'Hon. Benjamin D. Roxas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'ba-5', name: 'Hon. Ligaya R. Serrano', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'ba-6', name: 'Hon. Ricardo T. Lim', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Environment' },
      { id: 'ba-7', name: 'Hon. Corazon H. Beltran', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'ba-8', name: 'Hon. Victor S. De Leon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'ba-9', name: 'Hon. Imelda B. Aguilar', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'ba-10', name: 'Hon. Guillermo K. Mercado', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'ba-11', name: 'Hon. Samantha R. Javier', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'borbon',
    name: 'Borbon',
    classification: 'Rural',
    postalCode: '8500',
    population: 3110,
    censusYear: '2025 Official Census',
    elevationASL: '55m ASL',
    elevationMeters: 55,
    coordinates: { lat: 8.4722, lng: 125.9811, display: '8.4722° N, 125.9811° E' },
    landAreaSqKm: 13.8,
    hallAddress: 'Purok 3, Brgy. Borbon',
    contactPhone: '+63 (085) 839-1004',
    contactEmail: 'brgy.borbon@sfads.gov.ph',
    description: 'Dynamic rural barangay focused on sustainable palm oil and cassava farming.',
    officials: [
      { id: 'bo-1', name: 'Hon. Felipe S. Magno', title: 'Punong Barangay', role: 'captain' },
      { id: 'bo-2', name: 'Clarissa E. Laurel', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'bo-3', name: 'Oscar P. Dimaculangan', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'bo-4', name: 'Hon. Rolando M. Santos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'bo-5', name: 'Hon. Perla V. Enriquez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'bo-6', name: 'Hon. Mario C. Gutierrez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'bo-7', name: 'Hon. Susan T. Padilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'bo-8', name: 'Hon. Gregorio A. Ramos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'bo-9', name: 'Hon. Nora R. Morales', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'bo-10', name: 'Hon. Hector B. Carpio', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'bo-11', name: 'Hon. Christian L. Dionisio', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'buenasuerte',
    name: 'Buenasuerte',
    classification: 'Rural',
    postalCode: '8500',
    population: 2640,
    censusYear: '2025 Official Census',
    elevationASL: '95m ASL',
    elevationMeters: 95,
    coordinates: { lat: 8.4410, lng: 125.9925, display: '8.4410° N, 125.9925° E' },
    landAreaSqKm: 15.4,
    hallAddress: 'Main Street, Brgy. Buenasuerte',
    contactPhone: '+63 (085) 839-1005',
    contactEmail: 'brgy.buenasuerte@sfads.gov.ph',
    description: 'Peaceful inland community rich in natural spring resources and organic vegetable farming.',
    officials: [
      { id: 'bs-1', name: 'Hon. Dominador C. Reyes', title: 'Punong Barangay', role: 'captain' },
      { id: 'bs-2', name: 'Glenda R. Macaraeg', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'bs-3', name: 'Ignacio T. Soriano', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'bs-4', name: 'Hon. Alberto M. Tolentino', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'bs-5', name: 'Hon. Rosalinda N. Fabregas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'bs-6', name: 'Hon. Jaime B. Legaspi', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'bs-7', name: 'Hon. Evelyn K. Cortez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'bs-8', name: 'Hon. Nestor P. Samson', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'bs-9', name: 'Hon. Divina G. Villanueva', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'bs-10', name: 'Hon. Armando R. Dizon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'bs-11', name: 'Hon. Erika Mae B. Santos', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'caimpugan',
    name: 'Caimpugan',
    classification: 'Rural',
    postalCode: '8500',
    population: 3820,
    censusYear: '2025 Official Census',
    elevationASL: '22m ASL',
    elevationMeters: 22,
    coordinates: { lat: 8.4230, lng: 125.9340, display: '8.4230° N, 125.9340° E' },
    landAreaSqKm: 22.1,
    hallAddress: 'Purok 4, Brgy. Caimpugan',
    contactPhone: '+63 (085) 839-1006',
    contactEmail: 'brgy.caimpugan@sfads.gov.ph',
    description: 'Home to ecological peatland marshlands and vital freshwater conservation zones.',
    officials: [
      { id: 'ca-1', name: 'Hon. Pastor T. Agoncillo', title: 'Punong Barangay', role: 'captain' },
      { id: 'ca-2', name: 'Veronica S. Pineda', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'ca-3', name: 'Leopoldo M. Castaneda', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'ca-4', name: 'Hon. Edgardo R. Tuazon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'ca-5', name: 'Hon. Lilia P. Alcantara', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'ca-6', name: 'Hon. Cesar V. Mangubat', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Environment' },
      { id: 'ca-7', name: 'Hon. Jocelyn R. Nieves', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'ca-8', name: 'Hon. Felixberto G. Solis', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'ca-9', name: 'Hon. Virginia H. Malabanan', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'ca-10', name: 'Hon. Rodolfo M. David', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'ca-11', name: 'Hon. Nathaniel C. Zulueta', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'das-agan',
    name: 'Das-agan',
    classification: 'Rural',
    postalCode: '8500',
    population: 3280,
    censusYear: '2025 Official Census',
    elevationASL: '42m ASL',
    elevationMeters: 42,
    coordinates: { lat: 8.4560, lng: 125.9120, display: '8.4560° N, 125.9120° E' },
    landAreaSqKm: 12.9,
    hallAddress: 'Purok 1, Brgy. Das-agan',
    contactPhone: '+63 (085) 839-1007',
    contactEmail: 'brgy.dasagan@sfads.gov.ph',
    description: 'Active agricultural hub specializing in rice milling and yellow corn production.',
    officials: [
      { id: 'da-1', name: 'Hon. Tomas E. Quimpo', title: 'Punong Barangay', role: 'captain' },
      { id: 'da-2', name: 'Beatriz L. Galang', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'da-3', name: 'Salvador R. Manalo', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'da-4', name: 'Hon. Crisanto B. Ventura', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'da-5', name: 'Hon. Carmelita M. Regalado', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'da-6', name: 'Hon. Dionisio P. Serrano', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'da-7', name: 'Hon. Rowena G. Salcedo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'da-8', name: 'Hon. Artemio V. Corpuz', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'da-9', name: 'Hon. Myrna T. Sevilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'da-10', name: 'Hon. Gilberto K. Abad', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'da-11', name: 'Hon. Althea Marie S. Cruz', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'ebro',
    name: 'Ebro',
    classification: 'Rural',
    postalCode: '8500',
    population: 4120,
    censusYear: '2025 Official Census',
    elevationASL: '38m ASL',
    elevationMeters: 38,
    coordinates: { lat: 8.5180, lng: 125.9380, display: '8.5180° N, 125.9380° E' },
    landAreaSqKm: 16.3,
    hallAddress: 'Purok 5, Brgy. Ebro',
    contactPhone: '+63 (085) 839-1008',
    contactEmail: 'brgy.ebro@sfads.gov.ph',
    description: 'Strategic junction barangay connecting trade routes to neighbor municipalities.',
    officials: [
      { id: 'eb-1', name: 'Hon. Vicente A. Balagtas', title: 'Punong Barangay', role: 'captain' },
      { id: 'eb-2', name: 'Teresita H. Cordero', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'eb-3', name: 'Reynaldo M. Punzalan', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'eb-4', name: 'Hon. Guillermo P. San Jose', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'eb-5', name: 'Hon. Imelda C. Santiago', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'eb-6', name: 'Hon. Benjamin R. Macapagal', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'eb-7', name: 'Hon. Consuelo V. Sison', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'eb-8', name: 'Hon. Danilo M. Villa', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'eb-9', name: 'Hon. Esperanza L. Roxas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'eb-10', name: 'Hon. Emilio K. De Guzman', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'eb-11', name: 'Hon. Gabriel R. Santos', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'hubang',
    name: 'Hubang',
    classification: 'Urban',
    postalCode: '8500',
    population: 7850,
    censusYear: '2025 Official Census',
    elevationASL: '35m ASL',
    elevationMeters: 35,
    coordinates: { lat: 8.5020, lng: 125.9610, display: '8.5020° N, 125.9610° E' },
    landAreaSqKm: 9.8,
    hallAddress: 'Hubang Highway Crossing, Brgy. Hubang',
    contactPhone: '+63 (085) 839-1009',
    contactEmail: 'brgy.hubang@sfads.gov.ph',
    description: 'Rapidly urbanizing commercial zone adjacent to the municipal center.',
    officials: [
      { id: 'hu-1', name: 'Hon. Gregorio M. Laurel', title: 'Punong Barangay', role: 'captain' },
      { id: 'hu-2', name: 'Aida P. Crisostomo', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'hu-3', name: 'Ephraim S. De La Rosa', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'hu-4', name: 'Hon. Rodante B. Guinto', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'hu-5', name: 'Hon. Fe M. Laurel', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'hu-6', name: 'Hon. Jaime V. Evangelista', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Trade & Commerce' },
      { id: 'hu-7', name: 'Hon. Josefina R. Miranda', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'hu-8', name: 'Hon. Cornelio A. Castro', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'hu-9', name: 'Hon. Belinda T. Gomez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'hu-10', name: 'Hon. Alberto H. Sioson', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'hu-11', name: 'Hon. Kevin Paul M. Laurel', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'karaus',
    name: 'Karaus',
    classification: 'Rural',
    postalCode: '8500',
    population: 2890,
    censusYear: '2025 Official Census',
    elevationASL: '72m ASL',
    elevationMeters: 72,
    coordinates: { lat: 8.5290, lng: 125.9750, display: '8.5290° N, 125.9750° E' },
    landAreaSqKm: 14.1,
    hallAddress: 'Purok 2, Brgy. Karaus',
    contactPhone: '+63 (085) 839-1010',
    contactEmail: 'brgy.karaus@sfads.gov.ph',
    description: 'Community dedicated to Cavendish banana plantations and local handicraft processing.',
    officials: [
      { id: 'ka-1', name: 'Hon. Orlando T. Borja', title: 'Punong Barangay', role: 'captain' },
      { id: 'ka-2', name: 'Leticia G. Macabenta', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'ka-3', name: 'Silvestre B. Tolentino', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'ka-4', name: 'Hon. Rafael C. Aquino', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'ka-5', name: 'Hon. Rosanna M. Legaspi', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'ka-6', name: 'Hon. Teodoro S. Rivera', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'ka-7', name: 'Hon. Milagros V. Palma', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'ka-8', name: 'Hon. Eduardo P. Ramos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'ka-9', name: 'Hon. Norma L. Dizon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'ka-10', name: 'Hon. Hilario A. Diaz', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'ka-11', name: 'Hon. Janice M. Borja', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'ladgadan',
    name: 'Ladgadan',
    classification: 'Rural',
    postalCode: '8500',
    population: 3150,
    censusYear: '2025 Official Census',
    elevationASL: '110m ASL',
    elevationMeters: 110,
    coordinates: { lat: 8.5440, lng: 125.9610, display: '8.5440° N, 125.9610° E' },
    landAreaSqKm: 15.0,
    hallAddress: 'Purok 1, Brgy. Ladgadan',
    contactPhone: '+63 (085) 839-1011',
    contactEmail: 'brgy.ladgadan@sfads.gov.ph',
    description: 'Serene upland barangay known for rubber tapping and native fruit orchards.',
    officials: [
      { id: 'la-1', name: 'Hon. Nicanor R. Espina', title: 'Punong Barangay', role: 'captain' },
      { id: 'la-2', name: 'Ester M. Samson', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'la-3', name: 'Dante V. Castaneda', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'la-4', name: 'Hon. Mario T. Alcantara', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'la-5', name: 'Hon. Zenaida P. Bernardo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'la-6', name: 'Hon. Severino C. Fabregas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'la-7', name: 'Hon. Aurora G. Mangubat', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'la-8', name: 'Hon. Wilfredo H. Solis', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'la-9', name: 'Hon. Patricia B. Sevilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'la-10', name: 'Hon. Rufino K. Abad', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'la-11', name: 'Hon. Justin E. Espina', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'lapinigan',
    name: 'Lapinigan',
    classification: 'Rural',
    postalCode: '8500',
    population: 4320,
    censusYear: '2025 Official Census',
    elevationASL: '52m ASL',
    elevationMeters: 52,
    coordinates: { lat: 8.4680, lng: 125.9450, display: '8.4680° N, 125.9450° E' },
    landAreaSqKm: 17.5,
    hallAddress: 'Lapinigan Main Road, Brgy. Lapinigan',
    contactPhone: '+63 (085) 839-1012',
    contactEmail: 'brgy.lapinigan@sfads.gov.ph',
    description: 'Extensive agricultural community with active farmer cooperatives and grains post-harvest processing.',
    officials: [
      { id: 'lp-1', name: 'Hon. Benjamin H. Guanzon', title: 'Punong Barangay', role: 'captain' },
      { id: 'lp-2', name: 'Julieta S. Ocampo', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'lp-3', name: 'Marciano P. Quintero', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'lp-4', name: 'Hon. Federico R. Tuazon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'lp-5', name: 'Hon. Rosario M. Alcantara', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'lp-6', name: 'Hon. Teodoro C. Mangubat', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'lp-7', name: 'Hon. Cristina V. Nieves', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'lp-8', name: 'Hon. Jose H. Solis', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'lp-9', name: 'Hon. Yolanda B. Malabanan', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'lp-10', name: 'Hon. Crispin K. David', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'lp-11', name: 'Hon. Tristan G. Guanzon', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'lucac',
    name: 'Lucac',
    classification: 'Rural',
    postalCode: '8500',
    population: 2780,
    censusYear: '2025 Official Census',
    elevationASL: '88m ASL',
    elevationMeters: 88,
    coordinates: { lat: 8.4350, lng: 125.9670, display: '8.4350° N, 125.9670° E' },
    landAreaSqKm: 13.4,
    hallAddress: 'Purok 3, Brgy. Lucac',
    contactPhone: '+63 (085) 839-1013',
    contactEmail: 'brgy.lucac@sfads.gov.ph',
    description: 'Quiet countryside barangay celebrating rich indigenous cultural heritage.',
    officials: [
      { id: 'lc-1', name: 'Hon. Quirino S. Tanchoco', title: 'Punong Barangay', role: 'captain' },
      { id: 'lc-2', name: 'Gilda R. Galvez', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'lc-3', name: 'Bernardo T. Magpayo', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'lc-4', name: 'Hon. Honorio M. Santos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'lc-5', name: 'Hon. Leonora V. Enriquez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'lc-6', name: 'Hon. Agapito C. Gutierrez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'lc-7', name: 'Hon. Rebecca T. Padilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'lc-8', name: 'Hon. Saturnino A. Ramos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'lc-9', name: 'Hon. Socorro R. Morales', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'lc-10', name: 'Hon. Valeriano B. Carpio', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'lc-11', name: 'Hon. Desiree L. Tanchoco', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'mate',
    name: 'Mate',
    classification: 'Rural',
    postalCode: '8500',
    population: 3650,
    censusYear: '2025 Official Census',
    elevationASL: '105m ASL',
    elevationMeters: 105,
    coordinates: { lat: 8.4110, lng: 125.9520, display: '8.4110° N, 125.9520° E' },
    landAreaSqKm: 16.8,
    hallAddress: 'Purok 2, Brgy. Mate',
    contactPhone: '+63 (085) 839-1014',
    contactEmail: 'brgy.mate@sfads.gov.ph',
    description: 'Lush agricultural district dedicated to high-grade cacao production and livestock raising.',
    officials: [
      { id: 'mt-1', name: 'Hon. Prudencio M. Yambao', title: 'Punong Barangay', role: 'captain' },
      { id: 'mt-2', name: 'Ofelia P. Zambrano', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'mt-3', name: 'Crisostomo D. Zabala', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'mt-4', name: 'Hon. Basilio B. Ventura', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'mt-5', name: 'Hon. Amalia M. Regalado', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'mt-6', name: 'Hon. Epifanio P. Serrano', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'mt-7', name: 'Hon. Dolores G. Salcedo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'mt-8', name: 'Hon. Moises V. Corpuz', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'mt-9', name: 'Hon. Paz T. Sevilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'mt-10', name: 'Hon. Zacarias K. Abad', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'mt-11', name: 'Hon. Chloe Marie Y. Yambao', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'new-visayas',
    name: 'New Visayas',
    classification: 'Rural',
    postalCode: '8500',
    population: 3940,
    censusYear: '2025 Official Census',
    elevationASL: '125m ASL',
    elevationMeters: 125,
    coordinates: { lat: 8.5520, lng: 125.9310, display: '8.5520° N, 125.9310° E' },
    landAreaSqKm: 19.2,
    hallAddress: 'Purok 1, Brgy. New Visayas',
    contactPhone: '+63 (085) 839-1015',
    contactEmail: 'brgy.newvisayas@sfads.gov.ph',
    description: 'Vibrant settlement community known for cooperative multi-crop farming and high altitude views.',
    officials: [
      { id: 'nv-1', name: 'Hon. Esteban C. Villa', title: 'Punong Barangay', role: 'captain' },
      { id: 'nv-2', name: 'Herminia B. Macaraeg', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'nv-3', name: 'Nicanor T. Soriano', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'nv-4', name: 'Hon. Conrado M. Tolentino', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'nv-5', name: 'Hon. Felisa N. Fabregas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'nv-6', name: 'Hon. Gonzalo B. Legaspi', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'nv-7', name: 'Hon. Isabel K. Cortez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'nv-8', name: 'Hon. Lorenzo P. Samson', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'nv-9', name: 'Hon. Mercedes G. Villanueva', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'nv-10', name: 'Hon. Pedro R. Dizon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'nv-11', name: 'Hon. Kyle V. Villa', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'ormaca',
    name: 'Ormaca',
    classification: 'Rural',
    postalCode: '8500',
    population: 2340,
    censusYear: '2025 Official Census',
    elevationASL: '140m ASL',
    elevationMeters: 140,
    coordinates: { lat: 8.5630, lng: 125.9420, display: '8.5630° N, 125.9420° E' },
    landAreaSqKm: 11.2,
    hallAddress: 'Purok 2, Brgy. Ormaca',
    contactPhone: '+63 (085) 839-1016',
    contactEmail: 'brgy.ormaca@sfads.gov.ph',
    description: 'Scenic peripheral upland barangay surrounded by pristine natural forest foliage.',
    officials: [
      { id: 'or-1', name: 'Hon. Maximo T. Agoncillo', title: 'Punong Barangay', role: 'captain' },
      { id: 'or-2', name: 'Salome S. Pineda', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'or-3', name: 'Teofilo M. Castaneda', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'or-4', name: 'Hon. Urbano R. Tuazon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'or-5', name: 'Hon. Victoria P. Alcantara', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'or-6', name: 'Hon. Wenceslao V. Mangubat', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Environment' },
      { id: 'or-7', name: 'Hon. Xenon R. Nieves', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'or-8', name: 'Hon. Yul G. Solis', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'or-9', name: 'Hon. Zenaida H. Malabanan', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'or-10', name: 'Hon. Amado M. David', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'or-11', name: 'Hon. Liam C. Agoncillo', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'pasta',
    name: 'Pasta',
    classification: 'Rural',
    postalCode: '8500',
    population: 3180,
    censusYear: '2025 Official Census',
    elevationASL: '78m ASL',
    elevationMeters: 78,
    coordinates: { lat: 8.4980, lng: 125.9890, display: '8.4980° N, 125.9890° E' },
    landAreaSqKm: 14.7,
    hallAddress: 'Purok 3, Brgy. Pasta',
    contactPhone: '+63 (085) 839-1017',
    contactEmail: 'brgy.pasta@sfads.gov.ph',
    description: 'Hillside barangay featuring rambutan and durian fruit orchards alongside freshwater fishponds.',
    officials: [
      { id: 'ps-1', name: 'Hon. Bartolome E. Quimpo', title: 'Punong Barangay', role: 'captain' },
      { id: 'ps-2', name: 'Concepcion L. Galang', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'ps-3', name: 'Domingo R. Manalo', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'ps-4', name: 'Hon. Eleuterio B. Ventura', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'ps-5', name: 'Hon. Francisca M. Regalado', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'ps-6', name: 'Hon. Godofredo P. Serrano', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'ps-7', name: 'Hon. Herminia G. Salcedo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'ps-8', name: 'Hon. Ismael V. Corpuz', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'ps-9', name: 'Hon. Juana T. Sevilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'ps-10', name: 'Hon. Leandro K. Abad', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'ps-11', name: 'Hon. Sophia N. Quimpo', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'pisa-an',
    name: 'Pisa-an',
    classification: 'Rural',
    postalCode: '8500',
    population: 3560,
    censusYear: '2025 Official Census',
    elevationASL: '62m ASL',
    elevationMeters: 62,
    coordinates: { lat: 8.4810, lng: 125.9140, display: '8.4810° N, 125.9140° E' },
    landAreaSqKm: 15.8,
    hallAddress: 'Purok 1, Brgy. Pisa-an',
    contactPhone: '+63 (085) 839-1018',
    contactEmail: 'brgy.pisaan@sfads.gov.ph',
    description: 'Riverfront community noted for artisanal bamboo crafting and inland tilapia aquaculture.',
    officials: [
      { id: 'pa-1', name: 'Hon. Mariano A. Balagtas', title: 'Punong Barangay', role: 'captain' },
      { id: 'pa-2', name: 'Natividad H. Cordero', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'pa-3', name: 'Pascual M. Punzalan', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'pa-4', name: 'Hon. Quintin P. San Jose', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'pa-5', name: 'Hon. Remedios C. Santiago', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'pa-6', name: 'Hon. Severo R. Macapagal', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'pa-7', name: 'Hon. Trinidad V. Sison', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'pa-8', name: 'Hon. Ulpiano M. Villa', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'pa-9', name: 'Hon. Vicenta L. Roxas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'pa-10', name: 'Hon. Wilfredo K. De Guzman', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'pa-11', name: 'Hon. Ethan J. Balagtas', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'rizal',
    name: 'Rizal',
    classification: 'Urban',
    postalCode: '8500',
    population: 6240,
    censusYear: '2025 Official Census',
    elevationASL: '32m ASL',
    elevationMeters: 32,
    coordinates: { lat: 8.5080, lng: 125.9650, display: '8.5080° N, 125.9650° E' },
    landAreaSqKm: 8.4,
    hallAddress: 'Rizal St. Cor. National Highway, Brgy. Rizal',
    contactPhone: '+63 (085) 839-1019',
    contactEmail: 'brgy.rizal@sfads.gov.ph',
    description: 'Central urban sub-district housing primary schools, public gymnasiums, and civic centers.',
    officials: [
      { id: 'rz-1', name: 'Hon. Alfonso M. Laurel', title: 'Punong Barangay', role: 'captain' },
      { id: 'rz-2', name: 'Beatriz P. Crisostomo', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'rz-3', name: 'Cornelio S. De La Rosa', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'rz-4', name: 'Hon. Dionisio B. Guinto', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'rz-5', name: 'Hon. Elena M. Laurel', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'rz-6', name: 'Hon. Fabian V. Evangelista', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Commerce' },
      { id: 'rz-7', name: 'Hon. Generosa R. Miranda', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'rz-8', name: 'Hon. Hermogenes A. Castro', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'rz-9', name: 'Hon. Ines T. Gomez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'rz-10', name: 'Hon. Julian H. Sioson', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'rz-11', name: 'Hon. Hannah Grace M. Laurel', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'san-isidro',
    name: 'San Isidro',
    classification: 'Rural',
    postalCode: '8500',
    population: 4150,
    censusYear: '2025 Official Census',
    elevationASL: '58m ASL',
    elevationMeters: 58,
    coordinates: { lat: 8.5380, lng: 125.9810, display: '8.5380° N, 125.9810° E' },
    landAreaSqKm: 17.1,
    hallAddress: 'Purok 2, Brgy. San Isidro',
    contactPhone: '+63 (085) 839-1020',
    contactEmail: 'brgy.sanisidro@sfads.gov.ph',
    description: 'Agricultural heartland celebrating annual bountiful harvest festivals and patron traditions.',
    officials: [
      { id: 'si-1', name: 'Hon. Lazaro T. Borja', title: 'Punong Barangay', role: 'captain' },
      { id: 'si-2', name: 'Margarita G. Macabenta', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'si-3', name: 'Nicomedes B. Tolentino', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'si-4', name: 'Hon. Octavio C. Aquino', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'si-5', name: 'Hon. Priscila M. Legaspi', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'si-6', name: 'Hon. Quintin S. Rivera', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'si-7', name: 'Hon. Regina V. Palma', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'si-8', name: 'Hon. Silvino P. Ramos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'si-9', name: 'Hon. Tomasa L. Dizon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'si-10', name: 'Hon. Urban A. Diaz', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'si-11', name: 'Hon. Oliver P. Borja', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'santa-ana',
    name: 'Santa Ana',
    classification: 'Rural',
    postalCode: '8500',
    population: 3670,
    censusYear: '2025 Official Census',
    elevationASL: '85m ASL',
    elevationMeters: 85,
    coordinates: { lat: 8.4290, lng: 125.9890, display: '8.4290° N, 125.9890° E' },
    landAreaSqKm: 14.9,
    hallAddress: 'Purok 4, Brgy. Santa Ana',
    contactPhone: '+63 (085) 839-1021',
    contactEmail: 'brgy.santaana@sfads.gov.ph',
    description: 'Picturesque valley barangay with active women health councils and handicraft livelihood groups.',
    officials: [
      { id: 'sa-1', name: 'Hon. Vicente R. Espina', title: 'Punong Barangay', role: 'captain' },
      { id: 'sa-2', name: 'Wenceslaa M. Samson', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'sa-3', name: 'Xavier V. Castaneda', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'sa-4', name: 'Hon. Ysmael T. Alcantara', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'sa-5', name: 'Hon. Zenaida P. Bernardo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'sa-6', name: 'Hon. Abelardo C. Fabregas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Agriculture' },
      { id: 'sa-7', name: 'Hon. Bonifacia G. Mangubat', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'sa-8', name: 'Hon. Ciriaco H. Solis', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'sa-9', name: 'Hon. Dorotea B. Sevilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'sa-10', name: 'Hon. Estanislao K. Abad', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'sa-11', name: 'Hon. Chloe S. Espina', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'tagapua',
    name: 'Tagapua',
    classification: 'Rural',
    postalCode: '8500',
    population: 2980,
    censusYear: '2025 Official Census',
    elevationASL: '185m ASL',
    elevationMeters: 185,
    coordinates: { lat: 8.4020, lng: 125.9650, display: '8.4020° N, 125.9650° E' },
    landAreaSqKm: 18.1,
    hallAddress: 'Purok 1, Brgy. Tagapua',
    contactPhone: '+63 (085) 839-1022',
    contactEmail: 'brgy.tagapua@sfads.gov.ph',
    description: 'Mountain-side barangay dedicated to forest conservation, cool climate agriculture, and native flora.',
    officials: [
      { id: 'tg-1', name: 'Hon. Fortunato H. Guanzon', title: 'Punong Barangay', role: 'captain' },
      { id: 'tg-2', name: 'Gaudencia S. Ocampo', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'tg-3', name: 'Honorio P. Quintero', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'tg-4', name: 'Hon. Inocencio R. Tuazon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'tg-5', name: 'Hon. Josefa M. Alcantara', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'tg-6', name: 'Hon. Lucas C. Mangubat', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Environment' },
      { id: 'tg-7', name: 'Hon. Marta V. Nieves', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'tg-8', name: 'Hon. Nicanor H. Solis', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'tg-9', name: 'Hon. Paula B. Malabanan', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'tg-10', name: 'Hon. Quintin K. David', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'tg-11', name: 'Hon. Noah R. Guanzon', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'poblacion-1',
    name: 'Barangay 1 (Poblacion)',
    classification: 'Poblacion',
    postalCode: '8500',
    population: 8940,
    censusYear: '2025 Official Census',
    elevationASL: '28m ASL',
    elevationMeters: 28,
    coordinates: { lat: 8.5050, lng: 125.9680, display: '8.5050° N, 125.9680° E' },
    landAreaSqKm: 3.2,
    hallAddress: 'Gov. Plaza St., Barangay 1 (Poblacion)',
    contactPhone: '+63 (085) 839-1023',
    contactEmail: 'brgy1.poblacion@sfads.gov.ph',
    description: 'Municipal core center featuring the LGU Town Hall, public plaza, municipal museum, and historical landmarks.',
    officials: [
      { id: 'p1-1', name: 'Hon. Reynaldo G. Dela Cruz', title: 'Punong Barangay', role: 'captain' },
      { id: 'p1-2', name: 'Carmela S. Mendoza', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'p1-3', name: 'Gerardo M. Santos', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'p1-4', name: 'Hon. Antonio V. Reyes', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'p1-5', name: 'Hon. Beatriz L. Cruz', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance & Budget' },
      { id: 'p1-6', name: 'Hon. Cesar R. Ramos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Commercial Affairs' },
      { id: 'p1-7', name: 'Hon. Diana P. Torralba', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health & Sanitation' },
      { id: 'p1-8', name: 'Hon. Eduardo K. Gomez', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure & Urban Planning' },
      { id: 'p1-9', name: 'Hon. Flordeliza N. Santos', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education & Culture' },
      { id: 'p1-10', name: 'Hon. Gabriel T. Morales', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Ordinances & Legal' },
      { id: 'p1-11', name: 'Hon. Angela Marie D. Dela Cruz', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'poblacion-2',
    name: 'Barangay 2 (Poblacion)',
    classification: 'Poblacion',
    postalCode: '8500',
    population: 7420,
    censusYear: '2025 Official Census',
    elevationASL: '26m ASL',
    elevationMeters: 26,
    coordinates: { lat: 8.5025, lng: 125.9710, display: '8.5025° N, 125.9710° E' },
    landAreaSqKm: 2.8,
    hallAddress: 'Market Site St., Barangay 2 (Poblacion)',
    contactPhone: '+63 (085) 839-1024',
    contactEmail: 'brgy2.poblacion@sfads.gov.ph',
    description: 'Commercial heartland housing the Municipal Public Market, bus terminals, and financial banks.',
    officials: [
      { id: 'p2-1', name: 'Hon. Ferdinand C. Villanueva', title: 'Punong Barangay', role: 'captain' },
      { id: 'p2-2', name: 'Elena R. Soriano', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'p2-3', name: 'Wilfredo T. Macapagal', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'p2-4', name: 'Hon. Alejandro M. Padilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'p2-5', name: 'Hon. Brenda N. Sison', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'p2-6', name: 'Hon. Crispin V. Roxas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Market & Sanitation' },
      { id: 'p2-7', name: 'Hon. Digna P. De Guzman', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'p2-8', name: 'Hon. Enrique K. Balagtas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'p2-9', name: 'Hon. Fatima L. Cordero', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'p2-10', name: 'Hon. Gonzalo R. Punzalan', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'p2-11', name: 'Hon. Mark Anthony C. Villanueva', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'poblacion-3',
    name: 'Barangay 3 (Poblacion)',
    classification: 'Poblacion',
    postalCode: '8500',
    population: 6810,
    censusYear: '2025 Official Census',
    elevationASL: '30m ASL',
    elevationMeters: 30,
    coordinates: { lat: 8.4985, lng: 125.9660, display: '8.4985° N, 125.9660° E' },
    landAreaSqKm: 3.5,
    hallAddress: 'San Jose St., Barangay 3 (Poblacion)',
    contactPhone: '+63 (085) 839-1025',
    contactEmail: 'brgy3.poblacion@sfads.gov.ph',
    description: 'Residential and institutional district containing key healthcare centers, rural bank branches, and parish church.',
    officials: [
      { id: 'p3-1', name: 'Hon. Danilo R. Alcantara', title: 'Punong Barangay', role: 'captain' },
      { id: 'p3-2', name: 'Grace M. Mangubat', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'p3-3', name: 'Hernando V. Nieves', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'p3-4', name: 'Hon. Isagani P. Solis', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'p3-5', name: 'Hon. Josefina B. Malabanan', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'p3-6', name: 'Hon. Leandro K. David', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Social Services' },
      { id: 'p3-7', name: 'Hon. Minerva M. Agoncillo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'p3-8', name: 'Hon. Nicanor S. Pineda', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'p3-9', name: 'Hon. Ophelia R. Castaneda', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'p3-10', name: 'Hon. Pedro T. Tuazon', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'p3-11', name: 'Hon. Samantha Nicole R. Alcantara', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'poblacion-4',
    name: 'Barangay 4 (Poblacion)',
    classification: 'Poblacion',
    postalCode: '8500',
    population: 5930,
    censusYear: '2025 Official Census',
    elevationASL: '29m ASL',
    elevationMeters: 29,
    coordinates: { lat: 8.5090, lng: 125.9620, display: '8.5090° N, 125.9620° E' },
    landAreaSqKm: 2.9,
    hallAddress: 'Magsaysay Ave., Barangay 4 (Poblacion)',
    contactPhone: '+63 (085) 839-1026',
    contactEmail: 'brgy4.poblacion@sfads.gov.ph',
    description: 'Thriving mix of commercial establishments and secondary education academies.',
    officials: [
      { id: 'p4-1', name: 'Hon. Roberto T. Galang', title: 'Punong Barangay', role: 'captain' },
      { id: 'p4-2', name: 'Sonia L. Manalo', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'p4-3', name: 'Telesforo R. Ventura', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'p4-4', name: 'Hon. Ulpiano B. Regalado', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'p4-5', name: 'Hon. Virginia M. Serrano', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'p4-6', name: 'Hon. Wilfredo P. Salcedo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Commerce & Industry' },
      { id: 'p4-7', name: 'Hon. Xenon G. Corpuz', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'p4-8', name: 'Hon. Yolanda V. Sevilla', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'p4-9', name: 'Hon. Zacarias T. Abad', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'p4-10', name: 'Hon. Amado K. Quimpo', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'p4-11', name: 'Hon. Dominic R. Galang', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  },
  {
    id: 'poblacion-5',
    name: 'Barangay 5 (Poblacion)',
    classification: 'Poblacion',
    postalCode: '8500',
    population: 6410,
    censusYear: '2025 Official Census',
    elevationASL: '31m ASL',
    elevationMeters: 31,
    coordinates: { lat: 8.5060, lng: 125.9740, display: '8.5060° N, 125.9740° E' },
    landAreaSqKm: 3.1,
    hallAddress: 'Rizal Extension, Barangay 5 (Poblacion)',
    contactPhone: '+63 (085) 839-1027',
    contactEmail: 'brgy5.poblacion@sfads.gov.ph',
    description: 'Vibrant urban center featuring modern sports complexes, convention centers, and civic auditoriums.',
    officials: [
      { id: 'p5-1', name: 'Hon. Eduardo M. San Jose', title: 'Punong Barangay', role: 'captain' },
      { id: 'p5-2', name: 'Felisa C. Santiago', title: 'Barangay Secretary', role: 'secretary' },
      { id: 'p5-3', name: 'Gregorio R. Macapagal', title: 'Barangay Treasurer', role: 'treasurer' },
      { id: 'p5-4', name: 'Hon. Hernan V. Sison', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Peace & Order' },
      { id: 'p5-5', name: 'Hon. Inocencia M. Villa', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Finance' },
      { id: 'p5-6', name: 'Hon. Jose L. Roxas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Youth & Sports' },
      { id: 'p5-7', name: 'Hon. Katarina K. De Guzman', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Health' },
      { id: 'p5-8', name: 'Hon. Leon R. Balagtas', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Infrastructure' },
      { id: 'p5-9', name: 'Hon. Maxima H. Cordero', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Education' },
      { id: 'p5-10', name: 'Hon. Nemesio M. Punzalan', title: 'Barangay Kagawad', role: 'kagawad', committee: 'Rules' },
      { id: 'p5-11', name: 'Hon. Beatrice S. San Jose', title: 'SK Chairperson', role: 'sk_chairperson' }
    ]
  }
]

export const useBarangayDirectory = () => {
  // Use Nuxt useState to guarantee single-source of truth shared state across components
  const searchQuery = useState<string>('brgy-dir-search-query', () => '')
  const selectedClassification = useState<'All' | 'Poblacion' | 'Urban' | 'Rural'>('brgy-dir-classification', () => 'All')
  const selectedBarangayId = useState<string>('brgy-dir-selected-id', () => 'poblacion-1')
  const isLoading = useState<boolean>('brgy-dir-is-loading', () => false)
  const isDynamicSource = useState<boolean>('brgy-dir-is-dynamic', () => false)
  const barangays = useState<BarangayItem[]>('brgy-dir-barangays-list', () => BARANGAY_LIST_DATA)

  const selectedBarangay = computed(() => {
    return barangays.value.find(b => b.id === selectedBarangayId.value) || barangays.value[0]
  })

  const filteredBarangays = computed(() => {
    return barangays.value.filter(b => {
      const matchesSearch = searchQuery.value.trim() === '' || 
        b.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        b.postalCode.includes(searchQuery.value) ||
        b.officials.some(o => o.name.toLowerCase().includes(searchQuery.value.toLowerCase()))

      const matchesClass = selectedClassification.value === 'All' || 
        b.classification === selectedClassification.value

      return matchesSearch && matchesClass
    })
  })

  const totalPopulation = computed(() => {
    return barangays.value.reduce((acc, curr) => acc + curr.population, 0)
  })

  const selectBarangay = (id: string) => {
    selectedBarangayId.value = id
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setClassification = (classification: 'All' | 'Poblacion' | 'Urban' | 'Rural') => {
    selectedClassification.value = classification
  }

  // Dynamic Loader Hook: Replaces or extends local state when live backend API or CMS is available
  const setDynamicBarangays = (data: BarangayItem[]) => {
    if (data && Array.isArray(data) && data.length > 0) {
      barangays.value = data
      isDynamicSource.value = true
    }
  }

  const fetchBarangayByIdFromApi = async (id: string, apiEndpoint?: string): Promise<BarangayItem | undefined> => {
    isLoading.value = true
    try {
      if (apiEndpoint) {
        // Real API call when ready:
        // const response = await $fetch<BarangayItem>(`${apiEndpoint}/${id}`)
        // return response
      }
      return barangays.value.find(b => b.id === id)
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchQuery,
    selectedClassification,
    selectedBarangayId,
    isLoading,
    isDynamicSource,
    barangays,
    selectedBarangay,
    filteredBarangays,
    totalPopulation,
    selectBarangay,
    setSearchQuery,
    setClassification,
    setDynamicBarangays,
    fetchBarangayByIdFromApi
  }
}
