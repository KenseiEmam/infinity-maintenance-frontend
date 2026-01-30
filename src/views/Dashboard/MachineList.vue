<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import AddMachineModal from '@/components/Modals/AddMachineModal.vue'
import AddManufacturerModal from '@/components/Modals/AddManufacturerModal.vue'
import AddModelModal from '@/components/Modals/AddModelModal.vue'
import EditMachineModal from '@/components/Modals/EditMachineModal.vue'
import { useCustomerStore } from '@/stores/customerStore'
import { useUserStore } from '@/stores/users'
import Swal from 'sweetalert2'
const userStore = useUserStore()
import { useMachineStore } from '@/stores/machineStore'
import { onMounted, ref, watch, computed } from 'vue'
const customerStore = useCustomerStore()
const machineStore = useMachineStore()
const loading = ref(true)

// Filters
type Filter = {
  type?: string
}
const filter = ref(<Filter>{
  type: 'Machines',
})

// Pagination
const page = ref(1)
const pageSize = ref(10)
const addingMachine = ref(false)
const addingModel = ref(false)
const addingManufacturer = ref(false)
const editMachine = ref<any>(null)
const modalLoad = ref(false)
const modalLoad2 = ref(false)
const modalLoad4 = ref(false)
const modalLoad3 = ref(false)
const totalPages = computed(() => Math.ceil(machineStore.totalCount / pageSize.value))
function changeFilter($event: any) {
  filter.value.type = $event.target.value
  page.value = 1
}
// Fetch machines whenever filter or page changes
watch(
  [filter, page],
  () => {
    loading.value = true
    if (filter.value.type === 'Machines')
      machineStore.fetchMachines(page.value, pageSize.value).finally(() => {
        loading.value = false
      })
    else if (filter.value.type === 'Models')
      machineStore.fetchModels().finally(() => {
        loading.value = false
      })
    else if (filter.value.type === 'Manufacturers')
      machineStore.fetchManufacturers().finally(() => {
        loading.value = false
      })
  },
  { deep: true },
)

