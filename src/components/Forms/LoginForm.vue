<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useUserStore } from '@/stores/users'

import userServices from '@/services/userServices'

const email = ref('')
const password = ref('')
const loading = ref(false)
const userStore = useUserStore()

const eyeSvg = ref('eye-closed')
const fieldType = ref<'password' | 'text'>('password')

function obfuscateToggle() {
  fieldType.value = fieldType.value === 'password' ? 'text' : 'password'
  eyeSvg.value = fieldType.value === 'password' ? 'eye-closed' : 'eye-open'
}



onMounted(() => {
  if (localStorage.getItem('LoggedInUser') && localStorage.getItem('UserID')) {
    console.log("route dashboard")
  }


})

const handleLogin = async () => {
  try {
    loading.value = true
    const { data, error } = await userServices.login({email:email.value, password:password.value})

    if (error) throw new Error(error)

    const returnedData = data.user

    await userStore.fetchLogin(returnedData).then(() => {
      // router.push({ name: 'home' })
      console.log("Logged In")
    })
  } catch (error: any) {
    alert(error.response?.data?.error || error.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <form class=" space-y-3 text-left dark:text-white" @submit.prevent="handleLogin">
      <div class="form-control">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          class="chef-text-input"
          type="email"
          placeholder="chef@example.com"
          required
        />
      </div>

      <div class="form-control relative">
        <label for="password">Password</label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            class="chef-text-input pr-10"
            :type="fieldType"
            placeholder="*******"
            required
          />
          <button
            type="button"
            @click="obfuscateToggle"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:opacity-30"
          >
            <img :src="`/${eyeSvg}.svg`" class="w-6 cursor-pointer" alt="toggle visibility" />
          </button>
        </div>
      </div>
      <div>
        <router-link :to="{ name: 'forgot-password' }" class="text-secondary">
          Forgotten Password
        </router-link>
      </div>

      <input
        type="submit"
        class="btn-lg w-full mt-8"
        :value="loading ? 'Loading' : 'Sign In'"
        :disabled="loading"
      />
    </form>
  </div>
</template>
