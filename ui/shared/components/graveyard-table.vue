<script setup lang="ts">
import { useGraveyard } from '../composables/use-graveyard'

const { groupedEntries, hintLine, loading, restoreError, restoreEntry } = useGraveyard()

function formatTime(closedAt: number): string {
  return new Date(closedAt).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>

<template>
  <section class="flex h-full min-h-[28rem] flex-col px-6 pb-6 pt-4">
    <div v-if="loading" class="text-xs text-gray-500">loading…</div>

    <template v-else>
      <p class="mb-4 text-xs text-gray-500">{{ hintLine }}</p>

      <p v-if="restoreError" class="mb-3 text-xs text-red-600">{{ restoreError }}</p>

      <p v-if="groupedEntries.length === 0" class="text-xs text-gray-500">empty</p>

      <div v-else class="min-h-0 flex-1 space-y-6 overflow-auto">
        <section v-for="group in groupedEntries" :key="group.dayKey">
          <h2 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {{ group.label }}
          </h2>

          <table class="w-full border-collapse text-left text-xs text-gray-600">
            <thead class="text-gray-500">
              <tr>
                <th class="w-full border-b border-gray-200 pb-2 pr-4 font-normal">tab</th>
                <th
                  class="w-0 border-b border-gray-200 pb-2 pr-4 font-normal whitespace-nowrap"
                >
                  time
                </th>
                <th
                  class="w-0 min-w-[9rem] border-b border-gray-200 pb-2 pl-4 font-normal whitespace-nowrap"
                >
                  rule
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="entry in group.entries"
                :key="entry.id"
                class="align-top hover:bg-gray-50 [&>td]:border-b [&>td]:border-gray-200 last:[&>td]:border-b-0"
              >
                <td class="max-w-0 w-full py-2 pr-4 break-words">
                  <button
                    type="button"
                    class="cursor-pointer text-left text-blue-600 underline hover:text-blue-800"
                    :title="entry.url"
                    @click="restoreEntry(entry.id)"
                  >
                    {{ entry.title || entry.url }}
                  </button>
                </td>
                <td class="w-0 py-2 pr-4 whitespace-nowrap">
                  {{ formatTime(entry.closedAt) }}
                </td>
                <td class="w-0 min-w-[9rem] py-2 pl-4 font-mono whitespace-nowrap">
                  {{ entry.ruleText }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </template>
  </section>
</template>
