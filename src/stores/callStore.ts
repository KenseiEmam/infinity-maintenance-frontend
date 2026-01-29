/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import callServices from '@/services/callServices'

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
export interface Call {
  id?: string
  customerId: string
  machineId?: string
  description: string
  assignedToId?: string
  assignedAt?: string
  callTime?: string
  jobSheet?: any
  customer?: { id: string; name: string; phone: string; address: string }
  machine?: { id: string; serialNumber: string; underWarranty: boolean }
  assignedTo?: { id: string; name: string; email: string }
}
export const useCallStore = defineStore('call', () => {
  const calls = ref<Call[]>([])
  const callDetail = ref<Call | null>(null)
  const totalCount = ref(0) // optional, in case you add pagination
  function getErrorMessage(err: any, fallback = 'Something went wrong') {
    return err?.response?.data?.error || err?.message || fallback
  }

  /* ================= CRUD ================= */

  async function fetchCalls(page = 1, pageSize = 10) {
    try {
      const data = await callServices.fetchCalls(page, pageSize)
      calls.value = data.calls
      totalCount.value = data.count
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch calls'))
    }
  }
  async function fetchCall(id: string) {
    try {
      const data = await callServices.fetchCall(id)
      callDetail.value = data
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch job sheet'))
    }
  }
  async function createCall(payload: {
    customerId: string
    machineId?: string
    description: string
  }) {
    try {
      const data = await callServices.createCall(payload)
      calls.value.unshift(data)
      showSuccess('Call created successfully')
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to create call'))
    }
  }

  async function assignCall(id: string, assignedToId: string) {
    try {
      const data = await callServices.assignCall(id, assignedToId)
      const index = calls.value.findIndex((c) => c.id === id)
      if (index !== -1) calls.value[index] = data
      if (callDetail.value?.id === id) callDetail.value = data
      showSuccess('Call assigned successfully')
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to assign call'))
    }
  }

  return {
    calls,
    callDetail,
    totalCount,
    fetchCalls,
    fetchCall,
    createCall,
    assignCall,
  }
})
