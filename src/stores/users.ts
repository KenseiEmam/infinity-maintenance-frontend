/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import userServices from '@/services/userServices'

function showError(message: string) {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error',
    toast: true,
    position: 'top-right',
    timer: 2000,
    showConfirmButton: false,
  })
}

function showSuccess(message: string) {
  Swal.fire({
    title: 'Success',
    text: message,
    icon: 'success',
    toast: true,
    position: 'top-right',
    timer: 2000,
    showConfirmButton: false,
  })
}

export interface User {
  id?: string
  name?: string
  email?: string
  role?: string
  avatar?: string | null
  createdAt?: string
  updatedAt?: string
}

type Filters = {
  role?: string
  name?: string
}

export const useUserStore = defineStore('user', () => {
  const loggedInUser = ref<User | null>(null)
  const userDetail = ref<User | null>(null)
  const users = ref<User[]>([])
  const totalCount = ref(0)
  const token = ref<string | null>(localStorage.getItem('token'))

  /* ================= AUTH ================= */
  async function fetchLogin(id: string) {
    try {
      const { data } = await userServices.fetchUser(id)
      loggedInUser.value = data
      return data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to fetch user')
    }
  }
  async function login(email: string, password: string) {
    try {
      const { data } = await userServices.login({ email, password })

      loggedInUser.value = data.user
      token.value = data.token

      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)

      showSuccess('Logged in successfully')
      return data.user
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Login failed')
      throw err
    }
  }

  function logout() {
    loggedInUser.value = null
    token.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

  /* ================= USERS ================= */

  async function fetchUsers(filters: Filters, page = 1, pageSize = 10) {
    try {
      const params: any = { page, pageSize }
      if (filters.role) params.role = filters.role
      if (filters.name) params.name = filters.name

      const data = await userServices.fetchUsers(params)
      users.value = data.users
      totalCount.value = data.count
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to fetch users')
    }
  }

  async function fetchUser(id: string) {
    try {
      const { data } = await userServices.fetchUser(id)
      userDetail.value = data
      return data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to fetch user')
    }
  }

  async function updateUser(id: string, body: Partial<User>) {
    try {
      const { data } = await userServices.updateUser(id, body)

      if (loggedInUser.value?.id === id) {
        loggedInUser.value = data
      }

      showSuccess('User updated')
      return data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to update user')
    }
  }

  async function createAdmin(body: { name: string; email: string; password: string }) {
    try {
      const { data } = await userServices.createAdmin(body)
      users.value.unshift(data)
      showSuccess('Welcome new Admin!')
      return data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to create user')
    }
  }
  async function inviteUser(body: { name: string; email: string; role: string }) {
    try {
      const { data } = await userServices.inviteUser(body)
      users.value.unshift(data)
      showSuccess('User invited successfully')
      return data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to create user')
    }
  }

  async function deleteUser(id: string) {
    try {
      await userServices.deleteUser(id)
      users.value = users.value.filter((u) => u.id !== id)
      showSuccess('User deleted')
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to delete user')
    }
  }

  /* ================= PASSWORD ================= */

  async function forgotPassword(email: string) {
    try {
      await userServices.forgotPassword({ email })
      showSuccess('Reset link sent to email')
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to send reset email')
    }
  }

  async function resetPassword(payload: { userId: string; token: string; newPassword: string }) {
    try {
      await userServices.resetPassword(payload)
      showSuccess('Password reset successful')
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Password reset failed')
    }
  }

  return {
    // state
    loggedInUser,
    userDetail,
    users,
    totalCount,
    token,
    fetchLogin,
    // actions
    login,
    logout,
    fetchUsers,
    fetchUser,
    updateUser,
    inviteUser,
    deleteUser,
    forgotPassword,
    resetPassword,
  }
})
