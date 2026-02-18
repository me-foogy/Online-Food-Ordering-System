<script setup lang="ts">
    import { useToast } from '#imports';
    const {resetPassword, verifyResetPassword} = useReset();

    export interface resetPasswordType {
        email: string,
        password: string,
        confirmPassword: string  
    }

    const resetPasswordData=ref<resetPasswordType>({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const otp=ref<string>('')
    const passwordError = ref<boolean>(false);
    const confirmPasswordError = ref<boolean>(false);
    const emailError= ref<boolean>(false);
    const displaySection = ref<'firstPart'|'secondPart'>('firstPart');
    const totalSeconds = ref<number>(5*60);
    let timer: NodeJS.Timeout|null = null;
    
    watch(()=>resetPasswordData.value.password, (value)=>{
        const regexExp = /^(?=.*[A-Z])(?=.*[\W_]).+$/;
        passwordError.value=!regexExp.test(value);
    })

    watch(()=>resetPasswordData.value.email, (value)=>{
        const regexExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        emailError.value=!regexExp.test(value);
    })

    watch(()=>resetPasswordData.value.confirmPassword, (value)=>{
        if(resetPasswordData.value.password===value) confirmPasswordError.value=false
        else confirmPasswordError.value=true;
    })

    const formattedTime = computed(()=>{
        const minutes = Math.floor(totalSeconds.value/60)
        const seconds = totalSeconds.value%60
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2,"0")}`;
    })

    const startClock = () =>{
        totalSeconds.value=5*60;
        if(timer) clearInterval(timer)
        timer = setInterval(()=>{
            if(totalSeconds.value > 0) totalSeconds.value--;
            else clearInterval(timer!)
        }, 1000)
    }

    const sendResetOTP = async()=>{
        //api call for password reset
        const isOTPSent = await resetPassword(resetPasswordData.value.email);
        if(isOTPSent){
            displaySection.value='secondPart';
            startClock();
        }
    }

    const handleResetVerification = () =>{
        //api call to verify otp
        verifyResetPassword(resetPasswordData.value, otp.value);
    }

    const handleResend = () =>{
        //send reset details to the api endpoint for otp resend and otp reassign
        sendResetOTP();
        //reset Timer
        startClock();
    }

    onUnmounted(()=>{
        //cleanup on unmounted
        if(timer) clearInterval(timer);
    })
</script>

<template>
    <div class="w-[100dvw] h-[100dvh] bg-gray-500 flex flex-row">

        <!-- Left background Image -->
        <div class="w-[60%] h-full hidden 
                    bg-[url(/images/loginBG.jpg)] bg-cover bg-center bg-no-repeat
                    lg:block">
        </div>

        <!-- Right form -->
        <div class="w-full h-full bg-gray-100 p-8 lg:w-[40%] flex flex-col">

            <!-- Logo -->
            <div class="flex flex-row items-center gap-2">
                <span class="material-symbols-outlined text-6xl text-blue-600 flex-shrink-0">storefront</span>
                <p class="text-lg font-semibold text-gray-800">
                    THE <br> RESTAURANT
                </p>
            </div>

            <!-- Page heading -->
            <div class="my-4">
                <h1 class="font-bold text-4xl">Reset Password</h1>
                <p class="text-gray-500 mt-1">
                    {{ displaySection === 'firstPart' ? 'Enter your email to receive a reset code.' : 'Check your email for the OTP and set a new password.' }}
                </p>
            </div>

            <form class="pt-2 flex-1 min-h-0 overflow-y-auto px-4 flex flex-col gap-2">

                <!-- Email -->
                <div v-if="displaySection === 'firstPart'" class="space-y-4 px-2">

                    <div class="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-8">
                        <p class="text-red-700 text-sm font-medium">The Email address must be registered in the system</p>
                    </div>

                    <label for="username" class="text-gray-500">Email Address</label>
                    <input
                        type="mail"
                        id="username"
                        placeholder="example@gmail.com"
                        v-model="resetPasswordData.email"
                        required
                        class="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 my-1
                               focus:outline-none focus:border-blue-500 transition"
                    />
                    <p class="text-red-500 text-sm h-5" :class="{ 'invisible': !emailError }">
                        Email must be in the correct format
                    </p>
                </div>

                <!--OTP + New Password -->
                <div v-if="displaySection === 'secondPart'" class="space-y-3">

                    <!-- OTP notice -->
                    <div class="bg-red-50 border border-red-200 rounded-md px-4 py-3 space-y-1">
                        <p class="text-red-700 text-sm font-medium">An OTP has been sent to your email. It is valid for 30 minutes.</p>
                        <p class="text-gray-500 text-xs">Remember to check your spam folder.</p>
                    </div>

                    <!-- OTP input -->
                    <div>
                        <label class="text-gray-500">Enter 6-Digit OTP Code</label>
                        <div class="flex flex-row items-center gap-2 mt-1">
                            <input
                                type="text"
                                maxlength="6"
                                v-model="otp"
                                inputmode="numeric"
                                placeholder=". . . . . ."
                                class="w-full px-4 py-2 text-center tracking-widest text-lg
                                       rounded-md border border-gray-300 bg-white
                                       focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="button"
                                @click="handleResend"
                                :disabled="totalSeconds > 0"
                                class="bg-blue-600 px-4 py-2 rounded-md text-white flex flex-row items-center gap-2
                                       hover:bg-blue-700 hover:shadow-sm
                                       disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                <span class="material-symbols-outlined">cached</span>
                                Resend
                            </button>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">
                            Resend available in <span class="text-red-700 font-medium">
                                {{formattedTime}}
                            </span>
                        </p>
                    </div>

                    <!-- New password -->
                    <div>
                        <label for="password" class="text-gray-500">New Password</label>
                        <input
                            type="text"
                            id="password"
                            v-model="resetPasswordData.password"
                            required
                            class="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 my-1
                                   focus:outline-none focus:border-blue-500 transition"
                        />
                        <p class="text-red-500 text-sm h-5" :class="{ 'invisible': !passwordError }">
                            Password must include a capital letter and a special character
                        </p>
                    </div>

                    <!-- Confirm password -->
                    <div>
                        <label for="confirmPassword" class="text-gray-500">Confirm Password</label>
                        <input
                            type="text"
                            id="confirmPassword"
                            v-model="resetPasswordData.confirmPassword"
                            required
                            class="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 my-1
                                   focus:outline-none focus:border-blue-500 transition"
                        />
                        <p class="text-red-500 text-sm h-5" :class="{ 'invisible': !confirmPasswordError }">
                            Passwords must match
                        </p>
                    </div>
                </div>

                <!-- Submit buttons -->
                <div class="flex flex-row justify-end mt-2">
                    <button
                        v-if="displaySection === 'firstPart'"
                        type="button"
                        @click="sendResetOTP"
                        :disabled="resetPasswordData.email === ''"
                        class="bg-blue-600 text-white px-12 py-2 rounded-md
                               hover:bg-blue-700 hover:shadow-sm
                               disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>

                    <button
                        v-if="displaySection === 'secondPart'"
                        @click="handleResetVerification"
                        type="button"
                        :disabled="otp.length !== 6 || resetPasswordData.password === '' || resetPasswordData.confirmPassword === ''
                                   || passwordError || emailError || confirmPasswordError"
                        class="bg-blue-600 text-white px-12 py-2 rounded-md
                               hover:bg-blue-700 hover:shadow-sm
                               disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        Reset Password
                    </button>
                </div>

            </form>

            <!-- Log in link -->
            <div class="mt-9 w-full flex flex-row justify-center gap-2">
                <span>Already have an account?</span>
                <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700">Log In</NuxtLink>
            </div>

        </div>
    </div>
</template>