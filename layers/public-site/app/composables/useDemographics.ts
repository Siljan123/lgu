export interface CensusRecord {
  year: number
  population: number
  growthRate: string
  absoluteChange: number
  households?: number
}

export interface MunicipalFactSection {
  title: string
  items: {
    label: string
    value: string
    highlight?: boolean
    link?: string
  }[]
}

export const useDemographics = () => {
  const censusData = ref<CensusRecord[]>([
    { year: 1960, population: 11324, growthRate: '—', absoluteChange: 0 },
    { year: 1970, population: 22668, growthRate: '+7.18%', absoluteChange: 11344 },
    { year: 1975, population: 26505, growthRate: '+3.18%', absoluteChange: 3837 },
    { year: 1980, population: 38795, growthRate: '+7.92%', absoluteChange: 12290 },
    { year: 1990, population: 49215, growthRate: '+2.41%', absoluteChange: 10420 },
    { year: 1995, population: 55981, growthRate: '+2.61%', absoluteChange: 6766 },
    { year: 2000, population: 62409, growthRate: '+2.20%', absoluteChange: 6428 },
    { year: 2007, population: 63148, growthRate: '+0.16%', absoluteChange: 739 },
    { year: 2010, population: 70986, growthRate: '+3.82%', absoluteChange: 7838 },
    { year: 2015, population: 74549, growthRate: '+0.96%', absoluteChange: 3563 },
    { year: 2020, population: 80760, growthRate: '+1.61%', absoluteChange: 6211, households: 16902 }
  ])

  const municipalFacts = ref<MunicipalFactSection[]>([
    {
      title: 'Administrative & Location',
      items: [
        { label: 'Coordinates', value: '8°31′N 125°59′E' },
        { label: 'Country', value: 'Philippines' },
        { label: 'Region', value: 'Caraga (Region XIII)' },
        { label: 'Province', value: 'Agusan del Sur' },
        { label: 'Congressional District', value: '2nd District' },
        { label: 'Date Founded', value: 'June 21, 1959' },
        { label: 'Total Barangays', value: '27 Barangays', highlight: true }
      ]
    },
    {
      title: 'Governance & Leadership',
      items: [
        { label: 'Government Type', value: 'Sangguniang Bayan' },
        { label: 'Municipal Mayor', value: 'Solomon T. Rufila', highlight: true },
        { label: 'Vice Mayor', value: 'Bernardino S. Ursos' },
        { label: 'District Representative', value: 'Adolph Edward G. Plaza' }
      ]
    },
    {
      title: 'Physical Geography & Elevation',
      items: [
        { label: 'Total Land Area', value: '392.53 km² (151.56 sq mi)' },
        { label: 'Mean Elevation', value: '89 m (292 ft)' },
        { label: 'Highest Elevation', value: '806 m (2,644 ft)' },
        { label: 'Lowest Elevation', value: '0 m (0 ft)' },
        { label: 'Climate Type', value: 'Tropical' }
      ]
    },
    {
      title: 'Demographics & Economy',
      items: [
        { label: 'Population (2020 Census)', value: '80,760', highlight: true },
        { label: 'Population Density', value: '210/km² (530/sq mi)' },
        { label: 'Total Households', value: '16,902' },
        { label: 'Income Class', value: '1st Municipal Income Class', highlight: true },
        { label: 'Poverty Incidence', value: '32.22% (2015)' },
        { label: 'Municipal Revenue', value: '₱248,724,165.88 (2016)' }
      ]
    },
    {
      title: 'Services, Time & Codes',
      items: [
        { label: 'Electricity Provider', value: 'Agusan del Sur Electric Cooperative (ASELCO)' },
        { label: 'Time Zone', value: 'UTC+8 (PST)', link: 'https://en.wikipedia.org/wiki/Philippine_Standard_Time' },
        { label: 'ZIP Code', value: '8501' },
        { label: 'IDD Area Code', value: '+63 (0)85' },
        { label: 'Native Languages', value: 'Agusan, Butuanon, Cebuano, Higaonon, Tagalog' }
      ]
    }
  ])

  const quickStats = ref([
    { label: 'Barangays', value: '27', subtext: 'Political Subdivisions' },
    { label: 'Total Population', value: '80,760', subtext: '2020 PSA Census' },
    { label: 'Income Class', value: '1st Class', subtext: 'Municipal Status' },
    { label: 'Total Area', value: '392.53 km²', subtext: '3.93% of Agusan del Sur' }
  ])

  return {
    censusData,
    municipalFacts,
    quickStats
  }
}
