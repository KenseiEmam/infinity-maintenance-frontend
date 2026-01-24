<template>
  <header
    class="flex md:flex-col justify-center w-full md:w-auto z-50 overflow-y-auto align-center gap-8 md:h-screen bg-primary-background md:bg-primary md:text-white md:py-6 py-0 md:px-6"
  >
    <!-- Desktop Nav -->
    <nav
      :key="reRend"
      class="mx-auto dark md:flex md:h-full flex-col justify-between hidden mt-0 text-sm md:text-base"
    >
      <div class="contentH-large">
        <ChefLogo />
      </div>
      <div class="2xl:gap-8 gap-4 my-auto flex flex-col">
        <RouterLink
          :to="{ name: 'Login' }"
          class="flex gap-4 items-center hover:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            class="w-6"
          >
            <path
              d="M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"
            />
          </svg>
          <p class="text-sm 2xl:text-lg">Home</p>
        </RouterLink>

      </div>

      <div class="gap-4 2xl:gap-8 flex flex-col text-white text-left">
        <div
          v-if="userStore.loggedInUser && checkUser()"
          class="md:flex flex-col hidden relative 2xl:gap-4 min-w-max"
        >
          <div
            class="text-body flex gap-4 items-center hover:opacity-60 text-lg border-secondary-text py-2"
          >
            <div>
              <p class="text-dark-sectext text-xs">Logged in as</p>
              <p class="text-dark-text">
                {{ userStore.loggedInUser.name }}
              </p>
            </div>
          </div>

          <div
            class="flex-col top-22 rounded-xl bg-primary w-full flex gap-3 justify-center text-left"
          >
            <button @click="$router.push({ name: 'home' })" class="py-2 btn-lg">
              Back to Site
            </button>
            <button @click="handleLogout" class="py-2 text-center btn-lg-outline">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Header -->
    <div class="md:hidden w-full px-4">
      <div class="flex justify-between items-center text-center text-primary">
        <ChefLogo />

        <div class="flex items-center gap-4">
          <button
            @click="toggleMobileMenu"
            class="text-2xl p-2"
            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
          >
            <span v-if="!isMobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>
        </div>
      </div>

      <!-- slide-down mobile nav -->
      <transition name="slide-down">
        <nav
          v-show="isMobileMenuOpen"
          id="mobile-nav"
          class="mobile-nav card absolute left-5 right-5 top-24 bottom-5 bg-background/60 backdrop-blur-lg p-4 my-4 rounded-lg"
          role="navigation"
          aria-label="Mobile Navigation"
        >
          <!-- mirrored links (same order as desktop) -->
          <div class="flex flex-col gap-3 w-full">
            <RouterLink :to="{ name: 'Login' }" class="text-base block py-2"
              >Home</RouterLink
            >

          </div>

          <hr class="my-3 border-secondary-text" />

          <div
            v-if="userStore.loggedInUser && checkUser()"
            class="flex flex-col gap-3 w-full card bg-primary-background"
          >
            <div class="flex items-center gap-3">
              <img
                :src="
                  userStore.loggedInUser.avatar ||
                  'https://pexviywnztvqomfosvho.supabase.co/storage/v1/object/public/storage/avatars/default-avatar.png'
                "
                class="w-12 h-12 border border-primary-background ring-2 ring-primary rounded-full object-cover"
                alt="Avatar"
              />
              <div>
                <p class="text-secondary-text text-xs">Logged in as</p>
                <p class="text-primary-text">
                  {{ userStore.loggedInUser.name }}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <button @click="$router.push({ name: 'home' })" class="py-2 btn-lg">
                Back to Site
              </button>
              <button @click="handleLogout" class="py-2 text-center btn-lg-outline">Logout</button>
            </div>
          </div>
        </nav>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/users'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()
const reRend = ref(0)
const userStore = useUserStore()
const Menu = ref(false)
const isMobileMenuOpen = ref(false)
const logoShimmer = ref(false)
watch(
  userStore,
  () => {
    reRend.value++
    Menu.value = false
  },
  { deep: true },
)

watch(
  () => route.fullPath,
  () => {
    console.log(route.fullPath)
    Menu.value = false
    isMobileMenuOpen.value = false
  },
)
onMounted(() => {
  setInterval(() => {
    logoShimmer.value = true
    setTimeout(() => {
      logoShimmer.value = false
    }, 1200) // matches shimmer duration
  }, 10000) // shimmer every 10 seconds

  const userId = localStorage.getItem('UserID')
  if (userId && localStorage.getItem('loggedInUser')) {
    userStore.fetchLogin(userId )
  }
})

// prevent background scroll while mobile menu is open
watch(isMobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

// cleanup just in case
onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function checkUser() {
  return !!localStorage.getItem('UserID')
}
function handleLogout() {
  userStore.logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

/* overlay style */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 48;
}

/* mobile nav itself */
.mobile-nav {
  z-index: 50;
}

/* slide-down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 220ms ease;
}
.slide-down-enter-from {
  transform: translateY(-8px);
  opacity: 0;
}
.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-down-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

/* fade for overlay & small fades */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.dark a {
  color: white;
}
.router-link-exact-active {
  color: #bccf19 !important;
}
/* small visual polish — keep your existing design tokens */
.mobile-nav .btn-lg,
.mobile-nav .btn-lg-outline {
  width: 100%;
  justify-content: center;
}
</style>
