<script setup lang="ts">
import LoginForm from '@/components/Forms/LoginForm.vue';
import RegisterForm from '@/components/Forms/RegisterForm.vue';
import { useUserStore } from '@/stores/users';
import { onMounted , ref} from 'vue';
const loading =ref(true)
const noAdmin= ref(true)
const userStore =useUserStore()
onMounted(() => {
  if (localStorage.getItem('LoggedInUser') && localStorage.getItem('UserID')) {
    console.log("route dashboard")
  }
  userStore.fetchUsers({role:"ADMIN"}).then(()=>{
    if(userStore.totalCount === 0 && !userStore.totalCount)
  {
    console.log("Register First Admin")
  }
  else{
    noAdmin.value = false
  }
  loading.value =false
  }
)
})
</script>
<template>
  <section class="container flex flex-col h-screen items-center justify-center gap-4">
    <div class="card text-center items-center w-full">
      <h1 class="title-small">INTFINITY MEDICALS</h1>
      <p class="header-small">Service Portal</p>
    </div>
    <div v-if="loading" class="card text-center items-center w-full space-y-4">
     <div class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-center animate-pulse">Loading chunks..</p>
    </div>
    <div v-else-if="!noAdmin" class="card text-center items-center w-full">
      <LoginForm/>
    </div>
    <div v-else class="card text-center items-center w-full">
      <h3 class="contentH-small">Register Admin:</h3>
      <p class="text-sm text-teritiary">As this is your first time exploring this dashboard, we require that you register at least one admin!</p>
      <RegisterForm/>
    </div>
  </section>
</template>
