<script setup lang="ts">
import { Menu, ChevronRight, Phone } from '@lucide/vue'
import type { NavItem } from '../../types/navigation'
import AppLogo from './AppLogo.vue'

interface Props {
  items?: NavItem[]
}

const props = defineProps<Props>()
const { navigationItems } = useGuestNavigation()
const menuItems = computed(() => props.items || navigationItems.value)

const route = useRoute()
const isOpen = ref(false)

watch(
  () => route.path,
  () => {
    isOpen.value = false
  },
)

function isItemActive(item: NavItem): boolean {
  if (item.to) {
    if (typeof item.to === 'string') {
      if (item.to === '/' && route.path === '/') return true
      if (item.to !== '/' && route.path.startsWith(item.to)) return true
    } else if (typeof item.to === 'object' && item.to.name) {
      if (route.name === item.to.name) return true
    }
  }

  if (item.children?.length) {
    return item.children.some(child => isItemActive(child))
  }

  return false
}

const activeDropdown = computed(() => {
  const activeItem = menuItems.value.find(
    item => item.type === 'dropdown' && isItemActive(item)
  )
  return activeItem ? activeItem.name : undefined
})
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetTrigger as-child>
      <Button
        variant="outline"
        size="icon"
        class="lg:hidden"
        aria-label="Open mobile navigation menu"
      >
        <Menu class="size-5" />
      </Button>
    </SheetTrigger>

    <SheetContent side="top" class="flex flex-col w-full h-full">
      <SheetHeader class="text-left border-b border-border pb-4 pr-6">
        <NuxtLink
          to="/"
          class="group flex items-center gap-2.5 rounded-lg -m-1 p-1 transition-all duration-200 hover:bg-accent/50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Municipality of San Francisco - Return to home"
          @click="isOpen = false"
        >
          <AppLogo class="h-10 w-10 shrink-0 object-contain transition-transform group-hover:scale-105" />
          <div class="flex flex-col justify-center min-w-0">
            <span class="text-[10px] xs:text-xs font-semibold tracking-wider text-muted-foreground uppercase leading-none mb-0.5 truncate">
              Republic of the Philippines
            </span>
            <span class="text-xs sm:text-sm font-bold tracking-tight text-foreground uppercase leading-tight truncate">
              Municipality of San Francisco
            </span>
          </div>
        </NuxtLink>
        <SheetTitle class="sr-only">Mobile Navigation Menu</SheetTitle>
        <SheetDescription class="sr-only">
          Mobile navigation menu for Municipality of San Francisco
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-y-auto py-4">
        <nav class="flex flex-col space-y-1.5" aria-label="Mobile main navigation">
          <Accordion type="single" collapsible :default-value="activeDropdown" class="w-full space-y-1.5">
            <template v-for="item in menuItems" :key="item.name">
              <!-- Direct Link -->
              <NuxtLink
                v-if="item.type === 'link'"
                :to="item.to"
                class="flex min-h-11 items-center rounded-lg px-3.5 py-2.5 text-base font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground"
                :class="[
                  isItemActive(item)
                    ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary pl-2.5'
                    : 'text-foreground'
                ]"
                :aria-current="isItemActive(item) ? 'page' : undefined"
                @click="isOpen = false"
              >
                {{ item.name }}
              </NuxtLink>

              <!-- Dropdown Menu using Accordion -->
              <AccordionItem
                v-else-if="item.type === 'dropdown'"
                :value="item.name"
                class="border-b-0"
              >
                <AccordionTrigger
                  class="flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-base font-medium text-foreground transition-all outline-none hover:bg-accent hover:text-accent-foreground hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  :class="[
                    isItemActive(item) ? 'text-primary font-semibold bg-accent/40' : ''
                  ]"
                >
                  <span>{{ item.name }}</span>
                </AccordionTrigger>

                <AccordionContent class="pb-1 pt-1.5">
                  <div class="ml-3 border-l-2 border-border/70 pl-2.5 space-y-1">
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.name"
                      :to="child.to"
                      class="group flex min-h-11 items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                      :class="[
                        isItemActive(child)
                          ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary -ml-2.75 pl-2.25'
                          : 'text-foreground/80 hover:text-foreground hover:bg-accent/60'
                      ]"
                      :aria-current="isItemActive(child) ? 'page' : undefined"
                      @click="isOpen = false"
                    >
                      <div class="flex-1 min-w-0 pr-2">
                        <div class="truncate">{{ child.name }}</div>
                        <div
                          v-if="child.description"
                          class="text-xs font-normal text-muted-foreground group-hover:text-foreground/70 transition-colors line-clamp-1 mt-0.5"
                        >
                          {{ child.description }}
                        </div>
                      </div>
                      <ChevronRight
                        class="size-4 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-muted-foreground"
                        :class="isItemActive(child) ? 'text-primary opacity-100' : ''"
                        aria-hidden="true"
                      />
                    </NuxtLink>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </template>
          </Accordion>
        </nav>
      </div>

      <SheetFooter>
        <Button as-child class="w-full gap-2 font-medium shadow-xs">
          <NuxtLink to="/directory" @click="isOpen = false">
            <Phone class="size-4" aria-hidden="true" />
            <span>Emergency</span>
          </NuxtLink>
        </Button>
        <Button variant="outline" as-child class="w-full">
          <NuxtLink to="/login" @click="isOpen = false">Login</NuxtLink>
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
