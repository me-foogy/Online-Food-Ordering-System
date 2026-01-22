/*
  Middlware: Route middleware
  Protects unauthorized page access
  To uses pinia store to determine the role of user
*/

import {useAuthStore} from '@/stores/auth';
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to)=>{
    const auth = useAuthStore();

    if (!auth.isLoggedIn) {
        if (to.path.startsWith('/admin') || to.path.startsWith('/user')) {
        return navigateTo('/login');
        }
    return
  }
 
  if (to.path.startsWith('/admin') && !auth.isAdmin) {
    return navigateTo('/user')
  }

  if (to.path.startsWith('/user') && auth.isAdmin) {
    return navigateTo('/admin')
  }

})