<script setup lang="ts">
    import { useToast } from '#imports';
    import LocationSelector from '~/components/user/LocationSelector.vue';
    const {signup, verifySignup} = useAuth();

    const signUpFormData=ref<signUpData>({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phoneNo: "",
        address: '',
        termsAndCond: false
    })

    const otp=ref<string>('')
    const passwordError = ref<boolean>(false);
    const confirmPasswordError = ref<boolean>(false);
    const emailError= ref<boolean>(false);
    const phoneNoError = ref<boolean>(false);
    const displaySection = ref<'firstPart'|'secondPart'>('firstPart');
    const totalSeconds = ref<number>(5*60);
    let timer: NodeJS.Timeout|null = null;
    const displayMap = ref<boolean>(false);
    
    watch(()=>signUpFormData.value.password, (value)=>{
        const regexExp = /^(?=.*[A-Z])(?=.*[\W_]).+$/;
        passwordError.value=!regexExp.test(value);
    })

    watch(()=>signUpFormData.value.email, (value)=>{
        const regexExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        emailError.value=!regexExp.test(value);
    })

    watch(()=>signUpFormData.value.confirmPassword, (value)=>{
        if(signUpFormData.value.password===value) confirmPasswordError.value=false
        else confirmPasswordError.value=true;
    })

    watch(()=>signUpFormData.value.phoneNo, (value)=>{
        if(value!==null){
            const regexExp = /^\d{10}$/;
            phoneNoError.value=!regexExp.test(value.toString());
        }else{
            phoneNoError.value=false
        }
    })

    //handlers for location selector
    const handleLocationConfirm = (location: [number, number]) => {
        signUpFormData.value.address = `${location[0].toFixed(6)}, ${location[1].toFixed(6)}`
        displayMap.value = false
    }

    const handleMapClose = () => {
        displayMap.value = false
    }

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

    const handleSignup = async()=>{
        //api call for signup
        const isSignedUp = await signup(signUpFormData.value);
        if(isSignedUp) displaySection.value='secondPart';
        //start timer after OTP sent to user
        startClock();
    }

    const handleSignupVerification = () =>{
        //api call to verify otp
        verifySignup(signUpFormData.value, otp.value);
    }

    const handleResend = () =>{
        //send signup details to the api endpoint for otp resend and otp reassign
        handleSignup();
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
        <div class="w-[60%] h-full hidden 
                    bg-[url(/images/loginBG.jpg)] bg-cover bg-center bg-no-repeat
                    lg:block">
        </div>

        <div class="w-[100%] h-full bg-gray-100 p-4 sm:p-6 md:p-8
                    lg:w-[40%]">
            <!--Top Logo in signup-->
            <div class="flex flex-row gap-2">
                <span class="material-symbols-outlined text-5xl sm:text-6xl text-blue-600 flex-shrink-0">storefront</span>
                <p class="text-base sm:text-lg font-semibold text-gray-800">
                    THE <br> RESTAURANT
                </p>
            </div>

            <!--Create Account Message-->
            <div class="my-3 sm:my-4 space-y-1">
                <h1 class="font-bold text-2xl sm:text-3xl md:text-4xl">Create Account</h1>
                <p class="text-sm sm:text-base text-gray-500">Create a New Account</p>
            </div>

            <!--Input Form-->
            <form class="pt-2 px-2 sm:px-4 max-h-[60%] overflow-y-auto" @submit.prevent="handleSignup">

                <div v-if="displaySection==='firstPart'">
                    
                    <!-- OTP notice -->
                    <div class="bg-red-50 border border-red-200 rounded-md px-3 py-2 sm:px-4 sm:py-3 space-y-1 mb-4 sm:mb-6">
                        <p class="text-red-700 text-xs sm:text-sm font-medium">All fields are compulsary.</p>
                    </div>

                    <!--Email-->
                    <div class="mb-1">
                        <label for="username" class="text-sm sm:text-base text-gray-500">Email Address</label>
                        <input type="mail" placeholder="example@gmail.com" id="username" v-model="signUpFormData.email" required
                            class="w-full px-3 py-2 sm:px-4 rounded-md border-gray-300 bg-white text-gray-800 border my-2 text-sm sm:text-base
                                    focus:outline-none focus:border-blue-500
                                    transition"
                        />
                        <p class="text-red-500 text-xs sm:text-sm h-5" :class="{ 'invisible': !emailError }">
                            Email must be in the correct format
                        </p>
                    </div>
                    <!--password-->
                    <div class="mb-1">
                        <label for="password" class="text-sm sm:text-base text-gray-500">Password</label>
                        <input type="text" id="password" v-model="signUpFormData.password" required
                            class="w-full px-3 py-2 sm:px-4 rounded-md border-gray-300 bg-white text-gray-800 border my-2 text-sm sm:text-base
                                    focus:outline-none focus:border-blue-500
                                    transition"
                        />
                        <p class="text-red-500 text-xs sm:text-sm" :class="{ 'invisible': !passwordError }">
                            Password must include a capital letter and a special character
                        </p>
                    </div>
                    <!--Verify Password-->
                    <div class="mb-1">
                        <label for="confirmPassword" class="text-sm sm:text-base text-gray-500">Confirm Password</label>
                            <input type="text" id="confirmPassword" v-model="signUpFormData.confirmPassword" required
                                class="w-full px-3 py-2 sm:px-4 rounded-md border-gray-300 bg-white text-gray-800 border my-2 text-sm sm:text-base
                                        focus:outline-none focus:border-blue-500
                                        transition"
                            />
                        <p class="text-red-500 text-xs sm:text-sm" :class="{ 'invisible': !confirmPasswordError}">Passwords Must Match</p>
                    </div>

                    <!--Name-->
                    <div class="mb-4 sm:mb-6">
                        <label for="fullName" class="text-sm sm:text-base text-gray-500">Full Name</label>
                        <input type="mail" id="fullName" placeholder="Enter Full Name" v-model="signUpFormData.name" required
                            class="w-full px-3 py-2 sm:px-4 rounded-md border-gray-300 bg-white text-gray-800 border my-2 text-sm sm:text-base
                                    focus:outline-none focus:border-blue-500
                                    transition"
                        />
                        <Placeholder></Placeholder>
                    </div>

                    <!--address-->
                    <div class="mb-4 sm:mb-6">
                        <label for="address" class="text-sm sm:text-base text-gray-500">Location</label>
                        <input 
                            type="text" 
                            id="address" 
                            v-model="signUpFormData.address"
                            placeholder="Click to select location on map"
                            required
                            readonly
                            @click="displayMap=true"
                            class="w-full px-3 py-2 sm:px-4 pr-10 rounded-md border-gray-300 bg-white text-gray-800 border my-2 text-sm sm:text-base cursor-pointer
                                    focus:outline-none focus:border-blue-500
                                    transition"
                        />
                    </div>

                    <!--Phone No-->
                    <div class="mb-4 sm:mb-6">
                        <label for="confirmPassword" class="text-sm sm:text-base text-gray-500">Phone Number</label>
                            <input type="text" id="confirmPassword" placeholder="98XXXXXXXX" v-model="signUpFormData.phoneNo" required
                                class="w-full px-3 py-2 sm:px-4 rounded-md border-gray-300 bg-white text-gray-800 border my-2 text-sm sm:text-base
                                        focus:outline-none focus:border-blue-500
                                        transition"
                            />
                            <p class="text-red-500 text-xs sm:text-sm" v-show="phoneNoError">Number must be of ten digits</p>
                    </div>
                    
                    <!--T&C-->
                    <div class="flex flex-row space-x-2 items-center text-gray-500 mb-3 sm:mb-4">
                        <input type="checkbox" class="w-4 h-4" v-model="signUpFormData.termsAndCond">
                        <span class="ml-2 text-xs sm:text-sm">Agree To Our Terms and Conditions</span>
                    </div>

                </div>

                <div v-if="displaySection==='secondPart'">
                
                    <!-- OTP notice -->
                    <div class="bg-red-50 border border-red-200 rounded-md px-3 py-2 sm:px-4 sm:py-3 space-y-1 mb-6 sm:mb-8">
                        <p class="text-red-700 text-xs sm:text-sm font-medium">An OTP has been sent to your email. It is valid for 30 minutes.</p>
                        <p class="text-gray-500 text-xs">Remember to check your spam folder.</p>
                    </div>

                    <label class="text-sm sm:text-base text-gray-500">Enter 6 Digit OTP Code</label>
                    <div class="flex flex-row justify-between items-center align-middle mb-3 sm:mb-4 mt-3 sm:mt-4 gap-2 sm:gap-4">
                        <input
                            type="text"
                            maxlength="6"
                            v-model="otp"
                            placeholder=". . . . . ."
                            inputmode="numeric"
                            class="w-full px-3 py-2 sm:px-4 text-center tracking-widest text-base sm:text-lg
                                rounded-md border border-gray-300 bg-white my-2
                                focus:outline-none focus:border-blue-500"
                        />
                        <button type="button" class="bg-blue-600 px-3 py-2 sm:px-4 rounded-md text-white flex flex-row gap-2 text-sm sm:text-base
                            disabled:bg-blue-400 disabled:cursor-not-allowed
                            hover:bg-blue-700 hover:shadow-sm"
                            @click="handleResend"    
                            :disabled="totalSeconds>0"
                        >
                            <span class="material-symbols-outlined text-lg sm:text-xl">cached</span>
                            Resend
                        </button>
                    </div>
                    <div class="mb-12 sm:mb-16">
                        <p class="text-xs sm:text-sm">You can resend OTP again in <span class="text-red-700">{{formattedTime}}</span> seconds</p>
                    </div>
                </div>


                <div class="flex flex-row justify-end">  
                    <button type="submit" v-if="displaySection==='firstPart'"
                    :disabled="signUpFormData.email===''||signUpFormData.password===''||signUpFormData.confirmPassword===''
                    ||passwordError||emailError||confirmPasswordError||phoneNoError||!signUpFormData.termsAndCond"
                    class="border bg-blue-600 text-white px-8 py-2 sm:px-12 block rounded-md text-sm sm:text-base
                    hover:bg-blue-700 hover:shadow-sm
                    disabled:bg-blue-400 disabled:cursor-not-allowed
                    ">Next</button>

                    <button type="button" 
                    :disabled="otp.length!==6" 
                    v-if="displaySection==='secondPart'"
                    @click="handleSignupVerification"
                    class="border bg-blue-600 text-white px-8 py-2 sm:px-12 block rounded-md text-sm sm:text-base
                    hover:bg-blue-700 hover:shadow-sm
                    disabled:bg-blue-400 disabled:cursor-not-allowed
                    ">Sign Up</button>
                </div>

            </form>

            <!--Sign Up info-->
            <div class="mt-6 sm:mt-9 space-x-2 w-full flex flex-row justify-center text-sm sm:text-base">
                <span>Already have an account?</span>
                <button class="text-blue-600">
                    <NuxtLink to="/login">Log In</NuxtLink>
                </button>
            </div>
        </div>
    </div>

    <LocationSelector
        :is-open="displayMap"
        @close="handleMapClose"
        @confirm="handleLocationConfirm"
    />

</template>