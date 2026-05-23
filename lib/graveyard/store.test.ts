import { describe, expect, it } from 'vitest'
import {
  appendGraveyardEntry,
  createGraveyardEntry,
  pruneGraveyardByRetention,
} from './store'

describe('graveyard store', () => {
  it('creates entry with close action and metadata', () => {
    const entry = createGraveyardEntry({
      id: 'g1',
      url: 'https://example.com',
      title: 'example',
      ruleText: 'close inactive>30d',
      closedAt: 1_000,
    })
    expect(entry).toEqual({
      id: 'g1',
      url: 'https://example.com',
      title: 'example',
      closedAt: 1_000,
      action: 'close',
      ruleText: 'close inactive>30d',
    })
  })

  it('appends entry to list', () => {
    const first = createGraveyardEntry({ id: 'a', url: 'https://a', title: 'a', ruleText: 'r' })
    const second = createGraveyardEntry({ id: 'b', url: 'https://b', title: 'b', ruleText: 'r' })
    expect(appendGraveyardEntry([first], second)).toHaveLength(2)
  })

  // ac 13
  it('prunes entries older than retention days', () => {
    const now = 10_000_000_000
    const day = 24 * 60 * 60 * 1000
    const entries = [
      createGraveyardEntry({
        id: 'old',
        url: 'https://old',
        title: 'old',
        ruleText: 'r',
        closedAt: now - 100 * day,
      }),
      createGraveyardEntry({
        id: 'fresh',
        url: 'https://fresh',
        title: 'fresh',
        ruleText: 'r',
        closedAt: now - 1 * day,
      }),
    ]
    const pruned = pruneGraveyardByRetention(entries, 90, now)
    expect(pruned.map((e) => e.id)).toEqual(['fresh'])
  })
})
