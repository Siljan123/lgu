<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Edit3,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Link as LinkIcon
} from '@lucide/vue'
import { useBarangayDirectory, type BarangayOfficial } from '../../composables/useBarangayDirectory'

const props = withDefaults(
  defineProps<{
    open: boolean
    official: BarangayOfficial | null
    allOfficials?: BarangayOfficial[]
    barangayName?: string
  }>(),
  {
    allOfficials: () => []
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', officialId: string, payload: Partial<BarangayOfficial>): void
}>()

const isCustomPosition = ref(false)
const customPosition = ref('')
const isUploadingImage = ref(false)
const imagePreview = ref<string | null>(null)
const selectedImageFile = ref<File | null>(null)
const base64DataUrl = ref<string | null>(null)
const showUrlInput = ref(false)

const { positions, fetchPositions } = useBarangayDirectory()
await fetchPositions()
const standardPositions = computed(() => positions.value?.map(p => p.title) ?? [])

const form = ref({
  name: '',
  parentId: '',
  position: positions.value[0]?.title || '',
  committee: '',
  contact: '',
  avatarUrl: ''
})

watch(
  () => props.official,
  (off) => {
    if (off) {
      const currentTitle = off.title || off.position?.title || (positions.value[0]?.title || '')
      const matched = standardPositions.value.find(p => p.toLowerCase() === currentTitle.toLowerCase())

      if (matched) {
        form.value.position = matched
        isCustomPosition.value = false
        customPosition.value = ''
      } else {
        form.value.position = '__custom__'
        isCustomPosition.value = true
        customPosition.value = currentTitle
      }

      form.value.name = off.name || ''
      form.value.parentId = off.parent_id || off.parentId || ''
      form.value.committee = off.committee || ''
      form.value.contact = off.contact || ''
      form.value.avatarUrl = off.avatar_url || off.avatar || ''
      imagePreview.value = off.avatar_url || off.avatar || null
      selectedImageFile.value = null
      base64DataUrl.value = null
      showUrlInput.value = false
    }
  },
  { immediate: true }
)

watch(
  () => form.value.position,
  (val) => {
    if (val === '__custom__') {
      isCustomPosition.value = true
    } else {
      isCustomPosition.value = false
    }
  }
)

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    selectedImageFile.value = file
    imagePreview.value = URL.createObjectURL(file)

    // Also read base64 in background as fallback
    const reader = new FileReader()
    reader.onload = (e) => {
      base64DataUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function handleRemovePhoto() {
  selectedImageFile.value = null
  imagePreview.value = null
  base64DataUrl.value = null
  form.value.avatarUrl = ''
}

async function handleSubmit() {
  if (!props.official?.id || !form.value.name.trim()) return

  let finalPosition = isCustomPosition.value
    ? customPosition.value.trim() || 'Barangay Official'
    : form.value.position

  let finalAvatarUrl: string | null = form.value.avatarUrl || null

  // If a local image was picked, upload it to the server
  if (selectedImageFile.value) {
    try {
      isUploadingImage.value = true
      const formData = new FormData()
      formData.append('file', selectedImageFile.value)

      const res = await $fetch<{ success: boolean; publicUrl: string }>('/api/barangay-directory/upload', {
        method: 'POST',
        body: formData
      })

      if (res?.publicUrl) {
        finalAvatarUrl = res.publicUrl
      } else if (base64DataUrl.value) {
        finalAvatarUrl = base64DataUrl.value
      }
    } catch (err) {
      console.warn('Storage upload error, using fallback:', err)
      if (base64DataUrl.value) {
        finalAvatarUrl = base64DataUrl.value
      }
    } finally {
      isUploadingImage.value = false
    }
  }

  emit('submit', props.official.id, {
    name: form.value.name.trim(),
    title: finalPosition,
    parent_id: form.value.parentId || null,
    parentId: form.value.parentId || null,
    committee: form.value.committee.trim() || undefined,
    contact: form.value.contact.trim() || undefined,
    avatar_url: finalAvatarUrl || undefined
  })
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Edit3 class="size-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#171717] dark:text-white leading-tight">
              Edit Official Profile
            </h3>
            <p v-if="barangayName" class="text-xs text-neutral-500 dark:text-neutral-400">
              Brgy. {{ barangayName }}
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
        >
          <X class="size-5" />
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- Parent Node Selector -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Reports To (Parent Node)
          </label>
          <select
            v-model="form.parentId"
            class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          >
            <option value="">-- Direct Under Barangay Captain (Default Root) --</option>
            <option
              v-for="off in allOfficials.filter(o => o.id !== official?.id)"
              :key="off.id"
              :value="off.id"
            >
              {{ off.name }} ({{ off.title || off.position?.title }})
            </option>
          </select>
        </div>

        <!-- Avatar Preview & Actions -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Official Photo / Avatar
          </label>
          <div class="flex items-center space-x-4">
            <div class="relative size-16 rounded-full overflow-hidden border-2 border-[#dfdfdf] dark:border-[#333333] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 shadow-xs">
              <img
                v-if="imagePreview || form.avatarUrl"
                :src="imagePreview || form.avatarUrl"
                alt="Avatar Preview"
                class="size-full object-cover"
              />
              <ImageIcon v-else class="size-6 text-neutral-400" />
              <div
                v-if="isUploadingImage"
                class="absolute inset-0 bg-black/50 flex items-center justify-center text-white"
              >
                <Loader2 class="size-5 animate-spin" />
              </div>
            </div>
            <div class="flex-1 space-y-1.5">
              <div class="flex items-center space-x-2">
                <label
                  class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg cursor-pointer transition border border-neutral-300 dark:border-neutral-700"
                >
                  <Upload class="size-3.5" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleFileChange"
                    class="hidden"
                  />
                </label>

                <button
                  v-if="imagePreview || form.avatarUrl"
                  type="button"
                  @click="handleRemovePhoto"
                  class="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                >
                  <Trash2 class="size-3.5" />
                  <span>Remove</span>
                </button>
              
              </div>

              <!-- Direct URL input -->
              <div v-if="showUrlInput" class="pt-1">
                <input
                  v-model="form.avatarUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  class="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626]"
                  @input="imagePreview = form.avatarUrl"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Full Name -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Full Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. Hon. Juan M. Dela Cruz"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Position Dropdown -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Official Position <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.position"
            class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          >
            <option v-for="pos in standardPositions" :key="pos" :value="pos">
              {{ pos }}
            </option>
            <option value="__custom__">+ Custom Position...</option>
          </select>
        </div>

        <!-- Custom Position Input -->
        <div v-if="isCustomPosition">
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Custom Position Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="customPosition"
            type="text"
            required
            placeholder="e.g. Deputy Chief Executive"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Committee -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Committee / Assignment
          </label>
          <input
            v-model="form.committee"
            type="text"
            placeholder="e.g. Committee on Peace & Order"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Contact Phone -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Contact Number
          </label>
          <input
            v-model="form.contact"
            type="text"
            placeholder="e.g. +63 917 123 4567"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 border-t border-[#dfdfdf] dark:border-[#333333] flex items-center justify-end space-x-2.5">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!form.name.trim() || isUploadingImage"
            class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Edit3 class="size-3.5" />
            <span>Update Official</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
