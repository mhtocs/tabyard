import { describe, expect, it } from 'vitest'
import { globMatch } from './glob'

describe('globMatch', () => {
  it('matches plain pattern as substring of value', () => {
    expect(globMatch('reddit.com/r/cats', 'https://reddit.com/r/cats')).toBe(true)
    expect(globMatch('docs.google.com', 'https://docs.google.com/document/d/1')).toBe(
      true,
    )
    expect(globMatch('youtube.com', 'https://music.youtube.com/watch')).toBe(true)
    expect(globMatch('youtube.com', 'https://example.com/')).toBe(false)
  })

  it('matches plain pattern case-insensitively when requested', () => {
    expect(globMatch('YouTube.com', 'https://music.youtube.com/', { ignoreCase: true })).toBe(
      true,
    )
  })

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
