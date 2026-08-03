<script setup lang="ts">
import { ref } from 'vue'
import {
  Users,
  Landmark,
  HeartPulse,
  Building2,
  ShieldCheck,
  Radio,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Server,
  Lock,
  Cpu,
  Zap,
  ChevronRight,
} from '@lucide/vue'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/../layers/base/app/components/ui/tabs'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/../layers/base/app/components/ui/card'

interface EnterpriseCapability {
  label: string
  href: string
}

interface EnterpriseSystem {
  id: string
  code: string
  name: string
  status: 'OPERATIONAL' | 'LIVE TELEMETRY' | 'SYNCED' | 'ENCRYPTED'
  description: string
  capabilities: EnterpriseCapability[]
  href: string
}

interface EnterpriseDomain {
  id: string
  title: string
  shortLabel: string
  badge: string
  description: string
  systems: EnterpriseSystem[]
}

const domains: EnterpriseDomain[] = [
  {
    id: 'hrms',
    title: 'Human Resource (HRMS)',
    shortLabel: 'Human Resource (HRMS)',
    badge: '4 Modules',
    description: 'Automated municipal payroll, Civil Service evaluation tracking, biometrics, and capacity development.',
    systems: [
      {
        id: 'hris-payroll',
        code: 'HRIS-PAYROLL',
        name: 'HR Portal & Automated Payroll System',
        status: 'OPERATIONAL',
        description: 'Automated salary computation, GSIS/Pag-IBIG/PhilHealth deductions, timekeeping, and e-payslip generation.',
        capabilities: [
          { label: 'GSIS/PhilHealth Sync', href: 'https://hrms.sfads.ph/deductions' },
          { label: 'Automated Deductions', href: 'https://hrms.sfads.ph/payroll-calc' },
          { label: 'Digital Payslips', href: 'https://hrms.sfads.ph/payslips' },
        ],
        href: 'https://hrms.sfads.ph/payroll',
      },
      {
        id: 'spms-eval',
        code: 'SPMS-EVAL',
        name: 'Civil Service Performance Tracker (SPMS)',
        status: 'SYNCED',
        description: 'Strategic Performance Management System for tracking LGU employee IPCR and OPCR target accomplishments.',
        capabilities: [
          { label: 'IPCR / OPCR Workflow', href: 'https://spms.sfads.ph/ipcr' },
          { label: 'CSC Compliance', href: 'https://spms.sfads.ph/csc' },
          { label: 'Target Analytics', href: 'https://spms.sfads.ph/analytics' },
        ],
        href: 'https://spms.sfads.ph/evaluations',
      },
      {
        id: 'ld-hub',
        code: 'LD-HUB',
        name: 'Personnel Learning & Development Hub',
        status: 'OPERATIONAL',
        description: 'LGU training catalog, employee competency matrix, seminar registration, and digital certificates.',
        capabilities: [
          { label: 'Capacity Building', href: 'https://learning.sfads.ph/courses' },
          { label: 'Certifications', href: 'https://learning.sfads.ph/certificates' },
          { label: 'Training Records', href: 'https://learning.sfads.ph/records' },
        ],
        href: 'https://learning.sfads.ph',
      },
      {
        id: 'biotime-sync',
        code: 'BIOTIME-SYNC',
        name: 'Biometric & Telemetry Timekeeping',
        status: 'LIVE TELEMETRY',
        description: 'Real-time biometric sync across all municipal departments, city halls, and annex field offices.',
        capabilities: [
          { label: 'Real-time Bio Sync', href: 'https://biotime.sfads.ph/live' },
          { label: 'Multi-Office Telemetry', href: 'https://biotime.sfads.ph/offices' },
          { label: 'Attendance Log', href: 'https://biotime.sfads.ph/logs' },
        ],
        href: 'https://biotime.sfads.ph',
      },
    ],
  },
  {
    id: 'treasury',
    title: 'Financial & Treasury',
    shortLabel: 'Financial & Treasury',
    badge: '4 Modules',
    description: 'GIS real property tax mapping, online business licensing, multi-channel treasury payments, and e-NGAS auditing.',
    systems: [
      {
        id: 'rpts-gis',
        code: 'RPTS-GIS',
        name: 'Real Property Tax GIS Assessment System',
        status: 'OPERATIONAL',
        description: 'Geographic assessment mapping, automated tax declaration, land re-assessment, and electronic billing.',
        capabilities: [
          { label: 'GIS Tax Mapping', href: 'https://rpts.sfads.ph/map' },
          { label: 'Auto Tax Declaration', href: 'https://rpts.sfads.ph/declaration' },
          { label: 'e-Tax Bill', href: 'https://rpts.sfads.ph/billing' },
        ],
        href: 'https://rpts.sfads.ph/gis',
      },
      {
        id: 'bpls-online',
        code: 'BPLS-ONLINE',
        name: 'Online Business Permit & Licensing (BPLS)',
        status: 'OPERATIONAL',
        description: 'End-to-end business permit application, regulatory assessment, online payment, and Mayor\'s Permit generation.',
        capabilities: [
          { label: 'Unified Business Form', href: 'https://bpls.sfads.ph/apply' },
          { label: 'DTI/SEC API', href: 'https://bpls.sfads.ph/api-verify' },
          { label: 'Digital Permit', href: 'https://bpls.sfads.ph/permit-download' },
        ],
        href: 'https://bpls.sfads.ph/permits',
      },
      {
        id: 'e-revenue',
        code: 'E-REVENUE',
        name: 'Multi-Channel Electronic Revenue Gateway',
        status: 'LIVE TELEMETRY',
        description: 'Integrated treasury payment gateway supporting GCash, Maya, Landbank, and credit card settlements.',
        capabilities: [
          { label: 'GCash / Maya Gateway', href: 'https://treasury.sfads.ph/ewallet' },
          { label: 'e-OR Generation', href: 'https://treasury.sfads.ph/official-receipt' },
          { label: 'Treasury Reconciliation', href: 'https://treasury.sfads.ph/reconciliation' },
        ],
        href: 'https://treasury.sfads.ph/payments',
      },
      {
        id: 'engas-audit',
        code: 'ENGAS-AUDIT',
        name: 'Budget Accounting & e-NGAS Compliance',
        status: 'ENCRYPTED',
        description: 'COA-compliant National Government Accounting System, disbursement tracking, and audit trail ledger.',
        capabilities: [
          { label: 'COA Compliance', href: 'https://finance.sfads.ph/coa-reports' },
          { label: 'Disbursement Ledger', href: 'https://finance.sfads.ph/vouchers' },
          { label: 'Audit Trail', href: 'https://finance.sfads.ph/audit-trail' },
        ],
        href: 'https://finance.sfads.ph/engas',
      },
    ],
  },
  {
    id: 'health',
    title: 'Public Health Telemetry',
    shortLabel: 'Public Health Telemetry',
    badge: '4 Modules',
    description: 'DOH Electronic Health Records, epidemiological disease tracking, medicine cold-chain, and 161 EMS dispatch.',
    systems: [
      {
        id: 'iclinicsys',
        code: 'ICLINICSYS-EHR',
        name: 'Health Center EHR Telemetry (iClinicSys)',
        status: 'OPERATIONAL',
        description: 'Centralized patient records across barangay health centers synced with PhilHealth eHealth initiatives.',
        capabilities: [
          { label: 'PhilHealth eHealth', href: 'https://health.sfads.ph/philhealth' },
          { label: 'Barangay EHR', href: 'https://health.sfads.ph/records' },
          { label: 'Digital Consultation', href: 'https://health.sfads.ph/teleconsult' },
        ],
        href: 'https://health.sfads.ph/iclinicsys',
      },
      {
        id: 'epiwatch',
        code: 'EPIWATCH',
        name: 'Epidemiological Surveillance Hub',
        status: 'LIVE TELEMETRY',
        description: 'Real-time communicable disease surveillance, dengue hotspot heatmaps, and outbreak early warning system.',
        capabilities: [
          { label: 'Outbreak Heatmaps', href: 'https://epiwatch.sfads.ph/heatmaps' },
          { label: 'DOH Surveillance', href: 'https://epiwatch.sfads.ph/doh-sync' },
          { label: 'Early Warning', href: 'https://epiwatch.sfads.ph/alerts' },
        ],
        href: 'https://epiwatch.sfads.ph/telemetry',
      },
      {
        id: 'medtrack',
        code: 'MEDTRACK',
        name: 'Pharmacy & Cold-Chain Inventory System',
        status: 'SYNCED',
        description: 'Real-time telemetry monitoring for medicine stocks, vaccine cold-chain storage temperatures, and allocation.',
        capabilities: [
          { label: 'Cold-Chain Telemetry', href: 'https://pharmacy.sfads.ph/temperature' },
          { label: 'Vaccine Storage', href: 'https://pharmacy.sfads.ph/vaccines' },
          { label: 'Batch Expiry Alerts', href: 'https://pharmacy.sfads.ph/expiry-alerts' },
        ],
        href: 'https://pharmacy.sfads.ph/medtrack',
      },
      {
        id: 'ems161',
        code: 'EMS-161',
        name: 'Emergency Medical Dispatch & Hospital Sync',
        status: 'LIVE TELEMETRY',
        description: 'Computer-aided ambulance dispatch, paramedic vital telemetry, and ER hospital bed availability tracking.',
        capabilities: [
          { label: 'Ambulance GPS Dispatch', href: 'https://ems161.sfads.ph/gps-tracker' },
          { label: 'ER Bed Telemetry', href: 'https://ems161.sfads.ph/hospital-beds' },
          { label: 'Vital Signs Sync', href: 'https://ems161.sfads.ph/vitals' },
        ],
        href: 'https://ems161.sfads.ph/dispatch',
      },
    ],
  },
  {
    id: 'barangay',
    title: 'Barangay System',
    shortLabel: 'Barangay System',
    badge: '4 Modules',
    description: 'Household census profiling, Katarungang Pambarangay dispute tracking, dev fund management, and relief logging.',
    systems: [
      {
        id: 'bims-census',
        code: 'BIMS-CENSUS',
        name: 'Barangay Information & Census System',
        status: 'OPERATIONAL',
        description: 'Unified 24-barangay household registry, resident demographic profiling, and clearance issuing engine.',
        capabilities: [
          { label: 'Household Registry', href: 'https://barangay.sfads.ph/households' },
          { label: 'Resident Demographics', href: 'https://barangay.sfads.ph/demographics' },
          { label: 'Barangay Clearance', href: 'https://barangay.sfads.ph/clearance' },
        ],
        href: 'https://barangay.sfads.ph/bims',
      },
      {
        id: 'kp-law',
        code: 'KP-LAW',
        name: 'Katarungang Pambarangay Case Docket',
        status: 'ENCRYPTED',
        description: 'Digital tracking of barangay mediation, Lupon conciliation proceedings, and case resolution logs.',
        capabilities: [
          { label: 'Mediation Tracking', href: 'https://barangay.sfads.ph/mediation' },
          { label: 'Lupon Docket', href: 'https://barangay.sfads.ph/lupon' },
          { label: 'Certificate to File Action', href: 'https://barangay.sfads.ph/action-certs' },
        ],
        href: 'https://barangay.sfads.ph/kp-docket',
      },
      {
        id: 'bfpm-dev',
        code: 'BFPM-DEV',
        name: 'Barangay 20% Development Fund Manager',
        status: 'SYNCED',
        description: 'Monitoring local barangay infrastructure projects, 20% dev fund allocations, and procurement notices.',
        capabilities: [
          { label: 'Dev Fund Tracking', href: 'https://barangay.sfads.ph/projects' },
          { label: 'Project Procurement', href: 'https://barangay.sfads.ph/bids' },
          { label: 'Barangay Budget', href: 'https://barangay.sfads.ph/budget-ledger' },
        ],
        href: 'https://barangay.sfads.ph/dev-fund',
      },
      {
        id: 'reliefsync',
        code: 'RELIEFSYNC',
        name: 'Disaster Relief & Evacuee Logging',
        status: 'LIVE TELEMETRY',
        description: 'Evacuation center census, household relief pack biometric verification, and DSWD reporting.',
        capabilities: [
          { label: 'Evacuee Registry', href: 'https://relief.sfads.ph/evacuees' },
          { label: 'Relief Pack Verification', href: 'https://relief.sfads.ph/biometric-verify' },
          { label: 'DSWD Sync', href: 'https://relief.sfads.ph/dswd-reports' },
        ],
        href: 'https://relief.sfads.ph/sync',
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance & Transparency',
    shortLabel: 'Compliance & Transparency',
    badge: '4 Modules',
    description: 'Full Disclosure Policy portal, electronic FOI citizen requests, COA audit responses, and ARTA quality analytics.',
    systems: [
      {
        id: 'fdpp-sync',
        code: 'FDPP-SYNC',
        name: 'Full Disclosure Policy Portal (FDPP)',
        status: 'OPERATIONAL',
        description: 'Automated publishing of quarterly financial disclosures, procurement plans, and municipal budget reports.',
        capabilities: [
          { label: 'Quarterly Financials', href: 'https://transparency.sfads.ph/quarterly-financials' },
          { label: 'DILG FDPP Sync', href: 'https://transparency.sfads.ph/dilg-sync' },
          { label: 'Public Budget PDF', href: 'https://transparency.sfads.ph/budget-docs' },
        ],
        href: 'https://transparency.sfads.ph/fdpp',
      },
      {
        id: 'efoi-lgu',
        code: 'EFOI-LGU',
        name: 'Freedom of Information Portal (eFOI)',
        status: 'OPERATIONAL',
        description: 'Public portal for submitting, tracking, and fulfilling citizen requests for official municipal records.',
        capabilities: [
          { label: 'Document Requests', href: 'https://foi.sfads.ph/requests/new' },
          { label: 'Tracking ID', href: 'https://foi.sfads.ph/track' },
          { label: 'ARTA SLA Timers', href: 'https://foi.sfads.ph/sla-dashboard' },
        ],
        href: 'https://foi.sfads.ph',
      },
      {
        id: 'auditguard',
        code: 'AUDITGUARD',
        name: 'Internal Audit & COA Compliance Guard',
        status: 'ENCRYPTED',
        description: 'Tracking Commission on Audit (COA) findings, management response timelines, and compliance metrics.',
        capabilities: [
          { label: 'COA Observation Log', href: 'https://audit.sfads.ph/coa-log' },
          { label: 'Compliance Matrix', href: 'https://audit.sfads.ph/matrix' },
          { label: 'Risk Audit', href: 'https://audit.sfads.ph/risk-metrics' },
        ],
        href: 'https://audit.sfads.ph/guard',
      },
      {
        id: 'publicvibe',
        code: 'PUBLICVIBE',
        name: 'Citizen Charter & Feedback Engine',
        status: 'LIVE TELEMETRY',
        description: 'Real-time monitoring of service turn-around times, ARTA compliance ratings, and citizen satisfaction surveys.',
        capabilities: [
          { label: 'ARTA Compliance', href: 'https://publicvibe.sfads.ph/arta-ratings' },
          { label: 'SLA Monitoring', href: 'https://publicvibe.sfads.ph/sla' },
          { label: 'Feedback Analytics', href: 'https://publicvibe.sfads.ph/analytics' },
        ],
        href: 'https://publicvibe.sfads.ph/charter',
      },
    ],
  },
  {
    id: 'command',
    title: 'Command Safety Hub',
    shortLabel: 'Command Safety Hub',
    badge: '4 Modules',
    description: 'Live CCTV disaster command center, AI traffic monitoring, public safety video analytics, and 911 dispatch.',
    systems: [
      {
        id: 'cdrrmo-cmd',
        code: 'CDRRMO-CMD',
        name: 'Disaster Risk Reduction Command Center',
        status: 'LIVE TELEMETRY',
        description: '24/7 disaster operation hub integrating river level sensor telemetry, weather radar, and emergency dispatch.',
        capabilities: [
          { label: 'Water Level Sensors', href: 'https://command.sfads.ph/river-sensors' },
          { label: 'PAGASA Telemetry', href: 'https://command.sfads.ph/pagasa-radar' },
          { label: 'CCTV Video Wall', href: 'https://command.sfads.ph/cctv-wall' },
        ],
        href: 'https://command.sfads.ph/cdrrmo',
      },
      {
        id: 'traffic-ai',
        code: 'TRAFFIC-AI',
        name: 'Intelligent Traffic Management Engine',
        status: 'LIVE TELEMETRY',
        description: 'Smart intersection monitoring, adaptive signal controls, traffic flow heatmaps, and NCAP ticketing.',
        capabilities: [
          { label: 'Adaptive Signals', href: 'https://traffic.sfads.ph/signals' },
          { label: 'Flow Analytics', href: 'https://traffic.sfads.ph/heatmaps' },
          { label: 'Violation Ticketing', href: 'https://traffic.sfads.ph/ncap' },
        ],
        href: 'https://traffic.sfads.ph/ai',
      },
      {
        id: 'safecity',
        code: 'SAFECITY-AI',
        name: 'Public Safety & CCTV Video Analytics',
        status: 'LIVE TELEMETRY',
        description: 'AI-assisted video feed analysis, automated license plate recognition (ALPR), and spatial safety monitoring.',
        capabilities: [
          { label: 'ALPR License Sync', href: 'https://safecity.sfads.ph/alpr' },
          { label: 'AI Feed Alerts', href: 'https://safecity.sfads.ph/feed-alerts' },
          { label: 'Incident Mapping', href: 'https://safecity.sfads.ph/spatial-map' },
        ],
        href: 'https://safecity.sfads.ph/analytics',
      },
      {
        id: 'dispatch911',
        code: 'DISPATCH-911',
        name: 'Unified 911 Emergency Response Engine',
        status: 'OPERATIONAL',
        description: 'Multi-agency incident dispatch engine coordinating PNP police, BFP fire, medical, and CDRRMO teams.',
        capabilities: [
          { label: '911 Hotline Sync', href: 'https://911.sfads.ph/hotline' },
          { label: 'Multi-Agency Dispatch', href: 'https://911.sfads.ph/agency-matrix' },
          { label: 'CAD GPS Tracking', href: 'https://911.sfads.ph/cad-map' },
        ],
        href: 'https://911.sfads.ph/dispatch',
      },
    ],
  },
]

const activeTabId = ref<string>('hrms')
</script>

<template>
  <section
    id="integrated-enterprise-suite"
    class="py-16 md:py-24 bg-[#fafafa] dark:bg-[#1c1c1c] transition-colors"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <UiSectionHeader
        title="Integrated Enterprise Suite"
        description="A unified municipal digital backbone connecting personnel operations, treasury systems, public health telemetry, barangay dockets, and emergency command centers into a high-availability infrastructure."
        max-description-width="max-w-3xl"
      />

      <Tabs v-model="activeTabId" orientation="vertical" class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        <div class="lg:col-span-4 xl:col-span-3 w-full">
          <div class="text-xs font-mono font-medium text-[#707070] dark:text-[#a3a3a3] uppercase tracking-wider mb-2 px-1 hidden lg:block">
            System Domains
          </div>
          <TabsList class="bg-[#fafafa] dark:bg-[#202020] border p-1.5 h-auto flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible items-stretch justify-start gap-1 rounded-xl w-full scrollbar-none">
            <TabsTrigger
              v-for="domain in domains"
              :key="domain.id"
              :value="domain.id"
              class="flex items-center justify-between gap-3 px-3.5 py-3 text-xs sm:text-sm font-medium rounded-lg cursor-pointer transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-[#171717] data-[state=active]:text-[#171717] dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:border-[#dfdfdf] dark:data-[state=active]:border-[#333333] text-[#707070] dark:text-[#a3a3a3] hover:text-[#171717] dark:hover:text-white shrink-0 lg:w-full border border-transparent text-left"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="truncate">{{ domain.shortLabel }}</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-black/5 dark:bg-white/10 text-current">
                  {{ domain.systems.length }}
                </span>
                <ChevronRight class="size-3.5 hidden lg:block opacity-40 group-data-[state=active]:opacity-100 transition-opacity" aria-hidden="true" />
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <div class="lg:col-span-8 xl:col-span-9 w-full">
          <TabsContent
            v-for="domain in domains"
            :key="domain.id"
            :value="domain.id"
            class="mt-0 focus:outline-none w-full"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#fafafa] dark:bg-[#202020] border mb-6">
              <div class="flex items-center gap-3">
                <div>
                  <h3 class="text-lg font-medium text-[#171717] dark:text-[#ffffff]">
                    {{ domain.title }}
                  </h3>
                  <p class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-0.5">
                    {{ domain.description }}
                  </p>
                </div>
              </div>
              <div class="text-xs font-mono text-[#707070] dark:text-[#a3a3a3] shrink-0">
                4 Interoperable Subsystems
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                v-for="system in domain.systems"
                :key="system.id"
                class="group relative flex flex-col justify-between py-5 hover:border-[#c7c7c7] dark:hover:border-[#404040] transition-all duration-200 shadow-sm gap-4"
              >
                <CardHeader class="px-6 py-0 gap-2">
                  <!-- Code & Status Badges -->
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="font-mono text-xs font-semibold tracking-wide text-[#171717] dark:text-[#f2f2f2] bg-[#fafafa] dark:bg-[#252525] px-2.5 py-1 rounded border border-[#dfdfdf] dark:border-[#333333]">
                      {{ system.code }}
                    </span>

                    <span
                      class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium"
                      :class="[
                        system.status === 'LIVE TELEMETRY'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                          : system.status === 'OPERATIONAL'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                            : system.status === 'SYNCED'
                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20',
                      ]"
                    >
                      <span
                        class="size-1.5 rounded-full"
                        :class="[
                          system.status === 'LIVE TELEMETRY'
                            ? 'bg-amber-500 animate-pulse'
                            : system.status === 'OPERATIONAL'
                              ? 'bg-emerald-500'
                              : system.status === 'SYNCED'
                                ? 'bg-blue-500'
                                : 'bg-purple-500',
                        ]"
                      />
                      <span>{{ system.status }}</span>
                    </span>
                  </div>

                  <CardTitle class="text-lg font-medium text-[#171717] dark:text-[#ffffff] leading-snug">
                    <a
                      :href="system.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="hover:underline rounded-sm"
                    >
                      {{ system.name }}
                    </a>
                  </CardTitle>
                  <CardDescription class="text-sm text-[#707070] dark:text-[#a3a3a3] leading-relaxed pt-0.5">
                    {{ system.description }}
                  </CardDescription>
                </CardHeader>

                <CardContent class="px-6 py-0 flex-1">
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    <a
                      v-for="cap in system.capabilities"
                      :key="cap.label"
                      :href="cap.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-normal bg-[#fafafa] dark:bg-[#242424] text-[#212121] dark:text-[#e0e0e0] border border-[#dfdfdf]/70 dark:border-[#333333] hover:bg-[#B22222]/5 dark:hover:bg-[#E74C3C]/10 hover:border-[#B22222]/30 dark:hover:border-[#E74C3C]/30 hover:text-[#B22222] dark:hover:text-[#E74C3C] transition-all cursor-pointer"
                    >
                      <CheckCircle2 class="size-3 text-[#B22222] dark:text-[#E74C3C] shrink-0" aria-hidden="true" />
                      <span>{{ cap.label }}</span>
                      <ArrowUpRight class="size-3 opacity-60 ml-0.5" aria-hidden="true" />
                    </a>
                  </div>
                </CardContent>

                <CardFooter class="px-6 pt-3 pb-0 border-t border-[#dfdfdf]/60 dark:border-[#2a2a2a] flex items-center justify-start">
                  <UiActionLink
                    :href="system.href"
                    target="_blank"
                    label="Access System Portal"
                  />
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div class="mt-12 p-6 rounded-xl bg-[#fafafa] dark:bg-[#1c1c1c] border grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="flex flex-col items-center justify-center p-2">
          <div class="flex items-center gap-1.5 text-xl sm:text-2xl font-mono font-medium text-[#171717] dark:text-[#ffffff]">
            <Server class="size-5 text-[#B22222] dark:text-[#E74C3C]" aria-hidden="true" />
            <span>99.98%</span>
          </div>
          <span class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-1 font-medium">Uptime Telemetry</span>
        </div>

        <div class="flex flex-col items-center justify-center p-2 border-l">
          <div class="flex items-center gap-1.5 text-xl sm:text-2xl font-mono font-medium text-[#171717] dark:text-[#ffffff]">
            <Building2 class="size-5 text-[#B22222] dark:text-[#E74C3C]" aria-hidden="true" />
            <span>24 / 24</span>
          </div>
          <span class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-1 font-medium"> Systems Active</span>
        </div>

        <div class="flex flex-col items-center justify-center p-2 border-l">
          <div class="flex items-center gap-1.5 text-xl sm:text-2xl font-mono font-medium text-[#171717] dark:text-[#ffffff]">
            <Zap class="size-5 text-[#B22222] dark:text-[#E74C3C]" aria-hidden="true" />
            <span>128+</span>
          </div>
          <span class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-1 font-medium">Interoperable APIs</span>
        </div>

        <div class="flex flex-col items-center justify-center p-2 border-l">
          <div class="flex items-center gap-1.5 text-xl sm:text-2xl font-mono font-medium text-[#171717] dark:text-[#ffffff]">
            <Lock class="size-5 text-[#B22222] dark:text-[#E74C3C]" aria-hidden="true" />
            <span>ISO 27001</span>
          </div>
          <span class="text-xs text-[#707070] dark:text-[#a3a3a3] mt-1 font-medium">Data Security Standard</span>
        </div>
      </div>

    </div>
  </section>
</template>
