<script setup lang="ts">
import {
  Landmark,
  Scale,
  FileCheck2,
  Users,
  CalendarDays,
  Download,
  MapPin,
  CheckCircle2,
  Mail,
  FileText,
  Video,
} from '@lucide/vue'

defineEmits<{
  (e: 'open-search', query?: string): void
}>()

// Active Tab state
const activeTab = ref('ordinances')

// Vice Mayor Sidebar Info
const viceMayorSidebarInfo = {
  name: 'Hon. Maria Elena G. Vega',
  title: 'Municipal Vice Mayor',
  quote: 'Legislation is the foundation of durable progression. Our sessions stay committed to co-authoring policies that uphold civil clarity, transparency, and municipal equity.',
  location: '3rd Floor, Sangguniang Bayan Session Hall',
  email: 'vicemayor@sanfrancisco.gov.ph',
  councilMembers: '10 Elected Council Members (Sangguniang Bayan)',
  frameworks: {
    approvedActs: '14 Ordinances',
    resolutionsPassed: '112 Acts',
  },
}

// Key Ordinances Data (Max 4 displayed)
const keyOrdinances = [
  {
    id: 'ord-2026-042',
    code: 'Ordinance No. 2026-042',
    title: 'The Comprehensive Municipal Environmental Code and Plastic Reduction Policy',
    author: 'Hon. Councilor R. Mendoza & Hon. Vice Mayor Vega',
    enactedDate: 'July 21, 2026',
    committee: 'Committee on Environmental Protection',
    status: 'Enacted into Law',
    urgency: 'High Impact',
  },
  {
    id: 'ord-2026-038',
    code: 'Ordinance No. 2026-038',
    title: 'Institutionalizing the Micro & Small Enterprise Financial Assistance and Digital Literacy Grant',
    author: 'Hon. Councilor A. Bautista',
    enactedDate: 'July 07, 2026',
    committee: 'Committee on Trade, Commerce & Industry',
    status: 'Enacted into Law',
    urgency: 'Economic',
  },
  {
    id: 'ord-2026-035',
    code: 'Ordinance No. 2026-035',
    title: 'Establishing the Municipal Senior Citizens Free Maintenance Medicine and Wellness Program',
    author: 'Hon. Councilor C. Cruz',
    enactedDate: 'June 23, 2026',
    committee: 'Committee on Social Services & Elderly Affairs',
    status: 'Enacted into Law',
    urgency: 'Social Welfare',
  },
  {
    id: 'ord-2026-030',
    code: 'Ordinance No. 2026-030',
    title: 'Revising the Local Building Code for Solar Rooftop Incentives in Commercial Zones',
    author: 'Hon. Councilor E. Tan',
    enactedDate: 'June 09, 2026',
    committee: 'Committee on Infrastructure & Public Works',
    status: 'Enacted into Law',
    urgency: 'Sustainability',
  },
]

// Resolutions Data (Max 4 displayed)
const resolutions = [
  {
    id: 'res-2026-112',
    code: 'Res. No. 2026-112',
    title: 'Authorizing the Executive Mayor to Sign Memorandum of Agreement for Telehealth Expansion',
    date: 'July 28, 2026',
    sponsor: 'Committee on Health & Sanitation',
    status: 'Approved',
  },
  {
    id: 'res-2026-108',
    code: 'Res. No. 2026-108',
    title: 'Expressing Highest Commendation to Local Athletes Winning National Civil Service Sports Meet',
    date: 'July 14, 2026',
    sponsor: 'Committee on Youth & Sports Development',
    status: 'Approved',
  },
  {
    id: 'res-2026-101',
    code: 'Res. No. 2026-101',
    title: 'Urging the National Telecommunications Commission for Enhanced Mobile Network Coverage in Upland Barangays',
    date: 'June 30, 2026',
    sponsor: 'Committee on Science, Tech & Communications',
    status: 'Approved',
  },
  {
    id: 'res-2026-095',
    code: 'Res. No. 2026-095',
    title: 'Approving the Annual Investment Plan (AIP) Supplemental Budget for Barangay Disaster Preparedness',
    date: 'June 16, 2026',
    sponsor: 'Committee on Appropriations & Finance',
    status: 'Approved',
  },
]

