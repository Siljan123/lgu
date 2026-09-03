<script setup lang="ts">
import {
  Building2,
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
  layout: 'sidebar-test',
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
</script>

<template>
  <div class="space-y-4 min-h-[85vh]">
    <div class="p-4 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center space-x-3 min-w-0">
        <div class="size-10 rounded-lg bg-[#dc2626]/10 dark:bg-[#dc2626]/20 flex items-center justify-center text-[#dc2626] shrink-0">
          <Building2 class="size-5" />
        </div>
        <div class="min-w-0">
          <h2 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate">
            Municipal Organizational Structure
          </h2>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            Manage municipal department hierarchy, offices, personnel, and organizational units.
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <span class="text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg">
          {{ flatDepartments.length }} Total Units
        </span>
      </div>
    </div>
    <!-- Chart Canvas -->
    <div class="w-full">
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
  </div>
</template>