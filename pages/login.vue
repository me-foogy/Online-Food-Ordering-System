<script setup lang="ts">

    import { useAuthStore } from '@/stores/auth';
    import { loginSchema } from '@/shared/schemas/login';
    import {z} from 'zod';
    
    const {login} = useAuth();
    const visibility = ref<boolean>(false);
    const passwordError = ref<boolean>(false);
    const emailError = ref<boolean>(false);
    
    const formData=ref<loginFormData>({
        email: '',
        password:'',
        rememberMe: false
    })

    onMounted(()=>{
        const userEmail:string|null=localStorage.getItem('userEmail');
        if(userEmail){
            formData.value.email=userEmail;
            formData.value.rememberMe=true;
            return;
        }
        return;
    })
    
    watch(()=>formData.value.password, (value)=>{
        const regexExp = /^(?=.*[A-Z])(?=.*[\W_]).+$/;
        passwordError.value=!regexExp.test(value);
    })

    watch(()=>formData.value.email, (value)=>{
        const regexExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        emailError.value=!regexExp.test(value);
    })

    const handleLoginSubmit = () =>{
        login(formData.value);
    }

</script>

<template>
    <div class="w-screen h-screen bg-gray-500 flex flex-row">
        <div class="w-[60%] h-full hidden 
                    bg-[url(/images/loginBG.jpg)] bg-cover bg-center bg-no-repeat
                    lg:block">
        </div>

        <div class="w-full h-full bg-gray-100 p-4 sm:p-6 lg:p-8 lg:w-[40%]">

            <!--Top Logo in login-->
            <div class="flex flex-row gap-2 items-center mb-4 sm:mb-6">
                <span class="material-symbols-outlined text-3xl md:text-6xl text-blue-600 flex-shrink-0">storefront</span>
                <p class="text-sm md:text-lg font-semibold text-gray-800">
                    THE <br> RESTAURANT
                </p>
            </div>

            <!--Welcome Message-->
            <div class="mb-8 sm:mb-6 space-y-1">
                <h1 class="font-bold text-xl lg:text-2xl xl:text-4xl">Welcome Back</h1>
                <p class="text-gray-500 text-sm md:text-base">Sign in with your email and password</p>
            </div>

            <!--Input Form-->
            <form class="space-y-1 sm:space-y-2" @submit.prevent="handleLoginSubmit">

                <!--Email-->
                <div>
                    <label for="username" class="text-gray-500 text-sm md:text-base">Email Address</label>
                    <input 
                        type="mail" 
                        placeholder="example@gmail.com" 
                        id="username" 
                        v-model="formData.email" 
                        required
                        class="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md border-gray-300 bg-white text-gray-800 border mt-1
                               focus:outline-none focus:border-blue-500 transition"
                    />
                    <p class="text-red-500 text-xs sm:text-sm mt-1 h-5" :class="{ 'invisible': !emailError }">
                        Email must be in the correct format
                    </p>
                </div>

                <!--password-->
                <div>
                    <label for="password" class="text-gray-500 text-sm md:text-base">Password</label>
                    <div class="flex flex-row gap-2 mt-1">
                        <input 
                            :type="visibility ? 'text' : 'password'" 
                            id="password" 
                            v-model="formData.password" 
                            required
                            class="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-md border-gray-300 bg-white text-gray-800 border
                                   focus:outline-none focus:border-blue-500 transition"
                        />
                        <button 
                            type="button" 
                            @click="visibility = !visibility" 
                            class="bg-white border border-gray-300 rounded-md px-2 sm:px-3 flex items-center justify-center
                                   hover:border-blue-500"
                        >
                            <span class="material-symbols-outlined text-xl sm:text-2xl" v-if="visibility">visibility</span>
                            <span class="material-symbols-outlined text-xl sm:text-2xl" v-else>visibility_off</span>
                        </button>
                    </div>
                    <p class="text-red-500 text-xs sm:text-sm mt-1 h-5" :class="{ 'invisible': !passwordError }">
                        Password must include a capital letter and a special character
                    </p>
                </div>

                <!--remember me and forgot password-->
                <div class="flex flex-row justify-between items-center py-2">
                    <div class="flex flex-row gap-2 items-center">
                        <input type="checkbox" class="w-4 h-4" v-model="formData.rememberMe">
                        <span class="text-xs sm:text-sm md:text-base">Remember Me</span>
                    </div>
                    <NuxtLink 
                        to="/reset-password" 
                        class="text-gray-500 hover:text-blue-600 text-xs sm:text-sm md:text-base"
                    >
                        Forgot Password?
                    </NuxtLink>
                </div>

                <button 
                    type="submit" 
                    :disabled="passwordError || emailError" 
                    class="w-auto bg-blue-600 text-white px-8 py-2.5 sm:py-3 rounded-md
                           hover:bg-blue-700 hover:shadow-sm transition
                           disabled:bg-blue-400 disabled:cursor-not-allowed
                           text-sm sm:text-base font-medium"
                >
                    Log In
                </button>
            </form>

            <!--Sign Up info-->
            <div class="mt-6 sm:mt-8 lg:mt-10 w-full flex flex-row justify-center gap-2 text-sm sm:text-base">
                <span>Don't have an account?</span>
                <NuxtLink to="/signup" class="text-blue-600 hover:text-blue-700 font-medium">Sign Up</NuxtLink>
            </div>
        </div>
    </div>
</template>