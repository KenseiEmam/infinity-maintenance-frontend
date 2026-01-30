<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useUserStore } from '@/stores/users'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  visible: boolean
  loading?: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { assignedToId: string }): void
}>()

const userStore = useUserStore()
const assignedToId = ref('')
const errors = ref<{ assignedToId?: string }>({})
const loadingEngineers = ref(true)

onMounted(() => {
  userStore.fetchUsers({ role: 'ENGINEER' }).finally(() => {
    loadingEngineers.value = false
  })
})

const validateForm = () => {
  errors.value = {}
  if (!assignedToId.value) {
    errors.value.assignedToId = 'Engineer is required'
  }
  return Object.keys(errors.value).length === 0
}

const submitForm = () => {
  if (!validateForm()) return

  emits('submit', { assignedToId: assignedToId.value })

  assignedToId.value = ''
}
</script>

<template>
  <div
    v-if="props.visible"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
    style="background-color: #000000aa"
  >
    <div
      v-if="loading || loadingEngineers"
      class="card text-center items-center w-full space-y-4 max-w-md"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm animate-pulse">Loading engineers...</p>
    </div>

    <div v-else class="card bg-primary-background rounded-lg shadow p-6 mx-3 w-full max-w-md">
      <h2 class="contentH-small">Assign Engineer</h2>
      <p class="text-body mb-4">Select an engineer to assign this call.</p>

      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-sm font-medium">Engineer</label>
          <select
            v-model="assignedToId"
            class="infinity-text-input"
            :class="{ 'border-red-500': errors.assignedToId }"
          >
            <option value="" disabled>Select an engineer</option>
            <option v-for="engineer in userStore.users" :key="engineer.id" :value="engineer.id">
              {{ engineer.name }}
            </option>
          </select>
          <span v-if="errors.assignedToId" class="text-red-500 text-sm">
            {{ errors.assignedToId }}
          </span>
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" class="btn-lg-outline" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-lg">Assign Engineer</button>
        </div>
      </form>
    </div>
  </div>
</template>
