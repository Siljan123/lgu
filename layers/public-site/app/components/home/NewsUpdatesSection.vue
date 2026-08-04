<script setup lang="ts">
import {
  Calendar,
  Clock,
  ArrowUpRight,
  Sparkles,
  Tag,
  Building2,
} from '@lucide/vue'
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/../layers/base/app/components/ui/card'
import { Badge } from '@/../layers/base/app/components/ui/badge'
import { Button } from '@/../layers/base/app/components/ui/button'

const emit = defineEmits<{
  (e: 'open-search', query?: string): void
}>()

// Featured News Article (1)
const featuredArticle = {
  id: 'news-feat-01',
  code: 'NEWS-2026-089',
  title: 'San Francisco Municipal Center Achieves 100% Solar-Powered Operations',
  category: 'Sustainability & Infrastructure',
  date: 'August 03, 2026',
  readTime: '4 min read',
  author: 'Office of Environmental Management',
  summary: 'The Municipal Government officially commissions the 1.2MW rooftop solar array, making San Francisco one of the first zero-carbon local government administrative centers in the region while reducing municipal power overhead by 45%.',
  badgeText: 'Featured',
  image: 'https://placehold.co/800x450/171717/ffffff?text=100%25+Solar+Powered+LGU',
  tags: ['Green Energy', 'Smart Governance', 'Infrastructure'],
}

// Secondary News Articles (3)
const secondaryArticles = [
  {
    id: 'news-sec-01',
    code: 'NEWS-2026-085',
    title: 'Local Business Tax Incentive Window Open for Q3 2026 Early Filers',
    category: 'Revenue & Finance',
    date: 'August 01, 2026',
    readTime: '2 min read',
    summary: 'Registered micro and small enterprises filing Q3 municipal taxes before August 20 are eligible for a 12% prompt payment tax rebate.',
    image: 'https://placehold.co/400x300/1c1c1c/ffffff?text=Tax+Discount+Window',
    urgent: true,
  },
  {
    id: 'news-sec-02',
    code: 'NEWS-2026-081',
    title: 'City Health Office Launches Free Community Dental & Wellness Caravan',
    category: 'Public Health',
    date: 'July 29, 2026',
    readTime: '3 min read',
    summary: 'Mobile medical units will visit 12 rural barangays this month to provide free dental checkups, vaccinations, and preventive health screenings.',
    image: 'https://placehold.co/400x300/1c1c1c/ffffff?text=Health+%26+Wellness+Caravan',
    urgent: false,
  },
  {
    id: 'news-sec-03',
    code: 'NEWS-2026-078',
    title: 'Barangay Infrastructure Resiliency Grant Winners Announced',
    category: 'Community Development',
    date: 'July 25, 2026',
    readTime: '3 min read',
    summary: 'Six local barangays were awarded ₱2.5M each in matching grants for local flood mitigation, solar streetlights, and evac center upgrades.',
    image: 'https://placehold.co/400x300/1c1c1c/ffffff?text=Resiliency+Grants',
    urgent: false,
  },
]

function handleViewAll() {
  emit('open-search', 'LGU News & Updates')
}

function handleReadStory(title: string) {
  emit('open-search', title)
}
</script>

