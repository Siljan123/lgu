<script setup lang="ts">
import {
  Users,
  Building2,
  Compass,
  GraduationCap,
  ArrowUpRight,
} from '@lucide/vue'

defineEmits<{
  (e: 'open-search', query?: string): void
}>()

interface DirectActionCategory {
  id: string
  title: string
  description: string
  icon: typeof Users
  moreQuery: string
  links: {
    label: string
    query: string
  }[]
}

const categories: DirectActionCategory[] = [
  {
    id: 'residents',
    title: 'For Residents',
    description: 'Social services, health centers & local assistance',
    icon: Users,
    moreQuery: 'Resident Services',
    links: [
      {
        label: 'Apply for Senior Citizen or PWD ID',
        query: 'Senior Citizen PWD ID Application',
      },
      {
        label: 'Find Nearest Local Health Center',
        query: 'Local Health Center Locations',
      },
      {
        label: 'Process Local Scholarship Programs',
        query: 'Scholarship Programs Application',
      },
    ],
  },
  {
    id: 'businesses',
    title: 'For Businesses',
    description: 'Permits, bidding notices & economic incentives',
    icon: Building2,
    moreQuery: 'Business Services',
    links: [
      {
        label: 'Renew Business Permit Online',
        query: 'Renew Business Permit Online',
      },
      {
        label: 'View Active Bids & Procurement Notices',
        query: 'Bids Procurement Notices',
      },
      {
        label: 'Investigate Local Economic Incentives',
        query: 'Economic Incentives Business',
      },
    ],
  },
  {
    id: 'visitors',
    title: 'For Visitors',
    description: 'Tourism, events & accredited establishments',
    icon: Compass,
    moreQuery: 'Visitor Tourism Services',
    links: [
      {
        label: 'Explore Local Destinations & Heritage',
        query: 'Tourism Destinations Heritage',
      },
      {
        label: 'Check Annual Festival & Events Calendar',
        query: 'Festival Events Calendar',
      },
      {
        label: 'Browse DOT Accredited Hotels & Dining',
        query: 'DOT Accredited Hotels Dining',
      },
    ],
  },
  {
    id: 'scholars-youth',
    title: 'For Scholars & Youth',
    description: 'Educational portals, SK councils & sports programs',
    icon: GraduationCap,
    moreQuery: 'Youth Scholarship Services',
    links: [
      {
        label: 'LGU Educational Assistance Portal',
        query: 'Educational Assistance Portal',
      },
      {
        label: 'Join SK Youth & Leadership Councils',
        query: 'SK Youth Leadership Councils',
      },
      {
        label: 'Sports Development & Training Calendars',
        query: 'Sports Development Training',
      },
    ],
  },
]
</script>

<template>
  <section
    id="direct-action-center"
    class="py-16 md:py-24 bg-background border-t transition-colors"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <UiSectionHeader
        title="Direct Action Center"
        description="Fast-track municipal services, online permits, local portals, and public resources categorized by your needs."
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <UiFeatureCard
          v-for="category in categories"
          :key="category.id"
          class="gap-4 py-5"
        >
          <CardHeader class="px-5 pb-0 gap-2">
            <div class="flex items-center gap-3">
              <div>
                <component :is="category.icon" class="size-5" aria-hidden="true" />
              </div>
              <CardTitle class="text-lg font-medium text-[#171717] dark:text-[#ffffff] leading-tight">
                {{ category.title }}
              </CardTitle>
            </div>
            <CardDescription class="text-xs text-[#707070] dark:text-[#a3a3a3] leading-normal pt-1">
              {{ category.description }}
            </CardDescription>
          </CardHeader>

          <CardContent class="px-5 py-0 flex-1">
            <ul class="space-y-1.5" role="list">
              <li v-for="link in category.links" :key="link.label">
                <button
                  type="button"
                  @click="$emit('open-search', link.query)"
                  class="w-full group/link flex items-start justify-between gap-2 p-2.5 rounded-md text-left bg-transparent hover:bg-[#fafafa] dark:hover:bg-[#252525] transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#171717] dark:focus:ring-[#ffffff]"
                >
                  <span class="text-sm font-normal text-[#212121] dark:text-[#f2f2f2] group-hover/link:text-[#171717] dark:group-hover/link:text-[#ffffff] transition-colors leading-snug">
                    {{ link.label }}
                  </span>
                  <ArrowUpRight
                    class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3] group-hover/link:text-[#171717] dark:group-hover/link:text-[#ffffff] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all mt-0.5"
                    aria-hidden="true"
                  />
                </button>
              </li>
            </ul>
          </CardContent>

          <CardFooter class="px-5 pt-3 pb-0 border-t border-[#dfdfdf]/60 dark:border-[#2a2a2a]">
            <UiActionLink
              label="View more"
              icon-class="size-3.5 text-current"
              class="group/more text-xs hover:no-underline"
              @click="$emit('open-search', category.moreQuery)"
            />
          </CardFooter>
        </UiFeatureCard>
      </div>
    </div>
  </section>
</template>
