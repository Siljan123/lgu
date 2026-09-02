<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  UserPlus,
  X,
  Network,
  Sparkles,
  PlusCircle,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Loader2,
} from '@lucide/vue'
import type { AddOfficialPayload, PositionRow } from '../../../types/official'
import { formatContactInput } from '../../../utils/contact'

const props = withDefaults(
  defineProps<{
    open: boolean
    selectedParentId?: string | null
    allOfficials?: {
      id: string
      fullName: string
      position: string
      is_label?: boolean
      label_name?: string
    }[]
    positions?: PositionRow[]
  }>(),
  {
    selectedParentId: null,
    allOfficials: () => [],
    positions: () => [],
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: AddOfficialPayload): void
  (e: 'upload-avatar', file: File): Promise<string>
}>()

const nodeType = ref<'official' | 'label'>('official')
const isLabel = computed(() => nodeType.value === 'label')
const isRootOfficial = ref(false)
const isCustomPosition = ref(false)
const customPosition = ref('')
const isUploadingImage = ref(false)
const imagePreview = ref<string | null>(null)
const selectedImageFile = ref<File | null>(null)

const form = ref({
  parentId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  positionId: '',
  position: '',
  contact: '',
  avatarUrl: '',
})

function onContactInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.value.contact = formatContactInput(target.value)
}

const positionOptions = computed(() => {
  return props.positions || []
})

function applyParentPosition(parentId?: string | null) {
  if (!parentId) return
  const parent = props.allOfficials.find((o) => o.id === parentId)
  if (!parent) return

  if (parent.is_label) {
    const labelTitle = (parent.label_name || parent.fullName || '').trim()
    if (!labelTitle) return
    const matched = positionOptions.value.find((p) => {
      const pTitle = p.title.toLowerCase().trim()
      const lTitle = labelTitle.toLowerCase().trim()
      return pTitle === lTitle || pTitle === lTitle.replace(/s$/, '') || (lTitle.endsWith('s') && pTitle === lTitle.slice(0, -1))
    })
    if (matched) {
      isCustomPosition.value = false
      form.value.positionId = matched.id
      form.value.position = matched.title
    }
  }
}

watch(
  () => form.value.positionId,
  (val) => {
    if (val === '__custom__') {
      isCustomPosition.value = true
      customPosition.value = ''
      form.value.position = ''
    } else if (val) {
      const match = positionOptions.value.find((p) => p.id === val)
      if (match) {
        form.value.position = match.title
      }
    }
  }
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      nodeType.value = 'official'
      isCustomPosition.value = false
      customPosition.value = ''
      imagePreview.value = null
      selectedImageFile.value = null
      isUploadingImage.value = false

      form.value.firstName = ''
      form.value.middleName = ''
      form.value.lastName = ''
      form.value.positionId = positionOptions.value[0]?.id || ''
      form.value.position = positionOptions.value[0]?.title || ''
      form.value.contact = ''
      form.value.avatarUrl = ''

      if (props.selectedParentId) {
        isRootOfficial.value = false
        form.value.parentId = props.selectedParentId
        applyParentPosition(props.selectedParentId)
      } else {
        isRootOfficial.value = props.allOfficials.length === 0
        const defaultParent = props.allOfficials[0]?.id ?? ''
        form.value.parentId = defaultParent
        if (defaultParent) {
          applyParentPosition(defaultParent)
        }
      }
    }
  },
  { immediate: true }
)

watch(
  () => props.selectedParentId,
  (newParentId) => {
    if (newParentId) {
      isRootOfficial.value = false
      form.value.parentId = newParentId
      applyParentPosition(newParentId)
    }
  }
)

watch(
  () => form.value.parentId,
  (newParentId) => {
    if (newParentId && nodeType.value === 'official') {
      applyParentPosition(newParentId)
    }
  }
)

function toggleMode(root: boolean) {
  isRootOfficial.value = root
  if (root) {
    form.value.parentId = ''
  } else if (!form.value.parentId && props.allOfficials.length > 0) {
    form.value.parentId = props.allOfficials[0]?.id ?? ''
  }
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validate allowed image types
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!allowed.includes(file.type)) {
    alert('Please upload a valid image file (JPEG, PNG, WEBP, or SVG).')
    return
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    alert('Image file size must not exceed 5MB.')
    return
  }

  selectedImageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function removeAvatar() {
  selectedImageFile.value = null
  imagePreview.value = null
  form.value.avatarUrl = ''
}

