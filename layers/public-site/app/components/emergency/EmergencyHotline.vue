<script setup lang="ts">
import { ref, computed } from 'vue' // Added computed
import { 
  Phone, 
  PhoneCall, 
  Copy, 
  Check, 
  ShieldAlert, 
  Flame, 
  HeartPulse, 
  Building2, 
  Radio,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from '@lucide/vue'
import { EMERGENCY_HOTLINES, type EmergencyContact } from '../../composables/useEmergency'


const copiedId = ref<string | null>(null)

// --- MOBILE DROPDOWN LOGIC ---
const isExpanded = ref(false)

// --- DESKTOP SWAP/PAGINATION LOGIC ---
const desktopPage = ref(0)
const itemsPerDesktopPage = 4

const totalDesktopPages = computed(() => {
  return Math.ceil(EMERGENCY_HOTLINES.length / itemsPerDesktopPage)
})

const nextDesktopPage = () => {
  if (desktopPage.value < totalDesktopPages.value - 1) {
    desktopPage.value++
  }
}

const prevDesktopPage = () => {
  if (desktopPage.value > 0) {
    desktopPage.value--
  }
}

const copyNumber = (text: string, id: string) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Rescue & Disaster':
      return Radio
    case 'Hospital & Medical':
      return HeartPulse
    case 'Health Office':
      return Building2
    case 'Police & Security':
      return ShieldAlert
    case 'Fire Protection':
      return Flame
    default:
      return PhoneCall
  }
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-end px-1">
      <NuxtLink
        href="tel:911"
        class="inline-flex items-center gap-1.5 right-4 px-3 py-1 rounded-sm bg-red-600 hover:bg-red-700 text-[#ffffff] text-[11px] font-extrabold"
      >
        <PhoneCall :size="12" class="animate-shake-grow"/>
        <span>National Emergency: 911</span>
      </NuxtLink>
    </div>

    <div class="w-full dark:bg-[#202020] flex flex-col overflow-hidden">
      <div class="grid grid-cols-2 gap-2 sm:gap-3">
        <div
          v-for="(item, index) in EMERGENCY_HOTLINES"
          :key="item.id"
          class="w-full rounded-lg border border-[#dedede] bg-white p-2 dark:border-[#303030] dark:bg-[#202020]"
          :class="[
            isExpanded || index < 2 ? 'block' : 'hidden', 
            Math.floor(index / 4) === desktopPage ? 'sm:block' : 'sm:hidden'
          ]"
        >
          <!-- Agency Header -->
          <div class="flex items-start gap-2 sm:gap-3">
            <div
              class="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg text-white"
              :style="{ backgroundColor: item.badgeColor }"
            >
              <component
                :is="getCategoryIcon(item.category)"
                :size="16"
              />
            </div>

            <div class="min-w-0 flex-1">
              <h5 class="text-[10px] sm:text-sm font-bold leading-snug text-[#171717] dark:text-white line-clamp-2 sm:line-clamp-none">
                {{ item.agency }}
              </h5>
            </div>
          </div>

          <!-- Telephone Box -->
          <div class="mt-2 sm:mt-4 rounded-md border border-[#e2e2e2] bg-[#fafafa] p-2 sm:p-3 dark:border-[#333] dark:bg-[#191919]">
            <div class="flex items-center justify-between gap-1 sm:gap-3">
              <div class="min-w-0">
                <span class="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wide text-[#888]">
                  Direct Telephone
                </span>
                <span class="mt-0.5 sm:mt-1 block text-[11px] sm:text-sm font-extrabold text-[#171717] dark:text-white truncate">
                  {{ item.phone || item.mobile }}
                </span>
              </div>

              <!-- Copy -->
              <button
                type="button"
                class="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border border-[#ddd] bg-white text-[#666] hover:bg-[#f1f1f1] dark:border-[#3a3a3a] dark:bg-[#242424] dark:text-[#aaa] dark:hover:bg-[#303030]"
                title="Copy telephone number"
                @click="copyNumber(item.phone || item.mobile ||  '', item.id)"
              >
                <Check v-if="copiedId === item.id" :size="12" class="text-emerald-600" />
                <Copy v-else :size="12" />
              </button>
            </div>

            <div
              v-if="item.mobile && item.phone"
              class="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-[#e5e5e5] pt-2 dark:border-[#303030] gap-1 sm:gap-0"
            >
              <span class="text-[9px] sm:text-[10px] text-[#777] dark:text-[#999]">
                Mobile:
                <strong class="text-[#333] dark:text-white">{{ item.mobile }}</strong>
              </span>
              <a
                :href="`tel:${item.mobile.replace(/[^0-9+]/g, '')}`"
                class="text-[9px] sm:text-[10px] font-bold text-red-600 hover:underline"
              >
                Dial Mobile
              </a>
            </div>

            <a
              :href="`tel:${(item.phone || item.mobile ||'').replace(/[^0-9+]/g, '')}`"
              class="mt-2 sm:mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-red-600 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-bold text-white transition-colors hover:bg-red-700"
            >
              <Phone :size="12" />
              Call Now
            </a>
          </div>
        </div>
      </div>

      <div v-if="EMERGENCY_HOTLINES.length > 2" class="sm:hidden mt-3">
        <button 
          @click="isExpanded = !isExpanded"
          class="flex w-full items-center justify-center gap-2  py-2.5 text-xs font-bold text-[#555] transition-colors hover:bg-[#e8e8e8] dark:bg-[#2a2a2a] dark:text-[#aaa] dark:hover:bg-[#333]"
        >
          <span>{{ isExpanded ? 'Show Less' : `More  ${EMERGENCY_HOTLINES.length - 2} +` }}</span>
          <ChevronDown 
            :size="14" 
            class="transition-transform duration-300" 
            :class="isExpanded ? 'rotate-180' : ''" 
          />
        </button>
      </div>

      <!-- Desktop Swap/Pagination Controls (Hidden on Mobile) -->
      <div v-if="totalDesktopPages > 1" class="hidden sm:flex items-center justify-between mt-4  pt-4">
        <span class="text-xs font-bold text-[#666] dark:text-[#999]">
          Showing page {{ desktopPage + 1 }} of {{ totalDesktopPages }}
        </span>
        <div class="flex items-center gap-2">
          <button 
            @click="prevDesktopPage" 
            :disabled="desktopPage === 0"
            class="flex items-center justify-center rounded-md border border-[#ddd] bg-white p-1.5 text-[#555] hover:bg-[#f1f1f1] disabled:opacity-40 disabled:cursor-not-allowed dark:border-[#3a3a3a] dark:bg-[#242424] dark:text-[#aaa] dark:hover:bg-[#303030]"
          >
            <ChevronLeft :size="16" />
          </button>
          <button 
            @click="nextDesktopPage" 
            :disabled="desktopPage === totalDesktopPages - 1"
            class="flex items-center justify-center rounded-md border border-[#ddd] bg-white p-1.5 text-[#555] hover:bg-[#f1f1f1] disabled:opacity-40 disabled:cursor-not-allowed dark:border-[#3a3a3a] dark:bg-[#242424] dark:text-[#aaa] dark:hover:bg-[#303030]"
          >
            <ChevronRight :size="16" />
          </button>
        </div>
      </div>

    </div>
  </div>
</template>