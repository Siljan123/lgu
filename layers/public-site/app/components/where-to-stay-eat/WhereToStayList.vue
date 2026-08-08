<script setup lang="ts">
import { ref } from 'vue'
import type { Establishment } from '../../composables/useWhereToStayEat'
import { 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  Building2, 
  Hotel, 
  Sparkles, 
  Home, 
  Coffee, 
  ShoppingBag, 
  Scissors, 
  Utensils, 
  Stethoscope, 
  Layers,
  ExternalLink,
  Clock,
  Image as ImageIcon
} from '@lucide/vue'

import {
  Pagination as UiPagination,
  PaginationContent as UiPaginationContent,
  PaginationItem as UiPaginationItem,
  PaginationNext as UiPaginationNext,
  PaginationPrevious as UiPaginationPrevious,
  PaginationEllipsis as UiPaginationEllipsis,
  PaginationFirst as UiPaginationFirst,
  PaginationLast as UiPaginationLast,
} from '@/../layers/base/app/components/ui/pagination'

interface Props {
  establishments: Establishment[]
  totalCount: number
  currentPage: number
  itemsPerPage: number
  viewMode: 'grid' | 'table'
  activeId?: string | null
  currentCategory?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', establishment: Establishment): void
  (e: 'update:currentPage', page: number): void
}>()

const copiedId = ref<string | null>(null)
const failedImages = ref(new Set<string>())

