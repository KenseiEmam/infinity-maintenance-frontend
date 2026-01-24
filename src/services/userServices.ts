/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from './axiosClient'

interface ApiResponse<T = any> {
  data: T | null
  error: any | null
}

interface ListResponse<T = any> {
  users: T[]
  count: number
  error: any | null
}

class UserServices {
  /* ================= AUTH ================= */

  async login(payload: { email: string; password: string }): Promise<ApiResponse> {
    try {
      const res = await instance.post('/users/login', payload)
      return { data: res.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async register(payload: { name: string; email: string; password: string }): Promise<ApiResponse> {
    try {
      const res = await instance.post('/users/register-first-admin', payload)
      return { data: res.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  /* ================= PASSWORD ================= */

  async forgotPassword(payload: { email: string }): Promise<ApiResponse> {
    try {
      const res = await instance.post('/users/forgot-password', payload)
      return { data: res.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  /**
   * Used for BOTH:
   * - forgot password
   * - invited user setting password for first time
   */
  async resetPassword(payload: {
    userId: string
    token: string
    newPassword: string
  }): Promise<ApiResponse> {
    try {
      const res = await instance.post('/users/reset-password', payload)
      return { data: res.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  /* ================= USERS ================= */

  async fetchUser(id: string): Promise<ApiResponse> {
    try {
      const res = await instance.get(`/users/${id}`)
      return { data: res.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async fetchUsers(params: any): Promise<ListResponse> {
    try {
      const res = await instance.get('/users', { params })
      return { users: res.data.users, count: res.data.count, error: null }
    } catch (error: any) {
      return { users: [], count: 0, error }
    }
  }

  /**
   * ADMIN INVITES USER
   * - Creates user with NO password
   * - Backend sends setup email
   */
  async inviteUser(payload: { name: string; email: string; role: string }): Promise<ApiResponse> {
    try {
      const res = await instance.post('/users', payload)
      return { data: res.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async updateUser(id: string, payload: any): Promise<ApiResponse> {
    try {
      const res = await instance.patch(`/users/${id}`, payload)
      return { data: res.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    try {
      const res = await instance.delete(`/users/${id}`)
      return { data: res.data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }
}

export default new UserServices()
