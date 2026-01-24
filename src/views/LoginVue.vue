<script setup lang="ts">
import LoginForm from '@/components/Forms/LoginForm.vue';

</script>
<template>
  <section class="container flex flex-col h-screen items-center justify-center gap-4">
    <div class="card text-center items-center w-full">
      <h1 class="title-small">INTFINITY MEDICALS</h1>
      <p class="header-small">Service Portal</p>
    </div>
    <div class="card text-center items-center w-full">
      <LoginForm/>
    </div>
  </section>
</template>
