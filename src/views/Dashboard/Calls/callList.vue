<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import AddcallModal from '@/components/Modals/AddCallModal.vue'

import AssignEngineerModal from '@/components/Modals/AssignEngineerModal.vue'
import CallJobSheetModal from '@/components/Modals/CallJobSheetModal.vue'
import { useCallStore } from '@/stores/callStore'
import { useJobSheetStore } from '@/stores/jobSheetStore'
import { onMounted, ref, watch, computed } from 'vue'

const callStore = useCallStore()
const jobSheetStore = useJobSheetStore()
const loading = ref(true)

// Filters
type Filter = {
  serialNumber?: string
  customerId?: string
}
const filter = ref(<Filter>{
  serialNumber: '',
  customerId: '',
})

// Pagination
const page = ref(1)
const pageSize = ref(10)
const addingcall = ref(false)
const chosenCall = ref<any | undefined>(undefined)
const showAssignModal = ref<string | undefined>(undefined)

const modalLoad = ref(false)
const modalLoad2 = ref(false)
const modalLoad3 = ref(false)
const totalPages = computed(() => Math.ceil(callStore.totalCount / pageSize.value))

// Fetch calls whenever filter or page changes
watch(
  [filter, page],
  () => {
    loading.value = true

    callStore.fetchCalls(page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  },
  { deep: true },
)

onMounted(() => {
  loading.value = true
  callStore.fetchCalls(page.value, pageSize.value).finally(() => {
    loading.value = false
  })
})

const handleAddJob = (event: any) => {
  loading.value = true
  modalLoad3.value = true

  if (!chosenCall.value?.callTime) {
    alert('Date is required')
    modalLoad3.value = false
    loading.value = false
    return
  }

  if (!chosenCall.value?.customerId) {
    alert('Customer is required')
    modalLoad3.value = false
    loading.value = false
    return
  }

  if (!chosenCall.value?.machineId) {
    alert('Machine is required')
    modalLoad3.value = false
    loading.value = false
    return
  }

  const engineerId = chosenCall.value?.assignedToId || event.engineerId
  if (!engineerId) {
    alert('Engineer is required')
    modalLoad3.value = false
    loading.value = false
    return
  }

  const payload = {
    callId: chosenCall.value.id,
    purchaseOrderNo: event.purchaseOrderNo,
    date: new Date(chosenCall.value.callTime).toISOString(),
    customerId: chosenCall.value.customerId,
    machineId: chosenCall.value.machineId,
    engineerId,
    problemFound: event.problemFound,
    workReport: event.workReport,
    total: event.total,
    totalAfterDisc: event.totalAfterDisc,
  }

  jobSheetStore
    .createJobSheet(payload)
    .then(() => {
      chosenCall.value = undefined
      modalLoad3.value = false
      callStore.fetchCalls(page.value, pageSize.value).finally(() => {
        loading.value = false
      })
    })
    .catch(() => {
      modalLoad3.value = false
      loading.value = false
    })
}

const handleAdd = (event: any) => {
  loading.value = true
  modalLoad.value = true
  callStore.createCall(event).then(() => {
    addingcall.value = false
    modalLoad.value = false
    callStore.fetchCalls(page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  })
}
const assignEngineer = async (event: any) => {
  modalLoad2.value = true
  if (!showAssignModal.value) return
  await callStore.assignCall(showAssignModal.value, event).then(() => {
    showAssignModal.value = undefined
    modalLoad2.value = false
    callStore.fetchCalls(page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  })
}

// Pagination actions
function nextPage() {
  if (page.value < totalPages.value) page.value++
}
function prevPage() {
  if (page.value > 1) page.value--
}
</script>

<template>
  <section class="text-center md:text-left h-full space-y-6">
    <div class="md:flex-row flex-col flex items-center w-full gap-3">
      <div>
        <h3 class="header-medium">Calls List</h3>
        <p class="text-sm md:text-base text-secondary">
          Here you will see all your customer Calls and be able to assign them!
        </p>
      </div>

      <p v-if="callStore.calls" class="subheader-small md:ml-auto">
        Showing {{ callStore.calls?.length }} call(s)
      </p>
      <button class="btn-sm-outline w-full md:w-auto" @click="addingcall = true">
        Add Job Call
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col text-center items-center justify-center animate-pulse w-full space-y-4 h-full"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading calls..</p>
    </div>

    <!-- calls List -->
    <div v-else class="flex flex-col h-full gap-3">
      <div
        v-for="call in callStore.calls"
        class="card gap-4 md:flex-row items-center justify-between"
        :key="call.id"
      >
        <div>
          <p class="font-black">Call from: {{ call.customer?.name }}</p>
          <p class="text-secondary text-sm">{{ call.customer?.phone }}</p>
          <p class="text-teritiary line-clamp-2 text-xs">{{ call.description }}</p>
        </div>
        <div class="flex flex-col gap-2 w-full md:w-auto">
          <div v-if="call.assignedTo">
            <p v-if="call.assignedAt" class="text-teritiary text-sm">
              Assigned
              {{
                new Date(call.assignedAt).toLocaleDateString('en', {
                  day: '2-digit',
                  month: 'short',
                  year: '2-digit',
                })
              }}
            </p>
            <p class="text-teritiary text-sm">Assigned to: {{ call.assignedTo?.name }}</p>

            <button v-if="!call.jobSheet" class="btn-sm w-full" @click="chosenCall = call">
              Create Job
            </button>
            <button
              v-else
              class="btn-sm w-full"
              @click="$router.push({ name: 'single-sheet', params: { id: call.jobSheet.id } })"
            >
              Visit Job
            </button>
          </div>

          <button v-else class="btn-sm" @click="showAssignModal = call.id">Assign Call</button>
          <button
            class="btn-sm-outline md:w-auto w-full"
            @click="$router.push({ name: 'single-call', params: { id: call.id } })"
          >
            View Call
          </button>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-center items-center gap-2 card mt-auto mb-12 w-full">
        <button
          @click="prevPage"
          :disabled="page === 1"
          v-if="page !== 1"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          v-if="page < totalPages"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <AddcallModal
      @submit="handleAdd"
      @close="addingcall = false"
      :visible="addingcall"
      :loading="modalLoad"
    />
    <AssignEngineerModal
      :visible="!!showAssignModal"
      :loading="modalLoad2"
      @close="showAssignModal = undefined"
      @submit="assignEngineer"
    />
    <CallJobSheetModal
      @submit="handleAddJob"
      @close="chosenCall = undefined"
      :visible="chosenCall"
      :loading="modalLoad3"
    />
  </section>
</template>
