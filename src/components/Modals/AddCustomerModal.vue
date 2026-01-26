<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
})

const emits = defineEmits(['close', 'submit'])

// Customer form
const customer = ref({
  name: '',
  address: '',
  phone: '',
})

const errors = ref<any>({})

// Form validation
const validateForm = () => {
  errors.value = {}
  if (!customer.value.name) errors.value.name = 'Customer name is required'
  return Object.keys(errors.value).length === 0
}

// Submit
const submitForm = () => {
  if (!validateForm()) return

  emits('submit', { ...customer.value })

  // Reset form
  customer.value = {
    name: '',
    address: '',
    phone: '',
  }
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 max-h-screen overflow-y-auto"
    style="background-color: #000000aa"
  >
    <div v-if="loading" class="card text-center items-center w-full space-y-4 max-w-128">
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Creating customer...</p>
    </div>

    <div v-else class="card bg-primary-background rounded-lg shadow p-6 mx-3 w-full max-w-128">
      <h2 class="contentH-small">Create Customer</h2>
      <p class="text-body mb-4">Fill in the details to create a new customer.</p>

      <form @submit.prevent="submitForm" class="w-full gap-6">
        <div class="mb-4">
          <label class="block text-sm font-medium">Customer Name</label>
          <input
            v-model="customer.name"
            class="chef-text-input"
            placeholder="Enter customer name"
            :class="{ 'border-red-500': errors.name }"
            required
          />
          <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium">Address (Optional)</label>
          <input v-model="customer.address" class="chef-text-input" placeholder="Enter address" />
        </div>
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
        <div class="gap-2 flex justify-end flex-col md:flex-row">
          <button type="button" @click="$emit('close')" class="btn-lg-outline rounded mr-2">
            Cancel
          </button>
          <button type="submit" class="btn-lg rounded">Create Customer</button>
        </div>
      </form>
    </div>
  </div>
</template>
