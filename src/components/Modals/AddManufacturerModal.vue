<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
})

const emits = defineEmits(['close', 'submit'])

const manufacturer = ref({
  name: '',
})

const errors = ref<any>({})

const validateForm = () => {
  errors.value = {}
  if (!manufacturer.value.name) errors.value.name = 'Manufacturer name required'
  return Object.keys(errors.value).length === 0
}

const submitForm = () => {
  if (!validateForm()) return

  emits('submit', manufacturer.value.name)

  manufacturer.value.name = ''
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
      <p class="mt-2 animate-pulse">Saving manufacturer...</p>
    </div>

    <div v-else class="card bg-primary-background rounded-lg shadow p-6 w-full max-w-md">
      <h2 class="contentH-small mb-4">Add Manufacturer</h2>

      <form @submit.prevent="submitForm" class="space-y-4 w-full">
        <div>
          <label class="block text-sm font-medium">Name</label>
          <input
            v-model="manufacturer.name"
            class="infinity-text-input"
            placeholder="e.g. Siemens"
          />
          <span v-if="errors.name" class="text-red-500 text-sm">
            {{ errors.name }}
          </span>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="btn-lg-outline" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-lg">Add Manufacturer</button>
        </div>
      </form>
    </div>
  </div>
</template>
