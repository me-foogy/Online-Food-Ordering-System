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
            location: 'somewhere',
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
            location: 'somewhere',
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
        <div class="grid grid-cols-1 h-1/3 gap-5 sm:grid-cols-3"> 
            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white ">
                <div class="flex flex-row justify-between align-middle">
                    <span class="card-text">Total Orders</span>
                    <span class="material-symbols-outlined card-icon">Fastfood</span>
                </div>
                <p class="text-8xl">{{totalOrders}}</p>
            </div>

            <div class="h-full w-full border rounded-xl p-4 bg-white">
                <div class="flex flex-row justify-between align-middle">
                    <span class="card-text">Orders In Progress</span>
                    <span class="material-symbols-outlined card-icon">Cached</span>
                </div>
                <p class="text-8xl">{{orderInProgress}}</p>
            </div>

            <div class="h-full w-full border rounded-xl p-4 bg-white">
                <div class="flex flex-row justify-between align-middle">
                    <span class="card-text">Completed Orders</span>
                    <span class="material-symbols-outlined card-icon">Beenhere</span>
                </div>
                <p class="text-8xl">{{completedOrders}}</p>
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
    .card-text{
        @apply  text-2xl;
    }
    .card-icon{
        @apply border text-4xl p-4 rounded-lg text-black bg-white;
    }
</style>