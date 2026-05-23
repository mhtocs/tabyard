import { MIN_GRAVEYARD_RETENTION_DAYS } from '../graveyard/store'
import {
  type EvaluationIntervalMinutes,
  EVALUATION_INTERVALS,
  type Settings,
} from './schema'

export const DEFAULT_SETTINGS: Settings = {
  engineEnabled: true,
  evaluationIntervalMinutes: 5,
  graveyardRetentionDays: 90,
  rules: [],
}

export function isEvaluationIntervalMinutes(
  value: unknown,
): value is EvaluationIntervalMinutes {
  return (
    typeof value === 'number' &&
    (EVALUATION_INTERVALS as readonly number[]).includes(value)
  )
}

export type ParseSettingsResult =
  | { ok: true; settings: Settings }
  | { ok: false; error: string }

export function parseSettings(raw: unknown): ParseSettingsResult {
  if (raw === null || raw === undefined) {
    return { ok: true, settings: { ...DEFAULT_SETTINGS } }
  }

  if (typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'settings must be an object' }
  }

  const record = raw as Record<string, unknown>
  const engineEnabled = record.engineEnabled
  const evaluationIntervalMinutes = record.evaluationIntervalMinutes
  const graveyardRetentionDays = record.graveyardRetentionDays
  const rules = record.rules

  if (typeof engineEnabled !== 'boolean') {
    return { ok: false, error: 'engineEnabled must be a boolean' }
  }

  if (!isEvaluationIntervalMinutes(evaluationIntervalMinutes)) {
    return {
      ok: false,
      error: 'evaluationIntervalMinutes must be 1, 5, 15, 30, or 60',
    }
  }

  if (
    typeof graveyardRetentionDays !== 'number' ||
    !Number.isInteger(graveyardRetentionDays) ||
    graveyardRetentionDays < MIN_GRAVEYARD_RETENTION_DAYS
  ) {
    return {
      ok: false,
      error: `graveyardRetentionDays must be at least ${MIN_GRAVEYARD_RETENTION_DAYS}`,
    }
  }

  if (!Array.isArray(rules) || rules.some((line) => typeof line !== 'string')) {
    return { ok: false, error: 'rules must be an array of strings' }
  }

  return {
    ok: true,
    settings: {
      engineEnabled,
      evaluationIntervalMinutes,
      graveyardRetentionDays,
      rules: rules.map((line) => line.trim()).filter((line) => line.length > 0),
    },
  }
}
