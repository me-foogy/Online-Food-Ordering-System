import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app';

export default defineNuxtRouteMiddleware(async (to) => {

  const authUserCookie = useCookie<loginReturnMessageType | null>('auth_user', {
    default: ()=>null
  })
  const authUser = authUserCookie.value

  const publicRoutes = ['/login', '/signup', '/reset-password']
  const isPublic = publicRoutes.includes(to.path)

  if (!authUser && !isPublic && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If logged in and trying to access login/signup
if (authUser && isPublic) {
  if (authUser.role === 'admin') {
    return navigateTo('/admin/orders')
  }
  if (authUser.role === 'user') {
    return navigateTo('/user/home')
  }
}

  if (authUser) {
    if (to.path.startsWith('/user') && authUser?.role === 'admin') {
        return navigateTo('/admin/orders')
    }

    if (to.path.startsWith('/admin') && authUser?.role === 'user') {
        return navigateTo('/user/home')
    }
  }
})
