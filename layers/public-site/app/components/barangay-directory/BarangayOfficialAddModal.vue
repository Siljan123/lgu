<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  UserPlus,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Link as LinkIcon,
  Tag,
  User,
  CornerDownRight
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

// Node type: a real elected official (person) or a position/section label only.
const nodeType = ref<'official' | 'label'>('official')
const isLabel = computed(() => nodeType.value === 'label')

// The parent is fixed by whichever card's "add" button opened this modal, so
// there is no parent picker here — this is read-only context for the user.
const resolvedParentId = computed(() => props.selectedParentId || null)
const parentOfficial = computed(() =>
  resolvedParentId.value ? props.allOfficials.find(o => o.id === resolvedParentId.value) : undefined
)
const parentDisplay = computed(() => {
  const p = parentOfficial.value
  if (!p) return null
  const title = p.title || p.position?.title
  // Label rows store the position as their name, so don't repeat it.
  return title && title !== p.name ? `${p.name} (${title})` : p.name
})

// The resolved position/label text (from the dropdown or the custom input).
const resolvedPosition = computed(() =>
  isCustomPosition.value
    ? customPosition.value.trim()
    : form.value.position
)

// Whether the form can be submitted: a label only needs a position, an official needs a name.
const canSubmit = computed(() => {
  if (isUploadingImage.value) return false
  return isLabel.value ? !!resolvedPosition.value : !!form.value.name.trim()
})


const {positions, fetchPositions} = useBarangayDirectory()
await fetchPositions()
const standardPositions = computed(() => positions.value?.map(p=>p.title) ?? [])

const form = ref({
  name: '',
  positionId: positions.value[0]?.id || '',
  position: positions.value[0]?.title || '',
  committee: '',
  contact: '',
  avatarUrl: ''
})

function onContactInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.value.contact = formatContactInput(target.value)
}

watch(
  () => form.value.position,
  (val) => {
    const matched = positions.value.find(p => p.title === val)
    if (matched) {
      form.value.positionId = matched.id
    } else {
      form.value.positionId = ''
    }
  }
)

