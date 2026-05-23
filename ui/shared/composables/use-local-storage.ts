import { onMounted, onUnmounted } from 'vue'

export function useLocalStorageKeys(keys: string[], reload: () => void): void {
  function onStorageChanged(
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string,
  ) {
    if (areaName !== 'local') {
      return
    }
    if (keys.some((key) => key in changes)) {
      void reload()
    }
  }

  onMounted(() => {
    chrome.storage.onChanged.addListener(onStorageChanged)
  })

  onUnmounted(() => {
    chrome.storage.onChanged.removeListener(onStorageChanged)
  })
}
