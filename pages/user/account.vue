<script setup lang="ts">
    import { ref } from 'vue'

    interface User {
        name: string
        password: string
        email: string
        phone: string
        address: string
    }

    //replace later with API
    const user = ref<User>({
    name: 'Sworup Karki',
    password: '',
    email: 'sworup@example.com',
    phone: '+977-9812345678',
    address: 'Kalimati, Kathmandu'
    })

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

    const confirmChanges = () => {
        console.log('Confirmed user data:', user.value)
        uiState.value = 'noChange'
        user.value.password = ''
    }

    definePageMeta({
        layout: 'user-no-cart'
    })
</script>


<template>
    <div class="min-h-[99%] bg-[url(/images/foodDoodle.png)] bg-cover bg-center bg-no-repeat">
        <div class="flex flex-col gap-4 lg:flex-row">
            <div class="max-w-2xl flex-1 h-auto p-6 bg-white shadow-md rounded-lg">
                <form @submit.prevent="saveChanges" class="space-y-4">
                    <div class="flex justify-between mb-8 gap-10">
                    <h2 class="text-2xl font-semibold">My Account</h2>
                        <div class="flex gap-3">
                            <button
                                v-if="uiState === 'editing'"
                                @click="cancelEdit"
                                type="button"
                                class="px-8 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition">
                                Cancel
                            </button>
                            <button
                                v-if="uiState === 'noChange'"
                                @click="startEdit"
                                type="button"
                                class="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                Edit
                            </button>
                            <button
                                v-if="uiState === 'editing'"
                                type="submit"
                                class="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
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
                        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                        type="text"
                        v-model="user.name"
                        :readonly="uiState === 'noChange' || uiState === 'confirmation'"
                        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <!-- Phone -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                        type="text"
                        v-model="user.phone"
                        :readonly="uiState === 'noChange' || uiState === 'confirmation'"
                        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <!-- Address -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                        v-model="user.address"
                        :readonly="uiState === 'noChange' || uiState === 'confirmation'"
                        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                </form>
            </div>
            
            <div v-if="uiState === 'confirmation'" class="flex flex-col justify-between max-w-xl h-auto p-6 bg-white shadow-md rounded-lg">
                <div>
                    <div class="flex justify-between mb-8 gap-10">
                        <h2 class="text-2xl font-semibold">Enter Password</h2>
                        <button
                            @click="confirmChanges"
                            class="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
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
                            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </form>
                </div>
                <button
                    @click="cancelEdit"
                    type="button"
                    class="px-8 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>