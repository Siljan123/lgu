<script setup lang="ts">
import { computed } from 'vue'
import { X, User, Phone, Map as MapIcon, Mail, Info, Briefcase } from '@lucide/vue'
import type { MunicipalDepartmentNode, MunicipalDepartmentMember } from '../../../types/organization'
import { getInitials } from '../../../utils/string'

const props = defineProps<{
  open: boolean
  node: MunicipalDepartmentNode | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const member = computed<MunicipalDepartmentMember | null>(() => {
  if (!props.node?.member?.length) return null
  return props.node.member[0] as MunicipalDepartmentMember
})

const isLabel = computed(() => !!member.value?.is_label)

const fullName = computed(() => {
  if (!member.value) return ''
  return member.value.name || [member.value.first_name, member.value.middle_name, member.value.last_name].filter(Boolean).join(' ')
})
</script>

<template>
  <div
    v-if="open && node"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-md w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
      
      <!-- Modal Header -->
      <div class="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#dfdfdf] dark:border-[#333333] flex items-center justify-between bg-neutral-50/80 dark:bg-[#222222]/80">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-sm bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shrink-0">
            <Info class="size-5" />
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-tight">
              {{ isLabel ? 'Section Label Details' : 'Details' }}
            </h2>
            <p class="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Viewing information for this node.
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="p-2 -mr-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-[#333333] dark:hover:text-neutral-300 rounded-sm transition-colors cursor-pointer"
        >
          <X class="size-4 sm:size-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 sm:p-6 bg-white dark:bg-[#1c1c1c]">
        
        <div v-if="isLabel" class="text-center py-6">
          <h3 class="text-lg font-bold text-neutral-900 dark:text-white">{{ node.title }}</h3>
          <p v-if="node.acronym" class="text-xs font-mono text-neutral-500 mt-1">Acronym: {{ node.acronym }}</p>
          <p class="text-sm text-neutral-500 mt-4 max-w-sm mx-auto">This is a section label used to group offices or officials together.</p>
        </div>

        <div v-else-if="member" class="space-y-6">
          
          <!-- Avatar and Name -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
            <div
              v-if="member.avatar_url"
              class="size-20 sm:size-24 rounded-full overflow-hidden border-2 border-[#dfdfdf] dark:border-[#333333] shrink-0"
            >
              <img
                :src="member.image_url"
                :alt="fullName"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="size-20 sm:size-24 rounded-full flex items-center justify-center bg-[#dc2626]/10 text-[#dc2626] font-bold text-2xl border-2 border-[#dfdfdf] dark:border-[#333333] shrink-0"
            >
              {{ getInitials(fullName) }}
            </div>
            
            <div class="text-center sm:text-left flex-1 min-w-0">
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white truncate">{{ fullName }}</h3>
              <p v-if="member.position" class="text-sm font-medium text-[#dc2626] dark:text-[#f87171] mt-1">{{ member.position }}</p>
              <p v-if="node.title && node.title !== member.position" class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                {{ node.title }} <span v-if="node.acronym">({{ node.acronym }})</span>
              </p>
            </div>
          </div>

          <div class="h-px w-full bg-[#dfdfdf] dark:bg-[#333333]"></div>

          <!-- Contact Details -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">Contact Information</h4>
            
            <div v-if="member.contact" class="flex items-start space-x-3 text-sm">
              <Phone class="size-4 text-neutral-400 shrink-0 mt-0.5" />
              <span class="text-neutral-700 dark:text-neutral-300 font-medium">{{ member.contact }}</span>
            </div>
            
            <div v-if="member.email" class="flex items-start space-x-3 text-sm">
              <Mail class="size-4 text-neutral-400 shrink-0 mt-0.5" />
              <span class="text-neutral-700 dark:text-neutral-300 font-medium">{{ member.email }}</span>
            </div>

            <div v-if="!member.contact && !member.email" class="text-sm text-neutral-500 italic">
              No contact information available.
            </div>
          </div>
          
        </div>
        
        <div v-else class="text-center py-6 text-neutral-500">
          No detailed information available for this node.
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-5 py-4 sm:px-6 border-t border-[#dfdfdf] dark:border-[#333333] bg-neutral-50/80 dark:bg-[#222222]/80 flex justify-end">
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-2 bg-white dark:bg-[#1c1c1c] border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] text-sm font-medium rounded-sm shadow-xs transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-neutral-900/5 dark:focus:ring-white/10"
        >
          Close
        </button>
      </div>

    </div>
  </div>
</template>
