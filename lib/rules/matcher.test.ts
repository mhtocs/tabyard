import { describe, expect, it } from 'vitest'
import { parseRule } from './parser'
import { matchRules, ruleMatches, type TabMatchContext } from './matcher'

function tab(overrides: Partial<TabMatchContext> = {}): TabMatchContext {
  return {
    url: 'https://example.com/page',
    pinned: false,
    audible: false,
    active: false,
    inactiveMs: 3 * 3_600_000,
    ...overrides,
  }
}

describe('ruleMatches inactive', () => {
  it('matches when tab inactive longer than threshold', () => {
    const rule = parseRule('close inactive>2h')
    expect(rule.ok && ruleMatches(rule.rule, tab({ inactiveMs: 3 * 3_600_000 }))).toBe(
      true,
    )
  })

  it('does not match when tab inactive shorter than threshold', () => {
    const rule = parseRule('close inactive>2h')
    expect(rule.ok && ruleMatches(rule.rule, tab({ inactiveMs: 3_600_000 }))).toBe(
      false,
    )
  })
})

describe('ruleMatches domain', () => {
  // ac 16
  it('matches subdomain for domain=*.youtube.com', () => {
    const rule = parseRule('close domain=*.youtube.com inactive>1h')
    expect(
      rule.ok &&
        ruleMatches(rule.rule, tab({ url: 'https://music.youtube.com/watch?v=1' })),
    ).toBe(true)
  })

  it('does not match unrelated domain', () => {
    const rule = parseRule('close domain=*.youtube.com inactive>1h')
    expect(
      rule.ok && ruleMatches(rule.rule, tab({ url: 'https://example.com/' })),
    ).toBe(false)
  })
})

describe('ruleMatches url', () => {
  // ac 17
  it('matches path glob on full url', () => {
    const rule = parseRule('close url=*reddit.com/r/* inactive>1h')
    expect(
      rule.ok &&
        ruleMatches(
          rule.rule,
          tab({ url: 'https://www.reddit.com/r/programming/comments/abc' }),
        ),
    ).toBe(true)
  })
})

describe('ruleMatches tab state', () => {
  // ac 18
  it('matches active=true only for foreground tab', () => {
    const rule = parseRule('keep active=true')
    expect(rule.ok && ruleMatches(rule.rule, tab({ active: true }))).toBe(true)
    expect(rule.ok && ruleMatches(rule.rule, tab({ active: false }))).toBe(false)
  })

  it('matches pinned=true against chrome pinned flag', () => {
    const rule = parseRule('keep pinned=true')
    expect(rule.ok && ruleMatches(rule.rule, tab({ pinned: true }))).toBe(true)
    expect(rule.ok && ruleMatches(rule.rule, tab({ pinned: false }))).toBe(false)
  })
})

describe('matchRules', () => {
  it('returns all rules that match the tab', () => {
    const rules = [
      parseRule('keep pinned=true'),
      parseRule('close inactive>2h'),
    ]
      .filter((r) => r.ok)
      .map((r) => r.rule)

    const matched = matchRules(rules, tab({ pinned: false, inactiveMs: 9_000_000 }))
    expect(matched.map((r) => r.source)).toEqual(['close inactive>2h'])
  })
})
