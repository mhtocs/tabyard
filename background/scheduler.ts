import { EVALUATION_ALARM_NAME, syncEvaluationAlarm } from '../lib/engine/scheduler'
import { appendDevLog, readSettings } from '../lib/storage/chrome-storage'
import { initializeExtension } from './setup'
import { schedulerPorts } from './scheduler-ports'

export async function rescheduleEvaluationAlarm(): Promise<void> {
  const settings = await readSettings()
  await syncEvaluationAlarm(schedulerPorts, settings.evaluationIntervalMinutes)
}

export function registerSchedulerListeners(
  onEvaluate: () => Promise<unknown>,
): void {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== EVALUATION_ALARM_NAME) {
      return
    }
    void appendDevLog('alarm fired')
    void onEvaluate().catch((err: unknown) => {
      console.error('tabcleaner evaluation cycle failed', err)
    })
  })

  chrome.runtime.onStartup.addListener(() => {
    void initializeExtension({ runCycle: true }).catch((err: unknown) => {
      console.error('tabcleaner startup init failed', err)
    })
  })

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local' || !changes.settings) {
      return
    }
    void rescheduleEvaluationAlarm().catch((err: unknown) => {
      console.error('tabcleaner settings alarm reschedule failed', err)
    })
  })
}
