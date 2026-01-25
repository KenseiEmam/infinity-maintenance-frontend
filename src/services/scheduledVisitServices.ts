import instance from './axiosClient'

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

class ScheduledVisitServices {
  async fetchVisits() {
    const res = await instance.get('/scheduled-visits')
    return res.data
  }

  async fetchVisit(id: string) {
    const res = await instance.get(`/scheduled-visits/${id}`)
    return res.data
  }

  async createVisit(payload: { machineId: string; visitDate: string; notes?: string }) {
    const res = await instance.post('/scheduled-visits', payload)
    return res.data
  }

  async updateVisit(id: string, payload: Partial<ScheduledVisit>) {
    const res = await instance.patch(`/scheduled-visits/${id}`, payload)
    return res.data
  }

  async deleteVisit(id: string) {
    const res = await instance.delete(`/scheduled-visits/${id}`)
    return res.data
  }
}

export default new ScheduledVisitServices()
