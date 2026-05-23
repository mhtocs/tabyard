import { describe, expect, it } from 'vitest'
import { globMatch } from './glob'

describe('globMatch', () => {
  it('matches star as any substring', () => {
    expect(globMatch('*reddit.com/r/*', 'https://reddit.com/r/foo')).toBe(true)
    expect(globMatch('foo*bar', 'fooXXbar')).toBe(true)
  })

  it('matches question mark as single character', () => {
    expect(globMatch('tab?', 'tab1')).toBe(true)
    expect(globMatch('tab?', 'tab12')).toBe(false)
  })

  it('supports case insensitive option', () => {
    expect(globMatch('*.YouTube.com', 'music.youtube.com', { ignoreCase: true })).toBe(
      true,
    )
  })
})
