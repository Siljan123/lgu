<script setup lang="ts">
import { computed } from 'vue'
import {
  Eye,
  Download,
  Edit3,
  Trash2,
  Calendar,
  Scale,
  ShieldAlert,
  Award,
  FileText,
  MoreVertical,
  ExternalLink,
  Plus,
  RotateCcw,
  Loader2,
  FileCode,
  MoreHorizontal,
} from '@lucide/vue'
import type { LegalDocument } from '../../../types/ordinance'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/../layers/base/app/components/ui/dropdown-menu'

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
  documents: LegalDocument[]
  totalCount?: number
  currentPage?: number
  itemsPerPage?: number
  isAdmin?: boolean
  pending?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  totalCount: 0,
  currentPage: 1,
  itemsPerPage: 10,
  isAdmin: false,
  pending: false,
})

const emit = defineEmits<{
  (e: 'view', doc: LegalDocument): void
  (e: 'edit', doc: LegalDocument): void
  (e: 'delete', doc: LegalDocument): void
  (e: 'download', doc: LegalDocument): void
  (e: 'update:currentPage', page: number): void
  (e: 'resetFilters'): void
  (e: 'openAddModal'): void
}>()

const totalItems = computed(() => props.totalCount || props.documents.length)
const totalPages = computed(() => Math.ceil(totalItems.value / props.itemsPerPage) || 1)

const rangeStart = computed(() => {
  if (totalItems.value === 0) return 0
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const rangeEnd = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, totalItems.value)
})

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A'
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}



function getStatusDetails(status: string) {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
      }
    case 'amended':
      return {
        label: 'Amended',
        dot: 'bg-amber-500',
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
      }
    case 'repealed':
      return {
        label: 'Repealed',
        dot: 'bg-rose-500',
        badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
      }
    case 'draft':
      return {
        label: 'Draft',
        dot: 'bg-neutral-400',
        badge: 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
      }
    default:
      return {
        label: status,
        dot: 'bg-neutral-400',
        badge: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      }
  }
}

