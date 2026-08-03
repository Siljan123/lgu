<script setup lang="ts">
import {
  FileText,
  Briefcase,
  Award,
  Cake,
  Download,
  Calendar,
  Building,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Search,
  BadgeCheck,
  UserCheck,
} from '@lucide/vue'

defineEmits<{
  (e: 'open-search', query?: string): void
}>()

// Current active tab
const activeTab = ref('memos')

// Memos & Directives Mock Data
const memos = [
  {
    id: 'memo-2026-084',
    code: 'MO-2026-084',
    title: 'Guidelines on the Implementation of Flexible Work Arrangements for LGU Personnel',
    category: 'Memorandum Order',
    date: 'Aug 01, 2026',
    issuer: 'Office of the City Mayor',
    urgent: true,
  },
  {
    id: 'memo-2026-081',
    code: 'MC-2026-081',
    title: 'Mandatory Submission of 2026 Mid-Year Individual Performance Commitment and Review (IPCR)',
    category: 'Circular',
    date: 'Jul 28, 2026',
    issuer: 'Human Resource Management Office',
    urgent: false,
  },
  {
    id: 'memo-2026-079',
    code: 'EO-2026-015',
    title: 'Reconstitution of the Local Government Personnel Selection and Promotion Board (PSPB)',
    category: 'Executive Order',
    date: 'Jul 22, 2026',
    issuer: 'Office of the City Administrator',
    urgent: false,
  },
  {
    id: 'memo-2026-075',
    code: 'MO-2026-075',
    title: 'Annual Civil Service Month Celebration Activities & Participation Schedule',
    category: 'Memorandum Order',
    date: 'Jul 15, 2026',
    issuer: 'HRMO - Employee Welfare Division',
    urgent: false,
  },
]

// Vacant Plantilla Mock Data
const plantilla = [
  {
    id: 'pos-101',
    itemNo: 'OAD-ADMIN4-001',
    title: 'Administrative Officer IV (HRMO II)',
    office: 'Human Resource Management Office',
    salaryGrade: 'SG 15',
    monthlySalary: '₱36,619.00',
    education: "Bachelor's Degree relevant to the job",
    experience: '1 year of relevant experience',
    deadline: 'Aug 18, 2026',
  },
  {
    id: 'pos-102',
    itemNo: 'CPDO-PLAN3-004',
    title: 'City Planning Development Coordinator III',
    office: 'City Planning & Development Office',
    salaryGrade: 'SG 18',
    monthlySalary: '₱46,725.00',
    education: "Bachelor's Degree in Urban Planning, Civil Engr. or related field",
    experience: '2 years of relevant experience',
    deadline: 'Aug 22, 2026',
  },
  {
    id: 'pos-103',
    itemNo: 'ITO-ENG2-012',
    title: 'Information Technology Officer I',
    office: 'Management Information System Office (MISO)',
    salaryGrade: 'SG 19',
    monthlySalary: '₱51,357.00',
    education: "Bachelor's Degree in Computer Science, IT, or Software Engg",
    experience: '2 years relevant IT / Systems experience',
    deadline: 'Aug 25, 2026',
  },
]

// Promotions & Awards Mock Data
const promotionsAndAwards = [
  {
    id: 'award-1',
    name: 'Engr. Maria Santos-Cruz',
    newTitle: 'City Engineer II (Promoted from Engineer I)',
    office: 'City Engineering Office',
    awardType: 'Promotion & Advancement',
    date: 'August 2026',
    citation: 'Promoted for exemplary leadership in municipal infrastructure and flood control project execution.',
  },
  {
    id: 'award-2',
    name: 'Dr. Roberto V. Tan, M.D.',
    newTitle: 'Model Public Servant of the Quarter',
    office: 'City Health Department',
    awardType: 'Outstanding Performance Award',
    date: 'Q3 2026',
    citation: 'Awarded for pioneering community wellness outreach programs reaching over 15,000 residents.',
  },
  {
    id: 'award-3',
    name: 'Grace L. Fernandez',
    newTitle: '25-Year Service Loyalty Awardee',
    office: 'City Treasurer\'s Office',
    awardType: 'Loyalty & Longevity Award',
    date: 'August 2026',
    citation: 'Recognized for a quarter-century of unwavering integrity and public service excellence.',
  },
]

// August Celebrants Mock Data
const celebrants = [
  {
    id: 'cel-1',
    name: 'Atty. Fernando Morales',
    office: 'City Legal Office',
    day: 'Aug 04',
    role: 'City Legal Officer',
    initials: 'FM',
  },
  {
    id: 'cel-2',
    name: 'Elena D. Reyes',
    office: 'City Budget Office',
    day: 'Aug 09',
    role: 'Senior Budget Analyst',
    initials: 'ER',
  },
  {
    id: 'cel-3',
    name: 'Chief Insp. Joaquin Delgado',
    office: 'Disaster Risk Reduction & Mgt. Office',
    day: 'Aug 14',
    role: 'DRRMO Operations Head',
    initials: 'JD',
  },
  {
    id: 'cel-4',
    name: 'Patricia Ann Gomez',
    office: 'Social Welfare & Development Office',
    day: 'Aug 21',
    role: 'Social Welfare Officer III',
    initials: 'PG',
  },
  {
    id: 'cel-5',
    name: 'Mark Anthony Ramos',
    office: 'City General Services Office',
    day: 'Aug 28',
    role: 'Supply & Property Officer',
    initials: 'MR',
  },
]
</script>

