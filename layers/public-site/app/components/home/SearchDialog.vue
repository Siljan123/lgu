<script setup lang="ts">
import { defineComponent, watch } from 'vue'
import {
  FileText,
  Building2,
  ShieldCheck,
  ScrollText,
  HeartPulse,
  Briefcase,
  ArrowRight,
} from '@lucide/vue'
import { useCommand } from '#layers/base/app/components/ui/command'

const isSearchOpen = ref(false)
const searchQuery = ref('')

const CommandSearchSync = defineComponent({
  name: 'CommandSearchSync',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { filterState } = useCommand()

    function syncSearch(val: string) {
      nextTick(() => {
        if (filterState.search !== val) {
          filterState.search = val ?? ''
        }
      })
    }

    onMounted(() => {
      syncSearch(props.modelValue)
    })

    watch(() => props.modelValue, (newVal) => {
      syncSearch(newVal)
    })

    watch(() => filterState.search, (newVal) => {
      if (props.modelValue !== newVal) {
        emit('update:modelValue', newVal)
      }
    })

    return () => null
  }
})

const popularSearches = [
  { label: 'Business Permit', query: 'Business Permit', icon: FileText },
  { label: 'Real Property Tax', query: 'Real Property Tax', icon: Building2 },
  { label: 'Civil Registry', query: 'Civil Registry', icon: ShieldCheck },
  { label: 'Ordinances', query: 'Ordinances', icon: ScrollText },
  { label: 'Health Certificate', query: 'Health Certificate', icon: HeartPulse },
  { label: 'Job Openings', query: 'Job Openings', icon: Briefcase },
]

const allServices = [
  {
    title: 'New Business Permit Application',
    category: 'Services',
    description: 'Apply for a new municipal business permit online with document verification',
    href: '/services/business-permit',
    icon: FileText
  },
  {
    title: 'Business Permit Renewal',
    category: 'Services',
    description: 'Renew existing business licenses and pay local business taxes',
    href: '/services/business-renewal',
    icon: FileText
  },
  {
    title: 'Real Property Tax (RPT) Payment',
    category: 'Taxation',
    description: 'Calculate and pay real property taxes online or request tax clearance',
    href: '/services/rpt',
    icon: Building2
  },
  {
    title: 'Civil Registry Documents',
    category: 'Civil Registry',
    description: 'Request certified true copies of birth, marriage, and death records',
    href: '/services/civil-registry',
    icon: ShieldCheck
  },
  {
    title: 'Municipal Ordinances & Resolutions',
    category: 'Legislation',
    description: 'Search and read approved municipal ordinances and Sangguniang Bayan records',
    href: '/ordinances',
    icon: ScrollText
  },
  {
    title: 'Sanitary & Health Card Clearance',
    category: 'Health',
    description: 'Requirements, application, and scheduling for municipal health certificates',
    href: '/services/health-cert',
    icon: HeartPulse
  },
  {
    title: 'Municipal Job Vacancies',
    category: 'Careers',
    description: 'Explore career opportunities and public employment postings in San Francisco',
    href: '/careers',
    icon: Briefcase
  },
  {
    title: 'Building & Zoning Permits',
    category: 'Engineering',
    description: 'Applications for building, electrical, plumbing, and locational clearances',
    href: '/services/building-permit',
    icon: Building2
  },
]

const categories = computed(() => {
  const map = new Map<string, typeof allServices>()
  for (const service of allServices) {
    if (!map.has(service.category)) {
      map.set(service.category, [])
    }
    map.get(service.category)!.push(service)
  }
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }))
})

function open(query = '') {
  searchQuery.value = query
  isSearchOpen.value = true
}

function handleSelect(href: string) {
  isSearchOpen.value = false
  navigateTo(href)
}

