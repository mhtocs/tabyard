<script setup lang="ts">
const openDashboard = () => {
  const url = chrome.runtime.getURL('ui/dashboard/index.html')
  void chrome.tabs.create({ url })
}
</script>

<template>
  <main class="min-w-[280px] p-4 text-sm text-stone-800">
    <h1 class="font-medium">tabyard</h1>
    <p class="mt-2 text-stone-600">lifecycle engine (scaffold)</p>
    <button
      type="button"
      class="mt-4 rounded border border-stone-300 px-3 py-1.5 hover:bg-stone-50"
      @click="openDashboard"
    >
      open dashboard
    </button>
    <p class="mt-6 text-xs text-stone-500">tabby is tidying in the background.</p>
  </main>
</template>
