import { describe, expect, it } from 'vitest'
import { mergeTabLastAccessedIntoCache } from './bootstrap'

describe('mergeTabLastAccessedIntoCache', () => {
  const now = 1_000_000_000

  it('imports chrome lastAccessed for tabs missing from cache', () => {
    const cache = mergeTabLastAccessedIntoCache({}, [
      { id: 1, lastAccessed: now - 60_000 },
    ])
    expect(cache['1']).toBe(now - 60_000)
  })

  it('keeps newer cache entry over older chrome value', () => {
    const cache = mergeTabLastAccessedIntoCache({ '2': now - 1_000 }, [
      { id: 2, lastAccessed: now - 60_000 },
    ])
    expect(cache['2']).toBe(now - 1_000)
  })

  it('skips tabs without lastAccessed', () => {
    const cache = mergeTabLastAccessedIntoCache({}, [{ id: 3 }])
    expect(cache['3']).toBeUndefined()
  })
})
