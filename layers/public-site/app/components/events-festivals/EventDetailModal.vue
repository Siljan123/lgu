<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { 
  X, 
  Calendar, 
  MapPin, 
  Award, 
  Info, 
  Users, 
  CheckCircle2 
} from '@lucide/vue'
import type { EventFestival } from '../../composables/useEventsFestivals'

interface Props {
  event: EventFestival | null
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(() => props.isOpen, (newVal) => {
  if (typeof window !== 'undefined') {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})

</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen && event" 
        class="fixed inset-0 z-50 flex items-center justify-center mt-10 sm:p-6 overflow-y-auto bg-[#171717]/70 dark:bg-[#000000]/80 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            class="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#ffffff] dark:bg-[#1c1c1c] rounded-lg border border-[#dfdfdf] dark:border-[#2e2e2e] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <!-- Close Button -->
            <button
              type="button"
              class="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#171717]/60 hover:bg-[#171717] text-[#ffffff] backdrop-blur-md transition-all shadow-md cursor-pointer"
              aria-label="Close dialog"
              @click="emit('close')"
            >
              <X :size="18" />
            </button>

            <!-- Scrollable Container -->
            <div class="overflow-y-auto flex-1 divide-y divide-[#ededed] dark:divide-[#2e2e2e]">
              
              <!-- Modal Banner / Image Header -->
              <div class="relative w-full aspect-21/9 min-h-55 bg-[#171717]">
                <NuxtImg
                  :src="event.image"
                  :alt="event.name"
                  class="w-full h-full object-cover grayscale-[0.15]"
                />
                <div class="absolute inset-0 bg-linear-to-t from-[#171717] via-[#171717]/40 to-transparent"></div>

                <div class="absolute bottom-6 left-6 right-6 text-[#ffffff] space-y-2">
                  <h2 class="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight">
                    {{ event.name }}
                  </h2>
                
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-[#fafafa] dark:bg-[#202020]">
                <div class="flex items-start gap-3">
                  <div>
                    <span class="text-xs uppercase tracking-wider font-semibold text-[#707070] dark:text-[#a3a3a3]">Schedule & Peak Day</span>
                    <p class="text-sm font-medium text-[#171717] dark:text-[#ffffff] mt-0.5">
                      {{ event.whenHeld }}
                    </p>
                    <p v-if="event.peakDay" class="text-xs text-[#85181a] dark:text-[#ef4444] font-medium mt-0.5">
                      Peak Day: {{ event.peakDay }} (Founding Anniversary)
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div>
                    <span class="text-xs uppercase tracking-wider font-semibold text-[#707070] dark:text-[#a3a3a3]">Festival Venue</span>
                    <p class="text-sm font-medium text-[#171717] dark:text-[#ffffff] mt-0.5">
                      {{ event.venue }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Full Description Section -->
              <div class="p-6 md:p-8 space-y-4">
                <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444]">
                  <Info :size="14" />
                  <span>About the Festival</span>
                </div>
                <h3 class="text-xl font-medium text-[#171717] dark:text-[#ffffff]">
                  Full Description
                </h3>
                <p class="text-base text-[#212121] dark:text-[#d4d4d4] leading-relaxed">
                  {{ event.fullDescription }}
                </p>
              </div>

              <!-- Program Highlights Section -->
              <div v-if="event.highlights && event.highlights.length > 0" class="p-6 md:p-8 space-y-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444]">
                    <span>Schedule Activities</span>
                  </div>
                  <span class="text-xs text-[#707070] dark:text-[#a3a3a3]">
                    {{ event.highlights.length }} Program Highlights
                  </span>
                </div>

                <h3 class="text-xl font-medium text-[#171717] dark:text-[#ffffff]">
                  Program Highlights
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="(item, idx) in event.highlights" 
                    :key="idx"
                    class="p-1 border-b flex items-start gap-3.5 transition-colors"
                  >
                    <div class="space-y-1">
                      <h4 class="text-sm font-semibold text-[#171717] dark:text-[#ffffff]">
                        {{ item.title }}
                      </h4>
                      <p class="text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Why It Matters Section -->
              <div class="p-6 md:p-8 bg-[#fafafa] dark:bg-[#202020]/50 space-y-4">
                <div class="p-6 rounded-xl bg-[#ffffff] dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2e2e2e] space-y-3">
                  <h4 class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">
                    Why It Matters
                  </h4>
                  <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                    {{ event.whyItMatters }}
                  </p>
                </div>
              </div>

            </div>

            <!-- Modal Action Footer -->
            <div class="p-4 sm:p-6 bg-[#fafafa] dark:bg-[#202020] border-t border-[#dfdfdf] dark:border-[#2e2e2e] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div class="text-xs text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5">
                <CheckCircle2 :size="14" class="text-[#85181a] dark:text-[#ef4444]" />
                <span>Organized by {{ event.organizer }}</span>
              </div>

              <div class="flex items-center gap-3 w-full sm:w-auto">
                <a
                  v-if="event.contactInfo"
                  :href="`mailto:${event.contactInfo}`"
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#dfdfdf] dark:border-[#333333] text-xs font-semibold text-[#171717] dark:text-[#ffffff] hover:bg-[#ffffff] dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  Contact Tourism Office
                </a>
                <button
                  type="button"
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-2 rounded-lg text-xs font-semibold text-[#ffffff] bg-[#85181a] hover:bg-[#6b1214] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] transition-colors cursor-pointer"
                  @click="emit('close')"
                >
                  Close Window
                </button>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
