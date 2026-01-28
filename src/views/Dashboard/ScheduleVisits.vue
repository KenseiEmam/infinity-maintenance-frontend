<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { useScheduledVisitStore } from '@/stores/visitStore'
import { onMounted, ref, watch, computed } from 'vue'
import BookVisit from '@/components/Modals/BookVisit.vue'

const visitStore = useScheduledVisitStore()
const loading = ref(true)

// Pagination

const date = ref<Date | null>(new Date())
const page = ref(1)
const pageSize = ref(10)
const bookingvisit = ref(false)
const totalPages = computed(() => Math.ceil(visitStore.totalCount / pageSize.value))
// Pagination actions
function nextPage() {
  if (page.value < totalPages.value) page.value++
}
function prevPage() {
  if (page.value > 1) page.value--
}
// Fetch visits whenever filter or page changes
watch(
  [page, date],
  () => {
    loading.value = true

    visitStore
      .fetchVisits(
        date.value?.toISOString() || new Date().toISOString(),
        page.value,
        pageSize.value,
      )
      .finally(() => {
        loading.value = false
      })
  },
  { deep: true },
)
const modalLoad = ref(false)
const handleAdd = (event: string) => {
  loading.value = true
  modalLoad.value = true
  visitStore
    .createVisit({
      machineId: event,
      visitDate: date.value?.toISOString() || new Date().toISOString(),
    })
    .then(() => {
      bookingvisit.value = false
      modalLoad.value = false
      visitStore
        .fetchVisits(
          date.value?.toISOString() || new Date().toISOString(),
          page.value,
          pageSize.value,
        )
        .finally(() => {
          loading.value = false
        })
    })
}
onMounted(() => {
  loading.value = true
  visitStore
    .fetchVisits(date.value?.toISOString() || new Date().toISOString(), page.value, pageSize.value)
    .finally(() => {
      loading.value = false
    })
})
</script>
<template>
  <section class="w-full h-full grid md:grid-cols-3 gap-3">
    <div class="card text-center">
      <h3 class="title-medium mx-auto md:mx-0">Scheduled Visits</h3>
      <p class="text-secondary">
        Here you can view your scheduled visits and book new ones! Choose one day for your visit,
        the selected date will show all the visits on that date.
      </p>
      <div class="w-full h-full">
        <div
          class="bg-card text-infin dark:text-white justify-center flex flex-col gap-6 rounded-xl w-full h-full py-6"
        >
          <div data-slot="card-content" class="px-6 gap-6 h-full flex flex-col">
            <div class="flex justify-center my-auto">
              <div class="my-auto">
                <VueDatePicker
                  class="w-full mx-auto"
                  inline
                  :time-config="{ enableMinutes: false, startTime: { hours: 0, minutes: 0 } }"
                  auto-apply
                  v-model="date"
                ></VueDatePicker>
              </div>
            </div>
            <button
              class="btn-lg w-full disabled:opacity-40 disabled:cursor-default disabled:hover:bg-infin/40 disabled:bg-infin/40"
              :disabled="!date"
              @click="bookingvisit = true"
            >
              Book a new visit
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card md:col-span-2">
      <div class="flex-col flex items-center w-full h-full gap-3">
        <div>
          <p v-if="visitStore.visits" class="ml-auto subheader-small">
            Showing {{ visitStore.visits?.length }} Visit(s)
          </p>
        </div>

        <!-- Loading State -->
        <div
          v-if="loading"
          class="flex flex-col text-center items-center justify-center animate-pulse w-full space-y-4 h-full"
        >
          <div
            class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="text-sm text-center animate-pulse">Loading visits..</p>
        </div>

        <!-- Vistis List -->
        <div v-else class="flex flex-col h-full w-full gap-3">
          <div
            v-for="visit in visitStore.visits"
            class="card gap-4 md:flex-row items-center justify-between"
            :key="visit.id"
          >
            <div>
              <p class="font-black">
                {{ visit.machine?.customer?.name }}
              </p>
              <p class="text-teritiary text-sm">
                Machine: {{ visit.machine?.serialNumber || 'Missing Serial Number' }}
              </p>
              <p v-if="visit.visitDate" class="text-teritiary text-sm">
                {{
                  new Date(visit.visitDate).toLocaleString('en', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                }}
              </p>
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
      </div>
      <BookVisit
        :visible="bookingvisit"
        :loading="modalLoad"
        @close="bookingvisit = false"
        @submit="handleAdd"
      />
    </div>
  </section>
</template>
