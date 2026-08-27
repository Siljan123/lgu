<!-- components/organization/MunicipalOrgAddModal.vue -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { FolderPlus, X, Network, Sparkles, PlusCircle, RotateCcw, Tag, User, Upload, Image as ImageIcon, Loader2 } from '@lucide/vue'
import type { AddNodePayload, OrgLabelOptions } from '../../../types/organization'
import { formatContactInput } from '../../../utils/contact'

const props = withDefaults(
  defineProps<{
    open: boolean
    selectedParentId?: string
    allNodes: { id: string; title: string; acronym?: string; depth: number; isLabel?: boolean }[]
    positions?: string[]
    labelOptions?: OrgLabelOptions
  }>(),
  {
    positions: () => [],
    labelOptions: undefined,
  }
)
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: AddNodePayload): void
}>()

const { data: dbPositions } = await useAsyncData<string[]>(
  'municipal-positions',
  () => $fetch<string[]>('/api/organization/positions'),
  { default: () => [] }
)

// Label title choices, read  from the DB if the parent didn't supply them.
const { data: dbLabelOptions } = await useAsyncData<OrgLabelOptions>(
  'municipal-org-label-options',
  () => $fetch<OrgLabelOptions>('/api/organization/labels'),
  { default: () => ({ labels: [], positions: [] }) }
)

const nodeType = ref<'office' | 'label'>('office')
const isLabel = computed(() => nodeType.value === 'label')

const isIndependent = ref(false)
const isCustomTitle = ref(false)
const customTitle = ref('')

const isCustomPosition = ref(false)
const customPosition = ref('')

const isCustomLabelTitle = ref(false)
const customLabelTitle = ref('')
const labelTitle = ref('')

const isUploadingImage = ref(false)
const imagePreview = ref<string | null>(null)
const selectedImageFile = ref<File | null>(null)

const form = ref<{
  parentId: string
  title: string
  acronym: string
  firstName: string
  middleName: string
  lastName: string
  position: string
  contact: string
  description: string
  isOfficial: boolean
  imageUrl: string
}>({
  parentId: '',
  title: '',
  acronym: '',
  firstName: '',
  middleName: '',
  lastName: '',
  position: '',
  contact: '',
  description: '',
  isOfficial: false,
  imageUrl: '',
})
function onContactInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.value.contact = formatContactInput(target.value)
}
const titleOptions = computed(() => {
  const list = props.allNodes.map((n) => ({
    title: n.title,
    acronym: n.acronym,
  }))
  const uniqueTitles: { title: string; acronym?: string }[] = []
  const seen = new Set<string>()
  for (const item of list) {
    if (!seen.has(item.title)) {
      seen.add(item.title)
      uniqueTitles.push(item)
    }
  }
  return uniqueTitles
})

const resolvedLabelOptions = computed<OrgLabelOptions>(() => {
  const fromProp = props.labelOptions
  if (fromProp && (fromProp.labels.length > 0 || fromProp.positions.length > 0)) return fromProp
  return dbLabelOptions.value || { labels: [], positions: [] }
})

const existingLabelTitles = computed(() => resolvedLabelOptions.value.labels ?? [])
const labelPositionTitles = computed(() => resolvedLabelOptions.value.positions ?? [])
const parentNode = computed(() => props.allNodes.find(n => n.id === form.value.parentId))
const isParentLabel = computed(() => !!parentNode.value?.isLabel)

const hasLabelChoices = computed(
  () => existingLabelTitles.value.length > 0 || labelPositionTitles.value.length > 0
)

watch(
  () => form.value.title,
  (val) => {
    if (val === '__custom__') {
      isCustomTitle.value = true
      customTitle.value = ''
    } else if (val && !isIndependent.value) {
      const match = titleOptions.value.find((t) => t.title === val)
      if (match && match.acronym && !form.value.acronym) {
        form.value.acronym = match.acronym
      }
    }
  }
)

watch(
  () => form.value.position,
  (val) => {
    if (val === '__custom__') {
      isCustomPosition.value = true
      customPosition.value = ''
    }
  }
)

watch(labelTitle, (val) => {
  if (val === '__custom__') {
    isCustomLabelTitle.value = true
    customLabelTitle.value = ''
  }
})

