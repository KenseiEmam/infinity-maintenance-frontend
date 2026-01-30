<script setup lang="ts">
import DashboardChart from '@/components/DashboardChart.vue'
import DashboardSnapCarousel from '@/components/DashboardSnapCarousel.vue'
import { useCallStore } from '@/stores/callStore'
import { useJobSheetStore } from '@/stores/jobSheetStore'
import { useUserStore } from '@/stores/users'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const callStore = useCallStore()
const jobSheetStore = useJobSheetStore()
const loading = ref(true)
onMounted(() => {
  loading.value = true
  callStore.fetchCalls(1, 5).finally(() => {
    jobSheetStore.fetchJobSheets({}, 1, 5).finally(() => {
      loading.value = false
    })
  })
})
</script>
<template>
  <section class="w-full h-full grid md:grid-rows-4 gap-3 w-full gap-3">
    <div class="card items-center md:items-start md:row-span-2">
      <h3 class="title-medium">Hello {{ userStore.loggedInUser?.name }}!</h3>
      <p class="text-scecondary">
        Here you can view your dashboard with all your relevant metics, statistics and actions!
      </p>
      <DashboardChart />
    </div>
    <div class="card">
      <h3 class="subheader-small">Recent Calls:</h3>
      <div v-if="callStore.calls.length > 0" class="my-auto">
        <DashboardSnapCarousel>
          <div
            v-for="call in callStore.calls"
            :key="call.id"
            class="snap-start shrink-0 w-[320px] md:w-[380px]"
          >
            <div class="card h-full space-y-2">
              <h3 class="font-black text-primary">Call #{{ call.id }}</h3>
              <p class="text-sm text-teritiary">{{ call.customer?.name }}</p>

              <button
                class="btn-sm w-full"
                @click="$router.push({ name: 'single-call', params: { id: call.id } })"
              >
                View Call
              </button>
            </div>
          </div>
        </DashboardSnapCarousel>
      </div>
      <p class="text-teritiary py-3" v-else>No calls here yet!</p>
    </div>
    <div class="card">
      <h3 class="subheader-small">Recent Jobs:</h3>
      <div v-if="jobSheetStore.jobSheets.length > 0" class="my-auto">
        <DashboardSnapCarousel>
          <div
            v-for="js in jobSheetStore.jobSheets"
            :key="js.id"
            class="snap-start shrink-0 w-[320px] md:w-[380px]"
          >
            <div class="card h-full space-y-2">
              <h3 class="font-black text-primary">Sheet #{{ js.id }}</h3>
              <p class="text-sm text-teritiary">{{ js.customer?.name }}</p>

              <button
                class="btn-sm w-full"
                @click="$router.push({ name: 'single-job-sheet', params: { id: js.id } })"
              >
                View JobSheet
              </button>
            </div>
          </div>
        </DashboardSnapCarousel>
      </div>
      <p class="text-teritiary py-3" v-else>No job sheets here yet!</p>
    </div>
  </section>
</template>
