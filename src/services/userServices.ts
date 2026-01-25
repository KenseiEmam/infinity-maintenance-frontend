/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from './axiosClient'

class UserServices {
  /* ================= AUTH ================= */

  async login(payload: { email: string; password: string }) {
    const res = await instance.post('/users/login', payload)
    return res.data
  }

  async register(payload: { name: string; email: string; password: string }) {
    const res = await instance.post('/users/register-first-admin', payload)
    return res.data
  }

  /* ================= PASSWORD ================= */

  async forgotPassword(payload: { email: string }) {
    const res = await instance.post('/users/forgot-password', payload)
    return res.data
  }

  async setupPassword(payload: { userId: string; token: string; password: string }) {
    const res = await instance.post('/users/setup-password', payload)
    return res.data
  }

  async resetPassword(payload: { userId: string; token: string; newPassword: string }) {
    const res = await instance.post('/users/reset-password', payload)
    return res.data
  }

  /* ================= USERS ================= */

  async fetchUser(id: string) {
    const res = await instance.get(`/users/${id}`)
    return res.data
  }

  async fetchUsers(params: any) {
    const res = await instance.get('/users', { params })
    return res.data
  }

  async inviteUser(payload: { name: string; email: string; role: string }) {
    const res = await instance.post('/users/invite', payload)
    return res.data
  }

  async createAdmin(payload: { name: string; email: string; password: string }) {
    const res = await instance.post('/users/register-first-admin', payload)
    return res.data
  }

  async updateUser(id: string, payload: any) {
    const res = await instance.patch(`/users/${id}`, payload)
    return res.data
  }

  async deleteUser(id: string) {
    const res = await instance.delete(`/users/${id}`)
    return res.data
  }
}

export default new UserServices()