// fall back to free text.
watch(
  [() => props.open, hasLabelChoices, isLabel],
  ([isOpen, hasChoices, labelMode]) => {
    if (isOpen && labelMode && !hasChoices) {
      isCustomLabelTitle.value = true
    }
  },
  { immediate: true }
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      nodeType.value = 'office'
      isCustomTitle.value = false
      customTitle.value = ''
      isCustomPosition.value = false
      customPosition.value = ''
      isCustomLabelTitle.value = false
      customLabelTitle.value = ''
      labelTitle.value = ''

      // If a specific parent was clicked, default to sub-office mode; otherwise default to sub-office under primary
      if (props.selectedParentId) {
        isIndependent.value = false
        form.value.parentId = props.selectedParentId
      } else {
        isIndependent.value = false
        form.value.parentId = props.allNodes[0]?.id ?? ''
      }
      form.value.title = ''
      form.value.acronym = ''
      form.value.firstName = ''
      form.value.middleName = ''
      form.value.lastName = ''
      form.value.position = ''
      form.value.contact = ''
      form.value.description = ''
      form.value.isOfficial = false
      form.value.imageUrl = ''
      imagePreview.value = null
      selectedImageFile.value = null
      isUploadingImage.value = false
    }
  },
  { immediate: true }
)

watch(
  () => props.selectedParentId,
  (newParentId) => {
    if (newParentId) {
      form.value.parentId = newParentId
      if (!isLabel.value || isParentLabel.value) {
        isIndependent.value = false
      }
    }
  }
)

watch(
  () => form.value.parentId,
  () => {
    if (!isLabel.value || isParentLabel.value) {
      isIndependent.value = false
    }
  }
)

watch(isLabel, (newVal) => {
  if (!newVal) {
    isIndependent.value = false
  }
})

function toggleMode(independent: boolean) {
  isIndependent.value = independent
  form.value.title = ''
  form.value.acronym = ''
  isCustomTitle.value = false
  customTitle.value = ''
  if (independent) {
    form.value.parentId = ''
  } else if (!form.value.parentId) {
    form.value.parentId = props.allNodes[0]?.id ?? ''
  }
}

function setNodeType(type: 'office' | 'label') {
  nodeType.value = type
  form.value.title = ''
  form.value.acronym = ''
  isCustomTitle.value = false
  customTitle.value = ''
  labelTitle.value = ''
  isCustomLabelTitle.value = !hasLabelChoices.value
  customLabelTitle.value = ''
  if (type === 'office') {
    isIndependent.value = false
  }
}

