import type { resetPasswordType } from "~/pages/reset-password.vue";

export function useReset(){

    const toast = useToast();
    const loading = useLoadingScreen();
    const error = useState<string | null>('auth:error', ()=>null);

    async function resetPassword(email: string): Promise<boolean>{
        loading.value = true
        error.value = null
        try{
            const response = await $fetch('/api/auth/reset/password',{
                method: 'POST',
                body: {
                    email
                }
            });
            
            if(response.success){
                toast.success({message: 'OTP sent to the mail successfully'});
                return true
            }

            return false
        }
        catch(err: any){
            const status = err?.statusCode;
            console.log(status);

            if(status === 400){
                toast.error({message: 'Enter a valid Email'});
            }
            
            else if(status === 404){
                toast.error({message: 'The Email does not exist in database'});
            }

            else{
                toast.error({message: 'Unexpected Error Occured'});
            }
            return false;

        }finally{
            loading.value=false;
        }
    }

    async function verifyResetPassword(resetPasswordData: resetPasswordType, otp: string){
        loading.value = true
        error.value=null
        try{
            const response = await $fetch('/api/auth/reset/verify_password',{
                method: 'POST',
                body: {
                 email: resetPasswordData.email,
                 password: resetPasswordData.password,
                 otp: otp
                }
            });
            
            if(response.success){
                toast.success({message: 'Password Reset Successful'});
                navigateTo('/login')
            }
        }
        catch(err: any){
            const status = err?.statusCode;

            if(status === 400){
                toast.error({message: 'Enter a valid Email'});
            }
            
            else if(status === 404){
                toast.error({message: 'The Email does not exist in database'});
            }

            else if(status === 401){
                toast.error({message: 'The OTP is incorrect'});
            }

            else{
                toast.error({message: 'Unexpected Error Occured'});
            }

        }finally{
            loading.value=false;
        }
    }

    return{
        resetPassword,
        verifyResetPassword
    }
}