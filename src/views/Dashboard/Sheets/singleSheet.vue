<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useJobSheetStore } from '@/stores/jobSheetStore'
import Swal from 'sweetalert2'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
// import VueSignaturePad from 'vue-signature-pad'
const jobSheetStore = useJobSheetStore()
const loading = ref(true)
const uploading = ref(false)

async function uploadFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.item(0)

  if (!file) return
  if (!jobSheetStore.jobSheetDetail?.id) return

  uploading.value = true

  await jobSheetStore.uploadAttachment(file, jobSheetStore.jobSheetDetail.id)

  uploading.value = false
  input.value = ''
}

// route
const route = useRoute()
const changed = ref(false)
onMounted(() => {
  if (!route.params.id) {
    Swal.fire('Error', 'No sheet ID provided', 'error')
    return
  }
  loading.value = true
  const id = route.params.id.toString()
  jobSheetStore
    .fetchJobSheet(id)
    .then(() => {
      jobSheetStore.fetchAttachments(id)
    })
    .finally(() => {
      loading.value = false
      changed.value = false
    })
})

watch(
  () => jobSheetStore.jobSheetDetail,
  () => {
    changed.value = true
  },
  { deep: true },
)
const handleReset = () => {
  if (!route.params.id) {
    Swal.fire('Error', 'No sheet ID provided', 'error')
    return
  }
  loading.value = true
  loading.value = true
  jobSheetStore.fetchJobSheet(route.params.id.toString()).finally(() => {
    loading.value = false
    changed.value = false
  })
}
// const signaturePad = ref<any>(null)
// function clearSignature() {
//   if (!signaturePad.value) return
//   signaturePad.value.clearSignature()
// }

// async function saveSignature() {
//   if (!signaturePad.value || !jobSheetStore.jobSheetDetail?.id) return

//   const { isEmpty, data } = signaturePad.value.saveSignature()
//   if (isEmpty) {
//     Swal.fire('Empty Signature', 'Please sign before saving', 'warning')
//     return
//   }

//   const blob = await (await fetch(data)).blob()
//   const file = new File([blob], 'customer-signature.png', {
//     type: 'image/png',
//   })

//   await jobSheetStore.uploadAttachment(file, jobSheetStore.jobSheetDetail.id)
// }

const handleEdit = () => {
  if (!route.params.id) {
    Swal.fire('Error', 'No sheet ID provided', 'error')
    return
  }
  loading.value = true
  jobSheetStore
    .updateJobSheet(route.params.id.toString(), { ...jobSheetStore.jobSheetDetail })
    .then(() => {
      if (!route.params.id) {
        Swal.fire('Error', 'No sheet ID provided', 'error')
        return
      }
      jobSheetStore.fetchJobSheet(route.params.id.toString()).finally(() => {
        loading.value = false
        changed.value = false
      })
    })
}
</script>

