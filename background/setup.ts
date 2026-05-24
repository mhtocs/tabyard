import { mergeTabLastAccessedIntoCache } from '../lib/activity/bootstrap'
import { initialSettings } from '../lib/defaults/seed'
import { syncEvaluationAlarmIfNeeded } from '../lib/engine/scheduler'
import {
  readActivityCache,
  readLastRun,
  readSettings,
  readSettingsRaw,
  writeActivityCache,
  writeSettings,
} from '../lib/storage/chrome-storage'
import { queryAllTabs } from './chrome-tabs'
import { runKeeperEvaluationCycle } from './evaluation-runner'
import { schedulerPorts } from './scheduler-ports'

let readyPromise: Promise<void> | null = null

async function seedStorageIfEmpty(): Promise<void> {
  const stored = await readSettingsRaw()
  if (stored !== undefined && stored !== null) {
    return
  }
  await writeSettings(initialSettings())
}

async function bootstrapActivityCacheFromOpenTabs(): Promise<void> {
  const tabs = await queryAllTabs()
  const cache = await readActivityCache()
  const merged = mergeTabLastAccessedIntoCache(cache, tabs)
  if (merged !== cache) {
    await writeActivityCache(merged)
  }
}

async function prepareExtension(): Promise<void> {
  await seedStorageIfEmpty()
  await bootstrapActivityCacheFromOpenTabs()
  const settings = await readSettings()
  await syncEvaluationAlarmIfNeeded(schedulerPorts, settings.evaluationIntervalMinutes)
}

export function whenExtensionReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = prepareExtension().catch((err: unknown) => {
      readyPromise = null
      throw err
    })
  }
  return readyPromise
}

async function runOverdueEvaluationIfNeeded(): Promise<void> {
  const settings = await readSettings()
  if (!settings.engineEnabled) {
    return
  }
  const lastRun = await readLastRun()
  if (!lastRun) {
    return
  }
  const dueAt =
    lastRun.at + settings.evaluationIntervalMinutes * 60_000
  if (Date.now() < dueAt) {
    return
  }
  await runKeeperEvaluationCycle()
}

export async function initializeExtension(options?: {
  runCycle?: boolean
}): Promise<void> {
  await whenExtensionReady()
  if (!options?.runCycle) {
    await runOverdueEvaluationIfNeeded()
  }
  if (options?.runCycle) {
    await runKeeperEvaluationCycle()
  }
}
