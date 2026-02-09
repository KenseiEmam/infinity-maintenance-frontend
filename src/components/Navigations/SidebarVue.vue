<template>
  <header
    class="flex static md:flex-col justify-center w-full md:w-auto z-50 align-center gap-8 md:h-screen bg-primary-background md:bg-primary md:text-white md:py-12 md:px-6"
  >
    <!-- Desktop Nav -->
    <nav
      :key="reRend"
      class="mx-auto dark md:flex md:h-full flex-col hidden mt-0 text-sm md:text-base max-w-44"
    >
      <div class="flex gap-3">
        <img src="@/assets/logo.png" class="w-6" alt="" />
        <div class="flex-1">
          <h2 class="header-small">Infinity Medicals</h2>
          <h3 class="subheader-small text-dark-sectext/60">Service Portal</h3>
        </div>
      </div>

      <div class="2xl:gap-8 gap-4 my-16 2xl:my-32 flex flex-col">
        <RouterLink
          :to="{ name: 'dashboard-home' }"
          class="flex gap-4 items-center hover:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            class="w-4"
          >
            <path
              d="M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"
            />
          </svg>
          <p>Home</p>
        </RouterLink>
        <RouterLink
          :to="{ name: 'users' }"
          v-if="userStore.loggedInUser?.role === 'ADMIN'"
          class="flex gap-4 items-center hover:opacity-60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            fill="currentColor"
            class="w-4"
          >
            <path
              d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"
            />
          </svg>
          <p>Users</p>
        </RouterLink>
        <RouterLink :to="{ name: 'job-sheets' }" class="flex gap-4 items-center hover:opacity-60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill="currentColor"
            class="w-4"
          >
            <path
              d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-277.5c0-17-6.7-33.3-18.7-45.3L258.7 18.7C246.7 6.7 230.5 0 213.5 0L64 0zM325.5 176L232 176c-13.3 0-24-10.7-24-24L208 58.5 325.5 176z"
            />
          </svg>

          <p>Service Reports</p>
        </RouterLink>
        <RouterLink :to="{ name: 'calls' }" class="flex gap-4 items-center hover:opacity-60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            class="w-4"
          >
            <path
              d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z"
            />
          </svg>
          <p>Calls</p>
        </RouterLink>
        <RouterLink :to="{ name: 'customers' }" class="flex gap-4 items-center hover:opacity-60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            class="w-4"
          >
            <path
              d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM165.4 321.9c20.4 28 53.4 46.1 90.6 46.1s70.2-18.1 90.6-46.1c7.8-10.7 22.8-13.1 33.5-5.3s13.1 22.8 5.3 33.5C356.3 390 309.2 416 256 416s-100.3-26-129.4-65.9c-7.8-10.7-5.4-25.7 5.3-33.5s25.7-5.4 33.5 5.3zM144 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
            />
          </svg>
          <p>Customers</p>
        </RouterLink>
        <RouterLink :to="{ name: 'visits' }" class="flex gap-4 items-center hover:opacity-60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="currentColor"
            class="w-4"
          >
            <path
              d="M128 0C110.3 0 96 14.3 96 32l0 32-32 0C28.7 64 0 92.7 0 128l0 48 448 0 0-48c0-35.3-28.7-64-64-64l-32 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32-128 0 0-32c0-17.7-14.3-32-32-32zM0 224L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192-448 0z"
            />
          </svg>
          <p>Visits</p>
        </RouterLink>
        <RouterLink :to="{ name: 'machines' }" class="flex gap-4 items-center hover:opacity-60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            class="w-4"
          >
            <path
              d="M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z"
            />
          </svg>
          <p>Machines</p>
        </RouterLink>
      </div>

      <div class="gap-4 2xl:gap-8 flex flex-col text-white text-left mt-auto">
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
            <button @click="handleLogout" class="py-2 text-center btn-lg-outline">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Header -->
    <div class="md:hidden w-full px-4 pt-4 pb-2 bg-secondary-background/60 backdrop-blur-lg shadow">
      <div class="flex justify-between items-center text-center text-primary">
        <div class="flex gap-3 text-left">
          <img src="@/assets/logo.png" class="h-10" alt="" />
          <div class="flex-1 text-base">
            <h2 class="font-black">Infinity Medicals</h2>
            <p class="font-semibold text-secondary text-sm">Service Portal</p>
          </div>
        </div>

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
          class="mobile-nav card fixed z-50 top-16 left-5 right-5 bg-secondary-background p-4 my-4 rounded-lg"
          role="navigation"
          aria-label="Mobile Navigation"
        >
          <!-- mirrored links (same order as desktop) -->
          <div class="flex flex-col gap-3 w-full">
            <RouterLink
              :to="{ name: 'dashboard-home' }"
              class="text-base block py-2 btn-lg-outline text-center"
              >Home</RouterLink
            >
            <RouterLink
              :to="{ name: 'users' }"
              class="text-base block py-2 btn-lg-outline text-center"
              >Users</RouterLink
            >
            <RouterLink
              :to="{ name: 'job-sheets' }"
              class="text-base block py-2 btn-lg-outline text-center"
              >Service Reports</RouterLink
            >
            <RouterLink
              :to="{ name: 'calls' }"
              class="text-base block py-2 btn-lg-outline text-center"
              >Calls</RouterLink
            >

            <RouterLink
              :to="{ name: 'customers' }"
              class="text-base block py-2 btn-lg-outline text-center"
              >Customers</RouterLink
            >
            <RouterLink
              :to="{ name: 'visits' }"
              class="text-base block py-2 btn-lg-outline text-center"
              >Visits</RouterLink
            >
            <RouterLink
              :to="{ name: 'machines' }"
              class="text-base block py-2 btn-lg-outline text-center"
              >Machines</RouterLink
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
              <button @click="handleLogout" class="py-2 text-center btn-lg">Logout</button>
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
  if (userId) {
    userStore.fetchLogin(userId)
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
  color: #5f7a99 !important;
}
/* small visual polish — keep your existing design tokens */
.mobile-nav .btn-lg,
.mobile-nav .btn-lg-outline {
  width: 100%;
  justify-content: center;
}
</style>
