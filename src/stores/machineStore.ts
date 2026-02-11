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

export interface Manufacturer {
  id: string
  name: string
}

export interface Model {
  id: string
  name: string
  manufacturerId: string
  manufacturer?: Manufacturer
}
export const useMachineStore = defineStore('machine', () => {
  const machines = ref<Machine[]>([])
  const machineDetail = ref<Machine | null>(null)
  const totalCount = ref(0)
  const manufacturers = ref<Manufacturer[]>([])
  const models = ref<Model[]>([])

  async function fetchMachines(filters: any = {}, page = 1, pageSize = 10) {
    try {
      console.log('STORE RECEIVED PAGE =', page)
      const params: any = { page, pageSize }

      if (filters.role) params.role = filters.role
      if (filters.name) params.name = filters.name
      if (filters.customerId) params.customerId = filters.customerId
      const data = await machineServices.fetchMachines(params)
      machines.value = data.machines
      totalCount.value = data.count
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
  /* ---------------- MANUFACTURERS ---------------- */

  async function fetchManufacturers() {
    try {
      manufacturers.value = await machineServices.fetchManufacturers()
    } catch {
      showError('Failed to fetch manufacturers')
    }
  }

  async function createManufacturer(name: string) {
    try {
      const data = await machineServices.createManufacturer({ name })
      manufacturers.value.push(data)
      showSuccess('Manufacturer created')
      return data
    } catch {
      showError('Failed to create manufacturer')
    }
  }

  /* ---------------- MODELS ---------------- */

  async function fetchModels(manufacturerId?: string) {
    try {
      models.value = await machineServices.fetchModels(manufacturerId)
    } catch {
      showError('Failed to fetch models')
    }
  }

  async function createModel(payload: { name: string; manufacturerId: string }) {
    try {
      const data = await machineServices.createModel(payload)
      models.value.push(data)
      showSuccess('Model created')
      return data
    } catch {
      showError('Failed to create model')
    }
  }
  return {
    machines,
    machineDetail,
    totalCount,
    manufacturers,
    models,
    fetchMachines,
    fetchMachine,
    createMachine,
    updateMachine,
    deleteMachine,
    fetchManufacturers,
    createManufacturer,
    fetchModels,
    createModel,
  }
})
