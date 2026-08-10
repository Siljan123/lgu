import { describe, it, expect } from 'vitest'
import { useTravelersGuide } from '../../../app/composables/useTravelersGuide'

describe('useTravelersGuide composable', () => {
  it('provides getting there transport options for air, land, and sea', () => {
    const { gettingThereOptions, getOptionByMode } = useTravelersGuide()

    expect(gettingThereOptions.value.length).toBeGreaterThanOrEqual(4)

    const airOptions = getOptionByMode('Air').value
    expect(airOptions.length).toBe(3)
    const titles = airOptions.map(o => o.title)
    expect(titles).toContain('Via Butuan Bancasi Airport (BXU)')
    expect(titles).toContain('Via Francisco Bangoy International Airport (DVO)')
  })

  it('provides complete San Francisco terminal hub information for Barangay Hubang', () => {
    const { terminalHubInfo } = useTravelersGuide()

    expect(terminalHubInfo.value.name).toContain('San Francisco Integrated Bus')
    expect(terminalHubInfo.value.barangay).toContain('Brgy. Hubang')
    expect(terminalHubInfo.value.bays).toHaveLength(3)

    const bayA = terminalHubInfo.value.bays.find(b => b.name.includes('Bay A'))
    expect(bayA).toBeDefined()
    expect(bayA?.destinations).toContain('Davao City')
    expect(bayA?.destinations).toContain('Butuan City')
  })

  it('provides visitor rules, trekking permits, and emergency hotlines', () => {
    const { rulesAndPermits, emergencyContacts } = useTravelersGuide()

    expect(rulesAndPermits.value.length).toBeGreaterThanOrEqual(4)
    const magdiwataRule = rulesAndPermits.value.find(r => r.id === 'mt-magdiwata-permit')
    expect(magdiwataRule).toBeDefined()
    expect(magdiwataRule?.permitName).toContain('Mt. Magdiwata')

    expect(emergencyContacts.value.length).toBeGreaterThanOrEqual(4)
    const tourismDesk = emergencyContacts.value.find(c => c.id === 'contact-tourism')
    expect(tourismDesk).toBeDefined()
    expect(tourismDesk?.phone).toBe('(085) 839-0112')
  })
})