function handleFileChange(e: Event) {
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
  if (isLabel.value) {
    const finalLabelTitle = isCustomLabelTitle.value ? customLabelTitle.value.trim() : labelTitle.value.trim()
    if (!finalLabelTitle || finalLabelTitle === '__custom__') return

    emit('submit', {
      parentId: isIndependent.value ? undefined : (form.value.parentId || undefined),
      title: finalLabelTitle,
      acronym: form.value.acronym.trim() || '',
      isLabel: true,
      description: form.value.description.trim() || '',
    })
    return
  }

  const finalPosition = isCustomPosition.value ? customPosition.value.trim() : form.value.position.trim()
  
  const finalTitle = finalPosition
  const finalAcronym = form.value.acronym.trim()
  
  if (!finalTitle || !finalPosition) return

  const fullName = [form.value.firstName.trim(), form.value.middleName.trim(), form.value.lastName.trim()]
    .filter(Boolean)
    .join(' ')

  let uploadedUrl: string | null = form.value.imageUrl || null

  if (selectedImageFile.value) {
    isUploadingImage.value = true
    try {
      const formData = new FormData()
      formData.append('file', selectedImageFile.value)
      const res = await $fetch<{ success: boolean; publicUrl: string }>('/api/organization/upload', {
        method: 'POST',
        body: formData,
      })
      if (res?.publicUrl) {
        uploadedUrl = res.publicUrl
      }
    } catch (err) {
      console.error('Failed to upload avatar image:', err)
      alert('Failed to upload photo. Official will be created without avatar.')
    } finally {
      isUploadingImage.value = false
    }
  }

  emit('submit', {
    parentId: form.value.parentId || undefined,
    title: finalTitle,
    acronym: finalAcronym || '',
    isLabel: false,
    firstName: form.value.firstName.trim() || undefined,
    middleName: form.value.middleName.trim() || undefined,
    lastName: form.value.lastName.trim() || undefined,
    headName: fullName || undefined,
    position: finalPosition || undefined,
    contact: form.value.contact.trim() || undefined,
    description: form.value.description.trim() || '',
    isOfficial: form.value.isOfficial,
    avatar_url: uploadedUrl,
  })
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
          <div class="p-2 rounded-sm bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171] shrink-0">
            <Tag v-if="isLabel" class="size-5" />
            <FolderPlus v-else class="size-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
              {{ isLabel ? 'Add New Section Label' : 'Add New Office / Department' }}
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              <template v-if="isLabel">
                {{ isIndependent ? 'Add a section label as its own root on the chart' : 'Group offices under a shared position label' }}
              </template>
              <template v-else>
                {{ isIndependent ? 'Add a new independent parent office to the chart' : 'Attach a sub-office / division under an existing department' }}
              </template>
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
        <!-- 1. Node Type — a real office with a person, or a grouping label only -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            1. Entry Type
          </label>
          <div class="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-sm border border-neutral-200 dark:border-neutral-700/60">
            <button
              type="button"
              data-testid="node-type-office"
              :aria-pressed="!isLabel"
              @click="setNodeType('office')"
              class="flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer"
              :class="[
                !isLabel
                  ? 'bg-white dark:bg-[#1c1c1c] text-[#dc2626] shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              ]"
            >
              <User class="size-3.5" />
              <span>Official/Employee</span>
            </button>
            <button
              type="button"
              data-testid="node-type-label"
              :aria-pressed="isLabel"
              @click="setNodeType('label')"
              class="flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer"
              :class="[
                isLabel
                  ? 'bg-[#dc2626] text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              ]"
            >
              <Tag class="size-3.5" />
              <span>Label/Office</span>
            </button>
          </div>
          <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            <template v-if="isLabel">
              A label is a header only — no personnel card. Offices placed directly under it inherit its title.
            </template>
            <template v-else>
              A regular node with a personnel card: name, position, and contact details.
            </template>
          </p>
        </div>

        <!-- 2. Office Structure Placement Mode (label mode only) -->
        <div v-if="isLabel" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            2. Label Placement
          </label>
          <div class="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-sm border border-neutral-200 dark:border-neutral-700/60">
            <button
              type="button"
              @click="toggleMode(false)"
              class="flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer"
              :class="[
                !isIndependent
                  ? 'bg-white dark:bg-[#1c1c1c] text-[#dc2626] shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              ]"
            >
              <Network class="size-3.5" />
              <span>Nested or sub-label</span>
            </button>
            <button
              type="button"
              @click="toggleMode(true)"
              class="flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer"
              :class="[
                isIndependent
                  ? 'bg-[#dc2626] text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              ]"
            >
              <Sparkles class="size-3.5" />
              <span>Independent Label</span>
            </button>
          </div>
        </div>

        <!-- 1b. Parent Office Selection (Only when Sub-Office mode) -->
        <div v-if="!isIndependent" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {{ isLabel ? 'Parent Node' : 'Parent Office / Department' }} <span class="text-[#dc2626]">*</span>
          </label>
          <select
            v-model="form.parentId"
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
          >
            <option value="" disabled>Select parent office...</option>
            <option
              v-for="item in allNodes"
              :key="item.id"
              :value="item.id"
            >
              {{ item.title }} {{ item.acronym ? `(${item.acronym})` : '' }}
            </option>
          </select>
        </div>

        <!-- Independent Office Indicator Notice -->
        <div
          v-else
          class="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-sm flex items-center space-x-2.5 text-emerald-800 dark:text-emerald-300 text-xs"
        >
          <span>{{ isLabel ? 'Adding an independent section label. It will render as its own independent label on the canvas.' : 'Adding a new independent parent office. It will render as its own root on the canvas.' }}</span>
        </div>

        <!-- 3a. Section Label Title (label mode) — options read live from the database -->
        <div v-if="isLabel" class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              3. Section Label Title <span class="text-[#dc2626]">*</span>
            </label>

            <template v-if="hasLabelChoices">
              <button
                v-if="!isCustomLabelTitle"
                type="button"
                @click="isCustomLabelTitle = true; labelTitle = ''; customLabelTitle = ''"
                class="inline-flex items-center space-x-1 text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium transition cursor-pointer"
              >
                <PlusCircle class="size-3.5" />
                <span>Custom Label</span>
              </button>
              <button
                v-else
                type="button"
                @click="isCustomLabelTitle = false; customLabelTitle = ''; labelTitle = ''"
                class="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium transition cursor-pointer"
              >
                <RotateCcw class="size-3" />
                <span class="underline">Back to list</span>
              </button>
            </template>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
            <div class="sm:col-span-8">
              <select
                v-if="!isCustomLabelTitle"
                v-model="labelTitle"
                data-testid="label-title-select"
                required
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
              >
                <option value="" disabled>Select section label...</option>
                <optgroup v-if="existingLabelTitles.length > 0" label="Existing Section Labels">
                  <option v-for="item in existingLabelTitles" :key="`lbl-${item}`" :value="item">
                    {{ item }}
                  </option>
                </optgroup>
                <optgroup v-if="labelPositionTitles.length > 0" label="Position Titles">
                  <option v-for="item in labelPositionTitles" :key="`pos-${item}`" :value="item">
                    {{ item }}
                  </option>
                </optgroup>
                <option value="__custom__">+ Enter Custom Label...</option>
              </select>

              <input
                v-else
                type="text"
                v-model="customLabelTitle"
                data-testid="label-title-input"
                required
                placeholder="e.g. Division Chiefs / Section Heads"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>

            <div class="sm:col-span-4">
              <input
                type="text"
                v-model="form.acronym"
                placeholder="Acronym (optional)"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
          </div>

          <p v-if="!hasLabelChoices" class="text-[11px] text-neutral-500 dark:text-neutral-400">
            No labels or positions saved yet — type the first one and it becomes a choice next time.
          </p>
        </div>

        <div v-if="!isLabel" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            2. Personnel Details <span class="text-[#dc2626]">*</span>
          </label>
          <div class="sm:gap-3">
            <div class="grid grid-cols-4 gap-3">
              <div class="col-span-2">
                  <label class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">First Name</label>
                <input
                  type="text"
                  v-model="form.firstName"
                  required
              
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
                />
              </div>
              <div class="col-span-2">
                <label class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Middle Name/ I.</label>
                <input
                  type="text"
                  v-model="form.middleName"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
                />
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-2">
                  <label class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Last Name</label>
                <input
                  type="text"
                  v-model="form.lastName"
                  required
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
                />
              </div>
              <div class="col-span-1">
                <label class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Contact Number</label>
                <input
                  type="text"
                  v-model="form.contact"
                  @input="onContactInput"
                  placeholder="0940-124-1245"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isLabel" class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              3. Position / Designation <span class="text-[#dc2626]">*</span>
            </label>
            <button
              v-if="!isCustomPosition"
              type="button"
              @click="isCustomPosition = true; form.position = '__custom__'"
              class="inline-flex items-center space-x-1 text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium transition cursor-pointer"
            >
              <PlusCircle class="size-3.5" />
              <span>Custom Position</span>
            </button>
            <button
              v-else
              type="button"
              @click="isCustomPosition = false; form.position = ''"
              class="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium transition cursor-pointer"
            >
              <RotateCcw class="size-3" />
              <span class="underline">Back to list</span>
            </button>
          </div>

          <select
            v-if="!isCustomPosition"
            v-model="form.position"
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
          >
            <option value="" disabled>Select a position...</option>
            <option
              v-for="item in positions"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>

          <input
            v-else
            type="text"
            v-model="customPosition"
            required
            placeholder="e.g. Sangguniang Bayan Member"
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
          <label class="flex items-center space-x-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.isOfficial"
              class="rounded border-neutral-300 text-[#dc2626] focus:ring-[#dc2626] dark:border-neutral-600 dark:bg-neutral-800"
            />
            <span class="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">Is Elected Official? </span>
          </label>
        </div>

        <div v-if="!isLabel" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            4. Official Photo / Avatar
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

        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            5. Description / Scope of Responsibilities (Optional)
          </label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Brief description of duties and functions..."
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition resize-none"
          ></textarea>
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
            :disabled="isUploadingImage"
            class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm transition-colors shadow-xs cursor-pointer text-center flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Loader2 v-if="isUploadingImage" class="size-4 animate-spin" />
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
