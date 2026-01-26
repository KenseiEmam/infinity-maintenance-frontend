<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useCustomerStore } from '@/stores/customerStore'
import { useMachineStore } from '@/stores/machineStore'
import { useUserStore } from '@/stores/users'
import { onMounted, ref, watch } from 'vue'
const userStore = useUserStore()
const customerStore = useCustomerStore()
const machineStore = useMachineStore()
const props = defineProps({
  visible: Boolean,
  loading: Boolean,
})
const loadEng = ref(true)
const loadMachines = ref(false)
const emits = defineEmits(['close', 'submit'])
onMounted(() => {
  customerStore.fetchCustomers().then(() => {
    userStore.fetchUsers({ role: 'ENGINEER' }).then(() => {
      loadEng.value = false
    })
  })
})

// JobSheet form
const jobSheet = ref({
  purchaseOrderNo: '',
  date: '',
  customerId: '',
  machineId: '',
  engineerId: '',
  problemFound: '',
  workReport: '',
  total: 0,
  totalAfterDisc: 0,
  spareParts: [] as any[],
  laserData: [] as any[],
})
watch(
  () => jobSheet.value.customerId,
  (id) => {
    loadMachines.value = true
    machineStore.fetchMachines({ customerId: id }).finally(() => {
      loadMachines.value = false
    })
  },
  { deep: true },
)
const errors = ref<any>({})

// Form validation
const validateForm = () => {
  errors.value = {}
  if (!jobSheet.value.date) errors.value.date = 'Date is required'
  if (!jobSheet.value.customerId) errors.value.customerId = 'Customer is required'
  if (!jobSheet.value.machineId) errors.value.machineId = 'Machine is required'
  if (!jobSheet.value.engineerId) errors.value.engineerId = 'Engineer is required'

  return Object.keys(errors.value).length === 0
}

// Submit
const submitForm = () => {
  if (!validateForm()) return

  emits('submit', { ...jobSheet.value })

  // Reset form
  jobSheet.value = {
    purchaseOrderNo: '',
    date: '',
    customerId: '',
    machineId: '',
    engineerId: '',
    problemFound: '',
    workReport: '',
    total: 0,
    totalAfterDisc: 0,
    spareParts: [],
    laserData: [],
  }
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 max-h-screen overflow-y-auto"
    style="background-color: #000000aa"
  >
    <div
      v-if="loading || loadEng || loadMachines"
      class="card text-center items-center w-full space-y-4 max-w-128"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading job sheet data...</p>
    </div>

    <div v-else class="card bg-primary-background rounded-lg shadow p-6 mx-3 w-full max-w-128">
      <h2 class="contentH-small">Create Job Sheet</h2>
      <p class="text-body mb-4">Fill in the required details to create a new job sheet.</p>

      <form @submit.prevent="submitForm" class="w-full gap-6">
        <div class="mb-4">
          <label class="block text-sm font-medium">Purchase Order No</label>
          <input
            v-model="jobSheet.purchaseOrderNo"
            class="chef-text-input"
            placeholder="Optional"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium">Date</label>
          <input
            type="date"
            v-model="jobSheet.date"
            class="chef-text-input"
            :class="{ 'border-red-500': errors.date }"
            required
          />
          <span v-if="errors.date" class="text-red-500 text-sm">{{ errors.date }}</span>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium">Customer ID</label>
          <select
            v-model="jobSheet.customerId"
            class="chef-text-input"
            placeholder="Customer ID"
            :class="{ 'border-red-500': errors.customerId }"
            required
          >
            <option value="" disabled>Select a Customer</option>
            <option
              v-for="customer in customerStore.customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
            </option>
          </select>
          <span v-if="errors.customerId" class="text-red-500 text-sm">{{ errors.customerId }}</span>
        </div>

        <div v-if="jobSheet.customerId" class="mb-4">
          <label class="block text-sm font-medium">Machine ID</label>
          <select
            v-model="jobSheet.machineId"
            class="chef-text-input"
            placeholder="Machine ID"
            :class="{ 'border-red-500': errors.machineId }"
            required
          >
            <option value="" disabled>Select a Machine</option>
            <option v-for="machine in machineStore.machines" :key="machine.id" :value="machine.id">
              {{ machine.model.name }}
            </option>
          </select>
          <span v-if="errors.machineId" class="text-red-500 text-sm">{{ errors.machineId }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Engineer ID</label>
          <select
            v-model="jobSheet.engineerId"
            class="chef-text-input"
            placeholder="Engineer ID"
            :class="{ 'border-red-500': errors.engineerId }"
            required
          >
            <option value="" disabled>Select an Engineer</option>
            <option v-for="engineer in userStore.users" :key="engineer.id" :value="engineer.id">
              {{ engineer.name }}
            </option>
          </select>
          <span v-if="errors.engineerId" class="text-red-500 text-sm">{{ errors.engineerId }}</span>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium">Problem Found</label>
          <textarea
            v-model="jobSheet.problemFound"
            class="chef-text-input"
            placeholder="Optional"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium">Work Report</label>
          <textarea
            v-model="jobSheet.workReport"
            class="chef-text-input"
            placeholder="Optional"
          ></textarea>
        </div>

        <div class="mb-4 flex gap-4">
          <div class="flex-1">
            <label for="disc"> Job Total</label>
            <input
              type="number"
              v-model.number="jobSheet.total"
              placeholder="Total"
              class="chef-text-input flex-1"
            />
          </div>

          <div class="flex-1">
            <label for="disc"> After Discount</label>
            <input
              type="number"
              v-model.number="jobSheet.totalAfterDisc"
              placeholder="Total After Discount"
              class="chef-text-input flex-1"
            />
          </div>
        </div>

        <div class="gap-2 flex justify-end flex-col md:flex-row">
          <button type="button" @click="$emit('close')" class="btn-lg-outline rounded mr-2">
            Cancel
          </button>
          <button type="submit" class="btn-lg rounded">Create Job Sheet</button>
        </div>
      </form>
    </div>
  </div>
</template>
