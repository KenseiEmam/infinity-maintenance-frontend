<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/users'
import router from '@/router'

const email = ref('')
const loading = ref(false)
const userStore = useUserStore()

const handleForgot = async () => {
  loading.value = true
  userStore.forgotPassword(email.value).then(() => {
    loading.value = false
    router.push({ name: 'Login' })
  })
}
</script>

<template>
  <div class="w-full">
    <form class="space-y-3" @submit.prevent="handleForgot">
      <div class="form-control text-left w-full">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          class="infinity-text-input w-full"
          type="email"
          placeholder="infinity@example.com"
          required
        />
      </div>

      <input
        type="submit"
        class="btn-lg w-full"
        :value="loading ? 'Loading' : 'Send Email'"
        :disabled="loading"
      />
    </form>
  </div>
</template>