defineExpose({
  open
})

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isSearchOpen.value = !isSearchOpen.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <CommandDialog
    v-model:open="isSearchOpen"
    title="Search Municipal Services"
    description="Find permits, taxes, civil registry forms, and government offices."
  >
    <CommandSearchSync v-model="searchQuery" />

    <div class="relative flex items-center justify-between pr-3 border-b border-[#dfdfdf] dark:border-[#2a2a2a]">
      <CommandInput
        placeholder="Type to search services, permits, ordinances..."
        class="border-0 focus:ring-0 text-base"
      />
      <Kbd class="hidden sm:inline-flex text-[10px] uppercase font-mono px-1.5 py-0.5 border border-[#dfdfdf] dark:border-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3] shrink-0">
        ESC
      </Kbd>
    </div>

    <div class="px-4 py-2 bg-[#fdf7f7] dark:bg-[#202020] border-b border-[#dfdfdf] dark:border-[#2a2a2a] flex flex-wrap items-center gap-1.5">
      <span class="text-[11px] font-medium text-[#707070] dark:text-[#a3a3a3] mr-1">Suggestions:</span>
      <button
        v-for="badge in popularSearches"
        :key="'modal-' + badge.label"
        type="button"
        @click="searchQuery = badge.query"
        class="text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer"
        :class="searchQuery === badge.query ? 'bg-[#B22222] dark:bg-[#E74C3C] text-[#ffffff] font-medium shadow-xs' : 'bg-[#ffffff] dark:bg-[#171717] hover:bg-[#fdf7f7] dark:hover:bg-[#202020] border border-[#dfdfdf] dark:border-[#2a2a2a] text-[#171717] dark:text-[#ffffff]'"
      >
        {{ badge.label }}
      </button>
    </div>

    <CommandList class="max-h-90 p-2 space-y-1 bg-[#ffffff] dark:bg-[#171717]">
      <CommandEmpty class="py-12 text-center space-y-1.5">
        <p class="text-sm font-medium text-[#171717] dark:text-[#ffffff]">
          No services found matching "{{ searchQuery }}"
        </p>
        <p class="text-xs text-[#707070] dark:text-[#a3a3a3]">
          Try searching for business permits, taxes, or ordinances.
        </p>
      </CommandEmpty>

      <CommandGroup
        v-for="category in categories"
        :key="category.name"
        :heading="category.name"
        class="px-1 py-1 text-xs font-semibold text-[#707070] dark:text-[#a3a3a3]"
      >
        <CommandItem
          v-for="service in category.items"
          :key="service.title"
          :value="`${service.title} ${service.category} ${service.description}`"
          @select="handleSelect(service.href)"
          class="group/item flex items-start gap-3 p-3 rounded-md cursor-pointer transition-all border border-transparent data-highlighted:bg-[#fdf7f7] dark:data-highlighted:bg-[#202020] data-highlighted:border-[#dfdfdf]/50 dark:data-highlighted:border-[#2a2a2a]/50"
        >
          <div class="flex items-center justify-center size-9 rounded-md bg-[#fdf7f7] dark:bg-[#202020] text-[#707070] dark:text-[#a3a3a3] group-data-highlighted/item:bg-[#B22222] dark:group-data-highlighted/item:bg-[#E74C3C] group-data-highlighted/item:text-white transition-colors shrink-0 mt-0.5">
            <component :is="service.icon" class="size-4" aria-hidden="true" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 mb-0.5">
              <span class="text-sm font-medium text-[#171717] dark:text-[#ffffff] group-data-highlighted/item:text-[#B22222] dark:group-data-highlighted/item:text-[#E74C3C] transition-colors truncate">
                {{ service.title }}
              </span>
            </div>
            <p class="text-xs text-[#707070] dark:text-[#a3a3a3] line-clamp-1">
              {{ service.description }}
            </p>
          </div>
          <ArrowRight class="size-4 text-[#707070] dark:text-[#a3a3a3] group-data-highlighted/item:text-[#B22222] dark:group-data-highlighted/item:text-[#E74C3C] transition-transform group-data-highlighted/item:translate-x-0.5 shrink-0 self-center" />
        </CommandItem>
      </CommandGroup>
    </CommandList>

    <div class="px-4 py-2.5 bg-[#fdf7f7] dark:bg-[#202020] border-t border-[#dfdfdf] dark:border-[#2a2a2a] flex items-center justify-between text-xs text-[#707070] dark:text-[#a3a3a3]">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1.5">
          <KbdGroup>
            <Kbd class="bg-[#ffffff] dark:bg-[#171717] border border-[#dfdfdf] dark:border-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3] font-mono text-[10px] px-1 py-0.5">↑</Kbd>
            <Kbd class="bg-[#ffffff] dark:bg-[#171717] border border-[#dfdfdf] dark:border-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3] font-mono text-[10px] px-1 py-0.5">↓</Kbd>
          </KbdGroup>
          <span class="text-muted-foreground">navigate</span>
        </span>
        <span class="flex items-center gap-1.5">
          <Kbd class="bg-[#ffffff] dark:bg-[#171717] border border-[#dfdfdf] dark:border-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3] font-mono text-[10px] px-1 py-0.5">↵</Kbd>
          <span class="text-muted-foreground">select</span>
        </span>
        <span class="flex items-center gap-1.5">
          <Kbd class="bg-[#ffffff] dark:bg-[#171717] border border-[#dfdfdf] dark:border-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3] font-mono text-[10px] px-1.5 py-0.5">ESC</Kbd>
          <span class="text-muted-foreground">close</span>
        </span>
      </div>
      <span class="hidden sm:inline">Municipality of San Francisco</span>
    </div>
  </CommandDialog>
</template>
