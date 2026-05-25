<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useSettings } from '../composables/use-settings'

const {
  settings,
  rulesText,
  validationError,
  saveMessage,
  running,
  runError,
  loading,
  saveRules,
  runNow,
  setEngineEnabled,
} = useSettings()

const rulesTextarea = ref<HTMLTextAreaElement | null>(null)

function syncTextareaHeight() {
  const el = rulesTextarea.value
  if (!el) {
    return
  }

  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

watch(rulesText, () => {
  void nextTick(syncTextareaHeight)
})

watch(loading, (isLoading) => {
  if (!isLoading) {
    void nextTick(syncTextareaHeight)
  }
})
</script>

<template>
  <section class="space-y-4 p-6">
    <div v-if="loading" class="text-sm text-gray-500">loading...</div>

    <template v-else>
      <div class="flex items-center justify-between gap-4">
        <p class="text-sm text-gray-600">write your rules, then save.</p>
        <label
          v-if="settings"
          class="flex shrink-0 items-center gap-3 text-sm text-gray-700"
        >
          engine
          <button
            type="button"
            class="flex h-6 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-300"
            :class="settings.engineEnabled ? 'bg-green-500' : 'bg-gray-300'"
            @click="setEngineEnabled(!settings.engineEnabled)"
          >
            <span
              class="h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300"
              :class="settings.engineEnabled ? 'translate-x-6' : 'translate-x-0'"
            />
          </button>
        </label>
      </div>

      <textarea
        ref="rulesTextarea"
        v-model="rulesText"
        rows="1"
        spellcheck="false"
        class="w-full resize-none overflow-y-hidden rounded border border-gray-300 bg-white p-3 font-mono text-sm leading-relaxed text-gray-800 focus:border-blue-400 focus:outline-none"
        placeholder="keep pinned=true"
        @input="syncTextareaHeight"
      />

      <p v-if="validationError" class="text-sm text-red-600">{{ validationError }}</p>
      <p v-else-if="saveMessage" class="text-sm text-green-700">{{ saveMessage }}</p>
      <p v-if="runError" class="text-sm text-red-600">{{ runError }}</p>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
          @click="saveRules"
        >
          save rules
        </button>
        <button
          type="button"
          class="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="running || !settings?.engineEnabled"
          @click="runNow"
        >
          {{ running ? 'running...' : 'run now' }}
        </button>
      </div>

      <details
        class="rounded border border-gray-200 bg-white text-sm text-gray-600"
        open
      >
        <summary class="cursor-pointer select-none px-4 py-2 text-gray-700">
          rule format &amp; examples
        </summary>
        <div class="space-y-4 border-t border-gray-200 px-4 pb-4 pt-3">
          <p>
            <span class="text-gray-700">format:</span>
            <code class="rounded bg-gray-100 px-1 font-mono text-xs">[action] [condition] ...</code>
            one rule per line. conditions narrow which tabs match.
          </p>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="mb-2 text-gray-700">actions</p>
              <ul class="space-y-1 text-xs leading-relaxed">
                <li>
                  <code class="font-mono">keep</code> : leave the tab alone
                </li>
                <li>
                  <code class="font-mono">archive</code> : close tab and save to archive (restore later)
                </li>
                <li>
                  <code class="font-mono">discard</code> : close tab with no archive
                </li>
                <li>
                  <code class="font-mono">suspend</code> : lightweight placeholder; reload restores the url
                </li>
              </ul>
            </div>

            <div>
              <p class="mb-2 text-gray-700">conditions</p>
              <ul class="space-y-1 text-xs leading-relaxed">
                <li>
                  <code class="font-mono">inactive&gt;2h</code> : inactive for at least 2 hours
                  (<code class="font-mono">m</code>, <code class="font-mono">h</code>,
                  <code class="font-mono">d</code>)
                </li>
                <li>
                  <code class="font-mono">url=example.com</code> : url contains text, or glob with
                  <code class="font-mono">*</code> / <code class="font-mono">?</code>
                </li>
                <li>
                  <code class="font-mono">pinned</code>,
                  <code class="font-mono">audible</code>,
                  <code class="font-mono">active</code>,
                  <code class="font-mono">suspended</code>
                  = <code class="font-mono">true</code> or <code class="font-mono">false</code>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <p class="mb-2 text-gray-700">examples</p>
            <pre
              class="overflow-x-auto rounded border border-gray-200 bg-gray-50 p-3 font-mono text-xs leading-relaxed text-gray-800"
            >keep pinned=true
keep url=docs.google.com
archive inactive&gt;2h
archive inactive&gt;10m url=docs.google.com
discard url=*example.com* inactive&gt;7d
suspend inactive&gt;2h url=journalclub.io</pre>
          </div>

          <p class="text-xs text-gray-500">
            pinned, audible, and active tabs are skipped unless the matching rule sets that flag to
            <code class="font-mono">true</code>. when several rules match, the most specific wins.
          </p>
        </div>
      </details>
    </template>
  </section>
</template>
