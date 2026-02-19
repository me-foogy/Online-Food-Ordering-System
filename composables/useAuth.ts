import { useToast, type defaultApiType, type loginReturnMessageType, type signUpData, type signUpResponse } from '#imports';

const COOKIE_AGE = parseInt(process.env.COOKIE_AGE || '86400') //one day fallback

export function useAuth(){

    const toast = useToast();
    const loading = useState<boolean>('auth:loading', ()=>false);
    const error = useState<string | null>('auth:error', ()=>null);
    interface logoutApiResponse  {
        success: boolean, 
        message: string
    }
    
    async function login(formData: loginFormData){
        loading.value = true
        error.value = null
        const authUser = useCookie<loginReturnMessageType>('auth_user', {
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: COOKIE_AGE
        })

        try{
            const response = await $fetch<{success: true, message: loginReturnMessageType}>('/api/auth/login',{
                method: 'POST',
                body: formData,
            });

            if(response?.success){
                //set Frontend Cookie
                authUser.value = response.message;
                const {role} = authUser.value;
                // Wait for next tick(Wait for cookie to be initialized 
                await nextTick();
                navigateTo(role==='user'?'/user/home':'/admin/orders');
                toast.success({title: 'Success', message:`${role} logged in successfully`});
            }  
        }
        catch(err: any){
            const status = err?.statusCode;
            error.value=err?.data?.message;
            
            if(status === 400){
                toast.error({message: 'Validation Error'});
            }
            
            else if(status === 404){
                toast.error({message: 'User Not Found'});
            }

            else if(status === 401){
                toast.error({message: 'Invalid Credentials'});
            }

            else{
                toast.error({message: 'Unexpected Error Occured'});
            }
        }finally{
            loading.value = false;
        }
    }

    async function signup(signUpFormData: signUpData): Promise<boolean>{
        loading.value = true
        error.value = null
        try{
            const response = await $fetch<{success: true, message:signUpResponse}>('/api/auth/signup',{
                method: 'POST',
                body: signUpFormData
            });

            if(response.success){
                toast.success({title: 'SUCCESS', message:'OTP sent Successfully'});
                return true
            }
            
            return false 
        }
        catch(err: any){
            const status = err?.statusCode;
            error.value=err?.data?.message;
            
            if(status === 400){
                toast.error({message: 'Validation Error'});
            }
            
            else if(status === 409){
                toast.error({message: 'An account with the email already exists'});
            }

            else{
                toast.error({message: 'Unexpected Error Occured'});
            }
            return false
        }finally{
            loading.value=false;
        }
    }

    async function verifySignup(signUpFormData: signUpData, otp: string){
        loading.value = true
        error.value=null
        try{
            const response = await $fetch<{success: true, message: signUpResponse}>('/api/auth/verify_signup', {
                method: 'POST',
                body: {
                    email: signUpFormData.email,
                    otp
                }
            });

             if(response.success){
                toast.success({title: 'SUCCESS', message:'Sign In Successful'});
                login({
                    email: signUpFormData.email,
                    password: signUpFormData.password,
                    rememberMe: false
                })
            }

        }catch(err: any){

            const status = err?.statusCode;
            error.value=err?.data?.message;
            
            if(status === 400){
                toast.error({message: 'Body must have error and otp'});
            }
            
            else if(status === 404){
                toast.error({message: 'User with the email does not exist'});
            }

            else if(status === 401){
                toast.error({message: 'The Entered OTP is incorrect'});
            }

            else if(status === 410){
                toast.error({message: 'The OTP has already expired'});
            }

            else{
                toast.error({message: 'Unexpected Error Occured'});
            }

        }finally{
            loading.value=false;
        }
    }

    async function logout(){
        loading.value = true
        error.value = null
        try {
            const response = await $fetch<logoutApiResponse>('/api/auth/logout', {
                method: 'POST'
            })

            if (!response.success) {
                toast.error({ title: 'Error', message: 'Failed to logout' })
                return
            }

            toast.success({ title: 'Logged out', message: 'You have been logged out' })

            //remoove UI cookie
            const authUser = useCookie('auth_user', {
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            })
            authUser.value = undefined

            navigateTo('/login');
        } catch {
            //also delete cookie if api call fails
            const authUser = useCookie('auth_user', {
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            })
            authUser.value = undefined
            toast.error({ title: 'Error', message: 'Unexpected error occurred' })
        }finally{
            loading.value=false;
        }
    }

    return{
        loading,
        login,
        signup,
        verifySignup,
        logout
    }
}