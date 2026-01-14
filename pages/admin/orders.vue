<script setup lang="ts">

    // Total number of orders
    const totalOrders = computed(() => orders.value.length)

    // Orders In Progress
    const orderInProgress = computed(() =>
    orders.value.filter(order => order.orderProgress === 'inProgress').length
    )

    // Completed Orders
    const completedOrders = computed(() =>
    orders.value.filter(order => order.orderProgress === 'completed').length
    )

    //static data
    const orders = ref([
        {
            customerName: 'sworup',
            totalItems: 4,
            totalAmount: 760,
            location: 'Kalimati, Kathmandu',
            order: [
                {
                    itemName: 'chicken Momo',
                    itemCategory: 'lunch',
                    itemQuantity: 2,
                    eachItemPrice: 200
                },
                {
                    itemName: 'chicken Chowmein',
                    itemCategory: 'lunch',
                    itemQuantity: 2,
                    eachItemPrice: 180
                }
            ],
            customerNotes: `nothing of note`,
            orderProgress: 'notStarted' as orderProgressType
        },
        {
            customerName: 'sworup',
            totalItems: 4,
            totalAmount: 760,
            location: 'Pepsicola 13, Bhaktapur',
            order: [
                {
                    itemName: 'chicken Momo',
                    itemCategory: 'lunch',
                    itemQuantity: 2,
                    eachItemPrice: 200
                },
                {
                    itemName: 'chicken Chowmein',
                    itemCategory: 'lunch',
                    itemQuantity: 2,
                    eachItemPrice: 180
                }
            ],
            customerNotes: 'nothing of note',
            orderProgress: 'inProgress' as orderProgressType
        }
    ])

    type orderProgressType = 'notStarted' | 'inProgress' | 'completed';
    definePageMeta({
        layout: 'admin' 
    })
</script>

<template>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3"> 

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="text-sm sm:text-base font-medium text-gray-600">Total Orders</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Fastfood</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold">{{totalOrders}}</p>
            </div>

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="text-sm sm:text-base font-medium text-gray-600">Orders In Progress</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Cached</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold">{{orderInProgress}}</p>
            </div>

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="ctext-sm sm:text-base font-medium text-gray-600">Completed Orders</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Beenhere</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold">{{completedOrders}}</p>
            </div>
        </div>

     <div class="pt-8">
        <EachOrder v-for="(order, index) in orders" :key="index" :order="order" 
        @updateProgress='(newProgress: orderProgressType)=>{
            if(orders[index]) orders[index].orderProgress=newProgress as orderProgressType
        }
        '/>
    </div>
</template>

<style scoped>
</style>