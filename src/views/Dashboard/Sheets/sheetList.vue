<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import AddjobSheetModal from '@/components/Modals/AddJobSheetModal.vue'
import { useJobSheetStore } from '@/stores/jobSheetStore'
import { useUserStore } from '@/stores/users'
import Swal from 'sweetalert2'
import { onMounted, ref, watch, computed } from 'vue'

const jobSheetStore = useJobSheetStore()
const loading = ref(true)
const userStore = useUserStore()
// Filters
type Filter = {
  serialNumber?: string
  customerName?: string
}
const filter = ref(<Filter>{
  serialNumber: '',
  customerName: '',
})

// Pagination
const page = ref(1)
const pageSize = ref(10)
const addingjobSheet = ref(false)
const modalLoad = ref(false)
const totalPages = computed(() => Math.ceil(jobSheetStore.totalCount / pageSize.value))

// ---- Debounce helper ----
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 500) {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const fetchJobSheets = () => {
  loading.value = true
  jobSheetStore.fetchJobSheets(filter.value, page.value, pageSize.value).finally(() => {
    loading.value = false
  })
}

const debouncedFetchJobSheets = debounce(fetchJobSheets, 500)

// Fetch jobSheets whenever filter changes (debounced)
watch(
  filter,
  () => {
    page.value = 1
    debouncedFetchJobSheets()
  },
  { deep: true },
)

// Fetch jobSheets whenever page changes (instant)
watch(page, () => {
  fetchJobSheets()
})

onMounted(() => {
  fetchJobSheets()
})

const handleAdd = (event: any) => {
  loading.value = true
  modalLoad.value = true
  jobSheetStore.createJobSheet(event).then(() => {
    addingjobSheet.value = false
    modalLoad.value = false
    fetchJobSheets()
  })
}
async function handleDelete(id: string) {
  Swal.fire({
    title: 'Are you sure you want to DELETE this?',
    text: 'All records of this item and related items will be lost completely!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
  }).then(async (result) => {
    if (result.isConfirmed) {
      loading.value = true
      await jobSheetStore.deleteJobSheet(id).then(() => {
        jobSheetStore.fetchJobSheets(filter.value, page.value, pageSize.value).finally(() => {
          loading.value = false
        })
      })
    }
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
      <div class="md:ml-auto md:flex items-center gap-3">
        <label for="search" class="text-sm text-secondary min-w-max text-center md:text-left"
          >Search by Customer:</label
        >
        <input
          type="text"
          id="search"
          class="chef-text-input rounded-full px-3 py-2"
          v-model="filter.customerName"
          placeholder="Type customer name here..."
        />
      </div>

      <p v-if="jobSheetStore.jobSheets" class="subheader-small">
        Showing {{ jobSheetStore.jobSheets?.length }} Job Sheet(s)
      </p>
      <button class="btn-sm-outline w-full md:w-auto" @click="addingjobSheet = true">
        Add Job Sheet
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
          <p class="font-black">Customer: {{ jobSheet.customer.name }}</p>
          <p class="text-teritiary text-sm">Engineer: {{ jobSheet.engineer.name }}</p>
        </div>
        <div class="w-full flex flex-col md:w-auto space-y-3" v-if="jobSheet.createdAt">
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
          <button
            class="btn-sm-outline md:w-auto w-full"
            @click="$router.push({ name: 'single-sheet', params: { id: jobSheet.id } })"
          >
            View Sheet
          </button>
          <button
            v-if="jobSheet.id && userStore.loggedInUser?.role === 'ADMIN'"
            class="btn-sm-delete md:w-auto w-full"
            @click="handleDelete(jobSheet.id)"
          >
            Delete Sheet
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
    <AddjobSheetModal
      @submit="handleAdd"
      @close="addingjobSheet = false"
      :visible="addingjobSheet"
      :loading="modalLoad"
    />
  </section>
</template>
