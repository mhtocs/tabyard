export type EvaluationIntervalMinutes = 1 | 5 | 15 | 30 | 60

export const EVALUATION_INTERVALS: readonly EvaluationIntervalMinutes[] = [
  1, 5, 15, 30, 60,
] as const

export type LifecycleAction = 'protect' | 'archive' | 'close' | 'discard'

export type Settings = {
  engineEnabled: boolean
  evaluationIntervalMinutes: EvaluationIntervalMinutes
  graveyardRetentionDays: number
  rules: string[]
}

export type GraveyardEntry = {
  id: string
  url: string
  title: string
  favicon?: string
  closedAt: number
  action: 'close' | 'archive'
  ruleText: string
}

export type ActivityCache = Record<string, number>

export type LifecycleLogEntry = {
  id: string
  at: number
  tabId: number
  url: string
  title: string
  matchedRules: string[]
  resolvedAction: LifecycleAction | null
  resolutionReason: string
  executed: boolean
}

export type LastRunSummary = {
  at: number
  tabsEvaluated: number
  actionsTaken: number
}

export const STORAGE_KEYS = {
  settings: 'settings',
  graveyard: 'graveyard',
  activityCache: 'activityCache',
  lifecycleLog: 'lifecycleLog',
  lastRun: 'lastRun',
} as const
