/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from './axiosClient'

class MachineServices {
  async fetchMachines(params?: any) {
    const res = await instance.get('/machines', { params })
    return res.data
  }

  async fetchMachine(id: string) {
    const res = await instance.get(`/machines/${id}`)
    return res.data
  }

  async createMachine(payload: {
    serialNumber: string
    customerId: string
    modelId: string
    underWarranty?: boolean
  }) {
    const res = await instance.post('/machines', payload)
    return res.data
  }

  async updateMachine(id: string, payload: Partial<any>) {
    const res = await instance.patch(`/machines/${id}`, payload)
    return res.data
  }

  async deleteMachine(id: string) {
    const res = await instance.delete(`/machines/${id}`)
    return res.data
  }
}

export default new MachineServices()
