<script setup lang="ts">
import {
  User,
  Layers,
  FileText,
  Mic,
  Camera,
  Download,
  ArrowUpRight,
  Calendar,
  Building,
  CheckCircle2,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
  Clock,
  Mail,
  TrendingUp,
  Briefcase,
} from '@lucide/vue'

defineEmits<{
  (e: 'open-search', query?: string): void
}>()

// Active Tab state
const activeTab = ref('profile')

// Mayor Profile & Sidebar Info
const mayorSidebarInfo = {
  name: 'Hon. Alex J. Santos',
  title: 'Municipal Mayor',
  quote: 'Welcome to our digital workspace. We remain anchored on structural efficiency, progressive frameworks, and deploying inclusive community assets.',
  location: '2nd Floor, Executive Wing, Municipal Hall',
  email: 'mayor@sanfrancisco.gov.ph',
  publicDesk: 'Tue & Thu, 9AM - 12PM',
  indicators: {
    programTrack: '94.2%',
    activeMandates: '48 Projects',
  },
  bio: 'Hon. Alex J. Santos has served the municipality with over 15 years of dedicated public service. Spearheading digital transformation, infrastructure modernization, and social welfare expansion, Mayor Santos continues to drive inclusive growth for all constituents.',
  pillars: [
    { title: 'Digital Governance', desc: 'Automating municipal services for 100% online accessibility.' },
    { title: 'Economic Prosperity', desc: 'Attracting local investment and boosting SME growth.' },
    { title: 'Social Resilience', desc: 'Expanding free healthcare, education, and senior care programs.' },
    { title: 'Green Infrastructure', desc: 'Building eco-friendly public facilities and flood control systems.' },
  ],
}

// Major Plans & Programs Data (Max 4 displayed)
const plansAndPrograms = [
  {
    id: 'prog-01',
    title: 'Smart City Digital Services Modernization',
    category: 'Digital Transformation',
    status: 'In Progress',
    progress: 85,
    budget: '₱45,000,000',
    targetDate: 'Q4 2026',
    description: 'Integration of all municipal permit, tax, and social service applications into a unified online portal.',
  },
  {
    id: 'prog-02',
    title: 'Municipal Health Complex & Emergency Care Wing',
    category: 'Healthcare Infrastructure',
    status: 'Under Construction',
    progress: 60,
    budget: '₱120,000,000',
    targetDate: 'Q2 2027',
    description: 'Constructing a state-of-the-art 3-story healthcare facility equipped with modern diagnostics and emergency response center.',
  },
  {
    id: 'prog-03',
    title: 'Green Canopy & Riverfront Resiliency Park',
    category: 'Environmental & Parks',
    status: 'Planning & Bidding',
    progress: 35,
    budget: '₱32,000,000',
    targetDate: 'Q1 2027',
    description: 'Developing 4 hectares of urban eco-park and river embankment flood barriers to safeguard low-lying barangays.',
  },
  {
    id: 'prog-04',
    title: 'Youth Livelihood & Tech Skills Academy',
    category: 'Education & Youth',
    status: 'Active Launch',
    progress: 90,
    budget: '₱18,500,000',
    targetDate: 'Ongoing',
    description: 'Providing free high-tech skill certifications, coding bootcamps, and vocational courses for resident youth.',
  },
]

// Executive Orders Data (Max 4 displayed)
const executiveOrders = [
  {
    id: 'eo-2026-018',
    code: 'EO No. 18, S. 2026',
    title: 'Establishing the Municipal Zero-Waste Task Force and Mandating Segregation at Source',
    date: 'July 29, 2026',
    subject: 'Environmental Management',
    status: 'Active',
  },
  {
    id: 'eo-2026-015',
    code: 'EO No. 15, S. 2026',
    title: 'Reconstitution of the Local Development Council & Investment Incentives Committee',
    date: 'July 14, 2026',
    subject: 'Economic Planning',
    status: 'Active',
  },
  {
    id: 'eo-2026-012',
    code: 'EO No. 12, S. 2026',
    title: 'Mandating 24/7 Operational Readiness of the Local Disaster Risk Reduction Management Office',
    date: 'June 22, 2026',
    subject: 'Public Safety & DRRMO',
    status: 'Active',
  },
  {
    id: 'eo-2026-009',
    code: 'EO No. 09, S. 2026',
    title: 'Standardizing Online Payment Framework Across All LGU Service Kiosks',
    date: 'May 10, 2026',
    subject: 'Finance & Digitization',
    status: 'Active',
  },
]

