<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
  customers: { type: Array as () => any[], required: true },
  manufacturers: { type: Array as () => any[], required: true },
  models: { type: Array as () => any[], required: true },
  machineData: Object as () => {
    id: string
    serialNumber: string
    customerId: string
    modelId: string
    underWarranty?: boolean
    model?: { manufacturerId?: string }
  } | null,
})

const emits = defineEmits(['close', 'update'])

const machine = ref({
  id: '',
  serialNumber: '',
  customerId: '',
  manufacturerId: '',
  modelId: '',
  underWarranty: false,
})

const errors = ref<any>({})

/**
 * Prefill when opening / changing machine
 */
watch(
  () => props.machineData,
  (val) => {
    if (!val) {
      machine.value = {
        id: '',
        serialNumber: '',
        customerId: '',
        manufacturerId: '',
        modelId: '',
        underWarranty: false,
      }
      return
    }

    machine.value = {
      id: val.id,
      serialNumber: val.serialNumber,
      customerId: val.customerId,
      manufacturerId: val.model?.manufacturerId || '',
      modelId: val.modelId,
      underWarranty: !!val.underWarranty,
    }
  },
  { immediate: true },
)

const validateForm = () => {
  errors.value = {}
  if (!machine.value.serialNumber) errors.value.serialNumber = 'Serial number required'
  if (!machine.value.customerId) errors.value.customerId = 'Customer required'
  if (!machine.value.modelId) errors.value.modelId = 'Model required'
  return Object.keys(errors.value).length === 0
}

const submitForm = () => {
  if (!validateForm()) return

  emits('update', {
    id: machine.value.id,
    serialNumber: machine.value.serialNumber,
    customerId: machine.value.customerId,
    modelId: machine.value.modelId,
    underWarranty: machine.value.underWarranty,
  })
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
    style="background-color: #000000aa"
  >
    <!-- Loading -->
    <div v-if="loading" class="card w-full max-w-md text-center">
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin mx-auto"
      ></div>
      <p class="mt-2 animate-pulse">Updating machine...</p>
    </div>

    <!-- Modal -->
    <div v-else class="card bg-primary-background rounded-lg shadow p-6 w-full max-w-md">
      <h2 class="contentH-small mb-4">Edit Machine</h2>

      <form @submit.prevent="submitForm" class="space-y-4 w-full">
        <!-- Serial -->
        <div>
          <label class="block text-sm font-medium">Serial Number</label>
          <input v-model="machine.serialNumber" class="infinity-text-input" />
          <span v-if="errors.serialNumber" class="text-red-500 text-sm">
            {{ errors.serialNumber }}
          </span>
        </div>

        <!-- Customer -->
        <div>
          <label class="block text-sm font-medium">Customer</label>
          <select v-model="machine.customerId" class="infinity-text-input">
            <option value="" disabled>Select customer</option>
            <option v-for="c in customers" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
          <span v-if="errors.customerId" class="text-red-500 text-sm">
            {{ errors.customerId }}
          </span>
        </div>

        <!-- Manufacturer -->
        <div>
          <label class="block text-sm font-medium">Manufacturer</label>
          <select v-model="machine.manufacturerId" class="infinity-text-input">
            <option value="" disabled>Select manufacturer</option>
            <option v-for="m in manufacturers" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
        </div>

        <!-- Model -->
        <div>
          <label class="block text-sm font-medium">Model</label>
          <select v-model="machine.modelId" class="infinity-text-input">
            <option value="" disabled>Select model</option>
            <option
              v-for="m in models.filter((x) => x.manufacturerId === machine.manufacturerId)"
              :key="m.id"
              :value="m.id"
            >
              {{ m.name }}
            </option>
          </select>
          <span v-if="errors.modelId" class="text-red-500 text-sm">
            {{ errors.modelId }}
          </span>
        </div>

        <!-- Warranty -->
        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="machine.underWarranty" />
          <span>Under Warranty</span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="btn-lg-outline" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-lg">Update Machine</button>
        </div>
      </form>
    </div>
  </div>
</template>
