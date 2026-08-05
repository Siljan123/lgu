<script setup lang="ts">
import { useCitizensCharterData } from '../../composables/useCitizensCharter'
import CitizensCharterTable from './CitizensCharterTable.vue'
import {
  Search,
  X,
  Building2,
  FileText,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
} from '@lucide/vue'

const {
  searchQuery,
  selectedDepartmentId,
  selectedDepartment,
  filteredDepartments,
  selectDepartment,
} = useCitizensCharterData()
</script>

<template>
  <section class="w-full bg-[#fafafa] dark:bg-[#1c1c1c] text-primary py-12 md:py-16 transition-colors">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <aside class="lg:col-span-4 bg-[#fafafa] dark:bg-[#202020] border rounded-xl p-5 md:p-6 space-y-6 lg:sticky lg:top-24">
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xs uppercase tracking-wider font-semibold">
                Select Municipal Office
              </h2>
              <Badge>
                {{ filteredDepartments.length }} Offices
              </Badge>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search office or service..."
                class="w-full pl-9 pr-8 py-2 text-xs rounded-md border bg-[#ffffff] dark:bg-[#1c1c1c] placeholder-[#707070] dark:placeholder-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#ffffff] transition-colors"
              />
              <Search class="size-4 text-[#707070] dark:text-[#a3a3a3] absolute left-2.5 top-2.5" aria-hidden="true" />
              <button
                v-if="searchQuery"
                type="button"
                @click="searchQuery = ''"
                class="absolute right-2.5 top-2.5 text-[#707070] hover:text-[#171717] dark:hover:text-[#ffffff] transition-colors"
                aria-label="Clear search"
              >
                <X class="size-4" />
              </button>
            </div>
          </div>

          <!-- Office List -->
          <div class="space-y-2">
            <div
              v-if="filteredDepartments.length === 0"
              class="py-8 text-center text-xs text-[#707070] dark:text-[#a3a3a3]"
            >
              No offices or services match "<span class="font-medium">{{ searchQuery }}</span>"
            </div>

            <button
              v-for="dept in filteredDepartments"
              :key="dept.id"
              type="button"
              @click="selectDepartment(dept.id)"
              :class="[
                'w-full text-left p-3.5 rounded-lg border transition-all relative flex flex-col gap-1.5 group cursor-pointer',
                selectedDepartmentId === dept.id
                  ? 'bg-[#ffffff] dark:bg-[#1c1c1c] border-[#171717] dark:border-[#ffffff] shadow-sm'
                  : 'bg-[#fafafa] dark:bg-[#202020] hover:bg-[#ffffff] dark:hover:bg-[#1c1c1c] hover:border-[#c7c7c7] dark:hover:border-[#3a3a3a]'
              ]"
            >
              <span
                :class="[
                  'absolute -left-px top-3 bottom-3 w-1 rounded-r-md transition-all',
                  selectedDepartmentId === dept.id
                    ? 'bg-brand opacity-100'
                    : 'bg-transparent opacity-0 group-hover:bg-[#dfdfdf] dark:group-hover:bg-[#3a3a3a]'
                ]"
              ></span>

              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-semibold uppercase tracking-wider">
                  {{ dept.shortCode }}
                </span>
                <Badge variant="outline" class="text-xs">
                   {{ dept.services.length }} {{ dept.services.length === 1 ? 'Service' : 'Services' }}
                </Badge>
              </div>

              <p class="text-xs text-[#707070] dark:text-[#a3a3a3] font-normal leading-snug line-clamp-2">
                {{ dept.name }}
              </p>
            </button>
          </div>

          <div class="pt-4 border-t flex items-center gap-2 text-[11px] text-[#707070] dark:text-[#a3a3a3]">
            <ShieldCheck class="size-4 text-brand shrink-0" aria-hidden="true" />
            <span>Republic Act 11032 Compliant • No Noon Break Policy</span>
          </div>

        </aside>

        <main class="lg:col-span-8 space-y-8">
          
          <div v-if="selectedDepartment" class="border-b pb-6 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span class="text-xs uppercase tracking-wider font-semibold text-brand">
                  {{ selectedDepartment.shortCode }} Public Services
                </span>
                <h2 class="text-2xl sm:text-3xl font-medium tracking-tight mt-0.5">
                  {{ selectedDepartment.name }}
                </h2>
              </div>

              <div class="flex items-center gap-2">
                <Badge variant="outline">
                  <CheckCircle2 class="size-3.5 text-brand" aria-hidden="true" />
                  {{ selectedDepartment.services.length }} {{ selectedDepartment.services.length === 1 ? 'Service Charter' : 'Service Charters' }}
                </Badge>
              </div>
            </div>
            <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
              Below are the official standard operating procedures, required documentation, turnaround fees, and client-provider workflows for all services handled under this office.
            </p>
          </div>

          <!-- Services List -->
          <div v-if="selectedDepartment && selectedDepartment.services.length > 0" class="space-y-8">
            
            <article
              v-for="(service, index) in selectedDepartment.services"
              :key="service.id"
              class="rounded-xl border bg-[#ffffff] dark:bg-[#1c1c1c] overflow-hidden shadow-xs space-y-0"
            >
              <!-- Service Header Bar -->
              <div class="bg-[#fafafa] dark:bg-[#252525] border-b px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="size-7 rounded-md bg-[#ffffff] dark:bg-[#1c1c1c] border text-xs font-semibold flex items-center justify-center">
                    0{{ index + 1 }}
                  </span>
                  <div>
                    <h3 class="text-base sm:text-lg font-medium leading-tight">
                      {{ service.serviceRendered }}
                    </h3>
                    <p class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-0.5">
                      {{ service.departmentName }}
                    </p>
                  </div>
                </div>

                <Badge variant="outline">
                  <Clock class="size-3.5 text-brand" aria-hidden="true" />
                  Time: {{ service.totalProcessingTime }}
                </Badge>
              </div>

              <!-- Service Specs Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#dfdfdf] dark:divide-[#2a2a2a] border-b bg-[#ffffff] dark:bg-[#1c1c1c] text-xs">
                <div class="p-4 space-y-1">
                  <span class="text-[#707070] dark:text-[#a3a3a3] text-[11px] uppercase font-medium flex items-center gap-1.5">
                    <Clock class="size-3.5 text-[#707070] dark:text-[#a3a3a3]" aria-hidden="true" />
                    Availability
                  </span>
                  <p class="text-[#171717] dark:text-[#f2f2f2] font-normal leading-snug">
                    {{ service.availability }}
                  </p>
                </div>

                <div class="p-4 space-y-1">
                  <span class="text-[#707070] dark:text-[#a3a3a3] text-[11px] uppercase font-medium flex items-center gap-1.5">
                    <FileText class="size-3.5 text-[#707070] dark:text-[#a3a3a3]" aria-hidden="true" />
                    Requirements
                  </span>
                  <p class="text-[#171717] dark:text-[#f2f2f2] font-normal leading-snug">
                    {{ service.requirements }}
                  </p>
                </div>

                <div class="p-4 space-y-1">
                  <span class="text-[#707070] dark:text-[#a3a3a3] text-[11px] uppercase font-medium flex items-center gap-1.5">
                    <Coins class="size-3.5 text-[#707070] dark:text-[#a3a3a3]" aria-hidden="true" />
                    Fees
                  </span>
                  <p class="text-[#171717] dark:text-[#f2f2f2] font-semibold leading-snug">
                    {{ service.fees }}
                  </p>
                </div>
              </div>

              <!-- Workflow Steps Table -->
              <div class="p-4 sm:p-6 space-y-3 bg-[#ffffff] dark:bg-[#1c1c1c]">
                <div class="flex items-center justify-between pb-1">
                  <h4 class="text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
                    <span class="size-2 rounded-full bg-brand"></span>
                    Client & Provider Step-by-Step Workflow
                  </h4>
                </div>

                <CitizensCharterTable
                  :steps="service.steps"
                  :totalProcessingTime="service.totalProcessingTime"
                />
              </div>

            </article>

          </div>

          <!-- Fallback if no services match office -->
          <div v-else class="py-16 text-center text-sm text-[#707070] dark:text-[#a3a3a3] rounded-xl border border-dashed">
            No services found for this office.
          </div>

        </main>

      </div>
    </div>
  </section>
</template>
