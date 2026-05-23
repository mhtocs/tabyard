import { formatDevLogText } from '@/lib/logs/dev-log'
import { readDevLog } from '@/lib/storage/chrome-storage'
import { useLocalStorageKeys } from './use-local-storage'
import { computed, onMounted, ref } from 'vue'

export function useDevLog() {
  const logText = ref('')
  const loading = ref(true)

  const isEmpty = computed(() => logText.value.length === 0)

  async function load() {
    loading.value = true
    logText.value = formatDevLogText(await readDevLog())
    loading.value = false
  }

  onMounted(() => {
    void load()
  })

  useLocalStorageKeys(['devLog'], load)

  return { logText, isEmpty, loading }
}