// Standing Committees Data (Max 4 displayed)
const committees = [
  {
    id: 'comm-01',
    name: 'Committee on Appropriations, Ways & Means',
    chair: 'Hon. Councilor Ricardo V. Santos',
    viceChair: 'Hon. Councilor Beatriz L. Reyes',
    membersCount: 5,
    focus: 'Municipal budget review, tax measures, public finance, and revenue optimization.',
  },
  {
    id: 'comm-02',
    name: 'Committee on Rules, Laws & Privileges',
    chair: 'Hon. Councilor Atty. Fernando G. Aquino',
    viceChair: 'Hon. Councilor Patricia M. Lopez',
    membersCount: 5,
    focus: 'Legal review of ordinances, parliamentary procedures, and council ethics.',
  },
  {
    id: 'comm-03',
    name: 'Committee on Health, Sanitation & Social Services',
    chair: 'Hon. Councilor Dr. Clarissa D. Valenzuela',
    viceChair: 'Hon. Councilor Gabriel N. Castro',
    membersCount: 7,
    focus: 'Public health initiatives, hospital governance, and social assistance policies.',
  },
  {
    id: 'comm-04',
    name: 'Committee on Environmental Protection & Climate Change',
    chair: 'Hon. Councilor Marco T. Dela Cruz',
    viceChair: 'Hon. Councilor Evelyn S. Villanueva',
    membersCount: 5,
    focus: 'Waste management laws, river protection, green building standards, and disaster mitigation.',
  },
]

// Session Calendar Mock Data (Max 4 displayed)
const sessions = [
  {
    id: 'sess-01',
    number: '32nd Regular Session',
    date: 'August 04, 2026 (Tuesday)',
    time: '9:00 AM PST',
    venue: 'Sangguniang Bayan Session Hall, 3rd Floor',
    status: 'Upcoming',
    agendaHighlights: 'Second Reading of Municipal Green Building Code & Public Hearing on Local Transport Route Plan.',
    liveStream: true,
  },
  {
    id: 'sess-02',
    number: '31st Regular Session',
    date: 'July 28, 2026',
    time: '9:00 AM PST',
    venue: 'Sangguniang Bayan Session Hall',
    status: 'Completed / Minutes Available',
    agendaHighlights: 'Enactment of Res. No. 2026-112 and Approval of Barangay Supplemental Budgets.',
    liveStream: false,
  },
  {
    id: 'sess-03',
    number: '30th Regular Session',
    date: 'July 21, 2026',
    time: '9:00 AM PST',
    venue: 'Sangguniang Bayan Session Hall',
    status: 'Completed / Minutes Available',
    agendaHighlights: 'Third Reading and Enactment of Comprehensive Municipal Environmental Code.',
    liveStream: false,
  },
  {
    id: 'sess-04',
    number: '5th Special Joint Session',
    date: 'July 10, 2026',
    time: '1:30 PM PST',
    venue: 'Municipal Convention Center',
    status: 'Completed / Video Archived',
    agendaHighlights: 'Joint Session with Executive Department for the 2026 State of the Municipality Address.',
    liveStream: false,
  },
]
</script>

