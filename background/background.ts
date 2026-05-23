import { runTabYardEvaluationCycle } from './evaluation-runner'
import { registerGraveyardMessageListener } from './graveyard-restore'
import { registerSchedulerListeners } from './scheduler'
import { initializeExtension } from './setup'
import { syncTabActivated, syncTabRemoved } from '../lib/activity/sync'
import {
  readActivityCache,
  writeActivityCache,
} from '../lib/storage/chrome-storage'

const DASHBOARD_PATH = 'ui/dashboard/index.html'

const activityPorts = {
  readCache: readActivityCache,
  writeCache: writeActivityCache,
}

function registerOpenDashboardOnActionClick(): void {
  chrome.action.onClicked.addListener(() => {
    void chrome.tabs.create({ url: chrome.runtime.getURL(DASHBOARD_PATH) })
  })
}

function registerActivityListeners(): void {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    void syncTabActivated(activityPorts, activeInfo.tabId).catch((err: unknown) => {
      console.error('tabcleaner tab activated sync failed', err)
    })
  })

  chrome.tabs.onRemoved.addListener((tabId) => {
    void syncTabRemoved(activityPorts, tabId).catch((err: unknown) => {
      console.error('tabcleaner tab removed sync failed', err)
    })
  })
}

function registerEvaluationMessageListener(): void {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== 'run-evaluation-cycle') {
      return
    }
    void runTabYardEvaluationCycle()
      .then(() => sendResponse({ ok: true }))
      .catch((err: unknown) => {
        console.error('tabcleaner manual evaluation failed', err)
        sendResponse({ ok: false })
      })
    return true
  })
}

registerOpenDashboardOnActionClick()
registerActivityListeners()
registerSchedulerListeners(runTabYardEvaluationCycle)
registerGraveyardMessageListener()
registerEvaluationMessageListener()

chrome.runtime.onInstalled.addListener(() => {
  void initializeExtension({ runCycle: true }).catch((err: unknown) => {
    console.error('tabcleaner install setup failed', err)
  })
})

void initializeExtension().catch((err: unknown) => {
  console.error('tabcleaner background init failed', err)
})
