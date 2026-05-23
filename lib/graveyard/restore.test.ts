import { describe, expect, it, vi } from 'vitest'
import type { GraveyardEntry } from '../storage/schema'
import { restoreGraveyardEntry } from './restore'

describe('restoreGraveyardEntry', () => {
  const entries: GraveyardEntry[] = [
    {
      id: 'g1',
      url: 'https://example.com/page',
      title: 'example',
      closedAt: 1,
      action: 'close',
      ruleText: 'close inactive>2h',
    },
  ]

  // ac 3
  it('opens tab and removes entry from graveyard', async () => {
    const openTab = vi.fn().mockResolvedValue(99)
    const result = await restoreGraveyardEntry({ openTab }, entries, 'g1')

    expect(openTab).toHaveBeenCalledWith('https://example.com/page')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tabId).toBe(99)
      expect(result.entries).toHaveLength(0)
    }
  })

  it('returns error when entry is missing', async () => {
    const result = await restoreGraveyardEntry(
      { openTab: vi.fn() },
      entries,
      'missing',
    )
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('graveyard entry not found')
      expect(result.entries).toHaveLength(1)
    }
  })
})
