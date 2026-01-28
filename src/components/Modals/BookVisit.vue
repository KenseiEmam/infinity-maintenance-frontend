<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useMachineStore } from '@/stores/machineStore'
import { onMounted, ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
})
const loadingMachs = ref(true)
const emits = defineEmits(['close', 'submit'])

const user = ref<any>(undefined) // ✅ start empty
const errors = ref<any>({
  user: '',
})

const machineStore = useMachineStore()
const validateForm = () => {
  errors.value = { meal: ['', '', '', '', '', ''], user: '' }

  if (!user.value) {
    errors.value.user = 'Please state your user!'
  }

  // return true if no errors
  return !errors.value.meal.some((m: string) => m) && !errors.value.user
}

onMounted(() => {
  machineStore.fetchMachines({}, 1, 10000).then(() => {
    loadingMachs.value = false
  })
})

const submitForm = async () => {
  if (!validateForm()) return

  emits('submit', user.value.id)

  // Reset the form

  user.value = undefined
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-100 max-h-screen overflow-y-auto"
    style="background-color: #000000aa"
  >
    <div
      v-if="machineStore.machines && !loadingMachs && !loading"
      class="card bg-primary-background rounded-lg shadow p-6"
    >
      <h2 class="contentH-small">Assign a Machine to this Visit</h2>
      <p class="text-body mb-4">Choose the machine related to this visit!</p>
      <form @submit.prevent="submitForm" class="w-full">
        <div>
          <!-- Type field -->
          <div class="mb-4">
            <label for="type" class="block text-sm font-medium"> Machine User </label>
            <select
              id="type"
              v-model="user"
              class="chef-text-input"
              :class="{ 'border-red-500': errors.type }"
            >
              <option :value="undefined" disabled>Select Machine</option>
              <option v-for="machine in machineStore.machines" :key="machine.id" :value="machine">
                {{ machine.serialNumber }} | {{ machine.customer.name }} .
              </option>
            </select>
            <span v-if="errors.type" class="text-red-500 text-sm">{{ errors.type }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="col-span-2 flex justify-end">
          <button type="button" @click="$emit('close')" class="btn-lg-outline mr-2">Cancel</button>
          <button type="submit" class="btn-lg">Book Visit</button>
        </div>
      </form>
    </div>
    <p v-else class="text-body text-center animate pulse">Loading Data...</p>
  </div>
</template>
