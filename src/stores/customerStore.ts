/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import customerServices from '@/services/customerServices'

export interface Customer {
  id?: string
  name: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

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

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const customerDetail = ref<Customer | null>(null)

  function getErrorMessage(err: any, fallback = 'Something went wrong') {
    return err?.response?.data?.error || err?.message || fallback
  }

  /* ================= CRUD ================= */

  async function fetchCustomers() {
    try {
      const data = await customerServices.fetchCustomers()
      customers.value = data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch customers'))
    }
  }

  async function fetchCustomer(id: string) {
    try {
      const data = await customerServices.fetchCustomer(id)
      customerDetail.value = data
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch customer'))
    }
  }

  async function createCustomer(payload: { name: string; address?: string }) {
    try {
      const data = await customerServices.createCustomer(payload)
      customers.value.unshift(data)
      showSuccess('Customer created successfully')
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to create customer'))
    }
  }

  return {
    customers,
    customerDetail,
    fetchCustomers,
    fetchCustomer,
    createCustomer,
  }
})
