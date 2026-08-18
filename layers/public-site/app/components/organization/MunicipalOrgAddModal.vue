<!-- components/organization/MunicipalOrgAddModal.vue -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { FolderPlus, X, Network, Sparkles, PlusCircle, RotateCcw } from '@lucide/vue'
import type { AddNodePayload } from '../../../types/organization'
import { formatContactInput } from '../../../utils/contact'

const props = withDefaults(
  defineProps<{
    open: boolean
    selectedParentId?: string
    allNodes: { id: string; title: string; acronym?: string; depth: number }[]
    positions?: string[]
  }>(),
  {
    positions: () => [],
  }
)
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: AddNodePayload): void
}>()

// Fetch positions from database if not passed as prop
const { data: dbPositions } = await useAsyncData<string[]>(
  'municipal-positions',
  () => $fetch<string[]>('/api/organization/positions'),
  { default: () => [] }
)

const isIndependent = ref(false)
const isCustomTitle = ref(false)
const customTitle = ref('')

const isCustomPosition = ref(false)
const customPosition = ref('')

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

const positionOptions = computed(() => {
  const source = props.positions && props.positions.length > 0 ? props.positions : (dbPositions.value || [])
  const list = [...source].filter((p) => Boolean(p) && p !== '__custom__')
  if (form.value.position && form.value.position !== '__custom__' && !list.includes(form.value.position)) {
    list.unshift(form.value.position)
  }
  return list
})

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

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      isCustomTitle.value = false
      customTitle.value = ''
      isCustomPosition.value = false
      customPosition.value = ''
      
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
    }
  },
  { immediate: true }
)

watch(
  () => props.selectedParentId,
  (newParentId) => {
    if (newParentId) {
      isIndependent.value = false
      form.value.parentId = newParentId
    }
  }
)

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

function handleSubmit() {
  const finalTitle = isIndependent.value
    ? form.value.title.trim()
    : (isCustomTitle.value ? customTitle.value.trim() : form.value.title.trim())
  const finalPosition = isCustomPosition.value ? customPosition.value.trim() : form.value.position.trim()
  if (!finalTitle || !finalPosition) return

  const fullName = [form.value.firstName.trim(), form.value.middleName.trim(), form.value.lastName.trim()]
    .filter(Boolean)
    .join(' ')

  emit('submit', {
    parentId: isIndependent.value ? undefined : (form.value.parentId || undefined),
    title: finalTitle,
    acronym: form.value.acronym.trim() || '',
    firstName: form.value.firstName.trim() || undefined,
    middleName: form.value.middleName.trim() || undefined,
    lastName: form.value.lastName.trim() || undefined,
    headName: fullName || undefined,
    position: finalPosition || undefined,
    contact: form.value.contact.trim() || undefined,
    description: form.value.description.trim() || '',
  })
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
      <!-- Modal Header -->
      <div class="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-xl bg-[#dc2626]/10 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171] shrink-0">
            <FolderPlus class="size-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
              Add New Office / Department
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {{ isIndependent ? 'Add a new independent parent office to the chart' : 'Attach a sub-office / division under an existing department' }}
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
        <!-- 1. Office Structure Placement Mode -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            1. Office Structure Placement
          </label>
          <div class="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
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
              <span>Sub-Office / Division</span>
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
              <span>Independent Office</span>
            </button>
          </div>
        </div>

        <!-- 1b. Parent Office Selection (Only when Sub-Office mode) -->
        <div v-if="!isIndependent" class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Parent Office / Department <span class="text-[#dc2626]">*</span>
          </label>
          <select
            v-model="form.parentId"
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
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
          class="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center space-x-2.5 text-emerald-800 dark:text-emerald-300 text-xs"
        >
          <Sparkles class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Adding a new independent parent office. It will render as its own root on the canvas.</span>
        </div>

        <!-- 2. Office / Department Title Section -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {{ isIndependent ? '2. New Parent Office / Department Title' : '2. Sub-Office / Department Title' }} <span class="text-[#dc2626]">*</span>
            </label>

            <!-- Custom Toggle (Only relevant in Sub-Office mode) -->
            <template v-if="!isIndependent">
              <button
                v-if="!isCustomTitle"
                type="button"
                @click="isCustomTitle = true; form.title = '__custom__'"
                class="inline-flex items-center space-x-1 text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium transition cursor-pointer"
              >
                <PlusCircle class="size-3.5" />
                <span>Custom Title</span>
              </button>
              <button
                v-else
                type="button"
                @click="isCustomTitle = false; form.title = ''"
                class="inline-flex items-center space-x-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium transition cursor-pointer"
              >
                <RotateCcw class="size-3" />
                <span class="underline">Back to list</span>
              </button>
            </template>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
            <div class="sm:col-span-8 md:col-span-8">
              <!-- When Independent Office: Direct Input Field for New Parent Office Title -->
              <input
                v-if="isIndependent"
                type="text"
                v-model="form.title"
                required
                placeholder="e.g. Sangguniang Bayan / Office of the Vice Mayor"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />

              <!-- When Sub-Office Mode: Select Existing Office Title Option -->
              <select
                v-else-if="!isCustomTitle"
                v-model="form.title"
                required
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
              >
                <option value="" disabled>Select office / department title...</option>
                <option
                  v-for="item in titleOptions"
                  :key="item.title"
                  :value="item.title"
                >
                  {{ item.title }} {{ item.acronym ? `(${item.acronym})` : '' }}
                </option>
                <option value="__custom__">+ Enter Custom Office Title...</option>
              </select>

              <!-- When Sub-Office Mode Custom: Enter Custom Sub-Office Title -->
              <input
                v-else
                type="text"
                v-model="customTitle"
                required
                placeholder="e.g. Tourism Promotion & Cultural Affairs Division"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>

            <div class="sm:col-span-4 md:col-span-4">
              <input
                type="text"
                v-model="form.acronym"
                placeholder="Acronym (e.g. SB, OVM)"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            3. {{ isIndependent ? 'Department Head / Lead Officer Details' : 'Employee / Personnel Details' }} <span class="text-[#dc2626]">*</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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
            <div >
              <input
                type="text"
                v-model="form.contact"
                @input="onContactInput"
                placeholder="Contact number"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
              />
            </div>
          </div>

          <!-- Contact Field -->
         
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              4. Position / Designation <span class="text-[#dc2626]">*</span>
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

          <!-- Select from Database Positions -->
          <select
            v-if="!isCustomPosition"
            v-model="form.position"
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition cursor-pointer"
          >
            <option value="" disabled>Select position / designation...</option>
            <option
              v-for="pos in positionOptions"
              :key="pos"
              :value="pos"
            >
              {{ pos }}
            </option>
            <option value="__custom__">+ Enter Custom Position Title...</option>
          </select>

          <!-- Enter Custom Position Title Input -->
          <input
            v-else
            type="text"
            v-model="customPosition"
            required
            placeholder="e.g. Municipal Vice Mayor / Presiding Officer / Department Head"
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition"
          />
        </div>

        <!-- 5. Description (Optional) -->
        <div class="space-y-1.5">
          <label class="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            5. Description / Scope of Responsibilities (Optional)
          </label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Brief description of duties and functions..."
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/10 transition resize-none"
          ></textarea>
        </div>

        <!-- Modal Actions Bar -->
        <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            @click="emit('close')"
            class="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl transition-colors shadow-xs cursor-pointer text-center"
          >
            Save 
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
