<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCustomerStore } from '@/stores/customerStore'
import { useMachineStore } from '@/stores/machineStore'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
})

const emits = defineEmits(['close', 'submit'])
const selectedManufacturer = ref('')
const selectedModel = ref('')
const customerStore = useCustomerStore()
const machineStore = useMachineStore()

const loadData = ref(true)
const loadMachines = ref(false)

// Call form
const callForm = ref({
  customerId: '',
  machineId: '',
  description: '',
  callTime: '',
})

const errors = ref<any>({})

onMounted(async () => {
  customerStore.fetchCustomers().then(() => {
    machineStore.fetchManufacturers().then(() => {
      loadData.value = false
    })
  })
})
watch(
  () => selectedManufacturer.value,
  (id) => {
    loadMachines.value = true
    machineStore.fetchModels(id).finally(() => {
      loadMachines.value = false
    })
  },
  { deep: true },
)
watch(
  () => [callForm.value.customerId, selectedModel.value],
  ([id, secondid]) => {
    loadMachines.value = true
    machineStore.fetchMachines({ customerId: id, modelId: secondid }).finally(() => {
      loadMachines.value = false
    })
  },
  { deep: true },
)

// Validation
const validateForm = () => {
  errors.value = {}

  if (!callForm.value.customerId) errors.value.customerId = 'Customer is required'
  if (!callForm.value.description) errors.value.description = 'Description is required'

  return Object.keys(errors.value).length === 0
}

// Submit
const submitForm = () => {
  if (!validateForm()) return

  emits('submit', { ...callForm.value })

  // Reset
  callForm.value = {
    customerId: '',
    machineId: '',
    description: '',
    callTime: '',
  }
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 max-h-screen overflow-y-auto"
    style="background-color: #000000aa"
  >
    <!-- Loading -->
    <div
      v-if="loading || loadData || loadMachines"
      class="card text-center items-center w-full space-y-4 max-w-128"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm animate-pulse">Loading call data...</p>
    </div>

    <!-- Modal -->
    <div v-else class="card bg-primary-background rounded-lg shadow p-6 mx-3 w-full max-w-128">
      <h2 class="contentH-small">Create Call</h2>
      <p class="text-body mb-4">Log a new service call.</p>

      <form @submit.prevent="submitForm" class="w-full">
        <!-- Customer -->
        <div class="mb-4">
          <label class="block text-sm font-medium">Customer</label>
          <select
            v-model="callForm.customerId"
            class="infinity-text-input"
            :class="{ 'border-red-500': errors.customerId }"
          >
            <option value="" disabled>Select a customer</option>
            <option
              v-for="customer in customerStore.customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
            </option>
          </select>
          <span v-if="errors.customerId" class="text-red-500 text-sm">
            {{ errors.customerId }}
          </span>
        </div>
        <!-- Manufacturer -->
        <div class="mb-4">
          <label class="block text-sm font-medium">Manufacturer </label>
          <select v-model="selectedManufacturer" class="infinity-text-input">
            <option value="">No Manufacturer</option>
            <option
              v-for="manufacturer in machineStore.manufacturers"
              :key="manufacturer.id"
              :value="manufacturer.id"
            >
              {{ manufacturer.name }}
            </option>
          </select>
        </div>
        <!-- Model -->
        <div v-if="selectedManufacturer" class="mb-4">
          <label class="block text-sm font-medium">Models </label>
          <select v-model="selectedModel" class="infinity-text-input">
            <option value="">No Model</option>
            <option v-for="model in machineStore.models" :key="model.id" :value="model.id">
              {{ model.name }} | {{ model.manufacturer?.name }}
            </option>
          </select>
        </div>
        <!-- Machine -->
        <div v-if="callForm.customerId && selectedModel" class="mb-4">
          <label class="block text-sm font-medium">Machines</label>
          <select v-model="callForm.machineId" class="infinity-text-input">
            <option value="">No machine</option>
            <option v-for="machine in machineStore.machines" :key="machine.id" :value="machine.id">
              {{ machine.serialNumber }} | {{ machine.model.name }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="block text-sm font-medium">Description</label>
          <textarea
            v-model="callForm.description"
            class="infinity-text-input"
            placeholder="Describe the issue"
            :class="{ 'border-red-500': errors.description }"
          ></textarea>
          <span v-if="errors.description" class="text-red-500 text-sm">
            {{ errors.description }}
          </span>
        </div>

        <!-- Call Time -->
        <div class="mb-6">
          <label class="block text-sm font-medium">Call Time (optional)</label>
          <input type="datetime-local" v-model="callForm.callTime" class="infinity-text-input" />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 flex-col md:flex-row">
          <button type="button" class="btn-lg-outline" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-lg">Create Call</button>
        </div>
      </form>
    </div>
  </div>
</template>
