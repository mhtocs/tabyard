import { describe, expect, it } from 'vitest'
import { DEFAULT_RULES } from './rules'
import { initialSettings } from './seed'

describe('DEFAULT_RULES', () => {
  it('includes keep and close system defaults', () => {
    expect(DEFAULT_RULES).toEqual([
      'keep pinned=true',
      'close inactive>2h',
      'close inactive>30d',
    ])
  })
})

describe('initialSettings', () => {
  it('merges default rules with default settings', () => {
    const settings = initialSettings()
    expect(settings.rules).toEqual([...DEFAULT_RULES])
    expect(settings.engineEnabled).toBe(true)
    expect(settings.evaluationIntervalMinutes).toBe(5)
    expect(settings.graveyardRetentionDays).toBe(90)
  })
})

