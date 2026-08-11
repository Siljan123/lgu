<script setup lang="ts">
import { type VacantPosition } from '../../composables/useCareers'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/../layers/base/app/components/ui/dialog'
import {
  X,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Download,
  AlertCircle
} from '@lucide/vue'

const props = defineProps<{
  isOpen: boolean
  position: VacantPosition | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(val)
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && handleClose()">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-xl bg-[#ffffff] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2a2a2a] text-primary">
      
      <div v-if="position" class="space-y-0">
        <!-- Modal Sticky Header -->
        <div class="sticky top-0 z-10 bg-[#ffffff]/95 dark:bg-[#1c1c1c]/95 backdrop-blur-sm border-b border-[#dfdfdf] dark:border-[#2a2a2a] px-6 py-5 flex items-start justify-between gap-4">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider">
                Item No: {{ position.itemNo }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-[#fafafa] dark:bg-[#252525] border text-xs font-medium text-[#707070] dark:text-[#a3a3a3]">
                {{ position.employmentStatus }}
              </span>
            </div>

            <DialogTitle class="text-2xl sm:text-3xl font-medium tracking-tight text-primary leading-tight">
              {{ position.positionTitle }}
            </DialogTitle>

            <DialogDescription class="text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5 pt-0.5">
              <Building2 class="size-4 text-brand shrink-0" aria-hidden="true" />
              <span>{{ position.office }}</span>
            </DialogDescription>
          </div>

          <button
            type="button"
            @click="handleClose"
            class="p-2 rounded-lg text-[#707070] hover:text-primary hover:bg-[#fafafa] dark:hover:bg-[#252525] transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X class="size-5" />
          </button>
        </div>

        <!-- Salary & Publication Info Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#dfdfdf] dark:divide-[#2a2a2a] border-b border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] text-xs">
          <div class="p-4 space-y-1">
            <span class="text-[#707070] dark:text-[#a3a3a3] font-medium uppercase text-[11px] block">Salary Grade</span>
            <span class="font-semibold text-primary text-sm sm:text-base block">SG {{ position.salaryGrade }}</span>
          </div>

          <div class="p-4 space-y-1">
            <span class="text-[#707070] dark:text-[#a3a3a3] font-medium uppercase text-[11px] block">Monthly Base Pay</span>
            <span class="font-semibold text-brand text-sm sm:text-base block">{{ formatCurrency(position.monthlySalary) }}</span>
          </div>

          <div class="p-4 space-y-1">
            <span class="text-[#707070] dark:text-[#a3a3a3] font-medium uppercase text-[11px] block">Posting Date</span>
            <span class="font-medium text-primary block">{{ position.postingDate }}</span>
          </div>

          <div class="p-4 space-y-1">
            <span class="text-[#707070] dark:text-[#a3a3a3] font-medium uppercase text-[11px] block">Closing Deadline</span>
            <span class="font-semibold text-red-600 dark:text-red-400 block">{{ position.closingDate }}</span>
          </div>
        </div>

        <!-- Body Content -->
        <div class="p-6 sm:p-8 space-y-8">

          <!-- Qualification Standards Section -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 border-b border-[#dfdfdf] dark:border-[#2a2a2a] pb-2">
              <span class="size-2 rounded-full bg-brand"></span>
              <h3 class="text-xs uppercase tracking-wider font-semibold text-primary">
                CSC Minimum Qualification Standards (QS)
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-4 rounded-lg border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] space-y-1.5">
                <div class="flex items-center gap-2 font-medium text-primary text-xs uppercase tracking-wide">
                  <GraduationCap class="size-4 text-brand" />
                  <span>Education</span>
                </div>
                <p class="text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                  {{ position.qualificationStandards.education }}
                </p>
              </div>

              <div class="p-4 rounded-lg border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] space-y-1.5">
                <div class="flex items-center gap-2 font-medium text-primary text-xs uppercase tracking-wide">
                  <Briefcase class="size-4 text-brand" />
                  <span>Work Experience</span>
                </div>
                <p class="text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                  {{ position.qualificationStandards.experience }}
                </p>
              </div>

              <div class="p-4 rounded-lg border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] space-y-1.5">
                <div class="flex items-center gap-2 font-medium text-primary text-xs uppercase tracking-wide">
                  <Clock class="size-4 text-brand" />
                  <span>Training Hours</span>
                </div>
                <p class="text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                  {{ position.qualificationStandards.training }}
                </p>
              </div>

              <div class="p-4 rounded-lg border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] space-y-1.5">
                <div class="flex items-center gap-2 font-medium text-primary text-xs uppercase tracking-wide">
                  <Award class="size-4 text-brand" />
                  <span>Civil Service Eligibility</span>
                </div>
                <p class="text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                  {{ position.qualificationStandards.eligibility }}
                </p>
              </div>
            </div>

            <!-- Competencies -->
            <div class="pt-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] block mb-2">
                Core & Organizational Competencies
              </span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="comp in position.qualificationStandards.competencies"
                  :key="comp"
                  class="px-3 py-1 rounded-md bg-[#fafafa] dark:bg-[#252525] border border-[#dfdfdf] dark:border-[#333333] text-xs text-primary font-normal"
                >
                  • {{ comp }}
                </span>
              </div>
            </div>
          </div>

          <!-- Duties & Responsibilities -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 border-b border-[#dfdfdf] dark:border-[#2a2a2a] pb-2">
              <span class="size-2 rounded-full bg-brand"></span>
              <h3 class="text-xs uppercase tracking-wider font-semibold text-primary">
                Main Duties & Responsibilities
              </h3>
            </div>

            <ul class="space-y-2 text-xs sm:text-sm text-[#707070] dark:text-[#a3a3a3]">
              <li
                v-for="(duty, idx) in position.duties"
                :key="idx"
                class="flex items-start gap-2.5 leading-relaxed"
              >
                <CheckCircle2 class="size-4 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                <span>{{ duty }}</span>
              </li>
            </ul>
          </div>

          <!-- Required Application Documents Checklist -->
          <div class="p-5 rounded-xl border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#202020] space-y-4">
            <div class="flex items-center gap-2">
              <FileText class="size-4 text-brand shrink-0" aria-hidden="true" />
              <h3 class="text-xs uppercase tracking-wider font-semibold text-primary">
                Required Application Documents (CSC Resolution No. 1700653)
              </h3>
            </div>

            <ol class="space-y-2 text-xs text-[#707070] dark:text-[#a3a3a3] list-decimal list-inside leading-relaxed">
              <li v-for="(doc, idx) in position.requiredDocuments" :key="idx" class="pl-1">
                <span class="text-primary font-medium">{{ doc }}</span>
              </li>
            </ol>
          </div>

          <!-- How to Apply Notice -->
          <div class="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3 text-xs">
            <div class="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
              <AlertCircle class="size-4 shrink-0" />
              <span>Application Submission Guidelines</span>
            </div>

            <p class="text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
              Interested and qualified applicants should signify their interest in writing. Attach the required documents to the application letter and send to the address below not later than <strong class="text-primary font-semibold">{{ position.closingDate }}</strong>. Late submissions and incomplete applications will not be processed.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-500/20 text-xs">
              <div class="space-y-1">
                <span class="font-medium text-primary flex items-center gap-1.5">
                  <MapPin class="size-3.5 text-brand" /> In-Person Submission
                </span>
                <p class="text-[#707070] dark:text-[#a3a3a3]">
                  Human Resource Management Office (HRMO)<br />
                  1st Floor, Municipal Hall, San Francisco, Agusan del Sur
                </p>
              </div>

              <div class="space-y-1">
                <span class="font-medium text-primary flex items-center gap-1.5">
                  <Mail class="size-3.5 text-brand" /> Email Submission
                </span>
                <p class="text-[#707070] dark:text-[#a3a3a3]">
                  hrmo@sanfranciscoads.gov.ph<br />
                  <span class="text-[11px]">Subject line: Application - {{ position.positionTitle }} ({{ position.itemNo }})</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Sticky Footer CTA -->
        <div class="sticky bottom-0 bg-[#ffffff] dark:bg-[#1c1c1c] border-t border-[#dfdfdf] dark:border-[#2a2a2a] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div class="text-xs text-[#707070] dark:text-[#a3a3a3]">
            Submission deadline: <strong class="text-primary font-semibold">{{ position.closingDate }}</strong>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 rounded-lg border border-[#dfdfdf] dark:border-[#333333] text-xs font-medium text-primary hover:bg-[#fafafa] dark:hover:bg-[#252525] transition-colors"
            >
              Close
            </button>

            <a
              :href="`mailto:hrmo@sanfranciscoads.gov.ph?subject=Application for ${encodeURIComponent(position.positionTitle)} (${encodeURIComponent(position.itemNo)})`"
              class="px-4 py-2 rounded-lg bg-brand text-white text-xs font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <Mail class="size-4" />
              Apply via Email
            </a>
          </div>
        </div>

      </div>

    </DialogContent>
  </Dialog>
</template>
