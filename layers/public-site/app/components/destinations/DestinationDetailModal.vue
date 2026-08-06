<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Destination } from '../../composables/useDestinations'

const props = defineProps<{
  destination: Destination | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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
        v-if="isOpen && destination" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto bg-[#000000]/70 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div 
          class="relative w-full max-w-4xl max-h-[90vh] bg-[#ffffff] dark:bg-[#1c1c1c] rounded-2xl shadow-2xl border border-[#dfdfdf] dark:border-[#2e2e2e] overflow-hidden flex flex-col my-auto"
          @click.stop
        >
          <!-- Close Button -->
          <button 
            type="button"
            class="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#171717]/60 text-[#ffffff] hover:bg-[#171717] dark:bg-[#000000]/60 dark:hover:bg-[#000000] backdrop-blur-md transition-colors focus:outline-none"
            aria-label="Close modal"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Modal Scrollable Content Container -->
          <div class="overflow-y-auto max-h-[90vh] divide-y divide-[#ededed] dark:divide-[#2e2e2e]">
            
            <!-- Hero Image Banner -->
            <div class="relative w-full aspect-21/9 min-h-[260px] bg-[#fafafa] dark:bg-[#1a1a1a]">
              <NuxtImg 
                :src="destination.image" 
                :alt="destination.name"
                class="w-full h-full object-cover"
                loading="eager"
                format="webp"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/30 to-transparent flex items-end p-6 md:p-8">
                <div class="text-[#ffffff]">
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <Badge>
                      {{ destination.category }}
                    </Badge>
                    <Badge>
                      Brgy. {{ destination.barangay }}
                    </Badge>
                  </div>
                  <h2 class="text-2xl md:text-4xl font-medium tracking-tight text-[#ffffff]">
                    {{ destination.name }}
                  </h2>
                </div>
              </div>
            </div>

            <!-- Main Info Section -->
            <div class="p-6 md:p-8 space-y-8">
              
              <!-- Full Description -->
              <div>
                <h3 class="text-xs font-semibold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] mb-3">
                  Overview & History
                </h3>
                <p class="text-base md:text-lg text-[#171717] dark:text-[#d4d4d4] leading-relaxed">
                  {{ destination.fullDescription }}
                </p>
              </div>

              <!-- Highlights -->
              <div class="p-6 rounded-xl bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e]">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-[#85181a] dark:text-[#ef4444] mb-4 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                  Landmark Highlights
                </h3>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li 
                    v-for="(highlight, idx) in destination.highlights" 
                    :key="idx"
                    class="flex items-start gap-3 text-sm md:text-base text-[#171717] dark:text-[#ffffff]"
                  >
                    <svg class="w-5 h-5 text-[#85181a] dark:text-[#ef4444] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <Badge>{{ highlight }}</Badge>
                  </li>
                </ul>
              </div>

              <!-- Visitor Information Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- How to get there -->
                <div class="p-5 rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#1a1a1a]">
                  <div class="flex items-center gap-2 text-[#85181a] dark:text-[#ef4444] font-semibold text-xs uppercase tracking-wider mb-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                    </svg>
                    How to get there
                  </div>
                  <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                    {{ destination.howToGetThere }}
                  </p>
                </div>

                <!-- Best time to visit -->
                <div class="p-5 rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#1a1a1a]">
                  <div class="flex items-center gap-2 text-[#85181a] dark:text-[#ef4444] font-semibold text-xs uppercase tracking-wider mb-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Best time to visit
                  </div>
                  <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                    {{ destination.bestTimeToVisit }}
                  </p>
                </div>

                <!-- Access notes -->
                <div class="p-5 rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#1a1a1a]">
                  <div class="flex items-center gap-2 text-[#85181a] dark:text-[#ef4444] font-semibold text-xs uppercase tracking-wider mb-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Access & Guidelines
                  </div>
                  <p class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                    {{ destination.accessNotes }}
                  </p>
                </div>
              </div>

            </div>

            <!-- Footer Action Bar -->
            <div class="p-6 bg-[#fafafa] dark:bg-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="text-xs text-[#707070] dark:text-[#a3a3a3]">
                Need guidance? Contact <strong class="text-[#171717] dark:text-[#ffffff]">San Francisco Municipal Tourism Office</strong>.
              </div>
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <NuxtLink
                  :to="`/destinations/${destination.id}`"
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[#dfdfdf] dark:border-[#333333] text-xs font-semibold text-[#171717] dark:text-[#ffffff] hover:bg-[#ffffff] dark:hover:bg-[#202020] transition-colors"
                >
                  Full Page View
                </NuxtLink>
                <button
                  type="button"
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-semibold text-[#ffffff] bg-[#171717] hover:bg-[#85181a] dark:bg-[#ffffff] dark:text-[#171717] dark:hover:bg-[#ef4444] dark:hover:text-[#ffffff] transition-colors"
                  @click="emit('close')"
                >
                  Close Window
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