// Speeches Mock Data (Max 4 displayed)
const speeches = [
  {
    id: 'sp-01',
    title: 'State of the Municipality Address (SOMA) 2026',
    event: 'Annual Sangguniang Bayan Joint Special Session',
    date: 'July 10, 2026',
    venue: 'Municipal Convention Center',
    excerpt: 'Our commitment remains unwavering: to transform our municipality into a beacon of modern public service, economic vibrancy, and environmental resilience.',
  },
  {
    id: 'sp-02',
    title: 'Keynote Address: Inauguration of the Municipal Innovation Hub',
    event: 'Digital LGU Summit 2026',
    date: 'June 18, 2026',
    venue: 'Innovation Center Auditorium',
    excerpt: 'Technology must serve humanity. Our new digital infrastructure guarantees that no barangay and no citizen is left behind in the digital age.',
  },
  {
    id: 'sp-03',
    title: 'Message of Solidarity during World Environmental Day',
    event: 'LGU Tree Planting & River Cleanup Drive',
    date: 'June 05, 2026',
    venue: 'Municipal Eco-Park',
    excerpt: 'Protecting our rivers and urban forests is not just a civic duty; it is our solemn legacy to future generations of our beloved municipality.',
  },
  {
    id: 'sp-04',
    title: 'Turnover Ceremony Speech for New Emergency Response Vehicles',
    event: 'MDRRMO Fleet Blessing & Deployment',
    date: 'May 15, 2026',
    venue: 'Municipal Quadrangle',
    excerpt: 'Rapid response saves lives. We equip our first responders with top-tier technology and vehicles to ensure public safety around the clock.',
  },
]

// Mayor in Action Mock Data (Max 4 displayed)
const mayorInAction = [
  {
    id: 'act-01',
    title: 'Inspection of New Public Market Cold Storage Facility',
    category: 'Field Inspection',
    date: 'Aug 02, 2026',
    location: 'Central Public Market',
    summary: 'Mayor Santos personally inspected the newly installed refrigeration units ensuring local vendors can store produce safely.',
    tag: 'Infrastructure',
  },
  {
    id: 'act-02',
    title: 'Town Hall Consultation with Senior Citizens & PWD Leaders',
    category: 'Community Dialogue',
    date: 'Jul 26, 2026',
    location: 'Barangay Poblacion Activity Center',
    summary: 'Engaged with community elders to review monthly medicine distribution schemes and accessibility improvements.',
    tag: 'Social Services',
  },
  {
    id: 'act-03',
    title: 'Oversight Visit to Ongoing River Dredging & Flood Mitigation Works',
    category: 'Project Audit',
    date: 'Jul 19, 2026',
    location: 'San Jose River Basin',
    summary: 'Checked heavy equipment progress along the river channel ahead of the monsoon season to prevent local flooding.',
    tag: 'Public Works',
  },
  {
    id: 'act-04',
    title: 'Distribution of Educational Subsidies to 1,200 College Scholars',
    category: 'Youth & Education',
    date: 'Jul 12, 2026',
    location: 'Municipal Gymnasium',
    summary: 'Awarded financial assistance grants to deserving tertiary students across all 24 barangays for Academic Year 2026-2027.',
    tag: 'Scholarship',
  },
]
</script>

