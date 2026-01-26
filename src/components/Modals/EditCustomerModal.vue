<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
  customerData: Object as () => {
    id: string
    name: string
    address?: string
    phone?: string
  } | null,
})

const emits = defineEmits(['close', 'update'])

const customer = ref({
  id: '',
  name: '',
  address: '',
  phone: '',
})

const errors = ref<any>({})

// When modal opens or customerData changes, pre-fill the form
watch(
  () => props.customerData,
  (newVal) => {
    if (newVal) {
      customer.value = {
        id: newVal.id,
        name: newVal.name,
        address: newVal.address || '', // ensure string
        phone: newVal.phone || '', // ensure string
      }
    } else {
      customer.value = { id: '', name: '', address: '', phone: '' }
    }
  },
  { immediate: true },
)

const validateForm = () => {
  errors.value = {}
  if (!customer.value.name) errors.value.name = 'Please provide a customer name!'
  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return

  // Emit update event with form data
  emits('update', { ...customer.value })

  // Optionally reset form
  // customer.value = { id: '', name: '', address: '', phone: '' }
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 max-h-screen overflow-y-auto"
    style="background-color: #000000aa"
  >
    <div v-if="props.loading" class="card text-center items-center w-full space-y-4 max-w-128">
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading...</p>
    </div>

    <div v-else class="card bg-primary-background rounded-lg shadow p-6 mx-3 w-full max-w-md">
      <h2 class="contentH-small mb-2">Edit Customer</h2>
      <form @submit.prevent="submitForm" class="w-full gap-6">
        <!-- Name -->
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            v-model="customer.name"
            class="chef-text-input"
            placeholder="e.g. John Doe"
            :class="{ 'border-red-500': errors.name }"
          />
          <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
        </div>

        <!-- Address -->
        <div class="mb-4">
          <label for="address" class="block text-sm font-medium">Address</label>
          <input
            type="text"
            id="address"
            v-model="customer.address"
            class="chef-text-input"
            placeholder="e.g. 123 Street, City"
          />
        </div>

        <!-- Phone -->
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium">Phone</label>
          <input
            type="text"
            id="phone"
            v-model="customer.phone"
            class="chef-text-input"
            placeholder="e.g. +971501234567"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="btn-lg-outline rounded">
            Cancel
          </button>
          <button type="submit" class="btn-lg rounded">Update Customer</button>
        </div>
      </form>
    </div>
  </div>
</template>
