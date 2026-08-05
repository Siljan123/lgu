<script setup lang="ts">
import type { CharterStep } from '../../composables/useCitizensCharter'
import {Clock4, ChevronRight} from '@lucide/vue'

defineProps<{
  steps: CharterStep[] | null
  totalProcessingTime: string | null
}>()
</script>

<template>
  <div class="w-full overflow-x-auto rounded-sm border border-neutral-200">
    <table class="w-full text-left text-sm border-collapse">
      <thead>
        <tr class="border-b border-neutral-200 dark:border-[#262b33] bg-neutral-100/90 dark:bg-[#14181f]/80 text-[11px] uppercase tracking-wider">
          <th class="py-3 px-4 w-[28%] font-semibold">Steps for Client</th>
          <th class="py-3 px-4 w-[32%] font-semibold">Service Provider Step</th>
          <th class="py-3 px-4 w-[18%] font-semibold">Processing Time</th>
          <th class="py-3 px-4 w-[22%] font-semibold">Responsible Person(s)</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-200 dark:divide-[#1e232b]">
        <tr 
          v-for="(step, idx) in steps" 
          :key="idx"
          class="group transition-colors hover:bg-neutral-50 dark:hover:bg-[#13171d]/60"
        >
          <!-- Steps for Client -->
          <td class="py-4 px-4 align-top">
            <div class="flex flex-col gap-1">
              <span class="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest">
                <span class="inline-block w-1.5 h-1.5 rounded-full animate-pulse"></span>
                {{ step.stepNo }}
              </span>
              <p class="text-sm font-medium leading-snug text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white">
                {{ step.clientStep }}
              </p>
            </div>
          </td>

          <!-- Service Provider Step -->
          <td class="py-4 px-4 align-top">
            <p class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {{ step.serviceProviderStep }}
            </p>
          </td>

          <!-- Processing Time -->
          <td class="py-4 px-4 align-top">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded border text-xs tex-red-800">
              <Clock4 class="w-3.5 h-3.5" />
              {{ step.processingTime }}
            </span>
          </td>

          <!-- Responsible Person(s) -->
          <td class="py-4 px-4 align-top">
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="(person, pIdx) in step.responsiblePersons" 
                :key="pIdx"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#1c222b] border border-neutral-200 dark:border-[#2b3340] text-xs text-neutral-800 dark:text-neutral-200"
              >
                <ChevronRight class="w-3 h-3" />
                {{ person }}
              </span>
            </div>
          </td>
        </tr>

        <!-- Summary Row -->
        <tr class="bg-neutral-100/90 dark:bg-[#11141a] text-xs border-t-2 border-neutral-300 dark:border-[#2b323d]">
          <td class="py-3 px-4 font-bold tracking-wider uppercase">
            End of the Transaction
          </td>
          <td class="py-3 px-4 font-semibold tracking-wider text-neutral-600 dark:text-neutral-400 uppercase">
            Total Processing Time
          </td>
          <td class="py-3 px-4 font-bold">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded border">
               {{ totalProcessingTime }}
            </span>
          </td>
          <td class="py-3 px-4 text-neutral-500 dark:text-neutral-500 italic text-xs">
            Standard Operating Procedure
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
