<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
})

const emits = defineEmits(['close', 'submit'])

const sparePart = ref({
  itemName: '',
  quantity: 1,
  price: 0,
})

const errors = ref<any>({})

const validateForm = () => {
  errors.value = {}

  if (!sparePart.value.itemName) errors.value.itemName = 'Item name required'
  if (!sparePart.value.quantity || sparePart.value.quantity < 1)
    errors.value.quantity = 'Quantity required'
  if (
    sparePart.value.price === null ||
    sparePart.value.price === undefined ||
    sparePart.value.price < 0
  )
    errors.value.price = 'Price required'

  return Object.keys(errors.value).length === 0
}

const submitForm = () => {
  if (!validateForm()) return

  emits('submit', {
    itemName: sparePart.value.itemName,
    quantity: Number(sparePart.value.quantity),
    price: Number(sparePart.value.price),
  })

  sparePart.value = {
    itemName: '',
    quantity: 1,
    price: 0,
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
      <p class="mt-2 animate-pulse">Saving spare part...</p>
    </div>

    <div v-else class="card bg-primary-background rounded-lg shadow p-6 w-full max-w-md">
      <h2 class="contentH-small mb-4">Add Spare Part</h2>

      <form @submit.prevent="submitForm" class="space-y-4 w-full">
        <div>
          <label class="block text-sm font-medium">Item Name</label>
          <input v-model="sparePart.itemName" class="chef-text-input" />
          <span v-if="errors.itemName" class="text-red-500 text-sm">
            {{ errors.itemName }}
          </span>
        </div>

        <div>
          <label class="block text-sm font-medium">Quantity</label>
          <input type="number" v-model.number="sparePart.quantity" class="chef-text-input" />
          <span v-if="errors.quantity" class="text-red-500 text-sm">
            {{ errors.quantity }}
          </span>
        </div>

        <div>
          <label class="block text-sm font-medium">Price</label>
          <input type="number" v-model.number="sparePart.price" class="chef-text-input" />
          <span v-if="errors.price" class="text-red-500 text-sm">
            {{ errors.price }}
          </span>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="btn-lg-outline" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-lg">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>
