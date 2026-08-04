import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { HistorySection } from '#components'

describe('HistorySection', () => {
  it('renders historical text properly', async () => {
    const component = await mountSuspended(HistorySection)
    
    // Verify that the historical content is present
    expect(component.text()).toContain('The birth of San Francisco has always been associated with the history of the provinces of Agusan and Surigao del Sur.')
    expect(component.text()).toContain('At present, Mayor Solomon T. Rufila is occupying the office of the chief executive')
    
    // Check for correct html structure (semantic paragraphs in an article)
    const article = component.find('article')
    expect(article.exists()).toBe(true)
    
    const paragraphs = component.findAll('p')
    expect(paragraphs.length).toBeGreaterThan(0)
  })
})
