<script setup lang="ts">

    import { VueDatePicker } from '@vuepic/vue-datepicker'
    import SalesChart from '@/components/admin/SalesChart.vue'
    import '@vuepic/vue-datepicker/dist/main.css'
    import {subMonths } from 'date-fns';

    const date = ref(new Date());
    const displayDate = computed(() => {
        if (!date.value) return ''
        const year = date.value.getFullYear()
        const month = (date.value.getMonth() + 1).toString().padStart(2, '0')
        const day = date.value.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    })
    const minDate=subMonths(new Date(), 1);

    interface totalSalesData {
        totalRevenue: number,

    }

    definePageMeta({
        layout: 'admin'
    })
</script>
<template>
    <div class="flex min-h-screen">
        <main class="flex-1 xl:mr-80">

            <!--Title and date picker(phone)-->
            <div class="flex flex-row justify-between">
                <h1 class="text-md lg:text-2xl font-bold mb-6 shrink-0">Sales Overview {{displayDate}}</h1>
                <div class="flex-1 max-w-52 xl:hidden">
                    <VueDatePicker v-model="date"
                            :time-config="{ enableTimePicker: false }"
                            :min-date="minDate"
                            :max-date="new Date()"
                            prevent-min-max-navigation
                        />
                </div>
            </div>

            <div>
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <!--each card-->
                    <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                        <div class="flex flex-row justify-between items-center">
                            <span class="text-sm sm:text-base font-medium text-gray-600">Total Revenue</span>
                            <span class="material-symbols-outlined text-3xl sm:text-4xl">Attach_money</span>
                        </div>
                        <p class="text-3xl sm:text-4xl lg:text-5xl font-bold">22.22K</p>
                    </div>
                    <!--each card-->
                    <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                        <div class="flex flex-row justify-between items-center">
                            <span class="text-sm sm:text-base font-medium text-gray-600">Total Items</span>
                            <span class="material-symbols-outlined text-3xl sm:text-4xl">Fastfood</span>
                        </div>
                        <p class="text-3xl sm:text-4xl lg:text-5xl font-bold">2</p>
                    </div>
                    <!--each card-->
                    <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                        <div class="flex flex-row justify-between items-center">
                            <span class="ctext-sm sm:text-base font-medium text-gray-600">Total Customers</span>
                            <span class="material-symbols-outlined text-3xl sm:text-4xl">Person</span>
                        </div>
                        <p class="text-3xl sm:text-4xl lg:text-5xl font-bold">2</p>
                    </div>
                </div>
                <SalesChart/>
            </div>
        </main>
        
        <!--Date Selector-->
        <aside class="w-80 lg:w-70 bg-white border-l border-gray-200 p-4 fixed top-0 right-0 h-screen overflow-y-auto
                hidden xl:block">
            <h2 class="text-lg font-semibold mb-4 pl-4">Select Date</h2>
            <div class="flex justify-center">
                <div class="w-max">
                    <VueDatePicker v-model="date"
                        :time-config="{ enableTimePicker: false }"
                        :min-date="minDate"
                        :max-date="new Date()"
                        prevent-min-max-navigation
                        inline auto-apply
                    />
                </div>
            </div>
            <p class="text-red-500 p-4">* Sales Data is only available for the last 30 days</p>
        </aside>
    </div>
</template>