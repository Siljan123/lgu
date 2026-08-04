<script setup lang="ts">
import DefaultLogo from '/images/logo/sfads-logo.png'
interface LogoProps {
  src?: string
  alt?: string
  class?: string
}

const props = withDefaults(defineProps<LogoProps>(), {
  src: DefaultLogo,
  alt: 'SFADS Logo',
  class: '',
})
</script>

<template>
  <NuxtImg
    :src="props.src"
    :alt="props.alt"
    :class="['object-contain h-auto', props.class]"
    format="webp"
  />
</template>