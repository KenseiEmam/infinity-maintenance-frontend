<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useCallStore } from '@/stores/callStore'
import Swal from 'sweetalert2'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// import VueSignaturePad from 'vue-signature-pad'
const callStore = useCallStore()
const loading = ref(true)

// route
const route = useRoute()
const changed = ref(false)
onMounted(() => {
  if (!route.params.id) {
    Swal.fire('Error', 'No sheet ID provided', 'error')
    return
  }
  loading.value = true
  const id = route.params.id.toString()
  callStore.fetchCall(id).finally(() => {
    loading.value = false
    changed.value = false
  })
})

watch(
  () => callStore.callDetail,
  () => {
    changed.value = true
  },
  { deep: true },
)
</script>

<template>
  <section class="text-center md:text-left h-full space-y-6">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col text-center items-center justify-center animate-pulse w-full space-y-4 h-full"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading Sheet..</p>
    </div>

    <!-- calls List -->
    <div v-else-if="callStore.callDetail" class="flex flex-col gap-3 grid gap3">
      <!-- Sheet ID -->
      <div class="card h-auto space-y-2 items-center md:items-start">
        <h2 class="header-small text-left">
          <span class="font-black text-sm md:text-base">Sheet ID:</span
          >{{ callStore.callDetail.id }}
        </h2>
        <h3 v-if="callStore.callDetail.assignedAt" class="text-teritiary text-sm">
          <span class="font-bold">Assigned:</span
          >{{
            new Date(callStore.callDetail.assignedAt).toLocaleDateString('en', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            })
          }}
        </h3>
        <h3 v-if="callStore.callDetail.callTime" class="text-teritiary text-sm">
          <span class="font-bold">Called At:</span
          >{{
            new Date(callStore.callDetail.callTime).toLocaleString('en', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            })
          }}
        </h3>
        <button
          v-if="callStore.callDetail.jobSheet"
          class="btn-lg w-full"
          @click="
            $router.push({ name: 'single-sheet', params: { id: callStore.callDetail.jobSheet.id } })
          "
        >
          Visit Related Job
        </button>
      </div>
      <!-- Supervising Engineer -->
      <div class="card h-auto space-y-2 items-center md:items-start">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Supervised by:</span>
        </h2>
        <h2 class="text-primary text-sm md:text-lg">
          {{ callStore.callDetail.assignedTo?.name }}
        </h2>
        <p>{{ callStore.callDetail.assignedTo?.email }}</p>
      </div>
      <!-- Customer  -->
      <div class="card h-auto space-y-2 items-center md:items-start">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">For Customer:</span>
        </h2>
        <h2 class="text-primary text-sm md:text-lg">
          {{ callStore.callDetail.customer?.name }}
        </h2>
        <p>
          {{ callStore.callDetail.customer?.address }} |
          {{ callStore.callDetail.customer?.phone }}
        </p>
      </div>

      <!-- Machine  -->
      <div class="card h-auto space-y-2 items-center md:items-start">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Machine:</span>
        </h2>
        <h2 class="text-primary text-sm md:text-lg">
          {{ callStore.callDetail.machine?.serialNumber }}
        </h2>
        <p>
          {{ callStore.callDetail.machine?.underWarranty ? 'Under Warranty' : 'No Warranty' }}
        </p>
      </div>
      <!-- Description  -->
      <div class="card h-auto space-y-2 items-center md:items-start">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Description:</span>
        </h2>
        <div class="w-full">
          <p class="text-teritiary">
            {{ callStore.callDetail.description }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="h-full card items-center justify-center w-full">
      <router-link class="btn-lg px-3 w-32 py-3 text-center" :to="{ name: 'dashboard-home' }">
        Back to Home
      </router-link>
    </div>
  </section>
</template>
