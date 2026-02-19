/*
    desc: plugin that runs on frontend if jwt exists 
*/

const COOKIE_AGE = parseInt(process.env.COOKIE_AGE || '86400') //one day fallback

export default defineNuxtPlugin(async()=>{

    const authUser = useCookie<loginReturnMessageType|null>('auth_user', {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_AGE
    })

    try{
        const {data,} = await useFetch<loginReturnMessageType>('/api/auth/user', {
            method: 'GET',
            key: 'auth-user'
        }) 
        if(data.value) authUser.value=data.value
    }catch{
        authUser.value = null
    }

})