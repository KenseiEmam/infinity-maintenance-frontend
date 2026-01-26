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
  machineId?: string
  engineerId?: string
  createdAt?: string
  updatedAt?: string
  // add other fields if needed
  customer?: any
  machine?: any
  engineer?: any
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
      showSuccess('Job Sheet created')
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
      showSuccess('Job Sheet updated')
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
      showSuccess('Job Sheet deleted')
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
  }
})
