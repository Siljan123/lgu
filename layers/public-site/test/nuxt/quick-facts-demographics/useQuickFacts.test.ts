import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useQuickFacts } from '../../../app/composables/useQuickFacts'

describe('useQuickFacts Composable', () => {
  it('returns default municipal summary content for San Francisco', async () => {
    let result: ReturnType<typeof useQuickFacts> | undefined

    await mountSuspended({
      setup() {
        result = useQuickFacts()
        return () => null
      }
    })

    expect(result).toBeDefined()
    expect(result?.content).toContain('San Francisco, officially the Municipality of San Francisco')
    expect(result?.content).toContain('Agusan del Sur')
    expect(result?.content).toContain('80,760 people')
  })
})
