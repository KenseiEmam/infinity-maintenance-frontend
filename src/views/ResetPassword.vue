<script setup lang="ts">
import { useUserStore } from '@/stores/users'
import router from '@/router'
import { onMounted, ref } from 'vue'
import SetupForm from '@/components/Forms/SetupForm.vue'
const loading = ref(true)
const noAdmin = ref(true)
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
      <h1 class="title-small">INTFINITY MEDICALS</h1>
      <p class="header-medium">Service Portal</p>
    </div>
    <div v-if="loading" class="card text-center items-center w-full space-y-4">
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading chunks..</p>
    </div>
    <div v-else class="card text-center items-center w-full">
      <h3 class="contentH-small">ResetPassword:</h3>
      <p class="text-sm text-teritiary">
        You have been asked to reet your password, enter a valid password below!
      </p>
      <SetupForm />
    </div>
  </section>
</template>
