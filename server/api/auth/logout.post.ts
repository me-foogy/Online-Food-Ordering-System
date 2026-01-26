import { deleteCookie } from "h3"


export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })

  return {
            success: true, 
            message: 'Logged out'
        }
})
