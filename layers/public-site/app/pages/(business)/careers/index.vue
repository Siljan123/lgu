<script setup lang="ts">
import { Briefcase, TrendingUp, Award } from '@lucide/vue'

definePageMeta({
  layout: 'guest',
})

useHead({
  title: 'Careers and Job Vacancies - Human Resource Corner | LGU San Francisco, Agusan del Sur',
  meta: [
    {
      name: 'description',
      content: 'Human Resource Corner of the Municipal Government of San Francisco, Agusan del Sur. Explore plantilla job vacancies, employee promotions, and public service excellence awards.'
    }
  ]
})

const {
  activeTab,
  vacancies,
  promotions,
  awards,
  vacancySearchQuery,
  selectedOfficeFilter,
  selectedStatusFilter,
  selectedSalaryFilter,
  filteredVacancies,
  selectedJobModal,
  isJobModalOpen,
  openJobModal,
  closeJobModal,
  promotionSearchQuery,
  promotionYearFilter,
  filteredPromotions,
  awardSearchQuery,
  awardCategoryFilter,
  filteredAwards
} = useCareersData()
</script>

<template>
  <div>
    <!-- Hero Section -->
    <UiHeroSection
      title="Careers & Job Vacancies"
      description="Find career opportunities, plantilla job vacancies, employee promotions, and public service recognitions in the Local Government Unit of San Francisco, Agusan del Sur."
    />

    <CareersHeaderSection
      :vacanciesCount="vacancies.length"
      :promotionsCount="promotions.length"
      :awardsCount="awards.length"
    />

    <!-- Main Content & Tabs Section -->
    <section class="w-full bg-[#fafafa] dark:bg-[#1c1c1c] py-12 md:py-16 transition-colors border-b border-[#dfdfdf] dark:border-[#2a2a2a]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <!-- Interactive Tab Navigation -->
        <div class="flex items-center justify-center sm:justify-start">
          <div class="inline-flex p-1.5 rounded-xl bg-[#ffffff] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#333333] shadow-xs space-x-1 overflow-x-auto scrollbar-none max-w-full">
            
            <button
              type="button"
              @click="activeTab = 'vacancies'"
              :class="[
                'px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap',
                activeTab === 'vacancies'
                  ? 'bg-[#171717] text-white dark:bg-[#ffffff] dark:text-[#171717] shadow-sm font-semibold'
                  : 'text-[#707070] hover:text-primary hover:bg-[#fafafa] dark:hover:bg-[#252525]'
              ]"
            >
              <Briefcase class="size-4 shrink-0" />
              <span>Vacant Positions</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[11px] font-bold leading-none',
                  activeTab === 'vacancies'
                    ? 'bg-brand text-white'
                    : 'bg-[#fafafa] dark:bg-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3]'
                ]"
              >
                {{ vacancies.length }}
              </span>
            </button>

            <!-- Tab 2: Promotions -->
            <button
              type="button"
              @click="activeTab = 'promotions'"
              :class="[
                'px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap',
                activeTab === 'promotions'
                  ? 'bg-[#171717] text-white dark:bg-[#ffffff] dark:text-[#171717] shadow-sm font-semibold'
                  : 'text-[#707070] hover:text-primary hover:bg-[#fafafa] dark:hover:bg-[#252525]'
              ]"
            >
              <TrendingUp class="size-4 shrink-0" />
              <span>Promotions</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[11px] font-bold leading-none',
                  activeTab === 'promotions'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#fafafa] dark:bg-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3]'
                ]"
              >
                {{ promotions.length }}
              </span>
            </button>

            <!-- Tab 3: Award and Recognitions -->
            <button
              type="button"
              @click="activeTab = 'awards'"
              :class="[
                'px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap',
                activeTab === 'awards'
                  ? 'bg-[#171717] text-white dark:bg-[#ffffff] dark:text-[#171717] shadow-sm font-semibold'
                  : 'text-[#707070] hover:text-primary hover:bg-[#fafafa] dark:hover:bg-[#252525]'
              ]"
            >
              <Award class="size-4 shrink-0" />
              <span>Award and Recognitions</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[11px] font-bold leading-none',
                  activeTab === 'awards'
                    ? 'bg-amber-500 text-white'
                    : 'bg-[#fafafa] dark:bg-[#2a2a2a] text-[#707070] dark:text-[#a3a3a3]'
                ]"
              >
                {{ awards.length }}
              </span>
            </button>

          </div>
        </div>

        <div class="transition-all duration-300">
          <!-- Tab 1 View -->
          <CareersVacantPositionsTab
            v-if="activeTab === 'vacancies'"
            :vacancies="filteredVacancies"
            v-model:searchQuery="vacancySearchQuery"
            v-model:officeFilter="selectedOfficeFilter"
            v-model:statusFilter="selectedStatusFilter"
            v-model:salaryFilter="selectedSalaryFilter"
            :selectedJob="selectedJobModal"
            :isModalOpen="isJobModalOpen"
            @openModal="openJobModal"
            @closeModal="closeJobModal"
          />

   
          <CareersPromotionsTab
            v-else-if="activeTab === 'promotions'"
            :promotions="filteredPromotions"
            v-model:searchQuery="promotionSearchQuery"
            v-model:yearFilter="promotionYearFilter"
          />


          <CareersAwardsTab
            v-else-if="activeTab === 'awards'"
            :awards="filteredAwards"
            v-model:searchQuery="awardSearchQuery"
            v-model:categoryFilter="awardCategoryFilter"
          />
        </div>

      </div>
    </section>
    <Footer />
  </div>
</template>