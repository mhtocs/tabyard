import type { GraveyardEntry } from '../storage/schema'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export type GraveyardDayGroup = {
  dayKey: string
  label: string
  entries: GraveyardEntry[]
}

function graveyardDayKey(closedAtMs: number): string {
  const date = new Date(closedAtMs)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function graveyardDayLabel(dayKey: string, nowMs: number): string {
  const todayKey = graveyardDayKey(nowMs)
  const yesterdayKey = graveyardDayKey(nowMs - MS_PER_DAY)
  if (dayKey === todayKey) {
    return 'today'
  }
  if (dayKey === yesterdayKey) {
    return 'yesterday'
  }
  const [y, m, d] = dayKey.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function groupGraveyardEntriesByDay(
  entries: GraveyardEntry[],
  nowMs = Date.now(),
): GraveyardDayGroup[] {
  const byDay = new Map<string, GraveyardEntry[]>()

  for (const entry of entries) {
    const key = graveyardDayKey(entry.closedAt)
    const bucket = byDay.get(key)
    if (bucket) {
      bucket.push(entry)
    } else {
      byDay.set(key, [entry])
    }
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dayKey, dayEntries]) => ({
      dayKey,
      label: graveyardDayLabel(dayKey, nowMs),
      entries: [...dayEntries].sort((a, b) => b.closedAt - a.closedAt),
    }))
}
