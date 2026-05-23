import { describe, expect, it } from 'vitest'
import type { GraveyardEntry } from '../storage/schema'
import { groupGraveyardEntriesByDay } from './group-by-day'

function entry(closedAt: number, id: string): GraveyardEntry {
  return {
    id,
    url: `https://example.com/${id}`,
    title: id,
    closedAt,
    action: 'close',
    ruleText: 'close inactive>2h',
  }
}

describe('groupGraveyardEntriesByDay', () => {
  const now = new Date('2026-05-23T15:00:00').getTime()
  const day = 24 * 60 * 60 * 1000

  it('groups entries by calendar day newest first', () => {
    const groups = groupGraveyardEntriesByDay(
      [
        entry(now - 2 * day, 'old'),
        entry(now - 30 * 60_000, 'today-a'),
        entry(now - 60 * 60_000, 'today-b'),
        entry(now - day - 60 * 60_000, 'yesterday-a'),
      ],
      now,
    )

    expect(groups).toHaveLength(3)
    expect(groups[0]!.label).toBe('today')
    expect(groups[0]!.entries.map((e) => e.id)).toEqual(['today-a', 'today-b'])
    expect(groups[1]!.label).toBe('yesterday')
    expect(groups[2]!.label).not.toBe('today')
  })
})
