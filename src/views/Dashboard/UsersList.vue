<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import AddUserModal from '@/components/Modals/AddUserModal.vue'
import { useUserStore } from '@/stores/users'
import Swal from 'sweetalert2'
import { onMounted, ref, watch, computed } from 'vue'

const userStore = useUserStore()
const loading = ref(true)

// Filters
type Filter = {
  role?: string
  name?: string
}
const filter = ref(<Filter>{
  role: '',
  name: '',
})

// Pagination
const page = ref(1)
const pageSize = ref(10)
const addingUser = ref(false)
const modalLoad = ref(false)
const totalPages = computed(() => Math.ceil(userStore.totalCount / pageSize.value))

// Change filter
function changeFilter($event: any) {
  filter.value.role = $event.target.value
  page.value = 1
}
async function toggleRole(user: any) {
  if (!userStore.loggedInUser) return

  const newRole = user.role === 'ADMIN' ? 'ENGINEER' : 'ADMIN'

  loading.value = true
  await userStore.updateUser(user.id, { role: newRole }).then(() => {
    userStore.fetchUsers(filter.value, page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  })
}

// Fetch users whenever filter or page changes
watch(
  [filter, page],
  () => {
    loading.value = true

    userStore.fetchUsers(filter.value, page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  },
  { deep: true },
)
async function handleDelete(id: string) {
  Swal.fire({
    title: 'Are you sure you want to DELETE this?',
    text: 'All records of this item and related items will be lost completely!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
  }).then(async (result) => {
    if (result.isConfirmed) {
      loading.value = true
      await userStore.deleteUser(id).then(() => {
        userStore.fetchUsers(filter.value, page.value, pageSize.value).finally(() => {
          loading.value = false
        })
      })
    }
  })
}
onMounted(() => {
  loading.value = true
  userStore.fetchUsers(filter.value, page.value, pageSize.value).finally(() => {
    loading.value = false
  })
})

const handleInvite = (event: any) => {
  loading.value = true
  modalLoad.value = true
  userStore.inviteUser(event).then(() => {
    addingUser.value = false
    modalLoad.value = false
    userStore.fetchUsers(filter.value, page.value, pageSize.value).finally(() => {
      loading.value = false
    })
  })
}

// Pagination actions
function nextPage() {
  if (page.value < totalPages.value) page.value++
}
function prevPage() {
  if (page.value > 1) page.value--
}
</script>

<template>
  <section class="text-center md:text-left h-full space-y-6">
    <div class="md:flex-row flex-col flex items-center w-full gap-3">
      <div>
        <h3 class="header-medium">Users List</h3>
        <p class="text-sm md:text-base text-secondary">
          Here you may edit user roles and invite as many users as you may like!
        </p>
      </div>

      <select
        @change="changeFilter"
        name="filter"
        id="filter1"
        class="md:ml-auto infinity-text-input w-full md:w-auto"
      >
        <option :value="[]">No Filter</option>
        <option :value="['ENGINEER']">Engineers</option>
        <option :value="['ADMIN']">Admins</option>
      </select>

      <p v-if="userStore.users" class="subheader-small">
        Showing {{ userStore.users?.length }} User(s)
      </p>
      <button class="btn-sm-outline w-full md:w-auto" @click="addingUser = true">
        Invite User
      </button>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col text-center items-center justify-center animate-pulse w-full space-y-4 h-full"
    >
      <div
        class="w-8 h-8 border-4 border-primary/40 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-sm text-center animate-pulse">Loading users..</p>
    </div>

    <!-- Users List -->
    <div v-else class="flex flex-col h-full gap-3">
      <div
        v-for="user in userStore.users"
        class="card gap-4 md:flex-row items-center"
        :key="user.id"
      >
        <div>
          <p class="font-black">
            {{ user.name }}
          </p>
          <p class="text-teritiary text-sm">
            {{ user.email }}
          </p>
        </div>
        <label
          v-if="userStore.loggedInUser?.role === 'ADMIN' && userStore.loggedInUser?.id !== user.id"
          class="inline-flex relative items-center cursor-pointer md:ml-auto"
        >
          <input
            type="checkbox"
            class="sr-only peer"
            :checked="user.role === 'ADMIN'"
            @change="toggleRole(user)"
          />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teritiary rounded-full peer peer-checked:bg-secondary transition-colors"
          ></div>
          <div
            class="absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5"
          ></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {{ user.role === 'ADMIN' ? 'Admin' : 'Engineer' }}
          </span>
        </label>
        <p class="font-semibold text-teritiary/40 md:ml-auto" v-else>ME</p>
        <button
          v-if="
            userStore.loggedInUser?.id &&
            user.id !== userStore.loggedInUser.id &&
            userStore.loggedInUser.role === 'ADMIN'
          "
          class="btn-sm-delete md:w-auto w-full"
          @click="handleDelete(userStore.loggedInUser?.id)"
        >
          Delete User
        </button>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-center items-center gap-2 card mt-auto mb-12 w-full">
        <button
          @click="prevPage"
          :disabled="page === 1"
          v-if="page !== 1"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          v-if="page < totalPages"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    <AddUserModal
      @submit="handleInvite"
      @close="addingUser = false"
      :visible="addingUser"
      :loading="modalLoad"
    />
  </section>
</template>
