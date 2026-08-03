<script setup lang="ts">
import {
  Search,
  FileText,
  Building2,
  ShieldCheck,
  ScrollText,
  HeartPulse,
  Briefcase,
} from '@lucide/vue'

const emit = defineEmits<{
  (e: 'open-search', query?: string): void
}>()

const popularSearches = [
  { label: 'Business Permit', query: 'Business Permit', icon: FileText },
  { label: 'Real Property Tax', query: 'Real Property Tax', icon: Building2 },
  { label: 'Civil Registry', query: 'Civil Registry', icon: ShieldCheck },
  { label: 'Ordinances', query: 'Ordinances', icon: ScrollText },
  { label: 'Health Certificate', query: 'Health Certificate', icon: HeartPulse },
  { label: 'Job Openings', query: 'Job Openings', icon: Briefcase },
]
</script>

<template>
  <section id="hero" class="relative w-full h-130 sm:h-140 md:h-150 overflow-hidden">
    <UiDotField
      :dot-radius="2"
      :dot-spacing="16"
      :bulge-strength="67"
      :glow-radius="160"
      :sparkle="false"
      :wave-amplitude="0"
      :cursor-radius="500"
      :cursor-force="0.1"
      bulge-only
      gradient-from="#E74C3C"
      gradient-to="#B22222"
      glow-color="rgba(231, 76, 60, 0.15)"
      class="bg-[#0f172a] dark:bg-[#020617]"
    />

    <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 sm:px-6 lg:px-8 pointer-events-none z-10">

      <!-- Main Headline & Subtitle -->
      <div class="text-center max-w-3xl space-y-4">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-tight">
          How can we help you today?
        </h1>
        <p class="text-white/70 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Access municipal services, track permit applications, read public announcements, and connect directly with local government offices.
        </p>
      </div>

      <button
        type="button"
        @click="$emit('open-search', '')"
        aria-label="Open municipal services search dialog"
        class="pointer-events-auto group w-full max-w-2xl flex items-center justify-between gap-3 px-4 py-3.5 bg-white dark:bg-[#171717] border border-[#dfdfdf] dark:border-[#2a2a2a] rounded-md shadow-sm hover:border-[#B22222] dark:hover:border-[#E74C3C] transition-colors cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-[#B22222] dark:focus:ring-[#E74C3C]"
      >
        <div class="flex items-center gap-3 w-full min-w-0">
          <Search class="size-5 text-[#707070] dark:text-[#a3a3a3] shrink-0" aria-hidden="true" />
          <span class="text-base text-[#707070] dark:text-[#a3a3a3] font-normal flex-1 truncate group-hover:text-[#171717] dark:group-hover:text-[#ffffff] transition-colors">
            Search services, permits, documents...
          </span>
        </div>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </button>

      <div class="pointer-events-auto flex flex-wrap items-center justify-center gap-2 max-w-2xl">
        <button
          v-for="badge in popularSearches"
          :key="badge.label"
          type="button"
          @click="$emit('open-search', badge.query)"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-[#B22222] dark:hover:bg-[#E74C3C] text-white/80 hover:text-white border border-white/10 hover:border-transparent transition-all cursor-pointer focus:outline-none"
        >
          <component :is="badge.icon" class="size-3 opacity-70" aria-hidden="true" />
          <span>{{ badge.label }}</span>
        </button>
      </div>

    </div>
  </section>
</template>
