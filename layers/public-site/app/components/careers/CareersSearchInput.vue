<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Search, X, Tag, Sparkles, ChevronDown } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    suggestedTags: string[]
    label?: string
  }>(),
  {
    placeholder: 'Search...',
    label: 'Suggested Searches'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const isFocused = ref(false)
const containerRef = ref<HTMLElement | null>(null)

onClickOutside(containerRef, () => {
  isFocused.value = false
})

const handleSelectTag = (tag: string) => {
  if (props.modelValue === tag) {
    emit('update:modelValue', '')
  } else {
    emit('update:modelValue', tag)
  }
  isFocused.value = false
}

const clearInput = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <!-- Input Container -->
    <div class="relative">
      <input
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="isFocused = true"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-9 pr-16 py-2.5 text-xs sm:text-sm rounded-lg border border-[#dfdfdf] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1c1c1c] placeholder-[#707070] dark:placeholder-[#a3a3a3] text-primary focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#ffffff] transition-colors"
      />
      <Search class="size-4 text-[#707070] dark:text-[#a3a3a3] absolute left-3 top-3 pointer-events-none" />

      <!-- Right Buttons (Clear & Dropdown Indicator) -->
      <div class="absolute right-2.5 top-2.5 flex items-center gap-1">
        <button
          v-if="modelValue"
          type="button"
          @click="clearInput"
          class="p-0.5 rounded text-[#707070] hover:text-primary transition-colors"
          aria-label="Clear search"
        >
          <X class="size-4" />
        </button>

        <button
          type="button"
          @click="isFocused = !isFocused"
          class="p-0.5 rounded text-[#707070] hover:text-primary transition-colors cursor-pointer"
          title="Toggle suggested tags"
        >
          <ChevronDown :class="['size-4 transition-transform duration-200', isFocused ? 'rotate-180 text-brand' : '']" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isFocused && suggestedTags.length > 0"
        class="absolute left-0 right-0 top-full mt-1.5 z-30 p-3 rounded-xl border border-[#dfdfdf] dark:border-[#2a2a2a] bg-[#ffffff] dark:bg-[#1c1c1c] shadow-lg space-y-2.5"
      >
        <div class="flex items-center justify-between text-[11px] text-[#707070] dark:text-[#a3a3a3] border-b border-[#dfdfdf]/60 dark:border-[#2a2a2a] pb-2">
          <span class="font-semibold uppercase tracking-wider text-brand flex items-center gap-1.5">
            <Sparkles class="size-3.5" />
            {{ label }}
          </span>
          <span>Click tag to filter</span>
        </div>

        <!-- Tags Grid -->
        <div class="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto scrollbar-none pt-0.5">
          <button
            v-for="tag in suggestedTags"
            :key="tag"
            type="button"
            @click="handleSelectTag(tag)"
            :class="[
              'px-2.5 py-1 rounded-md text-xs font-medium transition-all inline-flex items-center gap-1 cursor-pointer',
              modelValue.toLowerCase() === tag.toLowerCase()
                ? 'bg-brand text-white shadow-xs'
                : 'bg-[#fafafa] dark:bg-[#252525] text-primary border border-[#dfdfdf] dark:border-[#333333] hover:border-brand hover:text-brand'
            ]"
          >
            <Tag class="size-3 shrink-0 opacity-70" />
            <span>{{ tag }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
