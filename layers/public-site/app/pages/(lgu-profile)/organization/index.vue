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
  layout: 'guest',
 
})

const {
  activeTreeData,
  positions,
  labelOptions,
  selectedOfficeId,
  selectedOffice,
  isRootSelected,
  viewMode,
  pending,
  error,
  flatDepartments,
  categorizedOffices,
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
    <UiHeroSection
    title="Organizational Structure"
    description=""
    />
  <div class="w-full bg-[#fafafa] dark:bg-[#121212] min-h-[85vh] py-6 sm:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
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

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        <!-- LEFT SIDEBAR: Office Selector & Navigation Menu -->
        <div
          class="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-6 space-y-4"
          :class="[
            isMobileSidebarOpen ? 'block' : 'hidden lg:block'
          ]"
        >
          <OrganizationMunicipalOrgSidebar
            :offices="flatDepartments"
            :categorized-offices="categorizedOffices"
            :selected-office-id="selectedOfficeId"
            @select-office="(id) => { selectOffice(id); isMobileSidebarOpen = false }"
            @add-sub-node="handleAddSubNodeFromSidebar"
          />
        </div>

        <!-- RIGHT MAIN: Branch Navigator & Interactive Org Chart -->
        <main class="lg:col-span-8 xl:col-span-9 space-y-3 min-w-0">

          <!-- Selected Office / Hierarchy Header Bar -->
          <div class="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center space-x-2.5 overflow-hidden min-w-0">
              <div class="truncate min-w-0">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 class="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {{ isRootSelected ? 'Full Municipal Structure' : selectedOffice?.title }}
                  </h3>
                  <span
                    v-if="!isRootSelected"
                    class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171] whitespace-nowrap"
                  >
                    Selected: {{ selectedOffice?.acronym || selectedOffice?.category || 'Office' }}
                  </span>
                </div>
                <p class="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {{ selectedOffice?.member?.[0]?.name }} • {{ selectedOffice?.member?.[0]?.position || selectedOffice?.member?.[0]?.role }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-2 shrink-0">
              <button
                v-if="!isRootSelected"
                type="button"
                @click="selectOffice('mayor-root')"
                class="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-colors cursor-pointer"
              >
                Show Full Structure
              </button>
              <span class="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">
                {{ flatDepartments.length }} Total Units
              </span>
            </div>
          </div>

          <!-- The Interactive Chart Canvas -->
          <div class="w-full overflow-x-auto">
            <OrganizationMunicipalOrgChart
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