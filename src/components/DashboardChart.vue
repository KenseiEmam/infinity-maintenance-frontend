<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
// oxlint-disable unicorn/no-new-array
import { useJobSheetStore } from '@/stores/jobSheetStore'
import { onMounted, ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const jobSheetStore = useJobSheetStore()

const loading = ref(false)
const range = ref<'past_year' | 'this_month' | 'last_3_months'>('past_year')

/**
 * You can change these labels + colors as you want.
 * We'll chart counts:
 * - Created job sheets
 * - Completed job sheets (completionTime exists)
 */
const chartData = ref<any>({
  labels: [],
  datasets: [
    {
      label: 'Created JobSheets',
      backgroundColor: '#0a6134',
      data: [],
    },
    {
      label: 'Completed JobSheets',
      backgroundColor: '#3b82f6',
      data: [],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
})

onMounted(async () => {
  await jobSheetStore.fetchAllForDashboard()
  chartData.value = jobSheetStore.aggregateForChart(jobSheetStore.jobSheets, range.value)
})

watch(range, () => {
  chartData.value = jobSheetStore.aggregateForChart(jobSheetStore.jobSheets, range.value)
})

// async function fetchJobSheetsFilter() {
//   loading.value = true

//   /**
//    * You can implement this in your store however you want:
//    * - fetchJobSheets({ range })
//    * - or fetchAllJobSheets() then filter client side
//    */
//   await jobSheetStore.fetchAllForDashboard({ range: range.value })

//   const sheets = jobSheetStore.jobSheets || []
//   const now = new Date()

//   // reset
//   chartData.value.labels = []
//   chartData.value.datasets[0].data = []
//   chartData.value.datasets[1].data = []

//   /* =======================
//      PAST YEAR (12 months)
//   ======================= */
//   if (range.value === 'past_year') {
//     chartData.value.labels = []
//     chartData.value.datasets[0].data = new Array(12).fill(0)
//     chartData.value.datasets[1].data = new Array(12).fill(0)

//     // Labels oldest → newest
//     for (let i = 11; i >= 0; i--) {
//       const d = new Date()
//       d.setMonth(d.getMonth() - i)
//       chartData.value.labels.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }))
//     }

//     sheets.forEach((s: any) => {
//       const createdAt = s.createdAt ? new Date(s.createdAt) : null
//       if (!createdAt || Number.isNaN(createdAt.getTime())) return

//       const diff =
//         (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth())

//       const index = 11 - diff
//       if (index < 0 || index > 11) return

//       chartData.value.datasets[0].data[index] += 1

//       // completed if completionTime exists
//       if (s.completionTime) chartData.value.datasets[1].data[index] += 1
//     })
//   }

//   /* =======================
//      LAST 3 MONTHS
//   ======================= */
//   if (range.value === 'last_3_months') {
//     chartData.value.labels = ['This Month', '1 Month Ago', '2 Months Ago']
//     chartData.value.datasets[0].data = []
//     chartData.value.datasets[1].data = []

//     for (let offset = 0; offset < 3; offset++) {
//       const target = new Date(now)
//       target.setMonth(now.getMonth() - offset)

//       let created = 0
//       let completed = 0

//       sheets.forEach((s: any) => {
//         const d = s.createdAt ? new Date(s.createdAt) : null
//         if (!d || Number.isNaN(d.getTime())) return

//         if (d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear()) {
//           created += 1
//           if (s.completionTime) completed += 1
//         }
//       })

//       chartData.value.datasets[0].data.push(created)
//       chartData.value.datasets[1].data.push(completed)
//     }
//   }

//   /* =======================
//      THIS MONTH (per day)
//   ======================= */
//   if (range.value === 'this_month') {
//     const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

//     chartData.value.labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)
//     chartData.value.datasets[0].data = []
//     chartData.value.datasets[1].data = []

//     for (let day = 1; day <= daysInMonth; day++) {
//       let created = 0
//       let completed = 0

//       sheets.forEach((s: any) => {
//         const d = s.createdAt ? new Date(s.createdAt) : null
//         if (!d || Number.isNaN(d.getTime())) return

//         if (
//           d.getDate() === day &&
//           d.getMonth() === now.getMonth() &&
//           d.getFullYear() === now.getFullYear()
//         ) {
//           created += 1
//           if (s.completionTime) completed += 1
//         }
//       })

//       chartData.value.datasets[0].data.push(created)
//       chartData.value.datasets[1].data.push(completed)
//     }
//   }

//   loading.value = false
// }
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-3">
      <h3 class="subheader-small">Jobs Overview</h3>

      <div class="ml-auto flex gap-2">
        <button
          @click="range = 'past_year'"
          class="btn-sm-outline"
          :class="range === 'past_year' ? 'bg-primary text-white' : ''"
        >
          Past Year
        </button>

        <button
          @click="range = 'this_month'"
          class="btn-sm-outline"
          :class="range === 'this_month' ? 'bg-primary text-white' : ''"
        >
          This Month
        </button>

        <button
          @click="range = 'last_3_months'"
          class="btn-sm-outline"
          :class="range === 'last_3_months' ? 'bg-primary text-white' : ''"
        >
          3 Months
        </button>
      </div>
    </div>

    <div class="h-full w-full">
      <div v-if="!loading" class="h-[320px] w-full">
        <Bar :data="chartData" :options="chartOptions" />
      </div>

      <div v-else class="h-[320px] w-full text-center flex animate-pulse">
        <p class="text-body m-auto">Loading JobSheets..</p>
      </div>
    </div>
  </div>
</template>
