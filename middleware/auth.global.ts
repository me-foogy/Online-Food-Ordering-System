import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app';

type AuthUser = {
  name: string
  email: string
  role: 'admin' | 'user'
}

export default defineNuxtRouteMiddleware((to)=>{

  const auth = useCookie<AuthUser>('auth_token');
  const authCookie = auth.value;

  // Public routes
  const isPublic = to.path === '/login' || to.path === '/signup'

  // Logged-in users
  if (isPublic && authCookie) {
    return navigateTo(authCookie.role === 'admin' ? '/admin' : '/user/home')
  }

  // Protected routes
  if (!isPublic && !authCookie) {
    return navigateTo('/login')
  }

  if (authCookie) {
    if (to.path.startsWith('/admin') && authCookie.role !== 'admin') {
      return navigateTo('/user/home')
    }

    if (to.path.startsWith('/user') && authCookie.role === 'admin') {
      return navigateTo('/admin')
    }
  }
})