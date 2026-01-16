<script setup lang="ts">

    interface signUpFormData {
        email: string
        password: string
        confirmPassword: string
        name: string
        phoneNo: number | null
        address: string
        termsAndCond: boolean
    }

    const signUpFormData=ref<signUpFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phoneNo: null,
        address: '',
        termsAndCond: false
    })

    const handleSignUpSubmit = async ()=>{
        console.log(signUpFormData);
        await navigateTo('/login');
    }

    const passwordError = ref<boolean>(false);
    const confirmPasswordError = ref<boolean>(false);
    const emailError= ref<boolean>(false);
    const phoneNoError = ref<boolean>(false);
    const displaySection = ref<'firstPart'|'secondPart'>('firstPart')
    
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
                <h1 class="font-bold text-4xl">Create Account</h1>
                <p class="text-gray-500">Create a New Account</p>
            </div>

            <!--Input Form-->
            <form class="pt-2" @submit.prevent="handleSignUpSubmit">

                <div v-if="displaySection==='firstPart'">
                    <!--Email-->
                    <div class="mb-2">
                        <label for="username" class="text-gray-500">Email Address</label>
                        <input type="mail" placeholder="example@gmail.com" id="username" v-model="signUpFormData.email" required
                            class="w-full px-4 py-2 rounded-md border-gray-300 bg-white text-gray-800 border my-2
                                    focus:outline-none focus:border-blue-500
                                    transition"
                        />
                        <P class="text-red-500" v-show="emailError">Email must be in the in correct format</P>
                    </div>
                    <!--password-->
                    <div class="mb-2">
                        <label for="password" class="text-gray-500">Password</label>
                            <input type="text" id="password" v-model="signUpFormData.password" required
                                class="w-full px-4 py-2 rounded-md border-gray-300 bg-white text-gray-800 border my-2
                                        focus:outline-none focus:border-blue-500
                                        transition"
                            />
                        <P class="text-red-500" v-show="passwordError">Password must include a capital letter and a special character</P>
                    </div>
                    <!--Verify Password-->
                    <div class="mb-6">
                        <label for="confirmPassword" class="text-gray-500">Confirm Password</label>
                            <input type="text" id="confirmPassword" v-model="signUpFormData.confirmPassword" required
                                class="w-full px-4 py-2 rounded-md border-gray-300 bg-white text-gray-800 border my-2
                                        focus:outline-none focus:border-blue-500
                                        transition"
                            />
                        <P class="text-red-500" v-show="confirmPasswordError">Passwords Must Match</P>
                    </div>
                </div>

                <div v-if="displaySection==='secondPart'">
                    <!--Name-->
                    <div class="mb-2">
                        <label for="fullName" class="text-gray-500">Full Name</label>
                        <input type="mail" id="fullName" placeholder="Enter Full Name" v-model="signUpFormData.name" required
                            class="w-full px-4 py-2 rounded-md border-gray-300 bg-white text-gray-800 border my-2
                                    focus:outline-none focus:border-blue-500
                                    transition"
                        />
                    </div>
                    <!--address-->
                    <div class="mb-2">
                        <label for="address" class="text-gray-500">Address</label>
                            <input type="text" id="address" placeholder="Enter Full Address" v-model="signUpFormData.address" required
                                class="w-full px-4 py-2 rounded-md border-gray-300 bg-white text-gray-800 border my-2
                                        focus:outline-none focus:border-blue-500
                                        transition"
                            />
                    </div>
                    <!--Phone No-->
                    <div class="mb-6">
                        <label for="confirmPassword" class="text-gray-500">Phone Number</label>
                            <input type="number" id="confirmPassword" placeholder="98XXXXXXXX" v-model="signUpFormData.phoneNo" required
                                class="w-full px-4 py-2 rounded-md border-gray-300 bg-white text-gray-800 border my-2
                                        focus:outline-none focus:border-blue-500
                                        transition"
                            />
                            <P class="text-red-500" v-show="phoneNoError">Number must be of ten digits</P>
                    </div>
                    
                    <!--T&C-->
                    <div class="flex flex-row space-x-2 items-center text-gray-500 mb-4">
                        <input type="checkbox" class="w-4 h-4" v-model="signUpFormData.termsAndCond">
                        <span class="ml-2">Agree To Our Terms and Conditions</span>
                    </div>
                </div>


                <div class="flex flex-row justify-between">
                    <button type="button" :disabled="displaySection==='firstPart'" @click="()=>displaySection='firstPart'"
                    class="border bg-blue-600 text-white px-12 py-2 block rounded-md
                    hover:bg-blue-700 hover:shadow-sm
                    disabled:bg-blue-400
                    ">Previous</button>
                    
                    <button type="button" v-if="displaySection==='firstPart'" @click="()=>displaySection='secondPart'"
                    :disabled="signUpFormData.email===''||signUpFormData.password===''||signUpFormData.confirmPassword===''"
                    class="border bg-blue-600 text-white px-12 py-2 block rounded-md
                    hover:bg-blue-700 hover:shadow-sm
                    disabled:bg-blue-400
                    ">Next</button>

                    <button type="submit" :disabled="passwordError||emailError||confirmPasswordError||!signUpFormData.termsAndCond" v-if="displaySection==='secondPart'"
                    class="border bg-blue-600 text-white px-12 py-2 block rounded-md
                    hover:bg-blue-700 hover:shadow-sm
                    disabled:bg-blue-400
                    ">Sign Up</button>
                </div>

            </form>

            <!--Sign Up info-->
            <div class="mt-10 space-x-2 w-full flex flex-row justify-center">
                <span>Already have an account?</span>
                <button class="text-blue-600">
                    <NuxtLink to="/login">Log In</NuxtLink>
                </button>
            </div>
        </div>
    </div>
</template>