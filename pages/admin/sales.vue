<script setup lang="ts">
    import Admin from '~/layouts/admin.vue';

    interface totalSalesData {
        totalRevenue: number,

    }

    definePageMeta({
        layout: 'admin'
    })
</script>
<template>
    <h1>Sales Overview</h1>
    <div>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3"> 

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="text-sm sm:text-base font-medium text-gray-600">Total Revenue</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Fastfood</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold">22.22K</p>
            </div>

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="text-sm sm:text-base font-medium text-gray-600">Total Orders</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Cached</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold">2</p>
            </div>

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="ctext-sm sm:text-base font-medium text-gray-600">Completed Orders</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Beenhere</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold">2</p>
            </div>
        </div>

        <SalesChart/>
    </div>
</template>