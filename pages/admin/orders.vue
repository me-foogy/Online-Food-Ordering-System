<script setup lang="ts">

    import EachOrder from '@/components/admin/EachOrder.vue'
    import { useToast } from '#imports';
    const toast = useToast();

    type orderProgressType = 'notStarted' | 'inProgress' | 'completed';
    interface orderDataType {
        customerName: string,
        totalItems: number,
        totalAmount: number,
        location: string,
        order: Array<orderItem>
        customerNotes: string,
        //<TODO>: Fix
        orderProgress: any // orderProgess must have orderProgressType but when fetching it is fetched as string which is creating problems 
    }

    interface orderItem{
        itemName: string,
        itemCategory: string,
        itemQuantity: number,
        eachItemPrice: number
    }
    interface apiResponse{
        success: boolean
        message: orderDataType[] | string
    }

    //-------------------------API FETCH FOR api/order/fetch GET request ----------------------//

    const orderData = ref<orderDataType[]>([]);
    const {data, error} = await useFetch<apiResponse>('/api/orders/fetch')

    if(error.value){
        orderData.value=[];
        console.error('SERVER ERROR');
        toast.error({title: 'SERVER ERROR', message:error.value.data.message});
    }
    else{
        if(data.value?.success && typeof(data.value.message) !== 'string'){
            orderData.value=data.value.message
            toast.success({title: 'Success', message:`Orders fetched successfully`});
        }else{
            orderData.value=[];
            toast.error({title: 'ERROR', message:data.value?.message as string});
        }
    }

    //--------------------------------------------------------------------------------------//

    // Total number of orders
    const totalOrders = computed(() => 
    orders.value.filter(order => order.orderProgress === 'notStarted').length
    )

    // Orders In Progress
    const orderInProgress = computed(() =>
    orders.value.filter(order => order.orderProgress === 'inProgress').length
    )

    // Completed Orders
    const completedOrders = computed(() =>
    orders.value.filter(order => order.orderProgress === 'completed').length
    )

    //static data
    const orders = ref<orderDataType[]>(orderData);

    definePageMeta({
        layout: 'admin' 
    })
</script>

<template>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3"> 

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="text-sm sm:text-base font-medium text-gray-600">Remaining Orders</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Fastfood</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold text-red-500">{{totalOrders}}</p>
            </div>

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="text-sm sm:text-base font-medium text-gray-600">Orders In Progress</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Cached</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold text-blue-500">{{orderInProgress}}</p>
            </div>

            <!--each card-->
            <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="ctext-sm sm:text-base font-medium text-gray-600">Completed Orders</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Beenhere</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold text-green-500">{{completedOrders}}</p>
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