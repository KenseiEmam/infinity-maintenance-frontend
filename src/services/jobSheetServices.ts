/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from './axiosClient'

export interface JobSheet {
  id?: string
  customerId?: string
  customerSignature?: string
  checkInTime?: Date
  arrivalTime?: Date
  completionTime?: Date
  labourTimeMin?: number
  machineId?: string
  engineerId?: string
  callId?: string
  createdAt?: string
  updatedAt?: string
  problemFound?: string
  workReport?: string
  total?: number
  totalAfterDisc?: number
  customer?: any
  machine?: any
  engineer?: any
  call?: any
  spareParts?: any[]
  laserData?: any[]
  attachments?: any[]
}
export interface Attachment {
  id?: string
  jobSheetId: string
  url: string
  fileType: string
  key?: string
}
type Filters = {
  customerName?: string
  serialNumber?: string
}

class JobSheetServices {
  async fetchJobSheets(filters: Filters = {}, page: number, pageSize: number) {
    const res = await instance.get('/job-sheets', {
      params: { customerName: filters.customerName, pageSize, page },
    })
    return res.data
  }

  async fetchJobSheet(id: string) {
    const res = await instance.get(`/job-sheets/${id}`)
    return res.data
  }

  async createJobSheet(payload: Partial<JobSheet>) {
    const res = await instance.post('/job-sheets', payload)
    return res.data
  }

  async updateJobSheet(id: string, payload: Partial<JobSheet>) {
    const res = await instance.patch(`/job-sheets/${id}`, payload)
    return res.data
  }

  async deleteJobSheet(id: string) {
    const res = await instance.delete(`/job-sheets/${id}`)
    return res.data
  }

  // ------------------------- Attachments -------------------------
  async uploadAttachment(file: File, jobSheetId: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('jobSheetId', jobSheetId)

    const res = await instance.post('/attachments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return res.data
  }

  async fetchAttachments(jobSheetId: string) {
    const res = await instance.get('/attachments', { params: { jobSheetId } })
    return res.data
  }
}

export default new JobSheetServices()
