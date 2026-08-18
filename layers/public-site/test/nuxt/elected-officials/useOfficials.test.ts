import { describe, expect, it } from 'vitest'
import { formatOfficialName } from '../../../app/composables/useOfficials'

describe('useOfficials Composable & Helpers', () => {
  it('formats official name with middle name', () => {
    const formatted = formatOfficialName('Grace', 'A.', 'Rodriguez')
    expect(formatted).toBe('Grace A. Rodriguez')
  })

  it('formats official name without middle name', () => {
    const formatted = formatOfficialName('Grace', null, 'Rodriguez')
    expect(formatted).toBe('Grace Rodriguez')
  })

  it('provides fallback if name is completely empty', () => {
    const formatted = formatOfficialName('', '', '')
    expect(formatted).toBe('Elected Official')
  })
})
