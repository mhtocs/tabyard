// mv3 service worker — evaluation cycle wired in task 14
console.log('tabyard background loaded')

chrome.runtime.onInstalled.addListener(() => {
  console.log('tabyard installed')
})
