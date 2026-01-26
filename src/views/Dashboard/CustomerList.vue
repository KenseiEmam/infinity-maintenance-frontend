<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import AddCustomerModal from '@/components/Modals/AddCustomerModal.vue'
import EditCustomerModal from '@/components/Modals/EditCustomerModal.vue'
import { useCustomerStore } from '@/stores/customerStore'
import { onMounted, ref, watch, computed } from 'vue'

const userStore = useCustomerStore()
const loading = ref(true)

// Filters
type Filter = {
  role?: string
  name?: string
}
const filter = ref(<Filter>{
  role: '',
  name: '',
})

// Pagination
const page = ref(1)
const pageSize = ref(10)
const addingCustomer = ref(false)
const editCustomer = ref<any>(null)
const modalLoad = ref(false)
const modalLoad2 = ref(false)
const totalPages = computed(() => Math.ceil(userStore.totalCount / pageSize.value))

// Fetch customers whenever filter or page changes
watch(
  [filter, page],
  () => {
    loading.value = true

    userStore.fetchCustomers(page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  },
  { deep: true },
)

onMounted(() => {
  loading.value = true
  userStore.fetchCustomers(page.value, pageSize.value).finally(() => {
    loading.value = false
  })
})

const handleAdd = (event: any) => {
  loading.value = true
  modalLoad.value = true
  userStore.createCustomer(event).then(() => {
    addingCustomer.value = false
    modalLoad.value = false
    userStore.fetchCustomers(page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  })
}
const handleEdit = (event: any) => {
  loading.value = true
  modalLoad2.value = true
  console.log(event.target)
  userStore.updateCustomer(event).then(() => {
    editCustomer.value = null
    modalLoad2.value = false
    userStore.fetchCustomers(page.value, pageSize.value).finally(() => {
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
        <h3 class="header-medium">Customers List</h3>
        <p class="text-sm md:text-base text-secondary">
          Here you may view and add customers mentioned in the jobsheets and calls!
        </p>
      </div>

      <p v-if="userStore.customers" class="ml-auto subheader-small">
        Showing {{ userStore.customers?.length }} Customer(s)
      </p>
      <button class="btn-sm-outline" @click="addingCustomer = true">Create Customer</button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col text-center items-center justify-center animate-pulse w-full space-y-4 h-full"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading customers..</p>
    </div>

    <!-- Customers List -->
    <div v-else class="flex flex-col h-full gap-3">
      <div
        v-for="user in userStore.customers"
        class="card gap-4 md:flex-row items-center justify-between"
        :key="user.id"
      >
        <div>
          <p class="font-black">
            {{ user.name }}
          </p>
          <p class="text-teritiary text-sm">
            {{ user.address || 'Missing Address' }}
          </p>
          <p class="text-teritiary text-sm">
            {{ user.phone || 'Missing Phone' }}
          </p>
        </div>
        <div class="flex gap-2 ml-auto">
          <button class="btn-lg-outline" @click="editCustomer = user">Edit</button>
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
    <AddCustomerModal
      @submit="handleAdd"
      @close="addingCustomer = false"
      :visible="addingCustomer"
      :loading="modalLoad"
    />
    <EditCustomerModal
      @update="handleEdit"
      @close="editCustomer = null"
      :loading="modalLoad2"
      :visible="editCustomer"
      :customer-data="editCustomer"
    />
  </section>
</template>
