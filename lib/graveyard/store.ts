import type { GraveyardEntry } from '../storage/schema'

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** ac 13 — drop entries older than retention window */
export function pruneGraveyardByRetention(
  entries: GraveyardEntry[],
  retentionDays: number,
  nowMs = Date.now(),
): GraveyardEntry[] {
  if (retentionDays <= 0) {
    return []
  }
  const cutoff = nowMs - retentionDays * MS_PER_DAY
  return entries.filter((entry) => entry.closedAt >= cutoff)
}
