<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
})

const emits = defineEmits(['close', 'submit'])

const laser = ref({
  laserType: '',
  lampCounter: null as number | null,
  voltage: null as number | null,
})

const errors = ref<any>({})

const validateForm = () => {
  errors.value = {}
  if (!laser.value.laserType) errors.value.laserType = 'Laser type required'
  return Object.keys(errors.value).length === 0
}

const submitForm = () => {
  if (!validateForm()) return

  emits('submit', {
    laserType: laser.value.laserType,
    lampCounter: laser.value.lampCounter === null ? null : Number(laser.value.lampCounter),
    voltage: laser.value.voltage === null ? null : Number(laser.value.voltage),
  })

  laser.value = {
    laserType: '',
    lampCounter: null,
    voltage: null,
  }
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
      <p class="mt-2 animate-pulse">Saving laser data...</p>
    </div>

    <div v-else class="card bg-primary-background rounded-lg shadow p-6 w-full max-w-md">
      <h2 class="contentH-small mb-4">Add Laser Data</h2>

      <form @submit.prevent="submitForm" class="space-y-4 w-full">
        <div>
          <label class="block text-sm font-medium">Laser Type</label>
          <input v-model="laser.laserType" class="infinity-text-input" />
          <span v-if="errors.laserType" class="text-red-500 text-sm">
            {{ errors.laserType }}
          </span>
        </div>

        <div>
          <label class="block text-sm font-medium">Lamp Counter</label>
          <input type="number" v-model.number="laser.lampCounter" class="infinity-text-input" />
        </div>

        <div>
          <label class="block text-sm font-medium">Voltage</label>
          <input type="number" v-model.number="laser.voltage" class="infinity-text-input" />
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="btn-lg-outline" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-lg">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>
