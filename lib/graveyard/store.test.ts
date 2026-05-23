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

  it('enforces minimum 10 day retention when setting is lower', () => {
    const now = 10_000_000_000
    const day = 24 * 60 * 60 * 1000
    const entries: GraveyardEntry[] = [
      {
        id: 'eleven-days',
        url: 'https://x',
        title: 'x',
        closedAt: now - 11 * day,
        action: 'close',
        ruleText: 'r',
      },
      {
        id: 'five-days',
        url: 'https://y',
        title: 'y',
        closedAt: now - 5 * day,
        action: 'close',
        ruleText: 'r',
      },
    ]
    const pruned = pruneGraveyardByRetention(entries, 1, now)
    expect(pruned.map((e) => e.id)).toEqual(['five-days'])
  })
})
