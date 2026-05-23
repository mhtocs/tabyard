import type { GraveyardEntry } from '../storage/schema'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export type GraveyardEntryInput = {
  url: string
  title: string
  favicon?: string
  ruleText: string
  closedAt?: number
  id?: string
}

export function createGraveyardEntry(input: GraveyardEntryInput): GraveyardEntry {
  return {
    id: input.id ?? crypto.randomUUID(),
    url: input.url,
    title: input.title,
    favicon: input.favicon,
    closedAt: input.closedAt ?? Date.now(),
    action: 'close',
    ruleText: input.ruleText,
  }
}

export function appendGraveyardEntry(
  entries: GraveyardEntry[],
  entry: GraveyardEntry,
): GraveyardEntry[] {
  return [...entries, entry]
}

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
