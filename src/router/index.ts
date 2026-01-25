import LoginVue from '@/views/LoginVue.vue'
import HomeView from '@/views/Dashboard/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import UsersList from '@/views/Dashboard/UsersList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'Login',
      meta: { requiresAntiAuth: true },
      component: LoginVue,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: LoginVue,
    },

    {
      path: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          name: 'dashboard-home',
          path: '',
          component: HomeView,
        },
        {
          name: 'users',
          path: 'users',
          component: UsersList,
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      return new Promise((resolve) => {
        let tries = 0
        const check = () => {
          const el = document.querySelector(to.hash!)
          if (el) resolve({ el: to.hash!, behavior: 'smooth' })
          else if (tries++ < 50) requestAnimationFrame(check)
          else resolve({ top: 0 })
        }
        check()
      })
    }

    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const token = localStorage.getItem('UserID')
  const role = localStorage.getItem('role') // ADMIN | ENGINEER

  // 🔐 Requires login
  if (to.meta.requiresAuth && !token) {
    return {
      path: '',
      query: { redirect: to.fullPath },
    }
  }

  // 🚫 Login page when already logged in
  if (to.meta.requiresAntiAuth && token) {
    return { path: '/dashboard' }
  }

  // 🛡 ADMIN only
  if (to.meta.requiresAdmin && role !== 'ADMIN') {
    return { path: '/dashboard' }
  }

  // 🧰 ENGINEER only
  if (to.meta.requiresEngineer && role !== 'ENGINEER') {
    return { path: '/dashboard' }
  }
})

router.afterEach((to) => {
  if (to.hash) {
    const el = document.querySelector(to.hash)
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 0)
    }
  }
})

export default router