onMounted(() => {
  loading.value = true
  machineStore.fetchMachines(page.value, pageSize.value).finally(() => {
    machineStore.fetchManufacturers().finally(() => {
      machineStore.fetchModels().finally(() => {
        customerStore.fetchCustomers(1, 100000).finally(() => {
          loading.value = false
        })
      })
    })
  })
})
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
      await machineStore.deleteMachine(id).then(() => {
        machineStore.fetchMachines(page.value, pageSize.value).finally(() => {
          loading.value = false
        })
      })
    }
  })
}
const handleAdd = (event: any) => {
  loading.value = true
  modalLoad.value = true
  machineStore.createMachine(event).then(() => {
    addingMachine.value = false
    modalLoad.value = false
    machineStore.fetchMachines(page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  })
}
const handleAddModel = (event: any) => {
  loading.value = true
  modalLoad3.value = true
  machineStore.createModel(event).then(() => {
    addingModel.value = false
    modalLoad3.value = false
    machineStore.fetchModels().finally(() => {
      loading.value = false
    })
  })
}
const handleAddManufacturer = (event: any) => {
  loading.value = true
  modalLoad4.value = true
  machineStore.createManufacturer(event).then(() => {
    addingManufacturer.value = false
    modalLoad4.value = false
    machineStore.fetchManufacturers().finally(() => {
      loading.value = false
    })
  })
}
const handleEdit = (event: any) => {
  loading.value = true
  modalLoad2.value = true
  console.log(event.target)
  machineStore.updateMachine(event.id, event).then(() => {
    editMachine.value = null
    modalLoad2.value = false
    machineStore.fetchMachines(page.value, pageSize.value).finally(() => {
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
        <h3 class="header-medium">Machines List</h3>
        <p class="text-sm md:text-base text-secondary">
          Here you may view your customers machines, their models and their makes!
        </p>
      </div>
      <select
        @change="changeFilter"
        name="filter"
        id="filter1"
        class="md:ml-auto infinity-text-input w-full md:w-auto"
      >
        <option value="Machines">Machines</option>
        <option value="Models">Models</option>
        <option value="Manufacturers">Manufacturers</option>
      </select>
      <div
        v-if="filter.type === 'Machines'"
        class="md:flex-row flex-col flex items-center gap-3 w-full md:w-auto"
      >
        <p v-if="machineStore.machines" class="subheader-small">
          Showing {{ machineStore.machines?.length }} Machine(s)
        </p>
        <button class="btn-sm-outline md:w-auto w-full" @click="addingMachine = true">
          Create Machine
        </button>
      </div>
      <div
        v-else-if="filter.type === 'Models'"
        class="md:flex-row flex-col flex items-center gap-3 w-full md:w-auto"
      >
        <p v-if="machineStore.models" class="subheader-small">
          Showing {{ machineStore.models?.length }} Model(s)
        </p>
        <button class="btn-sm-outline md:w-auto w-full" @click="addingModel = true">
          Create Model
        </button>
      </div>
      <div
        v-else-if="filter.type === 'Manufacturers'"
        class="md:flex-row flex-col flex items-center gap-3 w-full md:w-auto"
      >
        <p v-if="machineStore.manufacturers" class="subheader-small">
          Showing {{ machineStore.manufacturers?.length }} Manufacturer(s)
        </p>
        <button class="btn-sm-outline md:w-auto w-full" @click="addingManufacturer = true">
          Create Manufacturer
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col text-center items-center justify-center animate-pulse w-full space-y-4 h-full"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading machines..</p>
    </div>

    <!-- Machines List -->
    <div v-else-if="filter.type === 'Machines'" class="flex flex-col h-full gap-3">
      <div
        v-for="machine in machineStore.machines"
        class="card gap-4 md:flex-row items-center justify-between"
        :key="machine.id"
      >
        <div>
          <p class="font-black">
            {{ machine.model.name }}
          </p>
          <p class="text-teritiary text-sm">
            {{ machine.customer.name || 'Missing Address' }}
          </p>
        </div>
        <div class="flex gap-2 w-full flex-col md:w-auto md:ml-auto">
          <button class="btn-lg-outline w-full md:w-auto" @click="editMachine = machine">
            Edit
          </button>
          <button
            v-if="machine.id && userStore.loggedInUser?.role === 'ADMIN'"
            class="btn-sm-delete md:w-auto w-full"
            @click="handleDelete(machine.id)"
          >
            Delete Machine
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
    <div v-else-if="filter.type === 'Models'" class="flex flex-col h-full gap-3">
      <div
        v-for="model in machineStore.models"
        class="card gap-4 md:flex-row items-center justify-between"
        :key="model.id"
      >
        <div>
          <p class="font-black">
            {{ model.name }}
          </p>
          <p class="text-teritiary text-sm">
            {{ model.manufacturer?.name || 'Missing Manufacturer' }}
          </p>
        </div>
      </div>
    </div>
    <div v-else-if="filter.type === 'Manufacturers'" class="flex flex-col h-full gap-3">
      <div
        v-for="manufacturer in machineStore.manufacturers"
        class="card gap-4 md:flex-row items-center justify-between"
        :key="manufacturer.id"
      >
        <div>
          <p class="font-black">
            {{ manufacturer.name }}
          </p>
        </div>
      </div>
    </div>
    <AddMachineModal
      @submit="handleAdd"
      @close="addingMachine = false"
      :customers="customerStore.customers"
      :manufacturers="machineStore.manufacturers"
      :models="machineStore.models"
      :visible="addingMachine"
      :loading="modalLoad"
    />
    <AddModelModal
      @submit="handleAddModel"
      @close="addingModel = false"
      :manufacturers="machineStore.manufacturers"
      :visible="addingModel"
      :loading="modalLoad3"
    />
    <AddManufacturerModal
      @submit="handleAddManufacturer"
      @close="addingManufacturer = false"
      :visible="addingManufacturer"
      :loading="modalLoad4"
    />
    <EditMachineModal
      @update="handleEdit"
      @close="editMachine = null"
      :customers="customerStore.customers"
      :manufacturers="machineStore.manufacturers"
      :models="machineStore.models"
      :loading="modalLoad2"
      :visible="editMachine"
      :machine-data="editMachine"
    />
  </section>
</template>
