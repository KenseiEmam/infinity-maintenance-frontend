<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  visible: Boolean,
})

const emits = defineEmits(['close', 'submit'])

const reason = ref('')
const errors = ref<any>({
  reason: '',
})

const validateForm = () => {
  errors.value = { reason: '' }

  if (!reason.value) {
    errors.value.reason = 'Please state your reason for cancellation!'
  }

  // return true if no errors
  return !errors.value.reason
}

const submitForm = async () => {
  if (!validateForm()) return

  emits('submit', {
    reason: reason.value,
  })

  // Reset the form
  reason.value = ''
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 max-h-screen overflow-y-auto"
    style="background-color: #000000aa"
  >
    <div
      class="card bg-primary-background rounded-lg shadow p-6 overflow-y-auto"
      style="max-height: 80vh"
    >
      <h2 class="contentH-small">Cancel Meal Plan?</h2>
      <p class="text-body mb-4 max-w-128">
        Before cancelling your meal plan we would like to understand what leads you here! We will be
        in contact with you and issue refunds if need be!
      </p>
      <form @submit.prevent="submitForm">
        <div>
          <!-- Reasoning field -->
          <div class="mb-4">
            <label for="type" class="block text-sm font-medium"> Reasoning:</label>
            <textarea
              name="reasons"
              class="w-full my-3 chef-text-input"
              placeholder="Enter why you would like to part with this plan!"
              rows="5"
              v-model="reason"
            ></textarea>
            <span v-if="errors.reason" class="text-red-500 text-sm">{{ errors.reason }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="col-span-2 flex justify-end">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-lg bg-red-500 border-red-500 hover:bg-red-400 rounded mr-2"
          >
            Return
          </button>
          <button type="submit" class="btn-lg rounded">Submit Request</button>
        </div>
      </form>
    </div>
  </div>
</template>
