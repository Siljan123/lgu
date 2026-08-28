<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  FilePlus2,
  X,
  Upload,
  FileText,
  Loader2,
  Plus,
  Tag,
  CheckCircle2,
} from '@lucide/vue'
import type { CreateLegalDocumentPayload, DocumentType, DocumentStatus } from '../../../types/ordinance'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: CreateLegalDocumentPayload): void
}>()

const isUploadingPdf = ref(false)
const selectedPdfFile = ref<File | null>(null)
const tagInput = ref('')
const uploadSuccessMessage = ref('')

const form = ref({
  type: 'ordinance' as DocumentType,
  document_number: '',
  title: '',
  description: '',
  pdf_url: '',
  date_issued: new Date().toISOString().slice(0, 10),
  status: 'active' as DocumentStatus,
  tags: [] as string[],
})

const defaultDocNumberPlaceholder = computed(() => {
  const currentYear = new Date().getFullYear()
  switch (form.value.type) {
    case 'ordinance':
      return `e.g. Municipal Ordinance No. ${currentYear}-001`
    case 'executive_order':
      return `e.g. Executive Order No. ${currentYear}-001`
    case 'resolution':
      return `e.g. SB Resolution No. ${currentYear}-001`
    default:
      return 'Document Number'
  }
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      selectedPdfFile.value = null
      isUploadingPdf.value = false
      tagInput.value = ''
      uploadSuccessMessage.value = ''
      form.value = {
        type: 'ordinance',
        document_number: '',
        title: '',
        description: '',
        pdf_url: '',
        date_issued: new Date().toISOString().slice(0, 10),
        status: 'active',
        tags: [],
      }
    }
  },
  { immediate: true }
)

function addTag() {
  const val = tagInput.value.trim()
  if (val && !form.value.tags.includes(val)) {
    form.value.tags.push(val)
    tagInput.value = ''
  }
}

function removeTag(index: number) {
  form.value.tags.splice(index, 1)
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    alert('Please upload a valid PDF document.')
    return
  }

  // Max 30MB
  if (file.size > 30 * 1024 * 1024) {
    alert('PDF file size must not exceed 30MB.')
    return
  }

  selectedPdfFile.value = file
  isUploadingPdf.value = true
  uploadSuccessMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await $fetch<{ success: boolean; publicUrl: string }>('/api/ordinances/upload', {
      method: 'POST',
      body: formData,
    })

    if (res?.publicUrl) {
      form.value.pdf_url = res.publicUrl
      uploadSuccessMessage.value = `Uploaded "${file.name}" successfully!`
    }
  } catch (err: any) {
    console.error('Failed to upload PDF file:', err)
    alert(err?.data?.statusMessage || 'Failed to upload PDF file to storage.')
    selectedPdfFile.value = null
  } finally {
    isUploadingPdf.value = false
  }
}

function handleSubmit() {
  const docNum = form.value.document_number.trim()
  const title = form.value.title.trim()
  const pdfUrl = form.value.pdf_url.trim()
  const dateIssued = form.value.date_issued.trim()

  if (!docNum || !title || !pdfUrl || !dateIssued) {
    alert('Please complete all required fields (Document Number, Title, Date Issued, and PDF Document).')
    return
  }

  const payload: CreateLegalDocumentPayload = {
    type: form.value.type,
    document_number: docNum,
    title: title,
    description: form.value.description.trim() || undefined,
    pdf_url: pdfUrl,
    date_issued: dateIssued,
    status: form.value.status,
    tags: form.value.tags,
  }

  emit('submit', payload)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-md w-full max-w-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-sm bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171] shrink-0">
            <FilePlus2 class="size-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
              Create Legal Document
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Add a new Ordinance, Executive Order, or SB Resolution to the repository
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          aria-label="Close modal"
          class="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          <X class="size-5" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-5 sm:p-6 space-y-4 sm:space-y-5 max-h-[calc(88vh-80px)] overflow-y-auto">
        <!-- 1. Document Type & Status -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              1. Document Type <span class="text-[#dc2626]">*</span>
            </label>
            <select
              v-model="form.type"
              required
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
            >
              <option value="ordinance">Municipal Ordinance</option>
              <option value="executive_order">Executive Order</option>
              <option value="resolution">Sangguniang Bayan Resolution</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              2. Status <span class="text-[#dc2626]">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
            >
              <option value="active">Active (Enacted / In Force)</option>
              <option value="amended">Amended</option>
              <option value="repealed">Repealed</option>
              <option value="draft">Draft / Pending</option>
            </select>
          </div>
        </div>

        <!-- 2. Document Number & Date Issued -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              3. Document Number <span class="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              v-model="form.document_number"
              required
              :placeholder="defaultDocNumberPlaceholder"
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              4. Date Promulgated / Issued <span class="text-[#dc2626]">*</span>
            </label>
            <input
              type="date"
              v-model="form.date_issued"
              required
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
            />
          </div>
        </div>

        <!-- 3. Title -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            5. Document Title <span class="text-[#dc2626]">*</span>
          </label>
          <input
            type="text"
            v-model="form.title"
            required
            placeholder="Official title or enactment subject..."
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
        </div>

        <!-- 4. Description / Abstract -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            6. Statement of Purpose 
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 resize-none rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
        </div>

        <!-- 5. Tags / Policy Areas -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            7. Subject Tags / Topics
          </label>
          <div class="flex items-center space-x-2">
            <input
              type="text"
              v-model="tagInput"
              @keydown.enter.prevent="addTag"
              placeholder="e.g. Environment, Revenue, Health and press Enter"
              class="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] transition"
            />
            <button
              type="button"
              @click="addTag"
              class="px-3 py-2 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-sm transition cursor-pointer flex items-center space-x-1"
            >
              <Plus class="size-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div v-if="form.tags.length > 0" class="flex flex-wrap gap-1.5 pt-1.5">
            <span
              v-for="(tag, idx) in form.tags"
              :key="tag"
              class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
            >
              <Tag class="size-3 text-[#dc2626]" />
              <span>{{ tag }}</span>
              <button
                type="button"
                @click="removeTag(idx)"
                class="hover:text-red-500 transition cursor-pointer"
              >
                <X class="size-3" />
              </button>
            </span>
          </div>
        </div>

        <!-- 6. PDF Document Upload / URL -->
        <div class="space-y-2 p-4 bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-sm">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            8. PDF Document File <span class="text-[#dc2626]">*</span>
          </label>

          <!-- File Upload Picker -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <label class="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold bg-white dark:bg-[#1c1c1c] border border-neutral-200 dark:border-neutral-700 hover:border-[#dc2626] text-neutral-800 dark:text-neutral-200 rounded-sm cursor-pointer shadow-xs transition shrink-0">
              <Upload class="size-4 text-[#dc2626]" />
              <span>Choose PDF File</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                class="hidden"
                @change="handleFileChange"
              />
            </label>

            <span v-if="isUploadingPdf" class="flex items-center space-x-1.5 text-xs text-neutral-500">
              <Loader2 class="size-3.5 animate-spin text-[#dc2626]" />
              <span>Uploading to storage...</span>
            </span>

            <span v-else-if="uploadSuccessMessage" class="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 class="size-3.5" />
              <span>{{ uploadSuccessMessage }}</span>
            </span>
          </div>

        </div>

        <!-- Modal Actions Bar -->
        <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            @click="emit('close')"
            class="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isUploadingPdf"
            class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm transition-colors shadow-xs cursor-pointer text-center flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Loader2 v-if="isUploadingPdf" class="size-4 animate-spin" />
            <span>Create Legal Document</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
