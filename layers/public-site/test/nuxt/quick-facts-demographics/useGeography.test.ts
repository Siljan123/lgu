import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useGeography } from '../../../app/composables/useGeography'

describe('useGeography Composable', () => {
  it('returns structured climate indicators data for 12 months and annual totals', async () => {
    let result: ReturnType<typeof useGeography> | undefined

    await mountSuspended({
      setup() {
        result = useGeography()
        return () => null
      }
    })

    expect(result).toBeDefined()
    expect(result?.climateData.value.length).toBeGreaterThan(0)

    const recordHigh = result?.climateData.value.find(row => row.label.includes('Record high'))
    expect(recordHigh).toBeDefined()
    expect(recordHigh?.values).toHaveLength(12)
    expect(recordHigh?.year).toBe('33 (91)')

    const precipitation = result?.climateData.value.find(row => row.label.includes('precipitation'))
    expect(precipitation).toBeDefined()
    expect(precipitation?.year).toBe('3,371 (132.7)')
  })
})
