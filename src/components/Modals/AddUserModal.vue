<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
})

const emits = defineEmits(['close', 'submit'])

const user = ref({
  name: '',
  email: '',
  role: '',
})

const errors = ref<any>({})

const validateForm = () => {
  errors.value = {}

  if (!user.value.name) {
    errors.value.name = 'Please state your user name!'
  }

  if (!user.value.email) {
    errors.value.email = 'Please state your user email!'
  }

  if (!user.value.role) {
    errors.value.role = 'Please state your user goal!'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return

  // Emit the form data with the photo URL
  emits('submit', {
    ...user.value,
  })

  // Reset the form
  user.value = {
    name: '',
    email: '',
    role: 'ENGINEER',
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
      <p class="text-sm text-center animate-pulse">Loading user invitation..</p>
    </div>
    <div v-else class="card bg-primary-background rounded-lg shadow p-6 mx-3">
      <h2 class="contentH-small">Invite user</h2>
      <p class="text-body mb-4">
        Fill in the required details and submit to invite user to your system!
      </p>
      <form v-if="!loading" @submit.prevent="submitForm" class="w-full gap-6">
        <!-- user Photo Field -->

        <div class="w-full">
          <!-- user Name Field -->
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium">Name</label>
            <input
              role="text"
              id="name"
              v-model="user.name"
              class="infinity-text-input"
              required
              placeholder="example: John Doe"
              :class="{ 'border-red-500': errors.name }"
            />
            <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
          </div>

          <!-- user email Field -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium">Email</label>
            <input
              role="text"
              id="email"
              v-model="user.email"
              class="infinity-text-input"
              required
              placeholder="example: example@infinitymedicals.ae"
              :class="{ 'border-red-500': errors.email }"
            />
            <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
          </div>
          <!-- role Field -->
          <div class="mb-4">
            <label for="user" class="block text-sm font-medium">User Role</label>
            <select id="role" v-model="user.role" class="infinity-text-input" required>
              <option value="" disabled>Select role</option>
              <option value="ENGINEER">Engineer</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="gap-2 flex justify-end flex-col md:flox-row">
          <button role="button" @click="$emit('close')" class="btn-lg-outline rounded mr-2">
            Cancel
          </button>
          <button role="submit" class="btn-lg rounded">Add user</button>
        </div>
      </form>
      <div
        v-else
        class="h-full flex flex-col gap-2 items-center justify-center text-center w-full text-body"
      >
        <p class="text-lg animate-pulse">Loading</p>
      </div>
    </div>
  </div>
</template>
