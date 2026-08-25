<script setup lang="ts">
import { computed } from 'vue'
import { Trash2, AlertTriangle, AlertCircle, Tag, User } from '@lucide/vue'
import type { BarangayOfficial } from '../../composables/useBarangayDirectory'

const props = withDefaults(
  defineProps<{
    open: boolean
    official: BarangayOfficial | null
    allOfficials?: BarangayOfficial[]
  }>(),
  {
    allOfficials: () => []
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', officialId: string): void
}>()

// Calculate all descendant officials recursively
const descendants = computed<BarangayOfficial[]>(() => {
  if (!props.official?.id || !props.allOfficials.length) return []

  const result: BarangayOfficial[] = []
  const queue = [props.official.id]
  const visited = new Set<string>([props.official.id])

  while (queue.length > 0) {
    const parentId = queue.shift()!
    const directChildren = props.allOfficials.filter(
      o => (o.parent_id === parentId || o.parentId === parentId) && !visited.has(o.id)
    )
    for (const child of directChildren) {
      visited.add(child.id)
      result.push(child)
      queue.push(child.id)
    }
  }

  return result
})

const isLabel = computed(() => !!props.official?.is_label)
const hasChildren = computed(() => descendants.value.length > 0)
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-[#1c1c1c] border border-[#dfdfdf] dark:border-[#333333] rounded-sm w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <div class="p-6 text-center">
        <div class="size-12 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <AlertTriangle class="size-6" />
        </div>

        <h3 class="text-base font-bold text-[#171717] dark:text-white">
          {{ isLabel ? 'Delete Section Label?' : 'Delete Barangay Official?' }}
        </h3>

        <div v-if="isLabel" class="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          <p>
            Are you sure you want to remove the section label <strong class="text-neutral-900 dark:text-white">"{{ official?.title || official?.name }}"</strong>?
          </p>
        </div>

        <div v-else class="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          <p>
            Are you sure you want to remove <strong class="text-neutral-900 dark:text-white">{{ official?.name }}</strong> ({{ official?.title || official?.position?.title }}) from the records?
          </p>
        </div>

        <!-- Descendants warning notice when deleting a label or official with children -->
        <div
          v-if="hasChildren"
          class="mt-4 p-3.5 rounded-sm border border-amber-500/20 text-left text-xs"
        >
          <div class="flex items-start space-x-2.5">
           
            <div class="space-y-1.5 flex-1 min-w-0">
              <p class="font-semibold text-amber-900 dark:text-amber-200">
                All officials under this label will be deleted
              </p>
              <ul class="max-h-28 overflow-y-auto space-y-1 pl-1 text-[11px] text-amber-900 pt-1">
                <li v-for="d in descendants" :key="d.id" class="pt-1 flex items-center justify-between gap-1">
                  <span class="truncate font-medium">{{ d.name }}</span>
                  <span class="text-[10px] opacity-75 shrink-0">({{ d.title || (d.is_label ? 'Label' : 'Official') }})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-6 flex items-center justify-center space-x-3">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="official?.id && emit('confirm', official.id)"
            class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-sm shadow-xs transition cursor-pointer"
          >
            <Trash2 class="size-3.5" />
            <span>{{ isLabel && hasChildren ? 'Delete All' : isLabel ? 'Delete Label' : hasChildren ? 'Delete All' : 'Delete Official' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
