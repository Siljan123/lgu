<script setup lang="ts">
import type { CharterStep } from '../../composables/useCitizensCharter'
import { Clock, ChevronRight } from '@lucide/vue'

defineProps<{
  steps: CharterStep[] | null
  totalProcessingTime: string | null
}>()
</script>

<template>
  <div class="w-full overflow-x-auto rounded-lg border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#ffffff] dark:bg-[#1c1c1c]">
    <table class="w-full text-left text-sm border-collapse">
      <thead>
        <tr class="border-b border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#252525] text-[11px] uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3]">
          <th class="py-3 px-4 w-[28%] font-medium">Steps for Client</th>
          <th class="py-3 px-4 w-[32%] font-medium">Service Provider Step</th>
          <th class="py-3 px-4 w-[18%] font-medium">Processing Time</th>
          <th class="py-3 px-4 w-[22%] font-medium">Responsible Person(s)</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[#dfdfdf] dark:divide-[#2a2a2a]">
        <tr 
          v-for="(step, idx) in steps" 
          :key="idx"
          class="group transition-colors hover:bg-[#fafafa]/80 dark:hover:bg-[#252525]/80"
        >
          <!-- Steps for Client -->
          <td class="py-4 px-4 align-top">
            <div class="flex flex-col gap-1">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171717] dark:text-[#ffffff] tracking-wider">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-brand"></span>
                {{ step.stepNo }}
              </span>
              <p class="text-sm font-medium leading-snug text-[#171717] dark:text-[#ffffff]">
                {{ step.clientStep }}
              </p>
            </div>
          </td>

          <!-- Service Provider Step -->
          <td class="py-4 px-4 align-top">
            <p class="text-sm leading-relaxed text-[#212121] dark:text-[#d4d4d4]">
              {{ step.serviceProviderStep }}
            </p>
          </td>

          <!-- Processing Time -->
          <td class="py-4 px-4 align-top">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#252525] text-xs font-medium text-[#171717] dark:text-[#f2f2f2]">
              <Clock class="size-3.5 text-[#707070] dark:text-[#a3a3a3]" aria-hidden="true" />
              {{ step.processingTime }}
            </span>
          </td>

          <!-- Responsible Person(s) -->
          <td class="py-4 px-4 align-top">
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="(person, pIdx) in step.responsiblePersons" 
                :key="pIdx"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fafafa] dark:bg-[#252525] border border-[#dfdfdf] dark:border-[#2a2a2a] text-xs text-[#212121] dark:text-[#d4d4d4]"
              >
                <ChevronRight class="size-3 text-[#707070] dark:text-[#a3a3a3]" aria-hidden="true" />
                {{ person }}
              </span>
            </div>
          </td>
        </tr>

        <!-- Summary Row -->
        <tr class="bg-[#fafafa] dark:bg-[#252525] text-xs border-t-2 border-[#dfdfdf] dark:border-[#2a2a2a]">
          <td class="py-3 px-4 font-semibold tracking-wider uppercase text-[#171717] dark:text-[#ffffff]">
            End of Transaction
          </td>
          <td class="py-3 px-4 font-medium tracking-wider text-[#707070] dark:text-[#a3a3a3] uppercase">
            Total Processing Time
          </td>
          <td class="py-3 px-4 font-semibold">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#ffffff] dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff]">
              {{ totalProcessingTime }}
            </span>
          </td>
          <td class="py-3 px-4 text-[#707070] dark:text-[#a3a3a3] italic text-xs">
            Standard Operating Procedure
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

