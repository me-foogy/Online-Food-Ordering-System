import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app';

export default defineNuxtRouteMiddleware((to)=>{

  const authUser = useCookie<loginReturnMessageType>('auth_user').value;

  // Public routes
  const isPublic = to.path === '/login' || to.path === '/signup'

  // Logged-in users
  if (!authUser && !isPublic) {
    return navigateTo('/login');
  }

  // // Protected routes
  // if (authUser && isPublic) {
  //   return navigateTo(authUser?.role === 'admin' ? '/admin' : '/user/home')
  // }

  if (to.path.startsWith('/admin') && authUser?.role !== 'admin') {
    return navigateTo('/user/home')
  }

  if (to.path.startsWith('/user') && authUser?.role !== 'user') {
    return navigateTo('/admin/orders')
  }
})