import type { EvaluationIntervalMinutes } from '../lib/storage/schema'
import type { SchedulerPorts } from '../lib/engine/scheduler'

function getAlarm(name: string): Promise<chrome.alarms.Alarm | undefined> {
  return new Promise((resolve, reject) => {
    chrome.alarms.get(name, (alarm) => {
      const err = chrome.runtime.lastError
      if (err) {
        reject(new Error(err.message))
        return
      }
      resolve(alarm)
    })
  })
}

function clearAlarm(name: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.alarms.clear(name, (wasCleared) => {
      const err = chrome.runtime.lastError
      if (err) {
        reject(new Error(err.message))
        return
      }
      resolve(wasCleared)
    })
  })
}

function createAlarm(name: string, periodInMinutes: EvaluationIntervalMinutes): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.alarms.create(name, { periodInMinutes }, () => {
      const err = chrome.runtime.lastError
      if (err) {
        reject(new Error(err.message))
        return
      }
      resolve()
    })
  })
}

export const schedulerPorts: SchedulerPorts = {
  getAlarm,
  clearAlarm,
  createAlarm,
}