<template>
  <section
    id="legislative-office-portal"
    class="py-16 md:py-24 bg-background"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Section Title Badge -->
      <UiSectionHeader
        title="Legislative Office Portal"
        description="Sangguniang Bayan ordinances, active civic acts, session calendars, and committee rosters."
      />

      <!-- Main Layout: Sidebar (Left) + Tabs & Content (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
        <!-- MAIN CONTENT / TABS (Col 8) -->
        <main class="lg:col-span-8">
          <Tabs v-model="activeTab" class="w-full">
            <!-- Scrollable Tabs Navigation -->
            <UiTabsHeader>
              <TabsTrigger
                value="ordinances"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Scale class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Key Ordinances</span>
              </TabsTrigger>

              <TabsTrigger
                value="resolutions"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <FileCheck2 class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Resolutions</span>
              </TabsTrigger>

              <TabsTrigger
                value="committees"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Users class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Committees</span>
              </TabsTrigger>

              <TabsTrigger
                value="calendar"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <CalendarDays class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Session Calendar</span>
              </TabsTrigger>
            </UiTabsHeader>

            <!-- TAB 1: KEY ORDINANCES (Max 4) -->
            <TabsContent value="ordinances" class="mt-6 focus-visible:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiFeatureCard
                  v-for="ord in keyOrdinances"
                  :key="ord.id"
                >
                  <CardHeader>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="font-mono text-xs font-semibold text-[#171717] dark:text-[#ffffff] bg-[#f4f4f5] dark:bg-[#2a2a2a] px-2 py-0.5 rounded">
                        {{ ord.code }}
                      </span>
                      <Badge variant="secondary" class="text-[10px] bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-none font-medium">
                        {{ ord.urgency }}
                      </Badge>
                    </div>

                    <CardTitle class="text-base font-medium text-[#171717] dark:text-[#ffffff] leading-snug">
                      {{ ord.title }}
                    </CardTitle>

                    <CardDescription class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-1">
                      Sponsor: <strong class="text-[#171717] dark:text-[#e5e5e5] font-medium">{{ ord.author }}</strong>
                    </CardDescription>
                  </CardHeader>

                  <CardContent class="px-5 py-0 text-xs space-y-1 text-[#707070] dark:text-[#a3a3a3]">
                    <div>Committee: <strong class="text-[#171717] dark:text-[#ffffff] font-medium">{{ ord.committee }}</strong></div>
                    <div>Enacted: <span class="font-mono text-[#171717] dark:text-[#ffffff]">{{ ord.enactedDate }}</span></div>
                  </CardContent>

                  <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a] flex items-center justify-between text-xs">
                    <span class="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 class="size-3.5" />
                      {{ ord.status }}
                    </span>
                    <button
                      type="button"
                      @click="$emit('open-search', `Download ${ord.code}`)"
                      class="inline-flex items-center gap-1.5 text-xs font-medium text-[#171717] dark:text-[#ffffff] hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Download class="size-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </CardFooter>
                </UiFeatureCard>
              </div>

              <!-- View More Action -->
              <div class="mt-6 flex justify-end">
                <UiActionLink
                  label="View Complete Enacted Municipal Ordinances Repository"
                  @click="$emit('open-search', 'Municipal Ordinances Code Book Library Archive')"
                />
              </div>
            </TabsContent>

            <!-- TAB 2: RESOLUTIONS (Max 4) -->
            <TabsContent value="resolutions" class="mt-6 focus-visible:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiFeatureCard
                  v-for="res in resolutions"
                  :key="res.id"
                >
                  <CardHeader>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="font-mono text-xs font-semibold text-[#171717] dark:text-[#ffffff] bg-[#f4f4f5] dark:bg-[#2a2a2a] px-2 py-0.5 rounded">
                        {{ res.code }}
                      </span>
                      <span class="text-xs text-[#707070] dark:text-[#a3a3a3] font-mono">{{ res.date }}</span>
                    </div>

                    <CardTitle class="text-base font-medium text-[#171717] dark:text-[#ffffff] leading-snug">
                      {{ res.title }}
                    </CardTitle>
                  </CardHeader>

                  <CardContent class="px-5 py-0 text-xs text-[#707070] dark:text-[#a3a3a3]">
                    Sponsor: <strong class="text-[#171717] dark:text-[#ffffff] font-medium">{{ res.sponsor }}</strong>
                  </CardContent>

                  <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a] flex items-center justify-between mt-3 text-xs">
                    <span class="inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      {{ res.status }}
                    </span>
                    <button
                      type="button"
                      @click="$emit('open-search', `Download ${res.code}`)"
                      class="inline-flex items-center gap-1.5 text-xs font-medium text-[#171717] dark:text-[#ffffff] hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Download class="size-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </CardFooter>
                </UiFeatureCard>
              </div>

              <div class="mt-6 flex justify-end">
                <UiActionLink
                  label="Browse All Passed Resolutions"
                  @click="$emit('open-search', 'Approved Resolutions Municipal Council Archive')"
                />
              </div>
            </TabsContent>

            <!-- TAB 3: COMMITTEES (Max 4) -->
            <TabsContent value="committees" class="mt-6 focus-visible:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiFeatureCard
                  v-for="comm in committees"
                  :key="comm.id"
                >
                  <CardHeader>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="outline" class="text-[10px] border-[#c7c7c7] dark:border-[#404040] text-[#171717] dark:text-[#ffffff]">
                        Standing Committee
                      </Badge>
                      <span class="text-xs text-[#707070] dark:text-[#a3a3a3] font-medium">
                        {{ comm.membersCount }} Members
                      </span>
                    </div>

                    <CardTitle class="text-base font-medium text-[#171717] dark:text-[#ffffff] leading-snug">
                      {{ comm.name }}
                    </CardTitle>
                  </CardHeader>

                  <CardContent class="px-5 py-0 space-y-2 text-xs">
                    <div class="p-2.5 rounded bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dfdfdf]/70 dark:border-[#2e2e2e] space-y-1">
                      <div>
                        <span class="text-[#707070] dark:text-[#9a9a9a]">Chair: </span>
                        <strong class="text-[#171717] dark:text-[#ffffff] font-medium">{{ comm.chair }}</strong>
                      </div>
                      <div>
                        <span class="text-[#707070] dark:text-[#9a9a9a]">Vice Chair: </span>
                        <span class="text-[#171717] dark:text-[#e5e5e5]">{{ comm.viceChair }}</span>
                      </div>
                    </div>

                    <p class="text-[#707070] dark:text-[#9a9a9a] leading-relaxed text-[12px]">
                      {{ comm.focus }}
                    </p>
                  </CardContent>

                  <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a] flex items-center justify-between text-xs">
                    <span class="text-[#707070] dark:text-[#9a9a9a]">ID: {{ comm.id }}</span>
                    <UiActionLink
                      label="Hearings Schedule"
                    />
                  </CardFooter>
                </UiFeatureCard>
              </div>

              <div class="mt-6 flex justify-end">
                <UiActionLink
                  label="View All 18 Sangguniang Bayan Standing Committees"
                  @click="$emit('open-search', 'All Standing Committees Sangguniang Bayan Members')"
                />
              </div>
            </TabsContent>

            <!-- TAB 4: SESSION CALENDAR (Max 4) -->
            <TabsContent value="calendar" class="mt-6 focus-visible:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiFeatureCard
                  v-for="sess in sessions"
                  :key="sess.id"
                >
                  <CardHeader>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="font-mono text-xs font-semibold text-[#171717] dark:text-[#ffffff] bg-[#f4f4f5] dark:bg-[#2a2a2a] px-2 py-0.5 rounded">
                        {{ sess.number }}
                      </span>
                      <span v-if="sess.status.includes('Upcoming')" class="inline-flex items-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full animate-pulse">
                        Live Scheduled
                      </span>
                      <span v-else class="text-xs text-[#707070] dark:text-[#a3a3a3]">
                        Archived
                      </span>
                    </div>

                    <CardTitle class="text-base font-medium text-[#171717] dark:text-[#ffffff] flex items-center gap-2">
                      <CalendarDays class="size-4 text-red-600 dark:text-red-400" />
                      <span>{{ sess.date }}</span>
                    </CardTitle>

                    <CardDescription class="text-xs text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1.5 mt-0.5">
                      <MapPin class="size-3.5 shrink-0" />
                      <span>{{ sess.venue }} ({{ sess.time }})</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent class="px-5 py-0 text-xs text-[#707070] dark:text-[#9a9a9a] leading-relaxed">
                    <div class="p-2.5 rounded bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dfdfdf]/70 dark:border-[#2e2e2e]">
                      <span class="font-medium text-[#171717] dark:text-[#ffffff] block mb-1">Agenda Highlights:</span>
                      <p class="line-clamp-2">{{ sess.agendaHighlights }}</p>
                    </div>
                  </CardContent>

                  <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a] flex items-center justify-between text-xs">
                    <span class="text-[#707070] dark:text-[#9a9a9a]">{{ sess.status }}</span>
                    <button
                      type="button"
                      @click="$emit('open-search', `Watch Order of Business ${sess.number}`)"
                      class="inline-flex items-center gap-1.5 text-xs font-medium text-[#171717] dark:text-[#ffffff] hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Video v-if="sess.liveStream" class="size-3.5 text-red-600 dark:text-red-400" />
                      <FileText v-else class="size-3.5" />
                      <span>{{ sess.liveStream ? 'Watch Stream' : 'Order of Business' }}</span>
                    </button>
                  </CardFooter>
                </UiFeatureCard>
              </div>

              <div class="mt-6 flex justify-end">
                <UiActionLink
                  label="View Full Legislative Session Calendar & Video Archive"
                  @click="$emit('open-search', 'Sangguniang Bayan Session Calendar Live Stream Archive')"
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <!-- SIDEBAR (Col 4) -->
        <aside class="lg:col-span-4 bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] rounded-xl p-6 shadow-sm space-y-6">
          <!-- Profile Header in Sidebar -->
          <div class="flex items-start gap-4">
            <div class="size-16 rounded-xl bg-white dark:bg-[#282828] border border-[#dfdfdf] dark:border-[#333333] flex items-center justify-center shrink-0 p-1 shadow-xs">
              <Avatar class="size-full rounded-lg">
                <AvatarFallback class="bg-[#171717] dark:bg-[#ffffff] text-white dark:text-[#171717] text-lg font-bold rounded-lg">
                  MV
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 class="text-xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
                {{ viceMayorSidebarInfo.name }}
              </h3>
              <p class="text-xs font-semibold text-[#171717] dark:text-[#e5e5e5] mt-0.5">
                {{ viceMayorSidebarInfo.title }}
              </p>
            </div>
          </div>

          <Separator/>

          <div class="p-3.5 text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed italic border-l-2 border-l-red-600 dark:border-l-red-400">
            "{{ viceMayorSidebarInfo.quote }}"
          </div>

          <div class="space-y-2.5 text-xs text-[#707070] dark:text-[#a3a3a3]">
            <div class="flex items-start gap-2">
              <MapPin class="size-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <span>{{ viceMayorSidebarInfo.location }}</span>
            </div>

            <div class="flex items-center gap-2">
              <Mail class="size-4 shrink-0 text-red-600 dark:text-red-400" />
              <a :href="`mailto:${viceMayorSidebarInfo.email}`" class="text-[#171717] dark:text-[#ffffff] font-medium hover:underline font-mono">
                {{ viceMayorSidebarInfo.email }}
              </a>
            </div>

            <Separator/>

            <div class="flex items-start gap-2">
              <Users class="size-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <span class="text-[#171717] dark:text-[#ffffff] font-medium">{{ viceMayorSidebarInfo.councilMembers }}</span>
            </div>
          </div>
          <Separator/>

          <div>
            <div class="flex items-center gap-2 mb-3">
              <Landmark class="size-4 text-red-600 dark:text-red-400" />
              <h4 class="text-xs font-semibold text-[#171717] dark:text-[#ffffff] uppercase tracking-wider">
                2026 Enacted Frameworks
              </h4>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-lg bg-white dark:bg-[#1a1a1a] border border-[#dfdfdf] dark:border-[#2a2a2a] text-center">
                <span class="text-[11px] text-[#707070] dark:text-[#9a9a9a] block mb-0.5">Approved Acts</span>
                <span class="text-lg font-bold font-mono text-[#171717] dark:text-[#ffffff]">
                  {{ viceMayorSidebarInfo.frameworks.approvedActs }}
                </span>
              </div>

              <div class="p-3 rounded-lg bg-white dark:bg-[#1a1a1a] border border-[#dfdfdf] dark:border-[#2a2a2a] text-center">
                <span class="text-[11px] text-[#707070] dark:text-[#9a9a9a] block mb-0.5">Resolutions Passed</span>
                <span class="text-lg font-bold font-mono text-[#171717] dark:text-[#ffffff]">
                  {{ viceMayorSidebarInfo.frameworks.resolutionsPassed }}
                </span>
              </div>
            </div>
          </div>

          <!-- Sidebar Call to Action -->
          <UiActionLink
            variant="button"
            label="Submit Citizen Legislative Proposal"
            icon-class="size-3.5"
            class="w-full justify-center"
            @click="$emit('open-search', 'Submit Legislative Proposal Citizen Petition')"
          />
        </aside>
      </div>
    </div>
  </section>
</template>
