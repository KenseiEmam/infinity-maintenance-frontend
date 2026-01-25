<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useUserStore } from '@/stores/users'
import { onMounted, ref } from 'vue'

const props = defineProps({
  visible: Boolean,
})
const loading = ref(true)
const emits = defineEmits(['close', 'submit'])

const meal = ref<number[]>([])
const user = ref<any>(undefined) // ✅ start empty
const errors = ref<any>({
  meal: ['', '', '', '', '', ''],
  user: '',
})

const userStore = useUserStore()
const validateForm = () => {
  errors.value = { meal: ['', '', '', '', '', ''], user: '' }

  if (!user.value) {
    errors.value.user = 'Please state your user!'
  }
  for (let i = 0; i < user.value.noMeals; i++) {
    if (!meal.value[i]) {
      errors.value.meal[i] =
        i < 5 ? `Please choose your ${i + 1} meal!` : 'Please state your snack meal!'
    }
  }

  // return true if no errors
  return !errors.value.meal.some((m: string) => m) && !errors.value.user
}

onMounted(() => {
  userStore.fetchUsers({ role: 'ENGINEER' }, 1, 10000).then(() => {
    loading.value = false
  })
})

const submitForm = async () => {
  if (!validateForm()) return

  emits('submit', {
    EngineerId: user.value.id,
  })

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
      v-if="userStore.users && !loading"
      class="card bg-primary-background rounded-lg shadow p-6"
    >
      <h2 class="contentH-small">Assign a Engineer to this Order</h2>
      <p class="text-body mb-4">
        Choose your preferred Engineer from the list below to assign him to this order!
      </p>
      <form @submit.prevent="submitForm">
        <div>
          <!-- Type field -->
          <div class="mb-4">
            <label for="type" class="block text-sm font-medium"> Customer User </label>
            <select
              id="type"
              v-model="user"
              class="chef-text-input"
              :class="{ 'border-red-500': errors.type }"
            >
              <option :value="undefined" disabled>Select Engineer</option>
              <option v-for="users in userStore.users" :key="users.id" :value="users">
                {{ users.name }} | {{ users.email }} .
              </option>
            </select>
            <span v-if="errors.type" class="text-red-500 text-sm">{{ errors.type }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="col-span-2 flex justify-end">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-lg bg-red-500 border-red-500 hover:bg-red-400 rounded mr-2"
          >
            Cancel
          </button>
          <button type="submit" class="btn-lg rounded">Assign Engineer</button>
        </div>
      </form>
    </div>
    <p v-else class="text-body text-center animate pulse">Loading Users</p>
  </div>
</template>
