import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useDemographics } from '../../../app/composables/useDemographics'

describe('useDemographics Composable', () => {
  it('returns census records, municipal fact sections, and quick stats', async () => {
    let result: ReturnType<typeof useDemographics> | undefined

    await mountSuspended({
      setup() {
        result = useDemographics()
        return () => null
      }
    })

    expect(result).toBeDefined()
    expect(result?.censusData.value).toHaveLength(11)
    expect(result?.censusData.value[0]).toEqual({
      year: 1960,
      population: 11324,
      growthRate: '—',
      absoluteChange: 0
    })
    expect(result?.censusData.value[10].population).toBe(80760)

    expect(result?.municipalFacts.value.length).toBeGreaterThan(0)
    const adminSection = result?.municipalFacts.value.find(s => s.title === 'Administrative & Location')
    expect(adminSection).toBeDefined()
    expect(adminSection?.items.find(i => i.label === 'Province')?.value).toBe('Agusan del Sur')

    expect(result?.quickStats.value).toHaveLength(4)
    expect(result?.quickStats.value.find(s => s.label === 'Barangays')?.value).toBe('27')
  })
})
