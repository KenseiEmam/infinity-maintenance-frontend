<script setup lang="ts">
import LoginForm from '@/components/Forms/LoginForm.vue'
import RegisterForm from '@/components/Forms/RegisterForm.vue'
import { useUserStore } from '@/stores/users'
import router from '@/router'
import { onMounted, ref } from 'vue'
import ForgotPassword from '@/components/Forms/ForgotPassword.vue'
const loading = ref(true)
const noAdmin = ref(true)
const forgotPassword = ref(false)
const userStore = useUserStore()
onMounted(() => {
  if (localStorage.getItem('LoggedInUser') && localStorage.getItem('UserID')) {
    router.push({ name: 'dashboard-home' })
  }
  userStore.fetchUsers({ role: 'ADMIN' }).then(() => {
    if (userStore.totalCount === 0 && !userStore.totalCount) {
      console.log('Register First Admin')
    } else {
      noAdmin.value = false
    }
    loading.value = false
  })
})
</script>
<template>
  <section class="container flex flex-col h-screen items-center justify-center gap-4">
    <div class="card text-center items-center w-full">
      <img src="@/assets/logo.png" class="w-12 mb-3" alt="" />
      <h1 class="title-small">INFINITY MEDICALS</h1>
      <p class="header-medium">Service Portal</p>
    </div>
    <div v-if="loading" class="card text-center items-center w-full space-y-4">
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading chunks..</p>
    </div>
    <div v-else-if="forgotPassword" class="card text-center items-center w-full">
      <ForgotPassword />
    </div>
    <div v-else-if="!noAdmin" class="card text-center items-center w-full">
      <LoginForm @forgot="forgotPassword = true" />
    </div>
    <div v-else class="card text-center items-center w-full">
      <h3 class="contentH-small">Register Admin:</h3>
      <p class="text-sm text-teritiary">
        As this is your first time exploring this dashboard, we require that you register at least
        one admin!
      </p>
      <RegisterForm />
    </div>
  </section>
</template>
