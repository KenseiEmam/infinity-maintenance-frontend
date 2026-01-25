import instance from './axiosClient'

export interface Customer {
  id?: string
  name: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

class CustomerServices {
  async fetchCustomers() {
    const res = await instance.get('/customers')
    return res.data
  }

  async fetchCustomer(id: string) {
    const res = await instance.get(`/customers/${id}`)
    return res.data
  }

  async createCustomer(payload: { name: string; address?: string }) {
    const res = await instance.post('/customers', payload)
    return res.data
  }
}

export default new CustomerServices()
