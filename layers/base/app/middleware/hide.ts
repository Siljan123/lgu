export default defineNuxtRouteMiddleware((to, from) => {
  if (!import.meta.dev) return

  const isAllowed = true

  if (!isAllowed) {
    return navigateTo('/')
  }
})