<script setup lang="ts">
import { computed } from 'vue'
import type { BarangayOfficial } from '../../composables/useBarangayDirectory'
import { UserCheck, Shield, FileText, Landmark, Award, Heart, BookOpen, Wrench, Sprout, Gavel, Sparkles } from '@lucide/vue'

const props = defineProps<{
  officials: BarangayOfficial[]
  barangayName: string
}>()

const captain = computed(() => props.officials.find(o => o.role === 'captain'))
const secretary = computed(() => props.officials.find(o => o.role === 'secretary'))
const treasurer = computed(() => props.officials.find(o => o.role === 'treasurer'))
const kagawads = computed(() => props.officials.filter(o => o.role === 'kagawad'))
const skChairperson = computed(() => props.officials.find(o => o.role === 'sk_chairperson'))

const getCommitteeIcon = (committee?: string) => {
  if (!committee) return Shield
  const c = committee.toLowerCase()
  if (c.includes('peace') || c.includes('order')) return Shield
  if (c.includes('finance') || c.includes('budget')) return Landmark
  if (c.includes('health') || c.includes('welfare') || c.includes('sanitation')) return Heart
  if (c.includes('education') || c.includes('culture')) return BookOpen
  if (c.includes('infrastructure') || c.includes('works') || c.includes('planning')) return Wrench
  if (c.includes('agriculture') || c.includes('environment')) return Sprout
  if (c.includes('rules') || c.includes('laws') || c.includes('ordinances') || c.includes('legal')) return Gavel
  return Award
}
</script>

<template>
    <!-- Title & Header -->
  <Card class="p-4">
    <CardHeader> 
      <div class="flex items-center justify-between border-b border-[#dfdfdf] dark:border-[#333333] pb-4">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-lg bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171]">
            <UserCheck class="size-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-[#171717] dark:text-[#ffffff]">
              Barangay Officials & Organizational Structure
            </h2>
            <p class="text-xs text-[#707070] dark:text-[#a3a3a3]">
              Sangguniang Barangay Leadership of {{ barangayName }}
            </p>
          </div>
        </div>
        <span class="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fafafa] dark:bg-[#1c1c1c] text-[#171717] dark:text-[#ffffff] border border-[#dfdfdf] dark:border-[#333333]">
          Term 2023–2026
        </span>
      </div>
    </CardHeader>
    <!-- Tree Structure Container -->
    <CardContent >
      <div class="relative max-w-4xl mx-auto space-y-8 pt-2">
      <!-- LEVEL 1: PUNONG BARANGAY (BARANGAY CAPTAIN) -->
      <div class="flex justify-center">
        <div class="relative w-full max-w-md bg-[#fafafa] dark:bg-[#1c1c1c] border-2 border-[#dc2626] rounded-xl p-5 shadow-sm text-center space-y-2 group hover:shadow-md transition-all">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#dc2626] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
            Punong Barangay (Captain)
          </div>
          
          <div class="pt-2">
            <h3 class="text-base font-extrabold text-[#171717] dark:text-[#ffffff]">
              {{ captain?.name || 'Hon. Barangay Captain' }}
            </h3>
            <p class="text-xs text-[#dc2626] dark:text-[#f87171] font-medium">
              Chief Executive Officer • {{ barangayName }}
            </p>
          </div>
        </div>
      </div>

      <!-- Connector Vertical Line 1 -->
      <div class="flex justify-center">
        <div class="w-0.5 h-6 bg-[#dfdfdf] dark:bg-[#333333]"></div>
      </div>

      <!-- LEVEL 2: EXECUTIVE APPOINTEES (SECRETARY & TREASURER) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto relative">
        
        <!-- Barangay Secretary -->
        <div class="bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-lg p-4 text-center space-y-1 hover:border-[#dc2626] transition-colors">
          <div class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-semibold text-[#171717] dark:text-[#ffffff] uppercase tracking-wider mb-1">
            <FileText class="size-3 text-[#dc2626]" />
            <span>Barangay Secretary</span>
          </div>
          <h4 class="text-sm font-bold text-[#171717] dark:text-[#ffffff]">
            {{ secretary?.name || 'Barangay Secretary' }}
          </h4>
          <p class="text-[11px] text-[#707070] dark:text-[#a3a3a3]">
            Records & Secretariat Head
          </p>
        </div>

        <!-- Barangay Treasurer -->
        <div class="bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-lg p-4 text-center space-y-1 hover:border-[#dc2626] transition-colors">
          <div class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[10px] font-semibold text-[#171717] dark:text-[#ffffff] uppercase tracking-wider mb-1">
            <Landmark class="size-3 text-[#dc2626]" />
            <span>Barangay Treasurer</span>
          </div>
          <h4 class="text-sm font-bold text-[#171717] dark:text-[#ffffff]">
            {{ treasurer?.name || 'Barangay Treasurer' }}
          </h4>
          <p class="text-[11px] text-[#707070] dark:text-[#a3a3a3]">
            Finance & Disbursing Officer
          </p>
        </div>

      </div>

      <!-- Connector Vertical Line 2 -->
      <div class="flex justify-center">
        <div class="w-0.5 h-6 bg-[#dfdfdf] dark:bg-[#333333]"></div>
      </div>

      <!-- LEVEL 3: SANGGUNIANG BARANGAY MEMBERS (KAGAWADS) -->
      <div class="space-y-4">
        <div class="text-center">
          <span class="text-xs uppercase font-bold tracking-wider text-[#707070] dark:text-[#a3a3a3] bg-[#ffffff] dark:bg-[#202020] px-3 py-1 border border-[#dfdfdf] dark:border-[#333333] rounded-full">
            Sangguniang Barangay Councilors (Kagawads)
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(kagawad, idx) in kagawads"
            :key="kagawad.id"
            class="bg-[#fafafa] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-lg p-3.5 space-y-1.5 hover:border-[#a3a3a3] transition-colors"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono text-[#dc2626] font-bold">
                KAGAWAD #{{ idx + 1 }}
              </span>
              <component :is="getCommitteeIcon(kagawad.committee)" class="size-3.5 text-[#707070]" />
            </div>

            <div>
              <h5 class="text-xs font-bold text-[#171717] dark:text-[#ffffff] truncate">
                {{ kagawad.name }}
              </h5>
              <p v-if="kagawad.committee" class="text-[11px] text-[#707070] dark:text-[#a3a3a3] truncate">
                Committee on {{ kagawad.committee }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Connector Vertical Line 3 -->
      <div class="flex justify-center" v-if="skChairperson">
        <div class="w-0.5 h-6 bg-[#dfdfdf] dark:bg-[#333333]"></div>
      </div>

      <!-- LEVEL 4: SANGGUNIANG KABATAAN (SK CHAIRPERSON) -->
      <div v-if="skChairperson" class="flex justify-center">
        <div class="w-full max-w-md bg-[#fafafa] dark:bg-[#1c1c1c] border border-blue-500/30 dark:border-blue-400/30 rounded-xl p-4 text-center space-y-1.5 shadow-sm">
          <div class="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Sangguniang Kabataan (SK) Chairperson</span>
          </div>

          <div>
            <h4 class="text-sm font-bold text-[#171717] dark:text-[#ffffff]">
              {{ skChairperson.name }}
            </h4>
            <p class="text-[11px] text-[#707070] dark:text-[#a3a3a3]">
              Ex-Officio Member • Youth & Sports Development
            </p>
          </div>
        </div>
      </div>
    </div>
    </CardContent>
  </Card>
</template>

