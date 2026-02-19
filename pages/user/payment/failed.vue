<script>
    definePageMeta({
        layout: 'user-no-cart'
    })
</script>

<template>
    <div class="h-full w-full flex justify-center items-center px-4">
        <div class="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">
        
            <span class="material-symbols-outlined text-red-600 text-6xl mb-4 block">cancel</span>

            <h2 class="text-base lg:text-2xl font-semibold text-gray-800 mb-1">Payment Unsuccessful</h2>
            <p class="text-xs lg:text-base text-gray-500 mb-6">Sorry For the Inconvenience</p>

            <div class="border rounded-xl divide-y text-sm mb-6">
                    <div class="flex justify-between px-1 lg:px-4 py-3">
                        <span class="text-xs lg:text-base text-gray-600">If Payment has been Credited</span>
                        <span class="text-xs lg:text-base font-medium text-gray-800">Contact Us</span>
                    </div>
                    <div class="flex justify-between px-1 lg:px-4 py-3">
                        <span class="text-xs lg:text-base text-gray-600">If Payment is not credited</span>
                        <span class="text-xs lg:text-base font-medium text-gray-800">Contact ESEWA</span>
                    </div>
            </div>

            <NuxtLink to="/user/home" class="nav-link">
                <button class="w-full bg-green-600 hover:bg-green-700 text-white text-xs lg:text-base py-3 px-1 lg:px-4 rounded-xl font-medium transition duration-200">
                    Return to Homepage
                </button>
            </NuxtLink> 
            
        </div>
    </div>
</template>