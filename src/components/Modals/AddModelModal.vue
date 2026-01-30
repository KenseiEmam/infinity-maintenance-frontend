<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
  manufacturers: { type: Array as () => any[], required: true },
})

const emits = defineEmits(['close', 'submit'])

const model = ref({
  name: '',
  manufacturerId: '',
})

const errors = ref<any>({})

const validateForm = () => {
  errors.value = {}
  if (!model.value.name) errors.value.name = 'Model name required'
  if (!model.value.manufacturerId) errors.value.manufacturerId = 'Manufacturer required'
  return Object.keys(errors.value).length === 0
}

const submitForm = () => {
  if (!validateForm()) return

  emits('submit', {
    name: model.value.name,
    manufacturerId: model.value.manufacturerId,
  })

  model.value = { name: '', manufacturerId: '' }
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
    style="background-color: #000000aa"
  >
    <div v-if="loading" class="card w-full max-w-md text-center">
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin mx-auto"
      ></div>
      <p class="mt-2 animate-pulse">Saving model...</p>
    </div>

    <div v-else class="card bg-primary-background rounded-lg shadow p-6 w-full max-w-md">
      <h2 class="contentH-small mb-4">Add Model</h2>

      <form @submit.prevent="submitForm" class="space-y-4 w-full">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium">Model Name</label>
          <input v-model="model.name" class="infinity-text-input" placeholder="e.g. X200 Pro" />
          <span v-if="errors.name" class="text-red-500 text-sm">
            {{ errors.name }}
          </span>
        </div>

        <!-- Manufacturer -->
        <div>
          <label class="block text-sm font-medium">Manufacturer</label>
          <select v-model="model.manufacturerId" class="infinity-text-input">
            <option value="" disabled>Select manufacturer</option>
            <option v-for="m in manufacturers" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
          <span v-if="errors.manufacturerId" class="text-red-500 text-sm">
            {{ errors.manufacturerId }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="btn-lg-outline" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-lg">Add Model</button>
        </div>
      </form>
    </div>
  </div>
</template>