function handleDownloadClick(doc: LegalDocument) {
  emit('download', doc)
  if (doc.pdf_url && doc.pdf_url !== '#') {
    window.open(doc.pdf_url, '_blank')
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Minimalist Table Container -->
    <div class="w-full bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#2e2e2e] rounded-sm overflow-hidden shadow-xs transition-colors">
      
      <!-- Loading Skeleton Overlay -->
      <div v-if="pending" class="py-20 flex flex-col items-center justify-center space-y-3 text-neutral-500">
        <Loader2 class="size-7 animate-spin text-[#dc2626]" />
        <span class="text-xs font-medium tracking-wide">Loading documents...</span>
      </div>

      <div
        v-else-if="documents.length === 0"
        class="py-16 px-6 text-center space-y-4"
      >
        <div class="size-12 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center">
          <FileText class="size-6" />
        </div>
        <div class="space-y-1">
          <h4 class="text-sm font-semibold text-neutral-900 dark:text-white">
            No legal documents found
          </h4>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            No documents matched your query. Try resetting active filters or adding a new record.
          </p>
        </div>
        <div class="pt-2 flex items-center justify-center gap-2">
          <button
            type="button"
            @click="emit('resetFilters')"
            class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#dc2626] bg-[#dc2626]/10 hover:bg-[#dc2626]/20 rounded-sm transition-colors cursor-pointer"
          >
            <RotateCcw class="size-3" />
            <span>Clear Filters</span>
          </button>
          <button
            v-if="isAdmin"
            type="button"
            @click="emit('openAddModal')"
            class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-sm transition-colors shadow-xs cursor-pointer"
          >
            <Plus class="size-3" />
            <span>Add New Document</span>
          </button>
        </div>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr class="border-b border-[#dfdfdf] dark:border-[#2e2e2e] bg-neutral-50/75 dark:bg-[#222222]/60 text-neutral-500 dark:text-neutral-400 font-semibold tracking-wider text-[11px] uppercase">
              <th scope="col" class="py-3 px-4 sm:px-5 font-semibold whitespace-nowrap">
                Document No.
              </th>
              <th scope="col" class="py-3 px-4 sm:px-5 font-semibold min-w-64">
                Title & Description
              </th>
              <th scope="col" class="py-3 px-4 sm:px-5 font-semibold whitespace-nowrap">
                Date Issued
              </th>
              <th scope="col" class="py-3 px-4 sm:px-5 font-semibold whitespace-nowrap">
                Status
              </th>
              <th scope="col" class="py-3 px-4 sm:px-5 font-semibold hidden md:table-cell">
                Tags / Topics
              </th>
              <th scope="col" class="py-3 px-4 sm:px-5 font-semibold text-right whitespace-nowrap w-16">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#dfdfdf]/70 dark:divide-[#2e2e2e]/70">
            <tr
              v-for="doc in documents"
              :key="doc.id"
              class="group hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
            >
              <!-- Document Number & Type -->
              <td class="py-3.5 px-4 sm:px-5 align-top whitespace-nowrap">
                <div class="space-y-1.5">
                  <span class="block font-mono text-md font-bold text-neutral-900 dark:text-white tracking-tight">
                    {{ doc.document_number }}
                  </span>
                </div>
              </td>

              <td class="py-3.5 px-4 sm:px-5 align-top">
                <div class="space-y-1">
                  <h4
                    class="font-semibold dark:text-white leading-snug  text-[#dc2626] transition-colors cursor-pointer line-clamp-2"
                    :title="doc.title"
                    @click="emit('view', doc)"
                  >
                    {{ doc.title }}
                  </h4>
                  <p
                    v-if="doc.description"
                    class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-relaxed"
                    :title="doc.description"
                  >
                    {{ doc.description }}
                  </p>
                  <!-- Mobile tags preview -->
                  <div v-if="doc.tags && doc.tags.length > 0" class="flex md:hidden flex-wrap gap-1 pt-0.5">
                    <span
                      v-for="tag in doc.tags.slice(0, 2)"
                      :key="tag"
                      class="px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Date Issued -->
              <td class="py-3.5 px-4 sm:px-5 align-top whitespace-nowrap text-neutral-600 dark:text-neutral-300 text-xs">
                <div class="flex items-center space-x-1.5 font-medium tabular-nums">
                  <Calendar class="size-3.5 text-neutral-400 shrink-0" />
                  <span>{{ formatDate(doc.date_issued) }}</span>
                </div>
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4 sm:px-5 align-top whitespace-nowrap">
                <span
                  class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                  :class="getStatusDetails(doc.status).badge"
                >
                  <span class="size-1.5 rounded-full" :class="getStatusDetails(doc.status).dot" />
                  <span>{{ getStatusDetails(doc.status).label }}</span>
                </span>
              </td>

              <td class="py-3.5 align-top md:table-cell justify-between items-center text-center  flex w-5">
                <div>
                  <span
                    v-for="tag in (doc.tags || []).slice(0, 1)"
                    :key="tag"
                    class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60"
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="(doc.tags || []).length > 1"
                    class="px-1.5 py-0.5 rounded text-[10px] text-neutral-400"
                    :title="(doc.tags || []).slice(1).join(', ')"
                  >
                    +{{ doc.tags.length - 1 }}
                  </span>
                </div>
              </td>

              <td class="py-3.5 px-4 sm:px-5 align-middle text-right whitespace-nowrap">
                <DropdownMenu :modal="false">
                  <DropdownMenuTrigger as-child>
                    <button
                      type="button"
                      class="size-8 inline-flex items-center justify-center rounded-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#dc2626]/20"
                      aria-label="Document options"
                    >
                      <MoreHorizontal class="size-4" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    class="w-48 rounded-md border border-[#dfdfdf] dark:border-[#2e2e2e] bg-white dark:bg-[#1c1c1c] p-1.5 shadow-lg z-50 text-xs"
                  >
                    <DropdownMenuLabel class="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500 px-2 py-1">
                      Options
                    </DropdownMenuLabel>

                    <!-- View Details -->
                    <DropdownMenuItem
                      class="cursor-pointer gap-2 px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
                      @click="emit('view', doc)"
                    >
                      <Eye class="size-3.5 text-[#dc2626]" />
                      <span>View Details & PDF</span>
                    </DropdownMenuItem>

                    <!-- Download PDF -->
                    <DropdownMenuItem
                      v-if="doc.pdf_url && doc.pdf_url !== '#'"
                      class="cursor-pointer gap-2 px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
                      @click="handleDownloadClick(doc)"
                    >
                      <Download class="size-3.5 text-neutral-500 dark:text-neutral-400" />
                      <span>Download PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-else
                      disabled
                      class="gap-2 px-2.5 py-1.5 text-xs text-neutral-400 dark:text-neutral-500 opacity-60 cursor-not-allowed"
                    >
                      <Download class="size-3.5 text-neutral-400" />
                      <span>No PDF Attached</span>
                    </DropdownMenuItem>

                    <!-- Admin Actions -->
                    <template v-if="isAdmin">
                      <DropdownMenuSeparator class="my-1 border-t border-[#dfdfdf] dark:border-[#2e2e2e]" />
                      
                      <!-- Update / Edit -->
                      <DropdownMenuItem
                        class="cursor-pointer gap-2 px-2.5 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-sm transition-colors"
                        @click="emit('edit', doc)"
                      >
                        <Edit3 class="size-3.5" />
                        <span>Update / Edit</span>
                      </DropdownMenuItem>

                      <!-- Delete -->
                      <DropdownMenuItem
                        variant="destructive"
                        class="cursor-pointer gap-2 px-2.5 py-1.5 text-xs text-[#dc2626] dark:text-[#f87171] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-sm transition-colors"
                        @click="emit('delete', doc)"
                      >
                        <Trash2 class="size-3.5" />
                        <span>Delete Document</span>
                      </DropdownMenuItem>
                    </template>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Minimalist Pagination Bar -->
      <div
        v-if="totalItems > 0"
        class="px-4 py-3 sm:px-6 border-t border-[#dfdfdf] dark:border-[#2e2e2e] bg-neutral-50/50 dark:bg-[#181818]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      >
        <!-- Range Indicator -->
        <div class="text-neutral-500 dark:text-neutral-400 text-xs">
          Showing <strong class="text-neutral-900 dark:text-white font-semibold tabular-nums">{{ rangeStart }}</strong> to <strong class="text-neutral-900 dark:text-white font-semibold tabular-nums">{{ rangeEnd }}</strong> of <strong class="text-neutral-900 dark:text-white font-semibold tabular-nums">{{ totalItems }}</strong> records
        </div>

        <!-- Shadcn Pagination Navigation Controls -->
        <UiPagination
          v-if="totalPages > 1"
          v-slot="{ page }"
          :items-per-page="itemsPerPage"
          :total="totalItems"
          :sibling-count="1"
          :page="currentPage"
          @update:page="(p) => emit('update:currentPage', p)"
        >
          <UiPaginationContent v-slot="{ items }">
            <UiPaginationFirst class="cursor-pointer" />
            <UiPaginationPrevious class="cursor-pointer" />

            <template v-for="(item, index) in items">
              <UiPaginationItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                :is-active="item.value === page"
                class="cursor-pointer font-medium"
              >
                {{ item.value }}
              </UiPaginationItem>
              <UiPaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <UiPaginationNext class="cursor-pointer" />
            <UiPaginationLast class="cursor-pointer" />
          </UiPaginationContent>
        </UiPagination>
      </div>

    </div>
  </div>
</template>
