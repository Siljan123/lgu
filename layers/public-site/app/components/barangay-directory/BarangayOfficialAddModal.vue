<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  UserPlus,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Link as LinkIcon
} from '@lucide/vue'
import type { BarangayOfficial, BarangayPosition } from '../../composables/useBarangayDirectory'
import { formatContactInput } from '#layers/public-site/utils/contact';



const props = withDefaults(
  defineProps<{
    open: boolean
    barangayId: string
    barangayName: string
    selectedParentId?: string | null
    allOfficials?: BarangayOfficial[]
    positions?: BarangayPosition[]
  }>(),
  {
    selectedParentId: null,
    allOfficials: () => [],
    positions: () => []
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: Partial<BarangayOfficial>): void
}>()

const isCustomPosition = ref(false)
const customPosition = ref('')
const isUploadingImage = ref(false)
const imagePreview = ref<string | null>(null)
const selectedImageFile = ref<File | null>(null)
const base64DataUrl = ref<string | null>(null)
const showUrlInput = ref(false)

const standardPositions = [
  'Punong Barangay (Captain)',
  'Barangay Kagawad',
  'SK Chairperson',
  'Barangay Secretary',
  'Barangay Treasurer',
  'Barangay Tanod Executive Officer',
  'Lupong Tagapamayapa Member'
]

const form = ref({
  name: '',
  parentId: '',
  positionId: '',
  position: 'Barangay Kagawad',
  committee: '',
  contact: '',
  avatarUrl: '',
  orderIndex: 4
})
function onContactInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.value.contact = formatContactInput(target.value)
}
watch(
  () => form.value.position,
  (val) => {
    if (val === '__custom__') {
      isCustomPosition.value = true
      customPosition.value = ''
    } else {
      isCustomPosition.value = false
      if (val === 'Punong Barangay (Captain)') {
        form.value.orderIndex = 1
        form.value.committee = 'Executive & Peace and Order'
      } else if (val === 'Barangay Secretary') {
        form.value.orderIndex = 2
        form.value.committee = 'Secretariat'
      } else if (val === 'Barangay Treasurer') {
        form.value.orderIndex = 3
        form.value.committee = 'Treasury & Finance'
      } else if (val === 'SK Chairperson') {
        form.value.orderIndex = 10
        form.value.committee = 'Youth & Sports Development'
      } else {
        form.value.orderIndex = 4
      }
    }
  }
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      isCustomPosition.value = false
      customPosition.value = ''
      imagePreview.value = null
      selectedImageFile.value = null
      base64DataUrl.value = null
      isUploadingImage.value = false
      showUrlInput.value = false

      form.value = {
        name: '',
        parentId: props.selectedParentId || '',
        positionId: '',
        position: 'Barangay Kagawad',
        committee: '',
        contact: '',
        avatarUrl: '',
        orderIndex: 4
      }
    }
  }
)

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    selectedImageFile.value = file
    imagePreview.value = URL.createObjectURL(file)

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
  if (!form.value.name.trim()) return

  let finalPosition = isCustomPosition.value
    ? customPosition.value.trim() || 'Barangay Official'
    : form.value.position

  let finalAvatarUrl: string | null = form.value.avatarUrl || null

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

  emit('submit', {
    name: form.value.name.trim(),
    title: finalPosition,
    parent_id: form.value.parentId || null,
    parentId: form.value.parentId || null,
    committee: form.value.committee.trim() || undefined,
    contact: form.value.contact.trim() || undefined,
    avatar_url: finalAvatarUrl || undefined,
    order_index: Number(form.value.orderIndex) || 10
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
          <div class="size-9 rounded-xl bg-[#dc2626]/10 text-[#dc2626] dark:text-[#f87171] flex items-center justify-center">
            <UserPlus class="size-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#171717] dark:text-white leading-tight">
              Add Barangay Official
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              For Brgy. {{ barangayName }}
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
        <!-- Parent Node (Hierarchical Parent Selector) -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Reports To (Parent Node)
          </label>
          <select
            v-model="form.parentId"
            class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          >
            <option value="">-- Direct Under Barangay Captain (Default Root) --</option>
            <option v-for="off in allOfficials" :key="off.id" :value="off.id">
              {{ off.name }} ({{ off.title || off.position?.title }})
            </option>
          </select>
          <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Selecting a parent will place this official as a child node in the org chart.
          </p>
        </div>

        <!-- Avatar Upload Preview & Actions -->
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
                  <span>Choose Image</span>
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
            Committee / Assignment (optional)
          </label>
          <input
            v-model="form.committee"
            type="text"
            placeholder="e.g. Committee on Peace & Order, Finance"
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
            @input="onContactInput"
            placeholder=""
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Rank / Order Index -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Display Order Index
          </label>
          <input
            v-model.number="form.orderIndex"
            type="number"
            min="1"
            max="99"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
          <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            1 = Captain/Top, 2 = Secretary, 3 = Treasurer, 4-9 = Kagawad, 10 = SK Chairperson
          </p>
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
            <UserPlus class="size-3.5" />
            <span>Save Official</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