function applyDynamicParentPosition(parent?: BarangayOfficial) {
  const dbPositions = positions.value || []
  const defaultTitle = dbPositions[0]?.title || ''
  const defaultId = dbPositions[0]?.id || ''

  if (!parent) {
    isCustomMode.value = false
    form.value.position = defaultTitle
    form.value.positionId = defaultId
    return
  }

  // Get parent's exact title directly from database record
  const dbTitle = (parent.position?.title || parent.title || parent.name || '').trim()
  if (!dbTitle) {
    isCustomMode.value = false
    form.value.position = defaultTitle
    form.value.positionId = defaultId
    return
  }

  // Find matching position from database table (barangay_directory.position)
  const matchedDbPos = dbPositions.find(
    p => p.title.toLowerCase() === dbTitle.toLowerCase() || (parent.position_id && p.id === parent.position_id)
  )

  if (matchedDbPos) {
    isCustomMode.value = false
    form.value.position = matchedDbPos.title
    form.value.positionId = matchedDbPos.id
  } else if (parent.is_label) {
    // Custom label created in DB: use exact label title from database
    isCustomMode.value = true
    form.value.position = dbTitle
    form.value.positionId = ''
  } else {
    isCustomMode.value = false
    form.value.position = defaultTitle
    form.value.positionId = defaultId
  }
}

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
      nodeType.value = 'official'

      form.value = {
        name: '',
        positionId: positions.value[0]?.id || '',
        position: positions.value[0]?.title || '',
        committee: '',
        contact: '',
        avatarUrl: ''
      }

      applyDynamicParentPosition(parentOfficial.value)
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
  const finalPosition = (resolvedPosition.value || 'Barangay Official')

  // Label node: only the position/label matters — no person details.
  if (isLabel.value) {
    if (!resolvedPosition.value) return
    emit('submit', {
      name: finalPosition,
      title: finalPosition,
      is_label: true,
      parent_id: resolvedParentId.value,
      parentId: resolvedParentId.value
    })
    return
  }

  if (!form.value.name.trim()) return

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
    is_label: false,
    parent_id: resolvedParentId.value,
    parentId: resolvedParentId.value,
    committee: form.value.committee.trim() || undefined,
    contact: form.value.contact.trim() || undefined,
    avatar_url: finalAvatarUrl || undefined
  })
}
const isCustomMode = ref(false)
function toggleCustomPosition(){
  isCustomMode.value = !isCustomMode.value
  form.value.position = ''
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-md w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="size-9 rounded-md bg-[#dc2626]/10 text-[#dc2626] dark:text-[#f87171] flex items-center justify-center">
            <UserPlus class="size-4" />
          </div>
          <div>
            <h3 class="text-base font-bold text-[#171717] dark:text-white leading-tight">
              {{ isLabel ? 'Add Label / Section' : 'Add Barangay Official' }}
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
        <!-- Entry Type: Elected Official vs Label -->
        <div>
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Add As <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <label
              class="flex items-start space-x-2 rounded-sm border p-3 cursor-pointer transition"
              :class="!isLabel
                ? 'border-[#dc2626] bg-[#dc2626]/5 dark:bg-[#dc2626]/10'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'"
            >
              <input
                type="radio"
                value="official"
                v-model="nodeType"
                class="mt-0.5 accent-[#dc2626]"
              />
              <span class="min-w-0">
                <span class="flex items-center space-x-1 text-xs font-semibold text-neutral-900 dark:text-white">
                  <User class="size-3.5" />
                  <span>Elected Official</span>
                </span>
                <span class="block text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">
                  A real person with name, photo &amp; contact.
                </span>
              </span>
            </label>

            <label
              class="flex items-start space-x-2 rounded-sm border p-3 cursor-pointer transition"
              :class="isLabel
                ? 'border-[#dc2626] bg-[#dc2626]/5 dark:bg-[#dc2626]/10'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'"
            >
              <input
                type="radio"
                value="label"
                v-model="nodeType"
                class="mt-0.5 accent-[#dc2626]"
              />
              <span class="min-w-0">
                <span class="flex items-center space-x-1 text-xs font-semibold text-neutral-900 dark:text-white">
                  <Tag class="size-3.5" />
                  <span>Label</span>
                </span>
                <span class="block text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">
                  Position/section header only (e.g. "Kagawad").
                </span>
              </span>
            </label>
          </div>
        </div>

        <!-- Placement (read-only: determined by the card's add button) -->
        <div
          class="flex items-start space-x-2 rounded-sm bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 px-3 py-2.5"
        >
          <CornerDownRight class="size-3.5 mt-0.5 text-neutral-400 shrink-0" />
          <p class="text-[11px] leading-snug text-neutral-600 dark:text-neutral-400">
            <template v-if="parentDisplay">
              Will be placed under
              <span class="font-semibold text-neutral-900 dark:text-white">{{ parentDisplay }}</span>.
            </template>
            <template v-else>
              Will be placed at the
              <span class="font-semibold text-neutral-900 dark:text-white">top level</span>
              of the org chart.
            </template>
          </p>
        </div>

        <!-- Avatar Upload Preview & Actions -->
        <div v-if="!isLabel">
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
        <div v-if="!isLabel">
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Full Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            :required="!isLabel"
            placeholder="e.g. Hon. Juan M. Dela Cruz"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Position Dropdown -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {{ isLabel ? 'Label / Position to Display' : 'Official Position' }} <span class="text-red-500">*</span>
            </label>
            <button
              type="button"
              @click="toggleCustomPosition"
              class="text-xs font-semibold text-[#dc2626] hover:underline"
            >
              {{ isCustomMode ? 'Select from list' : '+ Custom Position' }}
            </button>
          </div>
          <select
            v-if="!isCustomMode"
            v-model="form.position"
            class="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          >
            <option disabled value="">Select position</option>
            <option v-for="pos in standardPositions" :key="pos" :value="pos">
              {{ pos }}
            </option>
          </select>

          <input
            v-else
            v-model="form.position"
            type="text"
            required
            placeholder="e.g. Deputy Chief Executive"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
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
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Committee -->
        <div v-if="!isLabel">
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Committee / Assignment (optional)
          </label>
          <input
            v-model="form.committee"
            type="text"
            placeholder="e.g. Committee on Peace & Order, Finance"
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Contact Phone -->
        <div v-if="!isLabel">
          <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Contact Number
          </label>
          <input
            v-model="form.contact"
            type="text"
            @input="onContactInput"
            placeholder=""
            class="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition"
          />
        </div>

        <!-- Action Buttons -->
        <div class="pt-4  border-[#dfdfdf] dark:border-[#333333] flex items-center justify-end space-x-2.5">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!canSubmit"
            class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <component :is="isLabel ? Tag : UserPlus" class="size-3.5" />
            <span>{{ isLabel ? 'Save Label' : 'Save Official' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