<template>
  <section class="text-center md:text-left h-full space-y-6">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col text-center items-center justify-center animate-pulse w-full space-y-4 h-full"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading Sheet..</p>
    </div>

    <!-- jobSheets List -->
    <div
      v-else-if="jobSheetStore.jobSheetDetail"
      class="flex flex-col gap-3 grid md:grid-cols-2 gap3"
    >
      <!-- Sheet ID -->
      <div class="card h-auto md:col-span-2 space-y-2">
        <h2 class="header-small text-left">
          <span class="font-black text-sm md:text-base">Sheet ID:</span
          >{{ jobSheetStore.jobSheetDetail.id }}
        </h2>
        <h3 v-if="jobSheetStore.jobSheetDetail.createdAt" class="text-teritiary text-sm">
          <span class="font-bold">Created:</span
          >{{
            new Date(jobSheetStore.jobSheetDetail.createdAt).toLocaleDateString('en', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            })
          }}
        </h3>
        <h3 v-if="jobSheetStore.jobSheetDetail.updatedAt" class="text-teritiary text-sm">
          <span class="font-bold">Updated:</span
          >{{
            new Date(jobSheetStore.jobSheetDetail.updatedAt).toLocaleDateString('en', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            })
          }}
        </h3>
      </div>
      <!-- Supervising Engineer -->
      <div class="card h-auto space-y-2">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Supervised by:</span>
        </h2>
        <h2 class="text-primary text-sm md:text-lg">
          {{ jobSheetStore.jobSheetDetail.engineer.name }}
        </h2>
        <p>{{ jobSheetStore.jobSheetDetail.engineer.email }}</p>
      </div>
      <!-- Customer  -->
      <div class="card h-auto space-y-2">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">For Customer:</span>
        </h2>
        <h2 class="text-primary text-sm md:text-lg">
          {{ jobSheetStore.jobSheetDetail.customer.name }}
        </h2>
        <p>
          {{ jobSheetStore.jobSheetDetail.customer.address }} |
          {{ jobSheetStore.jobSheetDetail.customer.phone }}
        </p>
      </div>
      <!-- Time Data  -->
      <!-- <div class="card h-auto space-y-2 md:col-span-2">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Time Data:</span>
        </h2>
      </div> -->
      <!-- Machine  -->
      <div class="card h-auto space-y-2">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Machine:</span>
        </h2>
        <h2 class="text-primary text-sm md:text-lg">
          {{ jobSheetStore.jobSheetDetail.machine.serialNumber }}
        </h2>
        <p>
          {{
            jobSheetStore.jobSheetDetail.machine.underWarranty ? 'Under Warranty' : 'No Warranty'
          }}
        </p>
      </div>
      <!-- Reports  -->
      <div class="card h-auto md:row-span-2 space-y-2">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Reports:</span>
        </h2>
        <div class="w-full">
          <label class="block text-sm font-medium">Problem Found</label>
          <textarea
            v-model="jobSheetStore.jobSheetDetail.problemFound"
            class="chef-text-input w-full"
            placeholder="None Provided"
          ></textarea>
        </div>

        <div class="w-full">
          <label class="block text-sm font-medium">Work Report</label>
          <textarea
            v-model="jobSheetStore.jobSheetDetail.workReport"
            class="chef-text-input w-full"
            placeholder="None Provided"
          ></textarea>
        </div>
      </div>
      <!-- Finances  -->
      <div class="card h-auto space-y-2">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Financials:</span>
        </h2>
        <div class="mb-4 flex gap-4">
          <div class="flex-1">
            <label for="disc"> Job Total</label>
            <input
              type="number"
              v-model.number="jobSheetStore.jobSheetDetail.total"
              placeholder="Total"
              class="chef-text-input flex-1"
            />
          </div>

          <div class="flex-1">
            <label for="disc"> After Discount</label>
            <input
              type="number"
              v-model.number="jobSheetStore.jobSheetDetail.totalAfterDisc"
              placeholder="Total After Discount"
              class="chef-text-input flex-1"
            />
          </div>
        </div>
      </div>

      <!-- Attachments -->
      <div class="card h-auto space-y-3">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Attachments:</span>
        </h2>

        <!-- Upload -->
        <input type="file" class="chef-text-input" @change="uploadFile" :disabled="uploading" />

        <p v-if="uploading" class="text-sm animate-pulse">Uploading...</p>

        <!-- List -->
        <div v-if="jobSheetStore.attachments.length" class="space-y-2 w-full">
          <div
            v-for="att in jobSheetStore.attachments"
            :key="att.id"
            class="flex items-center border rounded p-2 gap-3 w-full"
          >
            <!-- Inline preview for images -->
            <img v-if="att.fileType === 'image'" :src="att.url" class="h-12 rounded border" />
            <div class="flex justify-between items-center gap-2 w-full">
              <span class="font-bold capitalize">{{ att.fileType }} File</span>
              <a
                :href="att.url"
                target="_blank"
                class="btn-sm px-3 py-2 w-32 h-12 text-center flex items-center justify-center"
              >
                View
              </a>
            </div>
          </div>
        </div>

        <p v-else class="text-sm text-teritiary">No attachments uploaded</p>
      </div>

      <!-- Signature  -->
      <!-- <div class="card h-auto space-y-2">
        <h2 class="text-primary text-sm md:text-lg">
          <span class="font-black text-sm md:text-base">Signature:</span>
          <div class="space-y-3">
            <VueSignaturePad ref="signaturePad" class="border rounded-lg h-40 w-full" />

            <div class="flex gap-2">
              <button class="btn-lg-outline" @click="clearSignature">Clear</button>
              <button class="btn-lg" @click="saveSignature">Save Signature</button>
            </div>
          </div>
        </h2>
      </div> -->
      <!-- Updates  -->
      <div v-if="changed" class="card h-auto flex-row md:col-span-2 gap-3">
        <button @click="handleReset" class="btn-lg-outline flex-1">Reset Changes</button>
        <button @click="handleEdit" class="btn-lg flex-1">Save Changes</button>
      </div>
    </div>
    <div v-else class="h-full card items-center justify-center w-full">
      <router-link class="btn-lg px-3 w-32 py-3 text-center" :to="{ name: 'dashboard-home' }">
        Back to Home
      </router-link>
    </div>
  </section>
</template>
