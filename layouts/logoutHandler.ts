import { useToast } from '#imports'
import { useRouter } from '#app'

const toast = useToast()
const router = useRouter()

export const handleLogout = async () => {
  try {
    const { data, error } = await useFetch('/api/auth/logout', { method: 'POST' })

    if (error.value || !data.value?.success) {
      toast.error({ title: 'Error', message: 'Failed to logout' })
      return
    }

    toast.success({ title: 'Logged out', message: 'You have been logged out' })

    router.push('/login')
  } catch (err) {
    toast.error({ title: 'Error', message: 'Unexpected error occurred' })
  }
}
