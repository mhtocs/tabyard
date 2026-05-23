import { describe, expect, it } from 'vitest'
import type { GraveyardEntry } from '../storage/schema'
import { pruneGraveyardByRetention } from './store'

describe('pruneGraveyardByRetention', () => {
  // ac 13
  it('drops entries older than retention days', () => {
    const now = 10_000_000_000
    const day = 24 * 60 * 60 * 1000
    const entries: GraveyardEntry[] = [
      {
        id: 'old',
        url: 'https://old',
        title: 'old',
        closedAt: now - 100 * day,
        action: 'close',
        ruleText: 'r',
      },
      {
        id: 'fresh',
        url: 'https://fresh',
        title: 'fresh',
        closedAt: now - 1 * day,
        action: 'close',
        ruleText: 'r',
      },
    ]
    const pruned = pruneGraveyardByRetention(entries, 90, now)
    expect(pruned.map((e) => e.id)).toEqual(['fresh'])
  })
})
