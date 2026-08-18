<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Edit3,
  X,
  PlusCircle,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Loader2,
} from '@lucide/vue'
import type {
  OfficialRow,
  EditOfficialPayload,
  PositionRow,
} from '../../../types/official'
import { formatContactInput } from '../../../utils/contact'

const props = withDefaults(
  defineProps<{
    open: boolean
    official: OfficialRow | null
    allOfficials?: { id: string; fullName: string; position: string }[]
    positions?: PositionRow[]
  }>(),
  {
    allOfficials: () => [],
    positions: () => [],
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: EditOfficialPayload): void
}>()

const isCustomPosition = ref(false)
const customPosition = ref('')
const isUploadingImage = ref(false)
const imagePreview = ref<string | null>(null)
const selectedImageFile = ref<File | null>(null)

const form = ref({
  id: '',
  parentId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  positionId: '',
  position: '',
  contact: '',
  imageUrl: '',
})

function onContactInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.value.contact = formatContactInput(target.value)
}

const positionOptions = computed(() => {
  return props.positions || []
})

// Filter out self from parent options to prevent cycle
const availableParents = computed(() => {
  if (!props.official) return props.allOfficials
  return props.allOfficials.filter((o) => o.id !== props.official?.id)
})

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
  () => props.official,
  (cur) => {
    if (cur) {
      isCustomPosition.value = false
      customPosition.value = ''
      selectedImageFile.value = null
      imagePreview.value = cur.image_url || null
      isUploadingImage.value = false

      form.value = {
        id: cur.id,
        parentId: cur.parent_id || '',
        firstName: cur.first_name || '',
        middleName: cur.middle_name || '',
        lastName: cur.last_name || '',
        positionId: cur.position_id || cur.position?.id || '',
        position: cur.position?.title || '',
        contact: cur.contact || '',
        imageUrl: cur.image_url || '',
      }

      // Check if position exists in options
      if (form.value.positionId && !positionOptions.value.some((p) => p.id === form.value.positionId)) {
        if (form.value.position) {
          isCustomPosition.value = true
          customPosition.value = form.value.position
        }
      }
    }
  },
  { immediate: true }
)

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!allowed.includes(file.type)) {
    alert('Please upload a valid image file (JPEG, PNG, WEBP, or SVG).')
    return
  }

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
  form.value.imageUrl = ''
}

async function handleSubmit() {
  const firstName = form.value.firstName.trim()
  const lastName = form.value.lastName.trim()
  if (!firstName || !lastName || !form.value.id) return

  const finalPosTitle = isCustomPosition.value ? customPosition.value.trim() : form.value.position.trim()
  if (!finalPosTitle && !form.value.positionId) return

  let uploadedUrl = form.value.imageUrl || null

  // If new local image selected, upload it
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
      alert('Failed to upload photo. Changes will be saved with existing avatar.')
    } finally {
      isUploadingImage.value = false
    }
  }

  const payload: EditOfficialPayload = {
    id: form.value.id,
    first_name: firstName,
    middle_name: form.value.middleName.trim() || undefined,
    last_name: lastName,
    position_id: isCustomPosition.value ? undefined : form.value.positionId || undefined,
    position: finalPosTitle || undefined,
    parent_id: form.value.parentId || null,
    contact: form.value.contact.trim() || undefined,
    image_url: uploadedUrl,
  }

  emit('submit', payload)
}
</script>

<template>
  <div
    v-if="open && official"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
      <!-- Header -->
      <div class="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shrink-0">
            <Edit3 class="size-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
              Edit Elected Official
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Update official's profile, position, contact, and reports-to hierarchy
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
        <!-- 1. Reports To (Parent Official) -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Reports To (Hierarchy Placement)
          </label>
          <select
            v-model="form.parentId"
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
          >
            <option value="">No Superior (Top Level / Mayor)</option>
            <option
              v-for="item in availableParents"
              :key="item.id"
              :value="item.id"
            >
              {{ item.fullName }} ({{ item.position }})
            </option>
          </select>
        </div>

        <!-- 2. Full Name -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Full Name <span class="text-[#dc2626]">*</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <input
                type="text"
                v-model="form.firstName"
                required
                placeholder="First Name *"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
            <div>
              <input
                type="text"
                v-model="form.middleName"
                placeholder="Middle Name / M.I."
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
            <div>
              <input
                type="text"
                v-model="form.lastName"
                required
                placeholder="Last Name *"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
          </div>
        </div>

        <!-- 3. Position / Designation -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Elected Position / Designation <span class="text-[#dc2626]">*</span>
            </label>
            <button
              v-if="!isCustomPosition"
              type="button"
              @click="isCustomPosition = true; form.positionId = '__custom__'"
              class="inline-flex items-center space-x-1 text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium transition cursor-pointer"
            >
              <PlusCircle class="size-3.5" />
              <span>Custom Position</span>
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

          <!-- Position Select -->
          <select
            v-if="!isCustomPosition"
            v-model="form.positionId"
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
          >
            <option value="" disabled>Select elected position...</option>
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
            placeholder="e.g. Sangguniang Bayan Member"
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
        </div>

        <!-- 4. Contact & Photo -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Contact Number (Optional)
            </label>
            <input
              type="text"
              v-model="form.contact"
              @input="onContactInput"
              placeholder="e.g. 0917-234-5601"
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Official Photo / Avatar
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
                  <span>Change Photo</span>
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

        <!-- Actions -->
        <div class="pt-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 border-t border-[#dfdfdf] dark:border-[#333333]">
          <button
            type="button"
            @click="emit('close')"
            class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl transition cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isUploadingImage"
            class="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl shadow-xs hover:shadow-md transition cursor-pointer text-center flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Loader2 v-if="isUploadingImage" class="size-4 animate-spin" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
