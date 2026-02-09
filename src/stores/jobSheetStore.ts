// oxlint-disable unicorn/no-new-array
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import jobSheetServices from '@/services/jobSheetServices'

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
  customerId?: string
  serialNumber?: string
}
export const useJobSheetStore = defineStore('jobSheet', () => {
  const jobSheets = ref<JobSheet[]>([])
  const jobSheetDetail = ref<JobSheet | null>(null)
  const totalCount = ref(0) // optional, in case you add pagination
  const attachments = ref<Attachment[]>([])

  function getErrorMessage(err: any, fallback = 'Something went wrong') {
    return err?.response?.data?.error || err?.message || fallback
  }

  /* ================= CRUD ================= */

  async function fetchJobSheets(filters: Filters = {}, page = 1, pageSize = 10) {
    try {
      const data = await jobSheetServices.fetchJobSheets(filters, page, pageSize)
      jobSheets.value = data.jobSheets
      totalCount.value = data.count
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch job sheets'))
    }
  }

  async function fetchJobSheet(id: string) {
    try {
      const data = await jobSheetServices.fetchJobSheet(id)
      jobSheetDetail.value = data
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch job sheet'))
    }
  }

  async function createJobSheet(payload: Partial<JobSheet>) {
    try {
      const data = await jobSheetServices.createJobSheet(payload)
      jobSheets.value.unshift(data)
      showSuccess('Service Report created')
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to create job sheet'))
    }
  }

  async function updateJobSheet(id: string, payload: Partial<JobSheet>) {
    try {
      const data = await jobSheetServices.updateJobSheet(id, payload)
      const index = jobSheets.value.findIndex((j) => j.id === id)
      if (index !== -1) jobSheets.value[index] = data
      if (jobSheetDetail.value?.id === id) jobSheetDetail.value = data
      showSuccess('Service Report updated')
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to update job sheet'))
    }
  }

  async function deleteJobSheet(id: string) {
    try {
      await jobSheetServices.deleteJobSheet(id)
      jobSheets.value = jobSheets.value.filter((j) => j.id !== id)
      if (jobSheetDetail.value?.id === id) jobSheetDetail.value = null
      showSuccess('Service Report deleted')
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to delete job sheet'))
    }
  }
  // ------------------------- Attachments -------------------------
  async function uploadAttachment(file: File, jobSheetId: string) {
    try {
      const data = await jobSheetServices.uploadAttachment(file, jobSheetId)
      attachments.value.push(data)
      showSuccess('Attachment uploaded')
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to upload attachment'))
    }
  }

  async function fetchAttachments(jobSheetId: string) {
    try {
      const data = await jobSheetServices.fetchAttachments(jobSheetId)
      attachments.value = data
      return data
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch attachments'))
    }
  }
  /* ================== Dashboard Helpers ================== */
  async function fetchAllForDashboard() {
    try {
      // fetch a large page size to get all sheets (or implement server-side aggregation later)
      const data = await jobSheetServices.fetchJobSheets({}, 1, 1000)
      jobSheets.value = data.jobSheets
      totalCount.value = data.count
      return data.jobSheets
    } catch (err: any) {
      showError(getErrorMessage(err, 'Failed to fetch JobSheets for dashboard'))
      return []
    }
  }

  function aggregateForChart(
    jobSheets: JobSheet[],
    range: 'past_year' | 'last_3_months' | 'this_month',
  ) {
    const now = new Date()
    let labels: string[] = []
    let createdData: number[] = []
    let completedData: number[] = []

    if (range === 'past_year') {
      // Initialize arrays
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now)
        d.setMonth(now.getMonth() - i)
        labels.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }))
        createdData.push(0)
        completedData.push(0)
      }

      jobSheets.forEach((js) => {
        if (!js.createdAt) return
        const created = new Date(js.createdAt)
        const monthDiff =
          (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth())
        const index = 11 - monthDiff
        if (index >= 0 && index < 12) {
          createdData[index]! += 1 // Non-null assertion
          if (js.completionTime) completedData[index]! += 1
        }
      })
    }

    if (range === 'last_3_months') {
      labels = ['This Month', '1 Month Ago', '2 Months Ago']
      createdData = [0, 0, 0]
      completedData = [0, 0, 0]

      jobSheets.forEach((js) => {
        if (!js.createdAt) return
        const created = new Date(js.createdAt)
        for (let offset = 0; offset < 3; offset++) {
          const target = new Date(now)
          target.setMonth(now.getMonth() - offset)

          if (
            created.getMonth() === target.getMonth() &&
            created.getFullYear() === target.getFullYear()
          ) {
            createdData[offset]! += 1
            if (js.completionTime) completedData[offset]! += 1
          }
        }
      })
    }

    if (range === 'this_month') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)
      createdData = new Array(daysInMonth).fill(0)
      completedData = new Array(daysInMonth).fill(0)

      jobSheets.forEach((js) => {
        if (!js.createdAt) return
        const created = new Date(js.createdAt)
        const day = created.getDate()
        if (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear() &&
          day >= 1 &&
          day <= daysInMonth
        ) {
          createdData[day - 1]! += 1
          if (js.completionTime) completedData[day - 1]! += 1
        }
      })
    }

    return {
      labels,
      datasets: [
        {
          label: 'Created Jobsheets',
          backgroundColor: '#0a6134',
          data: createdData,
        },
        {
          label: 'Completed Jobsheets',
          backgroundColor: '#f87979',
          data: completedData,
        },
      ],
    }
  }

  return {
    jobSheets,
    jobSheetDetail,
    attachments,
    totalCount,
    fetchJobSheets,
    fetchJobSheet,
    createJobSheet,
    updateJobSheet,
    deleteJobSheet,
    uploadAttachment,
    fetchAttachments,
    fetchAllForDashboard,
    aggregateForChart,
  }
})
