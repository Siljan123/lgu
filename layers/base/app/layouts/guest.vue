<script setup lang="ts">
import { Phone } from '@lucide/vue'
import AppLogo from '../components/custom/AppLogo.vue'
import NavDesktopMenu from '../components/custom/NavDesktopMenu.vue'
import NavMobileMenu from '../components/custom/NavMobileMenu.vue'
import ThemeSwitcher from '../components/custom/ThemeSwitcher.vue'
import { Button } from '../components/ui/button'
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-foreground">
    <!-- Accessible Skip to Main Content Link -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>

    <header class="sticky top-0 z-50 h-16 w-full border-b border-border/80 bg-background transition-colors duration-200">
      <div class="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Official Brand Logo & Identity Unit -->
        <NuxtLink
          to="/"
          class="group flex items-center gap-2.5 sm:gap-3 rounded-lg -m-1.5 p-1.5"
          aria-label="Municipality of San Francisco - Return to home"
        >
          <AppLogo class="h-9 w-9 xs:h-10 xs:w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 shrink-0 object-contain transition-transform group-hover:scale-105" />
          <div class="flex flex-col justify-center min-w-0">
            <span class="text-[10px] xs:text-xs font-semibold tracking-wider text-muted-foreground uppercase leading-none mb-0.5 truncate">
              Republic of the Philippines
            </span>
            <span class="text-xs xs:text-sm sm:text-base md:text-lg font-bold tracking-tight text-foreground uppercase leading-tight truncate">
              Municipality of San Francisco
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation Menu -->
        <div class="hidden lg:flex items-center gap-1">
          <NavDesktopMenu />
        </div>

        
        <!-- Header Actions -->
        <div class="flex items-center gap-2">
           <QuickFactsDemographicsCurrentClimate/>
          <ThemeSwitcher />
          <div class="hidden lg:flex items-center gap-2">
            <Button size="sm" as-child class="gap-1.5 font-medium shadow-xs bg-brand! text-white dark:text-white hover:bg-brand/90">
              <NuxtLink to="/directory">
                <Phone class="size-3.5 animate-shake-grow" aria-hidden="true" />
                <span>Emergency</span>
              </NuxtLink>
            </Button>
            <Button variant="outline" size="sm" as-child>
              <NuxtLink to="/login">Login</NuxtLink>
            </Button>
          </div>

          <NavMobileMenu />
        </div>
      </div>
    </header>

    <main id="main-content" tabindex="-1" class="w-full min-h-[calc(100vh-4rem)] outline-none">
      <slot />
    </main>
  </div>
</template>
