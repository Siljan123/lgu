<script setup lang="ts">
import { type VacantPosition } from '../../composables/useCareers'
import JobDetailsModal from './JobDetailsModal.vue'
import CareersSearchInput from './CareersSearchInput.vue'
import {
  Filter,
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from '@lucide/vue'

const props = defineProps<{
  vacancies: VacantPosition[]
  searchQuery: string
  officeFilter: string
  statusFilter: string
  salaryFilter: string
  selectedJob: VacantPosition | null
  isModalOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:officeFilter', val: string): void
  (e: 'update:statusFilter', val: string): void
  (e: 'update:salaryFilter', val: string): void
  (e: 'openModal', position: VacantPosition): void
  (e: 'closeModal'): void
}>()

const vacancySuggestedTags = [
  'Human Resource',
  'Accountant',
  'Environment',
  'Programmer',
  'Midwife',
  'Civil Engineer',
  'Permanent',
  'SG 15',
  'CPA'
]

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <div class="space-y-8">

    <!-- Section Intro Card -->
    <div>
      <div class="flex items-center gap-2">
        <h2 class="text-xl uppercase tracking-wider font-semibold text-primary">
          Plantilla Vacancies & Publication Guidelines
        </h2>
      </div>

      <p class="text-sm md:text-base mt-4 text-[#707070] dark:text-[#a3a3a3] leading-relaxed max-w-[85ch]">
        The Municipal Government of San Francisco, Agusan del Sur is currently accepting applications for the following plantilla positions. Interested and qualified applicants are encouraged to review the qualification standards, prepare the required documents, and submit their application within the specified publication period. All vacancies are posted in accordance with the Civil Service Commission's guidelines on the merit and fitness principle.
      </p>
    </div>

    <!-- Filter & Search Controls Bar -->
    <div class="p-4 sm:p-5 rounded-xl border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        
        <div class="md:col-span-6">
          <CareersSearchInput
            :modelValue="searchQuery"
            @update:modelValue="emit('update:searchQuery', $event)"
            placeholder="Search by position title, item number, or department..."
            :suggestedTags="vacancySuggestedTags"
            label="Suggested Vacancy Keywords"
          />
        </div>

        <div class="md:col-span-3">
          <select
            :value="officeFilter"
            @change="emit('update:officeFilter', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] text-primary focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
          >
            <option value="ALL">All Departments / Offices</option>
            <option value="HRMO">HRMO (Human Resource)</option>
            <option value="ACCOUNTING">Accounting Office</option>
            <option value="MENRO">MENRO (Environment)</option>
            <option value="ITMD">IT & Management Division</option>
            <option value="MHO">Municipal Health Office</option>
            <option value="ENGINEERING">Municipal Engineering</option>
          </select>
        </div>

        <!-- Salary Grade Level Filter -->
        <div class="md:col-span-3">
          <select
            :value="salaryFilter"
            @change="emit('update:salaryFilter', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] text-primary focus:outline-none focus:ring-1 focus:ring-[#171717] transition-colors"
          >
            <option value="ALL">All Salary Grades</option>
            <option value="ENTRY">Entry Level (SG 1 - SG 11)</option>
            <option value="MID">Mid Technical (SG 12 - SG 18)</option>
            <option value="EXEC">Supervisory / Exec (SG 19+)</option>
          </select>
        </div>

      </div>

      <!-- Quick Filter Pills -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#dfdfdf]/60 dark:border-[#333333] text-xs">
        <div class="flex items-center gap-2">
          <span class="text-[#707070] dark:text-[#a3a3a3] font-medium">Employment:</span>
          <button
            type="button"
            @click="emit('update:statusFilter', 'ALL')"
            :class="[
              'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
              statusFilter === 'ALL'
                ? 'bg-primary text-white dark:bg-white dark:text-black'
                : 'bg-[#ffffff] dark:bg-[#1c1c1c] border text-[#707070] hover:text-primary'
            ]"
          >
            All
          </button>
          <button
            type="button"
            @click="emit('update:statusFilter', 'Permanent')"
            :class="[
              'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
              statusFilter === 'Permanent'
                ? 'bg-primary text-white dark:bg-white dark:text-black'
                : 'bg-[#ffffff] dark:bg-[#1c1c1c] border text-[#707070] hover:text-primary'
            ]"
          >
            Permanent Plantilla
          </button>
          <button
            type="button"
            @click="emit('update:statusFilter', 'Coterminous')"
            :class="[
              'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
              statusFilter === 'Coterminous'
                ? 'bg-primary text-white dark:bg-white dark:text-black'
                : 'bg-[#ffffff] dark:bg-[#1c1c1c] border text-[#707070] hover:text-primary'
            ]"
          >
            Coterminous
          </button>
        </div>

        <span class="text-[#707070] dark:text-[#a3a3a3] font-medium">
          Showing <strong class="text-primary">{{ vacancies.length }}</strong> open {{ vacancies.length === 1 ? 'position' : 'positions' }}
        </span>
      </div>
    </div>

    <div v-if="vacancies.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <article
        v-for="job in vacancies"
        :key="job.id"
        class="group p-6 rounded-sm border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#ffffff] dark:bg-[#1c1c1c] hover:border-brand/50 transition-all duration-200 flex flex-col justify-between space-y-6 shadow-xs relative"
      >
        <!-- Top Bar: Item No & Status -->
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="px-2.5 py-0.5 rounded-md bg-[#fafafa] dark:bg-[#252525] border text-[11px] font-mono font-medium text-[#707070] dark:text-[#a3a3a3]">
              Item No: {{ job.itemNo }}
            </span>
          </div>

          <!-- Position Title & Office -->
          <div class="space-y-1">
            <h3 class="text-xl font-medium tracking-tight text-primary group-hover:text-brand transition-colors leading-snug">
              {{ job.positionTitle }}
            </h3>
            <p class="text-xs text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5">
              <Building2 class="size-3.5 text-brand shrink-0" />
              <span>{{ job.office }}</span>
            </p>
          </div>

          <!-- Salary Grade Highlight Pill -->
          <div class="p-3 rounded-lg bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf]/70 dark:border-[#333333] flex items-center justify-between text-xs">
            <div class="space-y-0.5">
              <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3] uppercase font-medium">Salary Grade</span>
              <span class="font-semibold text-primary block">SG {{ job.salaryGrade }}</span>
            </div>
            <div class="text-right space-y-0.5">
              <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3] uppercase font-medium">Monthly Pay</span>
              <span class="font-semibold text-brand block text-sm sm:text-base">{{ formatCurrency(job.monthlySalary) }}</span>
            </div>
          </div>

          <!-- Summary Qualifications Badges -->
          <div class="space-y-1.5 text-xs text-[#707070] dark:text-[#a3a3a3]">
            <div class="flex items-start gap-2">
              <span class="line-clamp-1"><strong class="text-primary font-medium">Education:</strong> {{ job.qualificationStandards.education }}</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="line-clamp-1"><strong class="text-primary font-medium">Eligibility:</strong> {{ job.qualificationStandards.eligibility }}</span>
            </div>
          </div>
        </div>

        <!-- Footer: Closing Date & CTA -->
        <div class="pt-4 border-t border-[#dfdfdf] dark:border-[#2a2a2a] flex items-center justify-between gap-3 text-xs">
          <div class="space-y-0.5 text-[#707070] dark:text-[#a3a3a3]">
            <span class="text-[10px] uppercase tracking-wider block font-medium">Deadline</span>
            <span class="font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
              <Calendar class="size-3" />
              {{ job.closingDate }}
            </span>
          </div>
          <button
            type="button"
            @click="emit('openModal', job)"
            class="px-4 py-2 rounded-lg bg-[#fafafa] hover:bg-brand dark:bg-[#252525] dark:hover:bg-brand text-primary hover:text-white dark:text-white border border-[#dfdfdf] dark:border-[#333333] hover:border-brand font-medium text-xs transition-all flex items-center gap-1.5 group/btn cursor-pointer"
          >
            <span>View QS & Apply</span>
            <ArrowUpRight class="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>

      </article>

    </div>

    <!-- Empty State -->
    <div v-else class="py-16 text-center rounded-xl border border-dashed border-[#dfdfdf] dark:border-[#333333] space-y-3">
      <Briefcase class="size-10 text-[#707070] mx-auto stroke-1" />
      <h3 class="text-base font-medium text-primary">No Plantilla Vacancies Match Your Filter</h3>
      <p class="text-xs text-[#707070] dark:text-[#a3a3a3] max-w-md mx-auto">
        Try broadening your search term or selecting one of the suggested tags above.
      </p>
      <button
        type="button"
        @click="emit('update:searchQuery', ''); emit('update:officeFilter', 'ALL'); emit('update:statusFilter', 'ALL'); emit('update:salaryFilter', 'ALL');"
        class="px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 cursor-pointer"
      >
        Reset All Filters
      </button>
    </div>

    <!-- Job Details Modal Component -->
    <JobDetailsModal
      :isOpen="isModalOpen"
      :position="selectedJob"
      @close="emit('closeModal')"
    />

  </div>
</template>
