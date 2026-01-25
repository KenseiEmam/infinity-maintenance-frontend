import instance from './axiosClient'

export interface Call {
  id?: string
  customerId: string
  machineId?: string
  description: string
  assignedToId?: string
  assignedAt?: string
  callTime?: string
  customer?: { id: string; name: string }
  machine?: { id: string; serialNumber: string }
  assignedTo?: { id: string; name: string; email: string }
}

class CallServices {
  async fetchCalls() {
    const res = await instance.get('/calls')
    return res.data
  }

  async createCall(payload: { customerId: string; machineId?: string; description: string }) {
    const res = await instance.post('/calls', payload)
    return res.data
  }

  async assignCall(id: string, assignedToId: string) {
    const res = await instance.patch(`/calls/${id}/assign`, { assignedToId })
    return res.data
  }
}

export default new CallServices()
