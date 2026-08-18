export default defineNuxtRouteMiddleware((to,from) =>{
     const isAllowed = false 

  if (!isAllowed) {
    return navigateTo('/') 
  
  }
})