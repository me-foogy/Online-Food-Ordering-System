<script setup lang="ts">
    import { ref } from 'vue'
    import LocationSelector from '~/components/user/LocationSelector.vue';
    const toast = useToast();
    const loading = useLoadingScreen();
    const {parseAddress} = useLocation();

    const cookieUser = useCookie<Omit<loginReturnMessageType, 'id'>|null>('auth_user');
    type User = Omit<loginReturnMessageType,'role'> & {password: string};
    const displayMap = ref<boolean>(false);

    const user = ref<User>({
    name: cookieUser.value?.name ?? '',
    password: '',
    email: cookieUser.value?.email ?? '',
    phoneNo: cookieUser.value?.phoneNo??'',
    address:  cookieUser.value?.address ?? ''
    })

    //handlers for location selector
    const handleLocationConfirm = (location: [number, number]) => {
        user.value.address = `${location[0].toFixed(6)}, ${location[1].toFixed(6)}`
        displayMap.value = false
    }

    const handleMapClose = () => {
        displayMap.value = false
    }

    //---------------------------API CALL FOR USER DETAILS CHANGE------------------//

    const confirmChanges = async() => {
        loading.value=true;
        try{
            const res = await $fetch<defaultApiType<loginReturnMessageType[]>>('/api/user/edit_details',{
                method:'PATCH',
                body: user.value,
                onRequest(){
                    loading.value = true;
                },
                onResponse(){
                    loading.value = false;
                },
                onResponseError(){
                    loading.value=false;
                }
            });

            if(!res.success && typeof(res.message)=='string'){
                toast.error({title: 'Failed', message: res.message})
            }

            if(res.success && typeof(res.message)!=='string'){
                toast.success({title:'SUCCESS', message: 'User Info Changed'});
                console.log(res.message)
                cookieUser.value=res.message[0]!
            }
        }catch(err: any){
            toast.error({title: 'Error', message: err.message as string})
        }finally{
            loading.value=false;
        }

        uiState.value = 'noChange'
        user.value.password = ''
    }
    //-----------------------------------------------------------------------------//

    const originalUser = ref<User>({ ...user.value })

    type UIState = 'noChange' | 'editing' | 'confirmation'
    const uiState = ref<UIState>('noChange')

    const startEdit = () => {
        originalUser.value = { ...user.value }
        uiState.value = 'editing'
    }

    const cancelEdit = () => {
        user.value = { ...originalUser.value }
        uiState.value = 'noChange'
    }

    const saveChanges = () => {
        uiState.value = 'confirmation'
        user.value.password = ''
    }

    definePageMeta({
        layout: 'user-no-cart'
    })
</script>


<template>
    <div class="min-h-[95dvh] bg-[url(/images/foodDoodle.png)] bg-cover bg-center bg-no-repeat p-4 sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row max-w-7xl mx-auto">
            
            <!-- Account Form -->
            <div class="w-full lg:max-w-2xl flex-1 h-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
                <form @submit.prevent="saveChanges" class="space-y-4">
                    <div class="flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 gap-4 sm:gap-10">
                        <h2 class="text-xl sm:text-2xl font-semibold">My Account</h2>
                        <div class="flex gap-3">
                            <button
                                v-show="uiState === 'editing'"
                                @click="cancelEdit"
                                type="button"
                                class="flex-1 sm:flex-none px-6 sm:px-8 py-2 max-h-10 bg-red-500 text-white rounded-md hover:bg-red-700 transition text-sm sm:text-base">
                                Cancel
                            </button>
                            <button
                                v-show="uiState === 'noChange'"
                                @click="startEdit"
                                type="button"
                                class="flex-1 sm:flex-none px-6 sm:px-8 py-2 max-h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base">
                                Edit
                            </button>
                            <button
                                v-show="uiState === 'editing'"
                                type="submit"
                                class="flex-1 sm:flex-none px-6 sm:px-8 py-2 max-h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base">
                                Save
                            </button>
                        </div>
                    </div>
                    
                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            v-model="user.email"
                            :readonly="true"
                            class="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
                        />
                    </div>
                    
                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            v-model="user.name"
                            :readonly="uiState === 'noChange' || uiState === 'confirmation'"
                            :class="uiState === 'editing' ? 'cursor-pointer' : 'cursor-not-allowed'"
                            class="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <!-- Phone -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            v-model="user.phoneNo"
                            :readonly="uiState === 'noChange' || uiState === 'confirmation'"
                            :class="uiState === 'editing' ? 'cursor-pointer' : 'cursor-not-allowed'"
                            class="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <!-- Address -->
                    <div>
                        <label for="address" class="text-gray-700">Location</label>
                        <input 
                            type="text" 
                            id="address" 
                            v-model="user.address"
                            placeholder="Click to select location on map"
                            required
                            readonly
                            @click="uiState === 'editing' ? displayMap = true : null"
                            :class="uiState === 'editing' ? 'cursor-pointer' : 'cursor-not-allowed'"
                            class="w-full px-4 py-2 pr-10 rounded-md border-gray-300 bg-white text-gray-800 border my-2
                                    focus:outline-none focus:border-blue-500
                                    transition"
                        />
                    </div>
                </form>
            </div>
            
            <!-- Password Confirmation -->
            <div v-if="uiState === 'confirmation'" class="w-full lg:max-w-xl flex flex-col space-y-4 justify-between h-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
                <div>
                    <div class="flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 gap-4 sm:gap-10">
                        <h2 class="text-xl sm:text-2xl font-semibold">Enter Password</h2>
                        <button
                            @click="confirmChanges"
                            class="w-full sm:w-auto px-6 sm:px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base">
                            Confirm
                        </button>
                    </div>
                    <form @submit.prevent="confirmChanges" class="space-y-4">
                        <!-- Password -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                v-model="user.password"
                                class="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </form>
                </div>
                <button
                    @click="cancelEdit"
                    type="button"
                    class="w-full px-6 sm:px-8 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition text-sm sm:text-base">
                    Cancel
                </button>
            </div>
        </div>
    </div>

    <LocationSelector
        :is-open="displayMap"
        :current-location="parseAddress(user.address)"
        @close="handleMapClose"
        @confirm="handleLocationConfirm"
    />
</template>