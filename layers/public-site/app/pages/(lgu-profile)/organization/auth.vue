<script setup lang="ts">
import { ref } from 'vue'
import {
  Building2,
  ListFilter,
} from '@lucide/vue'

useHead({
  title: 'Organizational Structure | Municipality of San Francisco',
  meta: [
    {
      name: 'description',
      content: 'Official Organizational Structure and Municipal Departments of San Francisco, Agusan del Sur.',
    },
  ],
})

definePageMeta({
  layout:'guest'
})
const {
  activeTreeData,
  positions,
  labelOptions,
  selectedOfficeId,
  viewMode,
  pending,
  error,
  flatDepartments,
  selectOffice,
  addNode,
  editNode,
  deleteNode,
} = useMunicipalOrganization()

const isMobileSidebarOpen = ref(false)

function handleAddSubNodeFromSidebar(officeId: string) {
  selectOffice(officeId)
}
</script>

<template>
  
  <div class="w-full bg-[#fafafa] dark:bg-[#121212] min-h-[85vh] py-6 sm:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6  space-y-4">
      <div class="flex items-center justify-between lg:hidden bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-xl p-3 shadow-xs">
        <div class="flex items-center space-x-2 min-w-0">
          <Building2 class="size-4 text-[#dc2626] shrink-0" />
          <span class="text-xs font-bold text-neutral-900 dark:text-white truncate">Municipal Organization</span>
        </div>
        <button
          type="button"
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
          class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg cursor-pointer shrink-0"
        >
          <ListFilter class="size-3.5 text-[#dc2626]" />
          <span>{{ isMobileSidebarOpen ? 'Close' : 'Offices (' + flatDepartments.length + ')' }}</span>
        </button>
      </div>

      <div class="flex mx-auto gap-4">

        <main class="max-w-7xl space-y-3 min-w-7xl">
          <div class="w-full overflow-x-auto">
            <OrganizationAuthMunicipalOrgChart
              :tree-root="activeTreeData"
              :positions="positions"
              :label-options="labelOptions"
              :selected-office-id="selectedOfficeId"
              :view-mode="viewMode"
              :pending="pending"
              :error="error"
              @select-office="selectOffice"
              @add-node="addNode"
              @edit-node="editNode"
              @delete-node="deleteNode"
            />
          </div>
        </main>
      </div>

    </div>
  </div>
</template>