<template>
  <section
    id="lgu-news-updates"
    class="py-16 md:py-24 bg-[#fafafa] dark:bg-[#1c1c1c]"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <UiSectionHeader
        title="LGU News & Updates"
        description="Official press releases, municipal announcements, emergency advisories, and civic developments across San Francisco."
      >
        <template #action>
          <Button
            variant="outline"
            class="group"
            @click="handleViewAll"
          >
            <span>View All News & Updates</span>
            <ArrowUpRight class="size-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </template>
      </UiSectionHeader>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
        
        <div class="lg:col-span-7">
          <UiFeatureCard class="relative overflow-hidden group pt-0">
            
            <div class="relative h-48 sm:h-56 w-full bg-[#171717] overflow-hidden">
              <img
                :src="featuredArticle.image || 'https://placehold.co/800x450/171717/ffffff?text=LGU+News+Featured'"
                :alt="featuredArticle.title"
                class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent p-5 sm:p-6 flex flex-col justify-between">
                <div class="relative z-10 flex items-center justify-between">
                  <Badge class="bg-red-600 hover:bg-red-700 text-white font-medium border-none px-3 py-1 text-xs gap-1.5 shadow-sm">
                    <Sparkles class="size-3" />
                    <span>{{ featuredArticle.badgeText }}</span>
                  </Badge>
                  
                  <span class="text-xs font-mono text-zinc-300 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded border border-white/20">
                    {{ featuredArticle.code }}
                  </span>
                </div>

                <div class="relative z-10">
                  <span class="inline-block text-xs font-medium text-red-200 uppercase tracking-wide bg-red-950/90 px-2.5 py-0.5 rounded border border-red-800/60 shadow-xs">
                    {{ featuredArticle.category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Content Area -->
            <CardHeader class="pt-5 pb-2 px-5 sm:px-6">
              <div class="flex items-center gap-3 text-xs text-[#707070] dark:text-[#a3a3a3] mb-2 flex-wrap">
                <span class="inline-flex items-center gap-1">
                  <Calendar class="size-3.5" />
                  {{ featuredArticle.date }}
                </span>
                <span>•</span>
                <span class="inline-flex items-center gap-1">
                  <Clock class="size-3.5" />
                  {{ featuredArticle.readTime }}
                </span>
                <span>•</span>
                <span class="inline-flex items-center gap-1">
                  <Building2 class="size-3.5" />
                  {{ featuredArticle.author }}
                </span>
              </div>

              <CardTitle class="text-xl sm:text-2xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff] leading-snug">
                {{ featuredArticle.title }}
              </CardTitle>
            </CardHeader>

            <CardContent class="py-2 px-5 sm:px-6">
              <CardDescription class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed">
                {{ featuredArticle.summary }}
              </CardDescription>

              <!-- Article Tags -->
              <div class="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-[#dfdfdf]/60 dark:border-[#2e2e2e]">
                <Badge
                  v-for="tag in featuredArticle.tags"
                  :key="tag"
                  variant="secondary"
                  class="bg-[#ededed] dark:bg-[#2a2a2a] text-[#171717] dark:text-[#e0e0e0] font-normal text-[11px]"
                >
                  <Tag class="size-2.5 mr-1 text-[#707070] dark:text-[#a3a3a3]" />
                  {{ tag }}
                </Badge>
              </div>
            </CardContent>

            <CardFooter class="border-t border-[#dfdfdf]/60 dark:border-[#2e2e2e] flex items-center justify-end">
              <UiActionLink
                variant="button"
                label="Read Full Story"
                icon-class="size-3.5"
                @click="handleReadStory(featuredArticle.title)"
              />
            </CardFooter>
          </UiFeatureCard>
        </div>

        <div class="lg:col-span-5 flex flex-col gap-3.5">
          <UiFeatureCard
            v-for="article in secondaryArticles"
            :key="article.id"
            class="group overflow-hidden flex flex-col sm:flex-row items-stretch p-0"
          >
            <!-- Thumbnail Image -->
            <div class="w-full sm:w-36 md:w-40 shrink-0 h-36 sm:h-auto relative overflow-hidden bg-[#1c1c1c]">
              <img
                :src="article.image || 'https://placehold.co/400x300/171717/ffffff?text=LGU+News'"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div class="flex-1 flex flex-col justify-between p-4 sm:p-4.5">
              <div>
                <div class="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <div class="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      class="text-[10px] font-medium border-[#dfdfdf] dark:border-[#333333] text-[#707070] dark:text-[#a3a3a3] px-2 py-0"
                    >
                      {{ article.category }}
                    </Badge>

                    <Badge
                      v-if="article.urgent"
                      class="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border-none text-[10px] px-1.5 py-0"
                    >
                      Notice
                    </Badge>
                  </div>

                  <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3] font-mono">
                    {{ article.date }}
                  </span>
                </div>

                <CardTitle class="text-sm sm:text-base font-medium text-primary leading-snug line-clamp-2">
                  {{ article.title }}
                </CardTitle>

                <p class="text-xs text-[#707070] dark:text-[#a3a3a3] line-clamp-2 leading-relaxed mt-1">
                  {{ article.summary }}
                </p>
              </div>

              <div class="flex items-center justify-between border-t border-[#dfdfdf]/40 dark:border-[#2a2a2a] pt-2 mt-2.5">
                <span class="text-[11px] text-[#707070] dark:text-[#a3a3a3] inline-flex items-center gap-1">
                  <Clock class="size-3" />
                  {{ article.readTime }}
                </span>
                <UiActionLink
                  label="Read"
                />
              </div>
            </div>
          </UiFeatureCard>
        </div>

      </div>
    </div>
  </section>
</template>