<template>
  <section
    id="executive-office-portal"
    class="py-16 md:py-24 bg-[#fafafa] dark:bg-[#1c1c1c] transition-colors"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Section Title Badge -->
      <UiSectionHeader
        title="Executive Office Portal"
        description="Direct interactive updates, administrative roadmaps, and public guidelines."
      />

      <!-- Main Layout: Sidebar (Left) + Tabs & Content (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
        
        <!-- SIDEBAR (Col 4) -->
        <aside class="lg:col-span-4 bg-[#fafafa] dark:bg-[#202020] border border-[#dfdfdf] dark:border-[#2e2e2e] rounded-xl p-6 shadow-sm space-y-6">
          <!-- Profile Header in Sidebar -->
          <div class="flex items-start gap-4">
            <div class="size-16 rounded-xl bg-white dark:bg-[#282828] border border-[#dfdfdf] dark:border-[#333333] flex items-center justify-center shrink-0 p-1 shadow-xs">
              <Avatar class="size-full rounded-lg">
                <AvatarFallback class="bg-[#171717] dark:bg-[#ffffff] text-white dark:text-[#171717] text-lg font-bold rounded-lg">
                  AS
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 class="text-xl font-medium tracking-tight text-[#171717] dark:text-[#ffffff]">
                {{ mayorSidebarInfo.name }}
              </h3>
              <p class="text-xs font-semibold text-red-600 dark:text-red-400 mt-0.5">
                {{ mayorSidebarInfo.title }}
              </p>
            </div>
          </div>

          <Separator/>

          <!-- Official Quote -->
          <div class="p-3.5 text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed italic border-l-2 border-l-red-600 dark:border-l-red-400">
            "{{ mayorSidebarInfo.quote }}"
          </div>

          <!-- Contact & Public Desk Details -->
          <div class="space-y-2.5 text-xs text-[#707070] dark:text-[#a3a3a3]">
            <div class="flex items-start gap-2">
              <MapPin class="size-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <span>{{ mayorSidebarInfo.location }}</span>
            </div>

            <div class="flex items-center gap-2">
              <Mail class="size-4 shrink-0 text-red-600 dark:text-red-400" />
              <a :href="`mailto:${mayorSidebarInfo.email}`" class="text-[#171717] dark:text-[#ffffff] font-medium hover:underline font-mono">
                {{ mayorSidebarInfo.email }}
              </a>
            </div>
            <Separator/>
            <div class="flex items-start gap-2">
              <Clock class="size-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <span><strong class="text-[#171717] dark:text-[#ffffff] font-medium">Public Desk:</strong> {{ mayorSidebarInfo.publicDesk }}</span>
            </div>
          </div>
          <Separator/>

          <!-- State of Municipality Indicators -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <TrendingUp class="size-4 text-red-600 dark:text-red-400" />
              <h4 class="text-xs font-semibold text-[#171717] dark:text-[#ffffff] uppercase tracking-wider">
                State of Municipality Indicators
              </h4>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-lg bg-white dark:bg-[#1a1a1a] border border-[#dfdfdf] dark:border-[#2a2a2a] text-center">
                <span class="text-[11px] text-[#707070] dark:text-[#9a9a9a] block mb-0.5">Program Track</span>
                <span class="text-xl font-bold font-mono text-[#171717] dark:text-[#ffffff]">
                  {{ mayorSidebarInfo.indicators.programTrack }}
                </span>
              </div>

              <div class="p-3 rounded-lg bg-white dark:bg-[#1a1a1a] border border-[#dfdfdf] dark:border-[#2a2a2a] text-center">
                <span class="text-[11px] text-[#707070] dark:text-[#9a9a9a] block mb-0.5">Active Mandates</span>
                <span class="text-xl font-bold font-mono text-[#171717] dark:text-[#ffffff]">
                  {{ mayorSidebarInfo.indicators.activeMandates }}
                </span>
              </div>
            </div>
          </div>

          <!-- Sidebar Call to Action -->
          <UiActionLink
            variant="button"
            label="Book Courtesy Visit with Mayor"
            icon-class="size-3.5"
            class="w-full justify-center"
            @click="$emit('open-search', 'Schedule Appointment Office of the Mayor')"
          />
        </aside>

        <!-- MAIN CONTENT / TABS (Col 8) -->
        <main class="lg:col-span-8">
          <Tabs v-model="activeTab" class="w-full">
            <!-- Scrollable Tabs Navigation -->
            <UiTabsHeader>
              <TabsTrigger
                value="profile"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <User class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Profile</span>
              </TabsTrigger>

              <TabsTrigger
                value="plans"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Layers class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Plans & Programs</span>
              </TabsTrigger>

              <TabsTrigger
                value="orders"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <FileText class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Executive Orders</span>
              </TabsTrigger>

              <TabsTrigger
                value="speeches"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Mic class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Speeches</span>
              </TabsTrigger>

              <TabsTrigger
                value="action"
                class="px-4 py-2 text-sm font-medium rounded-md transition-all gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Camera class="size-4 shrink-0 text-[#707070] dark:text-[#a3a3a3]" />
                <span>Mayor in Action</span>
              </TabsTrigger>
            </UiTabsHeader>

            <!-- TAB 1: PROFILE -->
            <TabsContent value="profile" class="mt-6 focus-visible:outline-none">
              <Card class="bg-white dark:bg-[#202020] border-[#dfdfdf] dark:border-[#2e2e2e] shadow-sm">
                <CardHeader>
                  <CardTitle class="text-xl font-medium text-[#171717] dark:text-[#ffffff] flex items-center gap-2">
                    <span>Leadership Vision & Executive Roadmap</span>
                  </CardTitle>
                  <CardDescription class="text-xs text-[#707070] dark:text-[#a3a3a3]">
                    Strategic development agenda for municipal transformation.
                  </CardDescription>
                </CardHeader>

                <CardContent class="space-y-4 text-sm text-[#171717] dark:text-[#d4d4d4] leading-relaxed">
                  <p>{{ mayorSidebarInfo.bio }}</p>

                  <div class="pt-4 border-t border-[#f0f0f0] dark:border-[#2a2a2a]">
                    <h4 class="text-xs font-semibold uppercase tracking-wider text-[#707070] dark:text-[#a3a3a3] mb-3">
                      Core Development Pillars
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        v-for="(pillar, idx) in mayorSidebarInfo.pillars"
                        :key="idx"
                        class="p-3.5 rounded-lg bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#dfdfdf]/70 dark:border-[#2e2e2e]"
                      >
                        <span class="font-medium text-xs text-[#171717] dark:text-[#ffffff] flex items-center gap-1.5 mb-1">
                          <CheckCircle2 class="size-3.5 text-red-600 dark:text-red-400 shrink-0" />
                          {{ pillar.title }}
                        </span>
                        <p class="text-[12px] text-[#707070] dark:text-[#9a9a9a] leading-tight">
                          {{ pillar.desc }}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a] flex items-center justify-between text-xs">
                  <span class="text-[#707070] dark:text-[#9a9a9a] flex items-center gap-1">
                    <Building class="size-3.5 text-red-600 dark:text-red-400" />
                    Office of the Municipal Mayor
                  </span>
                  <UiActionLink
                    label="Read Full Profile"
                  />
                </CardFooter>
              </Card>
            </TabsContent>

            <!-- TAB 2: PLANS & PROGRAMS (Max 4) -->
            <TabsContent value="plans" class="mt-6 focus-visible:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiFeatureCard
                  v-for="plan in plansAndPrograms"
                  :key="plan.id"
                >
                  <CardHeader>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="outline" class="text-[11px] border-[#c7c7c7] dark:border-[#404040] text-[#171717] dark:text-[#ffffff]">
                        {{ plan.category }}
                      </Badge>
                      <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        {{ plan.status }}
                      </span>
                    </div>

                    <CardTitle class="text-base font-medium text-[#171717] dark:text-[#ffffff] leading-snug">
                      {{ plan.title }}
                    </CardTitle>

                    <CardDescription class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-1 line-clamp-2">
                      {{ plan.description }}
                    </CardDescription>
                  </CardHeader>

                  <CardContent class="px-5 py-2 space-y-3">
                    <div>
                      <div class="flex items-center justify-between text-xs mb-1">
                        <span class="text-[#707070] dark:text-[#a3a3a3]">Implementation Progress</span>
                        <span class="font-mono font-medium text-[#171717] dark:text-[#ffffff]">{{ plan.progress }}%</span>
                      </div>
                      <div class="w-full h-1.5 bg-[#e5e5e5] dark:bg-[#333333] rounded-full overflow-hidden">
                        <div class="h-full bg-red-600 dark:bg-red-500 rounded-full transition-all duration-500" :style="{ width: `${plan.progress}%` }"></div>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#f0f0f0] dark:border-[#2a2a2a]">
                      <div>
                        <span class="text-[#707070] dark:text-[#9a9a9a] block text-[11px]">Budget</span>
                        <span class="font-medium font-mono text-[#171717] dark:text-[#ffffff]">{{ plan.budget }}</span>
                      </div>
                      <div>
                        <span class="text-[#707070] dark:text-[#9a9a9a] block text-[11px]">Target</span>
                        <span class="font-medium text-[#171717] dark:text-[#ffffff]">{{ plan.targetDate }}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a] flex items-center justify-between text-xs">
                    <span class="text-[#707070] dark:text-[#9a9a9a] font-mono">{{ plan.id }}</span>
                    <UiActionLink
                      label="View Roadmap"
                    />
                  </CardFooter>
                </UiFeatureCard>
              </div>

              <!-- View More Action -->
              <div class="mt-6 flex justify-end">
                <UiActionLink
                  label="View All Executive Development Programs"
                  @click="$emit('open-search', 'All Executive Major Plans and Programs LGU')"
                />
              </div>
            </TabsContent>

            <!-- TAB 3: EXECUTIVE ORDERS (Max 4) -->
            <TabsContent value="orders" class="mt-6 focus-visible:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiFeatureCard
                  v-for="eo in executiveOrders"
                  :key="eo.id"
                >
                  <CardHeader>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="font-mono text-xs font-semibold text-[#171717] dark:text-[#ffffff] bg-[#f4f4f5] dark:bg-[#2a2a2a] px-2 py-0.5 rounded">
                        {{ eo.code }}
                      </span>
                      <span class="text-xs text-[#707070] dark:text-[#a3a3a3] flex items-center gap-1">
                        <Calendar class="size-3" />
                        {{ eo.date }}
                      </span>
                    </div>

                    <CardTitle class="text-base font-medium text-[#171717] dark:text-[#ffffff] leading-snug">
                      {{ eo.title }}
                    </CardTitle>
                  </CardHeader>

                  <CardContent class="px-5 py-0 text-xs text-[#707070] dark:text-[#a3a3a3]">
                    <span>Classification: <strong class="text-[#171717] dark:text-[#ffffff] font-medium">{{ eo.subject }}</strong></span>
                  </CardContent>

                  <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a] flex items-center justify-between">
                    <span class="inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      {{ eo.status }}
                    </span>
                    <button
                      type="button"
                      @click="$emit('open-search', `Download PDF ${eo.code}`)"
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
                  label="View Complete Executive Orders Repository"
                  @click="$emit('open-search', 'Executive Orders Archive Office of the Mayor')"
                />
              </div>
            </TabsContent>

            <!-- TAB 4: SPEECHES (Max 4) -->
            <TabsContent value="speeches" class="mt-6 focus-visible:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiFeatureCard
                  v-for="speech in speeches"
                  :key="speech.id"
                >
                  <CardHeader>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
                        {{ speech.event }}
                      </span>
                      <span class="text-xs text-[#707070] dark:text-[#a3a3a3]">{{ speech.date }}</span>
                    </div>

                    <CardTitle class="text-base font-medium text-[#171717] dark:text-[#ffffff] leading-snug">
                      {{ speech.title }}
                    </CardTitle>
                  </CardHeader>

                  <CardContent class="px-5 py-0 text-xs text-[#707070] dark:text-[#a3a3a3] leading-relaxed italic border-l-2 border-red-600/50 dark:border-red-400/50 ml-5 my-1 pl-3">
                    "{{ speech.excerpt }}"
                  </CardContent>

                  <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a] flex items-center justify-between text-xs">
                    <span class="text-[#707070] dark:text-[#9a9a9a] flex items-center gap-1">
                      <MapPin class="size-3 text-red-600 dark:text-red-400" />
                      {{ speech.venue }}
                    </span>
                    <UiActionLink
                      label="Transcript"
                    />
                  </CardFooter>
                </UiFeatureCard>
              </div>

              <div class="mt-6 flex justify-end">
                <UiActionLink
                  label="Browse All Speeches & Official Statements"
                  @click="$emit('open-search', 'Speeches and Official Statements Mayor Santos')"
                />
              </div>
            </TabsContent>

            <!-- TAB 5: MAYOR IN ACTION (Max 4) -->
            <TabsContent value="action" class="mt-6 focus-visible:outline-none">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UiFeatureCard
                  v-for="act in mayorInAction"
                  :key="act.id"
                  class="group pt-0"
                >
                  <div>
                    <div class="h-28 bg-[#ededed] dark:bg-[#282828] rounded-t-lg flex flex-col items-center justify-center p-3 text-center border-b border-[#dfdfdf] dark:border-[#2e2e2e] relative overflow-hidden">
                      <div class="absolute top-2 left-2">
                        <Badge class="bg-[#171717] text-white dark:bg-white dark:text-[#171717] text-[10px] font-medium border-none">
                          {{ act.tag }}
                        </Badge>
                      </div>
                      <Camera class="size-7 text-[#707070] dark:text-[#a3a3a3] mb-1 group-hover:scale-110 transition-transform" />
                      <span class="text-[11px] font-mono text-[#707070] dark:text-[#a3a3a3]">{{ act.date }}</span>
                    </div>

                    <CardHeader class="p-4 pb-2">
                      <CardTitle class="text-sm font-medium text-[#171717] dark:text-[#ffffff] leading-snug line-clamp-2">
                        {{ act.title }}
                      </CardTitle>
                      <CardDescription class="text-[11px] text-[#707070] dark:text-[#a3a3a3] mt-1 flex items-center gap-1">
                        <MapPin class="size-3 shrink-0 text-red-600 dark:text-red-400" />
                        <span class="truncate">{{ act.location }}</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent class="px-4 py-0 text-xs text-[#707070] dark:text-[#9a9a9a] line-clamp-2">
                      {{ act.summary }}
                    </CardContent>
                  </div>

                  <CardFooter class="border-t border-[#f0f0f0] dark:border-[#2a2a2a]">
                    <UiActionLink
                      label="View Activity Brief"
                    />
                  </CardFooter>
                </UiFeatureCard>
              </div>

              <div class="mt-6 flex justify-end">
                <UiActionLink
                  label="Explore Full Mayor in Action Activity Gallery"
                  @click="$emit('open-search', 'Mayor in Action Field Updates Activity Gallery')"
                />
              </div>
            </TabsContent>
          </Tabs>
        </main>

      </div>
    </div>
  </section>
</template>