<template>
  <section
    id="human-resources-bulletin"
    class="py-16 md:py-24 bg-background transition-colors"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Section Header -->
      <UiSectionHeader
        title="Human Resources Bulletin"
        description="Official municipal directives, vacant plantilla opportunities, career advancement honors, and monthly employee celebrants."
      />

      <!-- Tabs Main Section -->
      <div class="mt-8">
        <Tabs v-model="activeTab" class="w-full">
          <UiTabsHeader>
            <TabsTrigger
              value="memos"
              class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <FileText class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
              <span>Memos & Directives</span>
              <Badge class="ml-1 px-1.5 py-0.2 text-[10px] bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-semibold border-none">
                4 New
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="plantilla"
              class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Briefcase class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
              <span>Vacant Plantilla</span>
              <Badge class="ml-1 px-1.5 py-0.2 text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border-none">
                3 Open
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="promotions"
              class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Award class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
              <span>Promotions & Awards</span>
            </TabsTrigger>

            <TabsTrigger
              value="celebrants"
              class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Cake class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
              <span>August Celebrants</span>
              <Badge class="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border-none">
                This Month
              </Badge>
            </TabsTrigger>
          </UiTabsHeader>

          <TabsContent value="memos" class="mt-6 focus-visible:outline-none">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UiFeatureCard
                v-for="item in memos"
                :key="item.id"
                class="group"
              >
                <CardHeader>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="font-mono text-xs text-[#707070] dark:text-[#a3a3a3] bg-[#f4f4f5] dark:bg-[#2a2a2a] px-2 py-0.5 rounded">
                      {{ item.code }}
                    </span>
                    <div class="flex items-center gap-2">
                      <span v-if="item.urgent" class="inline-flex items-center text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
                        Urgent
                      </span>
                      <span class="text-xs text-[#707070] dark:text-[#a3a3a3]">
                        {{ item.date }}
                      </span>
                    </div>
                  </div>
                  <CardTitle class="text-base font-medium text-[#171717] dark:text-[#ffffff] leading-snug transition-colors">
                    {{ item.title }}
                  </CardTitle>
                </CardHeader>
                <CardContent class="px-5 py-0">
                  <div class="flex items-center gap-2 text-xs text-[#707070] dark:text-[#a3a3a3] pt-1">
                    <Building class="size-3.5 shrink-0" />
                    <span>Issued by: {{ item.issuer }}</span>
                  </div>
                </CardContent>
                <CardFooter class="flex items-center justify-between border-t border-[#f0f0f0] dark:border-[#2a2a2a]">
                  <span class="text-xs text-[#707070] dark:text-[#9a9a9a]">
                    Category: <strong class="font-medium text-[#171717] dark:text-[#f2f2f2]">{{ item.category }}</strong>
                  </span>
                  <button
                    type="button"
                    @click="$emit('open-search', `Download ${item.code}`)"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-[#171717] dark:text-[#ffffff] hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Download class="size-3.5" />
                    <span>Download PDF</span>
                  </button>
                </CardFooter>
              </UiFeatureCard>
            </div>

            <!-- View All Memos Footer Link -->
            <div class="mt-6 flex justify-end">
              <UiActionLink
                label="View Complete Directives & Memorandum Archive"
                @click="$emit('open-search', 'LGU Official Memos Directives Archive')"
              />
            </div>
          </TabsContent>

          <!-- TAB 2: VACANT PLANTILLA -->
          <TabsContent value="plantilla" class="mt-6 focus-visible:outline-none">
            <div class="space-y-4">
              <UiFeatureCard
                v-for="job in plantilla"
                :key="job.id"
              >
                <CardHeader>
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <Badge variant="outline" class="text-xs border-[#c7c7c7] dark:border-[#404040] text-[#171717] dark:text-[#ffffff]">
                          {{ job.salaryGrade }}
                        </Badge>
                        <span class="font-mono text-xs text-[#707070] dark:text-[#a3a3a3]">
                          Item No: {{ job.itemNo }}
                        </span>
                      </div>
                      <CardTitle class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">
                        {{ job.title }}
                      </CardTitle>
                      <CardDescription class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-0.5 flex items-center gap-1.5">
                        <Building class="size-3.5 shrink-0" />
                        <span>{{ job.office }}</span>
                      </CardDescription>
                    </div>

                    <div class="sm:text-right mt-2 sm:mt-0">
                      <span class="text-xs text-[#707070] dark:text-[#a3a3a3] block">Monthly Compensation</span>
                      <span class="text-lg font-semibold text-[#171717] dark:text-[#ffffff]">{{ job.monthlySalary }}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent class="px-5 py-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-[#f0f0f0] dark:border-[#2a2a2a] my-2 pt-3">
                  <div>
                    <span class="font-medium text-[#171717] dark:text-[#ffffff] block mb-0.5">Education Standard:</span>
                    <span class="text-[#707070] dark:text-[#a3a3a3]">{{ job.education }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-[#171717] dark:text-[#ffffff] block mb-0.5">Experience & Training:</span>
                    <span class="text-[#707070] dark:text-[#a3a3a3]">{{ job.experience }}</span>
                  </div>
                </CardContent>

                <CardFooter class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t">
                  <div class="flex items-center gap-1.5 text-xs text-[#707070] dark:text-[#a3a3a3]">
                    <Calendar class="size-3.5 text-red-600 dark:text-red-400" />
                    <span>Application Deadline: <strong class="text-[#171717] dark:text-[#ffffff] font-medium">{{ job.deadline }}</strong></span>
                  </div>

                  <button
                    type="button"
                    @click="$emit('open-search', `Apply for ${job.title}`)"
                    class="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#171717] hover:bg-[#333333] dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5] rounded-md transition-colors w-full sm:w-auto cursor-pointer"
                  >
                    <span>View Position & Apply</span>
                    <ChevronRight class="size-3.5" />
                  </button>
                </CardFooter>
              </UiFeatureCard>
            </div>

            <div class="mt-6 flex justify-end">
              <UiActionLink
                label="Browse All Civil Service Commission Plantilla Openings"
                @click="$emit('open-search', 'CSC Job Opportunities Plantilla Positions')"
              />
            </div>
          </TabsContent>

          <!-- TAB 3: PROMOTIONS & AWARDS -->
          <TabsContent value="promotions" class="mt-6 focus-visible:outline-none">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UiFeatureCard
                v-for="award in promotionsAndAwards"
                :key="award.id"
              >
                <CardHeader>
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <Badge class="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-medium">
                      <Sparkles class="size-3 mr-1 inline-block text-amber-500" />
                      {{ award.awardType }}
                    </Badge>
                    <span class="text-xs text-[#707070] dark:text-[#a3a3a3]">{{ award.date }}</span>
                  </div>

                  <CardTitle class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">
                    {{ award.name }}
                  </CardTitle>
                  <p class="text-sm font-medium text-red-600 dark:text-red-400 mt-0.5">
                    {{ award.newTitle }}
                  </p>
                  <CardDescription class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-1 flex items-center gap-1.5">
                    <Building class="size-3.5 shrink-0" />
                    <span>{{ award.office }}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent class="px-5 py-3 text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed border-t border-[#f0f0f0] dark:border-[#2a2a2a]">
                  "{{ award.citation }}"
                </CardContent>

                <CardFooter class="border-t">
                  <div class="flex items-center gap-1.5 text-xs text-[#171717] dark:text-[#ffffff] font-medium">
                    <BadgeCheck class="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Officially Confirmed by LGU HR Board</span>
                  </div>
                </CardFooter>
              </UiFeatureCard>
            </div>
          </TabsContent>

          <!-- TAB 4: AUGUST CELEBRANTS -->
          <TabsContent value="celebrants" class="mt-6 focus-visible:outline-none">
            <div class="bg-white dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] rounded-lg p-6 shadow-sm">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dfdfdf] dark:border-[#2a2a2a] mb-6">
                <div>
                  <h3 class="text-lg font-medium text-[#171717] dark:text-[#ffffff] flex items-center gap-2">
                    <Cake class="size-5 text-red-600 dark:text-red-400" />
                    <span>August LGU Birthday Celebrants</span>
                  </h3>
                  <p class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-1">
                    Honoring and sending best wishes to our dedicated public servants celebrating their birthday this month.
                  </p>
                </div>

                <Badge variant="secondary" class="w-fit text-xs bg-[#f4f4f5] dark:bg-[#2d2d2d] text-[#171717] dark:text-[#ffffff]">
                  Current Month: August 2026
                </Badge>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div
                  v-for="person in celebrants"
                  :key="person.id"
                  class="p-4 rounded-lg bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dfdfdf]/70 dark:border-[#2e2e2e] flex flex-col items-center text-center group hover:border-[#c7c7c7] dark:hover:border-[#404040] transition-all"
                >
                  <Avatar class="size-12 rounded-full mb-3">
                    <AvatarFallback class="rounded-full">{{ person.initials }}</AvatarFallback>
                  </Avatar>
                  <span class="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full mb-1">
                    {{ person.day }}
                  </span>
                  <h4 class="text-sm font-medium text-[#171717] dark:text-[#ffffff] line-clamp-1">
                    {{ person.name }}
                  </h4>
                  <p class="text-[11px] text-[#707070] dark:text-[#a3a3a3] mt-0.5 line-clamp-1">
                    {{ person.role }}
                  </p>
                  <p class="text-[10px] text-[#9a9a9a] dark:text-[#707070] mt-1 border-t border-[#e5e5e5] dark:border-[#2a2a2a] pt-1.5 w-full">
                    {{ person.office }}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </section>
</template>
