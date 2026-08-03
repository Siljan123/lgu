const MOBILE_BREAKPOINT = 768

/**
 * Returns a reactive `isMobile` boolean that tracks whether the viewport
 * width is below the mobile breakpoint. SSR-safe: defaults to `false`
 * on the server and only reads `window` once mounted on the client.
 */
export function useIsMobile() {
  const isMobile = ref(false)

  function update() {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update)
  })

  return { isMobile }
}