const copyContact = (contact: string, id: string) => {
  if (!contact) return
  navigator.clipboard.writeText(contact)
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

const onImageError = (id: string) => {
  failedImages.value.add(id)
}
</script>

<template>
  <div class="w-full space-y-6">
    <div 
      v-if="establishments.length === 0" 
      class="flex flex-col items-center justify-center p-12 text-center bg-[#ffffff] dark:bg-[#202020] rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e]"
    >
      <div class="p-4 rounded-full bg-[#fafafa] dark:bg-[#1a1a1a] text-[#707070] dark:text-[#a3a3a3] mb-4">
        <Building2 :size="32" />
      </div>
      <h3 class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">No establishments found</h3>
      <p class="mt-1 text-sm text-[#707070] dark:text-[#a3a3a3] max-w-sm">
        Try adjusting your search terms or filter selections to find what you are looking for.
      </p>
    </div>
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="item in establishments"
        :key="item.id"
        class="group relative flex flex-col h-full bg-[#ffffff] dark:bg-[#202020] rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#c7c7c7] dark:hover:border-[#404040]"
        :class="[activeId === item.id ? 'ring-2 ring-[#85181a] dark:ring-[#ef4444]' : '']"
      >
        <!-- Card Photo Thumbnail or Fallback UI when no image available -->
        <div class="relative w-full aspect-video overflow-hidden bg-[#18181b] flex flex-col items-center justify-center border-b border-[#dfdfdf] dark:border-[#2e2e2e]">
          <template v-if="item.image && !failedImages.has(item.id)">
            <img 
              :src="item.image" 
              :alt="item.name" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              loading="lazy"
              @error="onImageError(item.id)"
            />
          </template>

          <!-- Fallback UI when no image available or image load fails -->
          <template v-else>
            <div class="flex flex-col items-center justify-center text-center p-4 space-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <div class="p-2.5 rounded-full bg-[#ffffff]/10 text-[#ffffff] backdrop-blur-xs">
                <ImageIcon :size="22" />
              </div>
              <span class="text-[11px] font-medium tracking-wider text-[#a1a1aa] uppercase">No Image Available</span>
            </div>
          </template>

          <div class="absolute top-3 left-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#171717]/85 backdrop-blur-xs text-[#ffffff] border border-[#ffffff]/10">
              {{ item.category }}
            </span>
          </div>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <!-- Establishment Name -->
          <h3 class="text-lg font-bold tracking-tight text-[#171717] dark:text-[#ffffff] group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] transition-colors duration-200">
            {{ item.name }}
          </h3>

          <div class="mt-3 pt-3 border-t border-[#ededed] dark:border-[#2e2e2e] space-y-2 text-xs text-[#212121] dark:text-[#d4d4d4] flex-1">
            <div class="flex items-start gap-1.5">
              <MapPin :size="14" class="text-[#85181a] dark:text-[#ef4444] shrink-0 mt-0.5" />
              <span class="leading-relaxed">{{ item.address }}</span>
            </div>

            <div v-if="item.operatingHours" class="flex items-center gap-1.5 text-[#707070] dark:text-[#a3a3a3]">
              <Clock :size="13" />
              <span>Hours: {{ item.operatingHours }}</span>
            </div>
          </div>

          <!-- Action Button -->
          <button
            type="button"
            class="mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-[#ffffff] bg-[#171717] hover:bg-[#85181a] dark:bg-[#ffffff] dark:text-[#171717] dark:hover:bg-[#ef4444] dark:hover:text-[#ffffff] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            @click="emit('select', item)"
          >
            <span>Focus on Map / View 360°</span>
            <ExternalLink :size="13" />
          </button>
        </div>
      </article>
    </div>

    <div v-else class="w-full overflow-hidden rounded-xl border border-[#dfdfdf] dark:border-[#2e2e2e] bg-[#ffffff] dark:bg-[#202020] shadow-sm">
      <div 
        class="w-full py-4 px-6 bg-[#171717] dark:bg-[#171717] text-[#ffffff] flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div>
            <h2 class="text-lg font-bold uppercase tracking-wider text-[#ffffff]">
              {{ currentCategory && currentCategory !== 'All' ? currentCategory : 'Official Business & Services Directory' }}
            </h2>
            <p class="text-xs text-[#dfdfdf]/80">San Francisco, Agusan del Sur</p>
          </div>
        </div>
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-[#ffffff]/15 text-[#ffffff] border border-[#ffffff]/20">
          {{ totalCount }} Listed
        </span>
      </div>

      <!-- Responsive Table Container -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-[#243048] dark:bg-[#1a2333] text-[#ffffff] font-bold text-xs uppercase tracking-wider border-b border-[#dfdfdf] dark:border-[#2e2e2e]">
              <th scope="col" class="py-4 px-6 text-center w-1/3 min-w-50">
                Name / Establishment
              </th>
              <th scope="col" class="py-4 px-6 text-center w-1/3 min-w-50">
                Address
              </th>
              <th scope="col" class="py-4 px-6 text-center w-1/3 min-w-50">
                Contact #
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#dfdfdf] dark:divide-[#2a2a2a] text-[#171717] dark:text-[#e5e5e5]">
            <tr 
              v-for="(item, index) in establishments" 
              :key="item.id"
              class="group transition-colors duration-150 cursor-pointer hover:bg-[#fafafa] dark:hover:bg-[#262626]"
              :class="[
                activeId === item.id ? 'bg-[#85181a]/5 dark:bg-[#ef4444]/10 font-medium' : index % 2 === 0 ? 'bg-[#ffffff] dark:bg-[#202020]' : 'bg-[#fafafa]/60 dark:bg-[#1c1c1c]/60'
              ]"
              @click="emit('select', item)"
            >
              <!-- Name Column -->
              <td class="py-4 px-6 align-middle">
                <div class="flex gap-3">
                  <template v-if="item.image && !failedImages.has(item.id)">
                    <img 
                      :src="item.image" 
                      :alt="item.name"
                      class="w-10 h-10 rounded-lg object-cover border border-[#dfdfdf] dark:border-[#333333] shrink-0"
                      @error="onImageError(item.id)" 
                    />
                  </template>
                  <template v-else>
                    <div class="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center shrink-0 border border-[#dfdfdf] dark:border-[#333333] text-[#a1a1aa]" title="No image available">
                      <ImageIcon :size="16" />
                    </div>
                  </template>

                  <div>
                    <div class="font-bold text-base text-[#171717] dark:text-[#ffffff] group-hover:text-[#85181a] dark:group-hover:text-[#ef4444] transition-colors">
                      {{ item.name }}
                    </div>
                    <div class="mt-1 flex justify-center gap-1.5">
                      <span v-if="item.operatingHours" class="inline-flex items-center gap-1 text-[10px] text-[#707070] dark:text-[#a3a3a3]">
                        <Clock :size="10" />
                        {{ item.operatingHours }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="py-4 px-6  text-sm text-[#212121] dark:text-[#d4d4d4] font-medium leading-snug">
                <div class="flex gap-1.5">
                  <MapPin :size="15" class="text-[#85181a] dark:text-[#ef4444] shrink-0" />
                  <span>{{ item.address }}</span>
                </div>
              </td>

              <td class="py-4 px-6 text-center align-middle font-bold text-base tracking-wide">
                <template v-if="item.contactNo">
                  <div class="flex items-center justify-center gap-2">
                    <a 
                      :href="`tel:${item.contactNo}`" 
                      class="text-[#171717] dark:text-[#ffffff] hover:text-[#85181a] dark:hover:text-[#ef4444] transition-colors inline-flex items-center gap-1.5"
                      @click.stop
                    >
                      <Phone :size="14" class="text-[#707070] dark:text-[#a3a3a3]" />
                      <span>{{ item.contactNo }}</span>
                    </a>
                    <button
                      type="button"
                      title="Copy contact number"
                      class="p-1 rounded text-[#707070] hover:text-[#171717] dark:text-[#a3a3a3] dark:hover:text-[#ffffff] hover:bg-[#dfdfdf]/50 dark:hover:bg-[#333333] transition-all"
                      @click.stop="copyContact(item.contactNo, item.id)"
                    >
                      <Check v-if="copiedId === item.id" :size="14" class="text-green-600 dark:text-green-400" />
                      <Copy v-else :size="14" />
                    </button>
                  </div>
                </template>
                <template v-else>
                  <span class="text-xs font-normal text-[#9a9a9a] dark:text-[#707070] italic">
                    N/A
                  </span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SHADCN PAGINATION COMPONENT -->
    <div v-if="totalCount > itemsPerPage" class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#dfdfdf] dark:border-[#2e2e2e]">
      <div class="text-xs text-[#707070] dark:text-[#a3a3a3]">
        Showing Page <strong class="text-[#171717] dark:text-[#ffffff]">{{ currentPage }}</strong> of {{ Math.ceil(totalCount / itemsPerPage) }} ({{ totalCount }} total items)
      </div>

      <UiPagination
        v-slot="{ page }"
        :items-per-page="itemsPerPage"
        :total="totalCount"
        :sibling-count="1"
        :page="currentPage"
        @update:page="(p) => emit('update:currentPage', p)"
      >
        <UiPaginationContent v-slot="{ items }">
          <UiPaginationFirst />
          <UiPaginationPrevious />

          <template v-for="(item, index) in items">
            <UiPaginationItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              :is-active="item.value === page"
              class="cursor-pointer"
            >
              {{ item.value }}
            </UiPaginationItem>
            <UiPaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <UiPaginationNext />
          <UiPaginationLast />
        </UiPaginationContent>
      </UiPagination>
    </div>

  </div>
</template>
