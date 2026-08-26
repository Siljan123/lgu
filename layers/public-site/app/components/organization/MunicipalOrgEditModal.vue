<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Edit3, X, PlusCircle, RotateCcw, Tag, User } from '@lucide/vue'
import type { MunicipalDepartmentNode, EditNodePayload, MunicipalDepartmentMember, OrgLabelOptions } from '../../../types/organization'
import { formatContactInput } from '#layers/public-site/utils/contact';

function onContactInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.value.contact = formatContactInput(target.value)
}

const props = withDefaults(
  defineProps<{
    open: boolean
    node: MunicipalDepartmentNode | null
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
  (e: 'submit', payload: EditNodePayload): void
}>()

const { data: dbPositions } = await useAsyncData<string[]>(
  'municipal-positions',
  () => $fetch<string[]>('/api/organization/positions'),
  { default: () => [] }
)

const { data: dbLabelOptions } = await useAsyncData<OrgLabelOptions>(
  'municipal-org-label-options',
  () => $fetch<OrgLabelOptions>('/api/organization/labels'),
  { default: () => ({ labels: [], positions: [] }) }
)

const nodeType = ref<'office' | 'label'>('office')
const isLabel = computed(() => nodeType.value === 'label')

const isCustomPosition = ref(false)
const customPosition = ref('')

const isCustomLabelTitle = ref(false)
const customLabelTitle = ref('')

function parseMemberName(member?: MunicipalDepartmentMember): { firstName: string; middleName: string; lastName: string } {
  if (!member) return { firstName: '', middleName: '', lastName: '' }
  if (member.first_name || member.last_name) {
    return {
      firstName: member.first_name || '',
      middleName: member.middle_name || '',
      lastName: member.last_name || '',
    }
  }
  if (!member.name) return { firstName: '', middleName: '', lastName: '' }

  const words = member.name.trim().split(/\s+/)
  if (words.length === 1) {
    return { firstName: words[0] || '', middleName: '', lastName: '' }
  }
  if (words.length === 2) {
    return { firstName: words[0] || '', middleName: '', lastName: words[1] || '' }
  }
  if (words.length === 3) {
    return { firstName: words[0] || '', middleName: words[1] || '', lastName: words[2] || '' }
  }
  return {
    firstName: words.slice(0, words.length - 2).join(' '),
    middleName: words[words.length - 2] || '',
    lastName: words[words.length - 1] || '',
  }
}

const form = ref<{
  nodeId: string
  title: string
  acronym: string
  firstName: string
  middleName: string
  lastName: string
  position: string
  contact: string
  description: string
  isOfficial: boolean
}>({
  nodeId: '',
  title: '',
  acronym: '',
  firstName: '',
  middleName: '',
  lastName: '',
  position: '',
  contact: '',
  description: '',
  isOfficial: false,
})

const positionOptions = computed(() => {
  const source = props.positions && props.positions.length > 0 ? props.positions : (dbPositions.value || [])
  const list = [...source].filter((p) => p !== '__custom__')
  if (form.value.position && form.value.position !== '__custom__' && !list.includes(form.value.position)) {
    list.unshift(form.value.position)
  }
  return list
})

const resolvedLabelOptions = computed<OrgLabelOptions>(() => {
  const fromProp = props.labelOptions
  if (fromProp && (fromProp.labels.length > 0 || fromProp.positions.length > 0)) return fromProp
  return dbLabelOptions.value || { labels: [], positions: [] }
})

const existingLabelTitles = computed(() => {
  const list = [...(resolvedLabelOptions.value.labels ?? [])]
  const current = form.value.title.trim()
  if (current && !list.includes(current)) list.unshift(current)
  return list
})
const labelPositionTitles = computed(() =>
  (resolvedLabelOptions.value.positions ?? []).filter((t) => !existingLabelTitles.value.includes(t))
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

watch(
  () => form.value.title,
  (val) => {
    if (val === '__custom__') {
      isCustomLabelTitle.value = true
      customLabelTitle.value = ''
    }
  }
)

watch(
  () => props.node,
  (currentNode) => {
    if (currentNode) {
      isCustomPosition.value = false
      customPosition.value = ''
      isCustomLabelTitle.value = false
      customLabelTitle.value = ''
      nodeType.value = currentNode.is_label ? 'label' : 'office'
      const mem = currentNode.member?.[0]
      const nameParsed = parseMemberName(mem)
      form.value = {
        nodeId: currentNode.id,
        title: currentNode.title,
        acronym: currentNode.acronym || '',
        firstName: nameParsed.firstName,
        middleName: nameParsed.middleName,
        lastName: nameParsed.lastName,
        position: currentNode.is_label ? '' : (mem?.position || mem?.role || ''),
        contact: currentNode.is_label ? '' : (mem?.contact || ''),
        description: currentNode.description || '',
        isOfficial: false,
      }
    }
  },
  { immediate: true }
)

function setNodeType(type: 'office' | 'label') {
  nodeType.value = type
  if (type === 'label') {
    isCustomPosition.value = false
    customPosition.value = ''
  } else {
    isCustomLabelTitle.value = false
    customLabelTitle.value = ''
    if (form.value.title === '__custom__') {
      form.value.title = props.node?.title || ''
    }
  }
}

function handleSubmit() {
  if (isLabel.value) {
    const finalTitle = isCustomLabelTitle.value ? customLabelTitle.value.trim() : form.value.title.trim()
    if (!finalTitle || finalTitle === '__custom__' || !form.value.nodeId) return

    emit('submit', {
      nodeId: form.value.nodeId,
      title: finalTitle,
      acronym: form.value.acronym.trim() || '',
      isLabel: true,
      description: form.value.description.trim() || '',
    })
    return
  }

  const finalPosition = isCustomPosition.value ? customPosition.value.trim() : form.value.position.trim()
  if (!form.value.title.trim() || !form.value.nodeId || !finalPosition) return

  const fullName = [form.value.firstName.trim(), form.value.middleName.trim(), form.value.lastName.trim()]
    .filter(Boolean)
    .join(' ')

  emit('submit', {
    nodeId: form.value.nodeId,
    title: form.value.title.trim(),
    acronym: form.value.acronym.trim() || '',
    isLabel: false,
    firstName: form.value.firstName.trim() || undefined,
    middleName: form.value.middleName.trim() || undefined,
    lastName: form.value.lastName.trim() || undefined,
    headName: fullName || undefined,
    position: finalPosition || undefined,
    contact: form.value.contact.trim() || undefined,
    description: form.value.description.trim() || '',
    isOfficial: form.value.isOfficial,
  })
}
</script>

<template>
  <div
    v-if="open && node"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-md w-full max-w-xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
      <!-- Header -->
      <div class="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shrink-0">
            <Tag v-if="isLabel" class="size-5" />
            <Edit3 v-else class="size-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
              {{ isLabel ? 'Edit Section Label' : 'Edit Employee/Official' }}
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {{ isLabel ? 'Update the grouping header for the nodes beneath it' : 'Update node information, personnel, and designation' }}
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
        <!-- Entry Type Type — convert between a real office and a grouping label -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Entry Type
          </label>
          <div class="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-sm border border-neutral-200 dark:border-neutral-700/60">
            <button
              type="button"
              data-testid="edit-node-type-office"
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
              <span>Employee/Official</span>
            </button>
            <button
              type="button"
              data-testid="edit-node-type-label"
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
              Saving as a label hides this node's personnel card. Existing personnel are kept and reappear if you switch back.
            </template>
            <template v-else>
              This node keeps a personnel card with name, position, and contact details.
            </template>
          </p>
        </div>

        <!-- 1a. Section Label Title (label mode) — options read live from the database -->
        <div v-if="isLabel" class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Section Label Title <span class="text-[#dc2626]">*</span>
            </label>
            <button
              v-if="!isCustomLabelTitle"
              type="button"
              @click="isCustomLabelTitle = true; customLabelTitle = form.title === '__custom__' ? '' : form.title"
              class="inline-flex items-center space-x-1 text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium transition cursor-pointer"
            >
              <PlusCircle class="size-3.5" />
              <span>Custom Label</span>
            </button>
            <button
              v-else
              type="button"
              @click="isCustomLabelTitle = false; customLabelTitle = ''; form.title = node?.title || ''"
              class="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium transition cursor-pointer"
            >
              <RotateCcw class="size-3" />
              <span class="underline">Back to list</span>
            </button>
          </div>

          <select
            v-if="!isCustomLabelTitle"
            v-model="form.title"
            data-testid="edit-label-title-select"
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
          </select>

          <input
            v-else
            type="text"
            v-model="customLabelTitle"
            data-testid="edit-label-title-input"
            required
            placeholder="e.g. Division Chiefs / Section Heads"
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
        </div>

        <!-- 1b. Office Title (office mode) -->
        <div v-else class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Office / Department Title <span class="text-[#dc2626]">*</span>
          </label>
          <input
            type="text"
            v-model="form.title"
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
        </div>

        <!-- Acronym (label mode: stands alone, no position field) -->
        <div v-if="isLabel" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Acronym
          </label>
          <input
            type="text"
            v-model="form.acronym"
            placeholder="e.g. MDRRMO, HRMO"
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
        </div>

        <!-- 2. Acronym and Position (office mode only) -->
        <div v-if="!isLabel" class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
          <div class="sm:col-span-4 space-y-1.5">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Acronym
            </label>
            <input
              type="text"
              v-model="form.acronym"
              placeholder="e.g. MDRRMO, HRMO"
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
            />
          </div>

          <div class="sm:col-span-8 space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Designation / Position <span class="text-[#dc2626]">*</span>
              </label>
              <button
                v-if="!isCustomPosition"
                type="button"
                @click="isCustomPosition = true; form.position = '__custom__'"
                class="inline-flex items-center space-x-1 text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium transition cursor-pointer"
              >
                <PlusCircle class="size-3.5" />
                <span>Custom Title</span>
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

            <!-- Select from Database -->
            <select
              v-if="!isCustomPosition"
              v-model="form.position"
              required
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
            >
              <option value="" disabled>Select position title/ designation...</option>
              <option
                v-for="pos in positionOptions"
                :key="pos"
                :value="pos"
              >
                {{ pos }}
              </option>
            </select>

            <input
              v-else
              type="text"
              v-model="customPosition"
              required
              placeholder="e.g. Division Chief / Senior Specialist"
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
            />
          </div>
        </div>

        <!-- 3. Employee / Personnel Name (First, Middle, Last) & Contact (office mode only) -->
        <div v-if="!isLabel" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Head / In-Charge Name & Contact Details
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <input
                type="text"
                v-model="form.firstName"
                placeholder="First Name *"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
            <div>
              <input
                type="text"
                v-model="form.middleName"
                placeholder="Middle Name / M.I."
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
            <div>
              <input
                type="text"
                v-model="form.lastName"
                placeholder="Last Name *"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
            <div >
              <input
                type="text"
                v-model="form.contact"
                @input="onContactInput"
                placeholder="Contact Information (e.g. +63 912 345 6789 / officer@sanfrancisco.gov.ph)"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
            
            <label class="sm:col-span-2 flex items-center space-x-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="form.isOfficial"
                class="rounded border-neutral-300 text-[#dc2626] focus:ring-[#dc2626] dark:border-neutral-600 dark:bg-neutral-800"
              />
              <span class="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">is government official?</span>
            </label>
          </div>
        </div>

        <!-- 4. Description -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Brief description of duties and functions..."
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition resize-none"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="pt-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 border-t border-[#dfdfdf] dark:border-[#333333]">
          <button
            type="button"
            @click="emit('close')"
            class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-sm transition cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-sm shadow-xs hover:shadow-md transition cursor-pointer text-center"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
