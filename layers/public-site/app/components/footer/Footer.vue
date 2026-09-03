<script setup lang="ts">
import AppLogo from '#layers/base/app/components/custom/AppLogo.vue';
import { Phone, Mail } from '@lucide/vue';

</script>

<template>
  <footer class="border-t border-footer-foreground/20 bg-footer-background">
    <div class="container mx-auto px-4 md:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
        <!-- Logo -->
        <div class="space-y-4 col-span-1 md:col-span-2 lg:col-span-3">
          <div class="flex items-center justify-start">
            <AppLogo class="w-20" />
            <div class="flex flex-col justify-center min-w-0 ml-3">
              <span class="text-sm font-semibold tracking-wider text-muted-foreground uppercase leading-none mb-0.5 truncate">
                Republic of the Philippines
              </span>
              <span class="text-sm sm:text-base md:text-xl font-bold tracking-tight text-foreground uppercase leading-tight truncate">
                Municipality of San Francisco
              </span>
            </div>
          </div>
          <p class="text-foreground/80 text-sm max-w-xs">
            Municipal Hall Compound, Barangay 3,
            <br />
            San Francisco, Agusan del Sur, Philippines
          </p>
          <div class="flex flex-col gap-2">
            <p class="text-foreground/80 text-sm">
              <Phone class="inline-block w-4 h-4 mr-2" />
              +63 985 812 3456
            </p>
            <p class="text-foreground/80 text-sm">
              <Mail class="inline-block w-4 h-4 mr-2" />
              desk@sanfrancisco.gov.ph
            </p>
          </div>
        </div>

        <!-- Social -->
        <div class="space-y-4 mt-2">
          <h3 class="text-lg font-bold">Social</h3>
          <ul class="space-y-2">
            <li>
              <a
                href="https://www.facebook.com/civilservicegovph/"
                target="_blank"
                class="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors text-sm"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.csc.gov.ph/"
                target="_blank"
                class="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors text-sm"
              >
                Website
              </a>
            </li>
          </ul>
        </div>

        <div class="space-y-4 mt-2">
          <h3 class="text-lg font-bold">Legal</h3>
          <ul class="space-y-2">
            <li>
              <a
                href="/privacy"
                class="text-foreground/80 hover:text-foreground transition-colors text-sm"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                class="text-foreground/80 hover:text-foreground transition-colors text-sm"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        <div class="flex items-center justify-center w-28 h-44 mt-1">
          <a href="https://npcregistration.privacy.gov.ph/certificate/organizationRegistration/6a6ab51631d7a82d7a61462b" target="_blank"
            class="text-foreground/80 hover:text-foreground transition-colors text-sm w-full h-full flex items-center justify-center"
          >
            <NuxtImg
              src="images/logo/dpo.png"
              alt="Philippine Government Seal"
              class="w-full h-full object-contain"
            />
          </a>
        </div>
      </div>
    </div>


    <div
      class="bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,#e5e7eb_8px,#e5e7eb_9px)] dark:bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,#262626_8px,#262626_9px)]"
    >
      <div class="container mx-auto px-4 md:px-8 py-6">
        <div
          class="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-foreground/80"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} Municipality of San Francisco PH. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
