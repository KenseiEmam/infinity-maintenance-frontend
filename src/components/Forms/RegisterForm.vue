<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import router from '@/router'
import Swal from 'sweetalert2'

import { useUserStore } from '@/stores/users'



const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')


const userStore = useUserStore()






// Password validation
const isPasswordValid = ref(false)
const doPasswordsMatch = computed(() => password.value === confirmPassword.value)
const canSubmit = computed(() => isPasswordValid.value && doPasswordsMatch.value)

function validatePassword() {
  const hasNumber = /\d/.test(password.value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
  const isLongEnough = password.value.length >= 8
  const notSimilarToEmail = !email.value || !email.value.includes(password.value)
  isPasswordValid.value = hasNumber && hasSpecialChar && isLongEnough && notSimilarToEmail
}

const loading = ref(false)




async function signUpNewUser() {
  if (!canSubmit.value) {
    Swal.fire('Error', 'Please meet all requirements before submitting', 'error')
    return
  }

  loading.value = true

  try {
    // Call backend signup endpoint
    const response = await userStore.createAdmin({
      email: email.value,
      password: password.value,
      name: fullName.value
    })

    const createdUser = response.data

    if (!createdUser) throw new Error('User creation failed')

    // Auto-login after signup
    userStore.fetchLogin(createdUser.id)

    Swal.fire('Success', 'Account created successfully', 'success')

    // Reset form
    fullName.value = ''
    email.value = ''
    password.value = ''

    router.push({ name: 'login' })
  } catch (error: any) {
    Swal.fire('Error', error?.response?.data?.error || 'Signup failed', 'error')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="w-full text-left">
    <form class="space-y-3 dark:text-white" @submit.prevent="signUpNewUser">
      <div class="2xl:flex gap-3">
        <div class="w-full space-y-3">
          <!-- Full Name Field -->
          <div class="form-control">
            <label for="full-name" class="block text-sm font-medium"> Full Name </label>
            <input
              id="full-name"
              v-model="fullName"
              class="chef-text-input bg-primary-background "
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

          <!-- Email Field -->
          <div class="form-control">
            <label for="email" class="block text-sm font-medium"> Email </label>
            <input
              id="email"
              v-model="email"
              class="chef-text-input bg-primary-background "
              type="email"
              placeholder="chef@example.ae"
              required
            />
          </div>

          <!-- Password Field -->
          <div class="form-control">
            <label for="password" class="block text-sm font-medium"> Password </label>
            <input
              id="password"
              v-model="password"
              class="chef-text-input bg-primary-background "
              type="password"
              placeholder="Enter your password"
              required
              @input="validatePassword"
            />
          </div>

          <!-- Confirm Password Field -->
          <div class="form-control">
            <label for="confirm-password" class="block text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              class="chef-text-input bg-primary-background "
              type="password"
              placeholder="Re-enter your password"
              required
            />
            <ul
              class="list-disc text-sm mt-2 ml-6 text-left"
              :class="{ 'text-red-300': !isPasswordValid }"
            >
              <li>At least 8 characters</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
            <ul
              class="list-disc text-sm mt-2 ml-6 text-left"
              :class="{ 'text-red-300': !doPasswordsMatch }"
            >
              <li>Passwords don't match</li>
            </ul>
          </div>
        </div>
      </div>


      <!-- Submit Button -->
      <input
        type="submit"
        class="btn-lg w-full mt-8"
        :value="loading ? 'Loading' : 'Sign Up'"
        :disabled="loading || !canSubmit"
      />
    </form>
  </div>
</template>
