import { useToast, type defaultApiType, type loginReturnMessageType, type signUpData, type signUpResponse } from '#imports';
const toast = useToast();

const COOKIE_AGE = parseInt(process.env.COOKIE_AGE || '86400') //one day fallback

export function useAuth(){

    const loading = useState<boolean>('auth:loading', ()=>false);
    const error = useState<string | null>('auth:error', ()=>null);
    type apiResponse<T>={success: true; message: T} | {success: false, message: string}
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
            const response = await $fetch<defaultApiType<loginReturnMessageType>>('/api/auth/login',{
                method: 'POST',
                body: formData,
                ignoreResponseError:true
            });
            
            if(!response.success && typeof(response.message)=='string'){
                error.value = response.message
                toast.error({title: 'FAILED', message:error.value});
                return
            }

            if(response?.success && typeof(response.message) !== 'string'){
                //set Frontend Cookie
                authUser.value = response.message;
                const {role} = authUser.value;
                
                // Wait for next tick(Wait for cookie to be initialized )
                await nextTick();
                
                navigateTo(role==='user'?'/user/home':'/admin/orders');
                toast.success({title: 'Success', message:`${role} logged in successfully`});
            }else{
                toast.error({message:response.message as string});
            }
            
        }
        catch(err){
            toast.error({title: 'ERROR', message:'Unexpected error occured'});
        }finally{
            loading.value = false;
        }
    }

    async function signup(signUpFormData: signUpData){
        loading.value = true
        error.value = null
        try{
            const response = await $fetch<defaultApiType<signUpResponse>>('/api/auth/signup',{
                method: 'POST',
                body: signUpFormData
            });
            
            if(!response.success && typeof(response.message)=='string'){
                error.value = response.message
                toast.error({title: 'FAILED', message:error.value});
                return
            }

            if(response.success && typeof(response.message)!=='string'){
                toast.success({title: 'SUCCESS', message:`Sign In successful`});
                login({
                    email: signUpFormData.email,
                    password: signUpFormData.password,
                    rememberMe: false
                })
            }else{
                toast.error({title: 'Error', message:response.message as string});
            }   
        }
        catch(err: any){
            toast.error({title: 'Error', message:err.data.message as string});
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
            //remoove UI coo    kie
            const authUser = useCookie('auth_user')
            authUser.value = null

            navigateTo('/login');
        } catch {
            toast.error({ title: 'Error', message: 'Unexpected error occurred' })
        }finally{
            loading.value=false;
        }
    }

    return{
        login,
        signup,
        logout
    }
}