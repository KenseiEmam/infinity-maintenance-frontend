<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

import SidebarVue from './components/Navigations/SidebarVue.vue'

const route = useRoute()

// List of auth routes where we don't want header/footer
const authRoutes = [
  '/dashboard/login',
  '/dashboard/forgot',
  '/dashboard/password',
  'login',
  'forgot',
  'password',
  'register',
  'verify',
]

// Make them reactive
const isAuth = computed(() => authRoutes.includes(route.path))
const isDashboard = computed(() => route.path.startsWith('/dashboard'))
</script>

<template>
  <div
    v-if="!isAuth && isDashboard"
    class="md:flex-row flex flex-col w-full h-screen w-screen overflow-hidden bg-primary-background relative"
  >
    <SidebarVue />
    <div
      class="content-box flex-1 md:py-20 py-10 max-h-screen overflow-y-auto text-center md:text-left"
    >
      <RouterView />
    </div>
  </div>
  <div v-else class="w-full min-h-screen max-w-screen bg-primary-background">
    <!-- Only render header/footer if not dashboard or auth routes -->
    <div>
      <RouterView />
    </div>
  </div>
</template>
