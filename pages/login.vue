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

        <div class="w-[100%] h-full bg-gray-100 p-8 
                    lg:w-[40%]">
            <!--Top Logo in login-->
            <div class="flex flex-row gap-2">
                <span class="material-symbols-outlined text-6xl text-blue-600 flex-shrink-0">storefront</span>
                <p class="text-lg font-semibold text-gray-800">
                    THE <br> RESTAURANT
                </p>
            </div>

            <!--Welcome Message-->
            <div class="my-4 space-y-1">
                <h1 class="font-bold text-4xl">Welcome Back</h1>
                <p class="text-gray-500">Sign in with your email and password</p>
            </div>

            <!--Input Form-->
            <form class="pt-8" @submit.prevent="handleLoginSubmit">

                <!--Email-->
                <div class="mb-1">
                    <label for="username" class="text-gray-500">Email Address</label>
                    <input type="mail" placeholder="example@gmail.com" id="username" v-model="formData.email" required
                        class="w-full px-4 py-2 rounded-md border-gray-300 bg-white text-gray-800 border my-1
                                focus:outline-none focus:border-blue-500
                                transition"
                    />
                    <P class="text-red-500" :class="{ 'invisible': !emailError }">Email must be in the in correct format</P>
                </div>

                <!--password-->
                <label for="password" class="text-gray-500">Password</label>
                <div class="flex flex-row space-x-2">
                    <input :type="visibility?`text`:`password`" id="password" v-model="formData.password" required
                        class="w-full px-4 py-2 rounded-md border-gray-300 bg-white text-gray-800 border
                                focus:outline-none focus:border-blue-500 
                                transition"
                    />
                    <button type="button" @click="()=>visibility=!visibility" 
                        class="bg-white border border-gray-300 rounded-md px-2 flex items-center justify-center
                                hover:border-blue-500" 
                        >
                        <span class="material-symbols-outlined my-auto" v-if="visibility">visibility</span>
                        <span class="material-symbols-outlined my-auto" v-else>visibility_off</span>
                    </button>
                </div>
                <P class="text-red-500" :class="{ 'invisible': !passwordError }">Password must include a capital letter and a special character</P>

                <!--remember me and password-->
                <div class="flex flex-row justify-between my-4">
                    <div class="flex flex-row space-x-2 items-center">
                        <input type="checkbox" class="w-4 h-4" v-model="formData.rememberMe">
                        <span class="ml-2">Remember Me</span>
                    </div>
                    <button class="text-gray-500 hover:text-blue-600" type="button">Forgot Password?</button>
                </div>


                <button type="submit" :disabled="passwordError||emailError" 
                class="border bg-blue-600 text-white px-12 py-2 block rounded-md
                hover:bg-blue-700 hover:shadow-sm
                disabled:bg-blue-400
                ">LogIn</button>
            </form>

            <!--Sign Up info-->
            <div class="mt-10 space-x-2 w-full flex flex-row justify-center">
                <span>Don't have an account?</span>
                <button class="text-blue-600">
                    <NuxtLink to="/signup">Sign Up</NuxtLink>
                </button>
            </div>
        </div>
    </div>
</template>