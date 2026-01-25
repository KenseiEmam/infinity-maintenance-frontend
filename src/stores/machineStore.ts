/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import machineServices from '@/services/machineServices'

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

export interface Machine {
  id?: string
  serialNumber?: string
  customerId?: string
  modelId?: string
  underWarranty?: boolean
  createdAt?: string
  updatedAt?: string
  customer?: any
  model?: any
  jobSheets?: any[]
  calls?: any[]
  scheduledVisits?: any[]
}

export const useMachineStore = defineStore('machine', () => {
  const machines = ref<Machine[]>([])
  const machineDetail = ref<Machine | null>(null)
  const totalCount = ref(0)

  async function fetchMachines(filters: any = {}) {
    try {
      const data = await machineServices.fetchMachines(filters)
      machines.value = data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to fetch machines')
    }
  }

  async function fetchMachine(id: string) {
    try {
      const data = await machineServices.fetchMachine(id)
      machineDetail.value = data
      return data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to fetch machine')
    }
  }

  async function createMachine(payload: {
    serialNumber: string
    customerId: string
    modelId: string
    underWarranty?: boolean
  }) {
    try {
      const data = await machineServices.createMachine(payload)
      machines.value.unshift(data)
      showSuccess('Machine created successfully')
      return data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to create machine')
    }
  }

  async function updateMachine(id: string, payload: Partial<Machine>) {
    try {
      const data = await machineServices.updateMachine(id, payload)
      if (machineDetail.value?.id === id) {
        machineDetail.value = data
      }
      showSuccess('Machine updated successfully')
      return data
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to update machine')
    }
  }

  async function deleteMachine(id: string) {
    try {
      await machineServices.deleteMachine(id)
      machines.value = machines.value.filter((m) => m.id !== id)
      showSuccess('Machine deleted')
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Failed to delete machine')
    }
  }

  return {
    machines,
    machineDetail,
    totalCount,
    fetchMachines,
    fetchMachine,
    createMachine,
    updateMachine,
    deleteMachine,
  }
})
