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

    const editable = ref(false)
    const enterPasswordView = ref(false);
    const toggleEdit = () => {
        editable.value = !editable.value
    }

    const toggleSave = () => {
        editable.value = !editable.value
    }

    const saveChanges = () => {
        editable.value = false
        console.log('Saved user data:', user.value)
    }

    definePageMeta({
        layout: 'user-no-cart'
    })
</script>


<template>
    <div class="min-h-[99%] bg-[url(/images/foodDoodle.png)] bg-cover bg-center bg-no-repeat">
        <div class="flex flex-col gap-4 lg:flex-row">
            <div class="max-w-2xl flex-1 h-auto p-6 bg-white shadow-md rounded-lg">
                <form @submit="saveChanges" class="space-y-4">
                    <div class="flex justify-between mb-8 gap-10">
                    <h2 class="text-2xl font-semibold">My Account</h2>
                        <button
                            @click="!editable?toggleEdit:toggleSave"
                            :type="!editable?'button':'submit'"
                            class="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            {{ editable ? 'Save' : 'Edit' }}
                        </button>
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
                        :readonly="!editable"
                        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <!-- Phone -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                        type="text"
                        v-model="user.phone"
                        :readonly="!editable"
                        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <!-- Address -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                        v-model="user.address"
                        :readonly="!editable"
                        class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                </form>
            </div>
            
            <div class="max-w-xl h-auto p-6 bg-white shadow-md rounded-lg">
                <div class="flex justify-between mb-8 gap-10">
                    <h2 class="text-2xl font-semibold">Enter Password</h2>
                    <button class="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Confirm</button>
                </div>
                <form @submit.prevent="saveChanges" class="space-y-4">
                    <!-- Email -->
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
        </div>
    </div>
</template>


