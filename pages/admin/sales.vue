<script setup lang="ts">

    import { VueDatePicker } from '@vuepic/vue-datepicker'
    import SalesChart from '@/components/admin/SalesChart.vue'
    import '@vuepic/vue-datepicker/dist/main.css'
    import {subMonths } from 'date-fns';
    import { useToast } from '#imports'
    const toast = useToast();
    const loading = useLoadingScreen();

    const date = ref(new Date());
    const displayDate = computed(() => {
        if (!date.value) return ''
        const year = date.value.getFullYear()
        const month = (date.value.getMonth() + 1).toString().padStart(2, '0')
        const day = date.value.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    })
    //---------------------API CALL FOR CHART DETAILS--------------------//

    const {data, error, pending} = useFetch(()=>`/api/admin/sales?date=${displayDate.value}`, {
        method: 'GET',
        watch: [displayDate]
    })

    watch(pending, (isLoading)=>{
        loading.value = isLoading
    })

    const hourlyRevenue = computed(() => {
        return data.value?.success && typeof(data.value.message) !== 'string'
            ? data.value.message.hourlyRevenue
            : Array(24).fill(0)
    })

    const hourlyCustomers = computed(() => {
        return data.value?.success && typeof(data.value.message) !== 'string'
            ? data.value.message.hourlyCustomers
            : Array(24).fill(0)
    })

     const hourlyTotalItems = computed(() => {
        return data.value?.success && typeof(data.value.message) !== 'string'
            ? data.value.message.hourlyTotalItems
            : Array(24).fill(0)
    })

    const totalRevenue = computed(()=>{
        return hourlyRevenue.value.reduce((sum, item)=>{
            return sum+item;
        })
    })

    const totalItems = computed(()=>{
        return hourlyTotalItems.value.reduce((sum, item)=>{
            return sum+item;
        })
    })

    const totalCustomers = computed(()=>{
        return hourlyCustomers.value.reduce((sum, item)=>{
            return sum+item;
        })
    })
    


    // Handle errors with a watcher
    watch(error, (newError) => {
        if (newError) {
            toast.error({title: 'SERVER ERROR', message: newError.data.message});
        }
    })
  //-------------------------------------------------------------------//

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
            <div class="flex flex-row justify-between items-center mb-4 gap-2">
                <div class="flex flex-col md:flex-row md:space-x-6">
                    <span class="text-sm sm:text-lg lg:text-2xl font-bold shrink-0">{{displayDate}}</span>
                    <span class="text-sm sm:text-lg lg:text-2xl font-bold shrink-0">Sales Overview </span>
                </div>
                <div class="flex-1 max-w-44 xl:hidden">
                    <ClientOnly>
                        <VueDatePicker v-model="date"
                                :time-config="{ enableTimePicker: false }"
                                :min-date="minDate"
                                :max-date="new Date()"
                                prevent-min-max-navigation
                            />
                    </ClientOnly>
                </div>
            </div>

            <div>
                <div class="grid grid-cols-1 gap-2 md:gap-5 sm:grid-cols-3">
                    <!--each card-->
                    <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-1 md:gap-4">
                        <div class="flex flex-row justify-between items-center">
                            <span class="text-sm sm:text-base font-medium text-gray-600">Total Revenue</span>
                            <span class="material-symbols-outlined text-3xl sm:text-4xl">Attach_money</span>
                        </div>
                        <p class="text-3xl sm:text-4xl lg:text-5xl font-bold">{{totalRevenue}}</p>
                    </div>
                    <!--each card-->
                    <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-1 md:gap-4">
                        <div class="flex flex-row justify-between items-center">
                            <span class="text-sm sm:text-base font-medium text-gray-600">Total Items</span>
                            <span class="material-symbols-outlined text-3xl sm:text-4xl">Fastfood</span>
                        </div>
                        <p class="text-3xl sm:text-4xl lg:text-5xl font-bold">{{totalItems}}</p>
                    </div>
                    <!--each card-->
                    <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-1 md:gap-4">
                        <div class="flex flex-row justify-between items-center">
                            <span class="ctext-sm sm:text-base font-medium text-gray-600">Total Customers</span>
                            <span class="material-symbols-outlined text-3xl sm:text-4xl">Person</span>
                        </div>
                        <p class="text-3xl sm:text-4xl lg:text-5xl font-bold">{{totalCustomers}}</p>
                    </div>
                </div>
                <SalesChart :hourlyRevenue :hourlyCustomers :key="displayDate"/>
            </div>
        </main>
        
        <!--Date Selector-->
        <aside class="w-80 lg:w-70 bg-white border-l border-gray-200 p-4 fixed top-0 right-0 h-screen overflow-y-auto
                hidden xl:block">
            <h2 class="text-lg font-semibold mb-4 pl-4">Select Date</h2>
            <div class="flex justify-center">
                <div class="w-max">
                    <ClientOnly>
                        <VueDatePicker v-model="date"
                            :time-config="{ enableTimePicker: false }"
                            :min-date="minDate"
                            :max-date="new Date()"
                            prevent-min-max-navigation
                            inline auto-apply
                        />
                    </ClientOnly>
                </div>
            </div>
            <p class="text-red-500 p-4">* Select a date to view sales data of selected date</p>
        </aside>
    </div>
</template>