async function handleSubmit() {
  const isLabel = nodeType.value === 'label'
  const finalPosTitle = isCustomPosition.value ? customPosition.value.trim() : form.value.position.trim()

  if (isLabel) {
    if (!finalPosTitle && !form.value.positionId) return
    const payload: AddOfficialPayload = {
      label_name: finalPosTitle,
      first_name: null,
      middle_name: undefined,
      last_name: null,
      position_id: isCustomPosition.value ? undefined : form.value.positionId || undefined,
      position: finalPosTitle || undefined,
      parent_id: isRootOfficial.value ? null : (form.value.parentId || null),
      is_label: true,
    }
    emit('submit', payload)
    return
  }

  const firstName = form.value.firstName.trim()
  const lastName = form.value.lastName.trim()
  if (!firstName || !lastName) return

  if (!finalPosTitle && !form.value.positionId) return

  let uploadedUrl = form.value.avatarUrl || null

  // If a new local image file was selected, upload it first
  if (selectedImageFile.value) {
    isUploadingImage.value = true
    try {
      const formData = new FormData()
      formData.append('file', selectedImageFile.value)
      const res = await $fetch<{ success: boolean; publicUrl: string }>('/api/elected-officials/upload', {
        method: 'POST',
        body: formData,
      })
      if (res?.publicUrl) {
        uploadedUrl = res.publicUrl
      }
    } catch (err) {
      console.error('Failed to upload official avatar image:', err)
      alert('Failed to upload photo. Official will be created without avatar.')
    } finally {
      isUploadingImage.value = false
    }
  }

  const payload: AddOfficialPayload = {
    first_name: firstName,
    middle_name: form.value.middleName.trim() || undefined,
    last_name: lastName,
    position_id: isCustomPosition.value ? undefined : form.value.positionId || undefined,
    position: finalPosTitle || undefined,
    parent_id: isRootOfficial.value ? null : (form.value.parentId || null),
    is_label: false,
    contact: form.value.contact.trim() || undefined,
    avatar_url: uploadedUrl,
    image_url: uploadedUrl,
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
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-md w-full max-w-xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-md bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171] shrink-0">
            <UserPlus class="size-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
              {{ nodeType === 'label' ? 'Add Section / Group Label' : 'Add Elected Official' }}
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {{ isRootOfficial ? 'Add a top-level node' : 'Attach to the elected officials reporting structure' }}
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
        <!-- Node Type Selector (Official vs Label) -->
        <div class="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md">
          <button
            type="button"
            @click="nodeType = 'official'"
            :class="[
              nodeType === 'official'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            ]"
            class="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center"
          >
            Elected Official
          </button>
          <button
            type="button"
            @click="nodeType = 'label'"
            :class="[
              nodeType === 'label'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            ]"
            class="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center"
          >
            Section / Group Label
          </button>
        </div>

        <div v-if="!isRootOfficial" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200" v-if="isLabel">
            1. Superior Label <span class="text-[#dc2626]">*</span>
          </label>
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200" v-else>
            1. Superior Official <span class="text-[#dc2626]">*</span>
          </label>
          <select
            v-model="form.parentId"
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
          >
            <option value="" disabled v-if="isLabel">Select superior Label...</option>
            <option value="" disabled v-else>Select superior Official...</option>
            <option
              v-for="item in allOfficials"
              :key="item.id"
              :value="item.id"
            >
              <span v-if="isLabel">{{ item.is_label ? (item.label_name || item.fullName) : `${item.position} - ${item.fullName}` }}</span>
              <span v-else>{{ item.is_label ? (item.label_name || item.fullName) : `${item.fullName} - ${item.position}` }}</span>
            </option>
          </select>
        </div>
        <div v-if="nodeType === 'official'" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            2. Official's Full Name <span class="text-[#dc2626]">*</span>
          </label>
          <div class="grid sm:grid-cols-3 gap-2.5">
            <div class="sm:col-span-2">
              <input
                type="text"
                v-model="form.firstName"
                required
                placeholder="First Name *"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
            <div>
              <input
                type="text"
                v-model="form.middleName"
                placeholder="Middle Name / M.I."
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
            <div class="sm:col-span-3">
              <input
                type="text"
                v-model="form.lastName"
                required
                placeholder="Last Name *"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
          </div>
        </div>

        <!-- 3. Position / Designation or Label Title -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {{ nodeType === 'label' ? '2. Section / Label Title' : '3. Elected Position / Designation' }} <span class="text-[#dc2626]">*</span>
            </label>
            <button
              v-if="!isCustomPosition"
              type="button"
              @click="isCustomPosition = true; form.positionId = '__custom__'"
              class="inline-flex items-center space-x-1 text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium transition cursor-pointer"
            >
              <PlusCircle class="size-3.5" />
              <span>Custom Title</span>
            </button>
            <button
              v-else
              type="button"
              @click="isCustomPosition = false; form.positionId = positionOptions[0]?.id || ''"
              class="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium transition cursor-pointer"
            >
              <RotateCcw class="size-3" />
              <span class="underline">Select from list</span>
            </button>
          </div>

          <!-- Position Select from DB -->
          <select
            v-if="!isCustomPosition"
            v-model="form.positionId"
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
          >
            <option value="" disabled>Select position / title...</option>
            <option
              v-for="pos in positionOptions"
              :key="pos.id"
              :value="pos.id"
            >
              {{ pos.title }}
            </option>
          </select>

          <!-- Custom Position Input -->
          <input
            v-else
            type="text"
            v-model="customPosition"
            required
            :placeholder="nodeType === 'label' ? 'e.g. Sangguniang Bayan Members' : 'e.g. Sangguniang Bayan Member / Ex-Officio Member'"
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
        </div>

        <!-- 4. Contact & Photo Avatar (Only for Officials) -->
        <div v-if="nodeType === 'official'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <!-- Contact Number -->
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              4. Contact Number (Optional)
            </label>
            <input
              type="text"
              v-model="form.contact"
              @input="onContactInput"
              placeholder="e.g. 0917-234-5601"
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
            />
          </div>

          <!-- Official Photo / Avatar -->
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              5. Official Photo
            </label>
            <div class="flex items-center space-x-3">
              <div class="relative size-12 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Preview"
                  class="size-full object-cover"
                />
                <ImageIcon v-else class="size-5 text-neutral-400" />
              </div>

              <div class="flex-1 space-y-1">
                <label class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg cursor-pointer transition">
                  <Upload class="size-3.5" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    class="hidden"
                    @change="handleFileChange"
                  />
                </label>
                <button
                  v-if="imagePreview"
                  type="button"
                  @click="removeAvatar"
                  class="block text-[11px] text-[#dc2626] hover:underline cursor-pointer"
                >
                  Remove photo
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions Bar -->
        <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            @click="emit('close')"
            class="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isUploadingImage"
            class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-md transition-colors shadow-xs cursor-pointer text-center flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Loader2 v-if="isUploadingImage" class="size-4 animate-spin" />
            <span>{{ nodeType === 'label' ? 'Save Label' : 'Save Official' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
