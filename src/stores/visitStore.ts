/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import scheduledVisitServices from '@/services/scheduledVisitServices'

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

export interface ScheduledVisit {
  id?: string
  machineId: string
  visitDate: string
  notes?: string
  createdAt?: string
  updatedAt?: string
  machine?: {
    id: string
    serialNumber: string
    customer: {
      id: string
      name: string
    }
  }
}
export const useScheduledVisitStore = defineStore('scheduledVisit', () => {
  const visits = ref<ScheduledVisit[]>([])
  const visitDetail = ref<ScheduledVisit | null>(null)
  const totalCount = ref(0) // optional, in case you add pagination
  function getErrorMessage(err: any, fallback = 'Something went wrong') {
    return err?.response?.data?.error || err?.message || fallback
  }

  /* ================= CRUD ================= */

  async function fetchVisits(visitDate: string, page = 1, pageSize = 10) {
    try {
      const data = await scheduledVisitServices.fetchVisits(visitDate, page, pageSize)
      visits.value = data.visits
      totalCount.value = data.count
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch scheduled visits'))
    }
  }

  async function fetchVisit(id: string) {
    try {
      const data = await scheduledVisitServices.fetchVisit(id)
      visitDetail.value = data
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch scheduled visit'))
    }
  }

  async function createVisit(payload: { machineId: string; visitDate: string; notes?: string }) {
    try {
      const data = await scheduledVisitServices.createVisit(payload)
      visits.value.unshift(data)
      showSuccess('Scheduled visit created successfully')
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to create scheduled visit'))
    }
  }

  async function updateVisit(id: string, payload: Partial<ScheduledVisit>) {
    try {
      const data = await scheduledVisitServices.updateVisit(id, payload)
      const index = visits.value.findIndex((v) => v.id === id)
      if (index !== -1) visits.value[index] = data
      if (visitDetail.value?.id === id) visitDetail.value = data
      showSuccess('Scheduled visit updated')
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to update scheduled visit'))
    }
  }

  async function deleteVisit(id: string) {
    try {
      await scheduledVisitServices.deleteVisit(id)
      visits.value = visits.value.filter((v) => v.id !== id)
      showSuccess('Scheduled visit deleted')
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to delete scheduled visit'))
    }
  }

  return {
    visits,
    visitDetail,
    totalCount,
    fetchVisits,
    fetchVisit,
    createVisit,
    updateVisit,
    deleteVisit,
  }
})
