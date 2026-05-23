import type { ParsedRule, RuleCondition } from './types'

const CONDITION_WEIGHT: Record<RuleCondition['kind'], number> = {
  inactive: 1,
  pinned: 2,
  audible: 2,
  active: 2,
  url: 4,
}

export function conditionWeight(condition: RuleCondition): number {
  return CONDITION_WEIGHT[condition.kind]
}

export function specificityScore(rule: ParsedRule): number {
  return rule.conditions.reduce(
    (sum, condition) => sum + conditionWeight(condition),
    0,
  )
}
