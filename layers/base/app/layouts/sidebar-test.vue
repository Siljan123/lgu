<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Menu,
  X,
  ChevronLeft,
} from '@lucide/vue'

const isSidebarOpen = ref(false)
const isCollapsed = ref(false)

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Documents', icon: FileText, to: '/documents' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]
</script>

<template>
  <div class="min-h-screen flex bg-neutral-50 dark:bg-[#141414]">
    <!-- Mobile overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 md:hidden"
      @click="isSidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-[#1c1c1c] border-r border-[#dfdfdf] dark:border-[#333333] transition-all duration-200',
        isCollapsed ? 'w-16' : 'w-64',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <!-- Logo / Header -->
      <div class="h-14 flex items-center justify-between px-4 border-b border-[#dfdfdf] dark:border-[#333333]">
        <span v-if="!isCollapsed" class="text-sm font-bold text-neutral-900 dark:text-white">
          MyApp
        </span>
        <button
          type="button"
          class="hidden md:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          @click="isCollapsed = !isCollapsed"
        >
          <ChevronLeft :class="['size-4 transition-transform', isCollapsed && 'rotate-180']" />
        </button>
        <button
          type="button"
          class="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
          @click="isSidebarOpen = false"
        >
          <X class="size-4" />
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          active-class="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
        >
          <component :is="item.icon" class="size-4 shrink-0" />
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="h-14 flex items-center gap-3 px-4 border-b border-[#dfdfdf] dark:border-[#333333] bg-white/80 dark:bg-[#1c1c1c]/80 backdrop-blur-xs">
        <button
          type="button"
          class="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
          @click="isSidebarOpen = true"
        >
          <Menu class="size-5" />
        </button>
        <h1 class="text-sm font-semibold text-neutral-900 dark:text-white">
          <slot name="header">Page Title</slot>
        </h1>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>