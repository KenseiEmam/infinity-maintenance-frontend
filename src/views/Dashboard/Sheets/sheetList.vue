<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import AddjobSheetModal from '@/components/Modals/AddJobSheetModal.vue'
import { useJobSheetStore } from '@/stores/jobSheetStore'
import { onMounted, ref, watch, computed } from 'vue'

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
const addingjobSheet = ref(false)
const modalLoad = ref(false)
const totalPages = computed(() => Math.ceil(jobSheetStore.totalCount / pageSize.value))

// Change filter
function changeFilter($event: any) {
  filter.value.serialNumber = $event.target.value
  page.value = 1
}

// Fetch jobSheets whenever filter or page changes
watch(
  [filter, page],
  () => {
    loading.value = true

    jobSheetStore.fetchJobSheets(filter.value, page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  },
  { deep: true },
)

onMounted(() => {
  loading.value = true
  jobSheetStore.fetchJobSheets(filter.value, page.value, pageSize.value).finally(() => {
    loading.value = false
  })
})

const handleAdd = (event: any) => {
  loading.value = true
  modalLoad.value = true
  jobSheetStore.createJobSheet(event).then(() => {
    addingjobSheet.value = false
    modalLoad.value = false
    jobSheetStore.fetchJobSheets(filter.value, page.value, pageSize.value).finally(() => {
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
        <h3 class="header-medium">Job Sheets List</h3>
        <p class="text-sm md:text-base text-secondary">
          Here you will see all your Job Sheets and be able to filter them!
        </p>
      </div>

      <select
        @change="changeFilter"
        customerId="filter"
        id="filter1"
        class="md:ml-auto chef-text-input w-full md:w-auto"
      >
        <option :value="[]">No Filter</option>
        <option :value="['ENGINEER']">Engineers</option>
        <option :value="['ADMIN']">Admins</option>
      </select>

      <p v-if="jobSheetStore.jobSheets" class="subheader-small">
        Showing {{ jobSheetStore.jobSheets?.length }} jobSheet(s)
      </p>
      <button class="btn-sm-outline" @click="addingjobSheet = true">Add Job Sheet</button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col text-center items-center justify-center animate-pulse w-full space-y-4 h-full"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading jobSheets..</p>
    </div>

    <!-- jobSheets List -->
    <div v-else class="flex flex-col h-full gap-3">
      <div
        v-for="jobSheet in jobSheetStore.jobSheets"
        class="card gap-4 md:flex-row items-center justify-between"
        :key="jobSheet.id"
      >
        <div>
          <p class="font-black">Job for: {{ jobSheet.customer.name }}</p>
          <p class="text-teritiary text-sm">By: {{ jobSheet.engineer.name }}</p>
        </div>
        <div v-if="jobSheet.createdAt">
          <p class="text-teritiary text-sm">
            Created
            {{
              new Date(jobSheet.createdAt).toLocaleDateString('en', {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
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
    <AddjobSheetModal
      @submit="handleAdd"
      @close="addingjobSheet = false"
      :visible="addingjobSheet"
      :loading="modalLoad"
    />
  </section>
</template>
