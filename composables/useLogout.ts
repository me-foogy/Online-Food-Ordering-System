import { useToast } from "#imports"

interface logoutApiResponse  {
  success: boolean, 
  message: string
}

export const useLogout = () => {
  const toast = useToast()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { data, error } = await useFetch<logoutApiResponse>('/api/auth/logout', {
        method: 'POST'
      })

      if (error.value || !data.value?.success) {
        toast.error({ title: 'Error', message: 'Failed to logout' })
        return
      }

      toast.success({ title: 'Logged out', message: 'You have been logged out' })
      //remoove UI cookie
      const authUser = useCookie('auth_user')
      authUser.value = null

      router.push('/login')
    } catch {
      toast.error({ title: 'Error', message: 'Unexpected error occurred' })
    }
  }

  return { handleLogout }
}
