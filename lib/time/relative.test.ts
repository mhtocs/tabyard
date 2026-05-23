import { describe, expect, it } from 'vitest'
import { formatTimeAgo, formatTimeUntil } from './relative'

describe('relative time', () => {
  const now = 1_000_000_000_000

  it('formats time ago in compact units', () => {
    expect(formatTimeAgo(now - 5_000, now)).toBe('just now')
    expect(formatTimeAgo(now - 45_000, now)).toBe('45s ago')
    expect(formatTimeAgo(now - 120_000, now)).toBe('2m ago')
    expect(formatTimeAgo(now - 7_200_000, now)).toBe('2h ago')
    expect(formatTimeAgo(now - 86_400_000, now)).toBe('1d ago')
  })

  it('formats time until in compact units', () => {
    expect(formatTimeUntil(now + 500, now)).toBe('in 1s')
    expect(formatTimeUntil(now + 45_000, now)).toBe('in 45s')
    expect(formatTimeUntil(now + 300_000, now)).toBe('in 5m')
    expect(formatTimeUntil(now - 1, now)).toBe('now')
  })
})
