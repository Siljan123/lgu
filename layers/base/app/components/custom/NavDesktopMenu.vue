<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type { NavItem } from '../../types/navigation'
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';

interface Props {
  items?: NavItem[]
}

const props = defineProps<Props>()
const { navigationItems } = useGuestNavigation()
const menuItems = computed(() => props.items || navigationItems.value)

const route = useRoute()

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
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem v-for="item in menuItems" :key="item.name">
        <NavigationMenuLink v-if="item.type === 'link'" as-child :class="navigationMenuTriggerStyle()">
          <NuxtLink
            :to="item.to"
            class="cursor-pointer transition-colors duration-300"
            :class="[
              isItemActive(item) ? 'bg-accent text-accent-foreground' : ''
            ]"
          >
            {{ item.name }}
          </NuxtLink>
        </NavigationMenuLink>

        <template v-else-if="item.type === 'dropdown'">
          <NavigationMenuTrigger
            :class="[
              isItemActive(item) ? 'bg-accent text-accent-foreground' : ''
            ]"
          >
            <span>{{ item.name }}</span>
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul class="grid gap-2 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
              <li v-for="child in item.children" :key="child.name">
                <NavigationMenuLink as-child>
                  <NuxtLink
                    :to="child.to"
                    :class="[
                      isItemActive(child) ? 'bg-accent/60 text-primary font-semibold' : ''
                    ]"
                  >
                    <div class="text-sm font-medium leading-none">{{ child.name }}</div>
                    <p v-if="child.description" class="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                      {{ child.description }}
                    </p>
                  </NuxtLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </template>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
