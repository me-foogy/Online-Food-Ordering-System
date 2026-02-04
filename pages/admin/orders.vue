<script setup lang="ts">

    import EachOrder from '@/components/admin/EachOrder.vue'
    import { useToast } from '#imports';
    import { ref, computed } from 'vue';
    const toast = useToast();

    const pageIndex = ref(0)
    const totalPages = ref(20)

    type orderProgressType = 'notStarted' | 'inProgress' | 'completed';
    interface orderDataType {
        orderId: number,
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

    const dateToday = new Date().toISOString().split('T')[0] //format 20xx-xx-xx

    const orderData = ref<orderDataType[]>([]);
    const {data, error} = await useFetch<apiResponse>(`/api/admin/orders/fetch?date=${dateToday}`,{
        method: 'GET'
    })

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
    orderData.value.filter(order => order.orderProgress === 'notStarted').length
    )

    // Orders In Progress
    const orderInProgress = computed(() =>
    orderData.value.filter(order => order.orderProgress === 'inProgress').length
    )

    // Completed Orders
    const completedOrders = computed(() =>
    orderData.value.filter(order => order.orderProgress === 'completed').length
    )

    definePageMeta({
        layout: 'admin' 
    })
</script>

<template>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2"> 

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
            <!-- <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col gap-4">
                <div class="flex flex-row justify-between items-center">
                    <span class="ctext-sm sm:text-base font-medium text-gray-600">Completed Orders</span>
                    <span class="material-symbols-outlined text-5xl sm:text-7xl">Beenhere</span>
                </div>
                <p class="text-5xl sm:text-6xl lg:text-7xl font-bold text-green-500">{{completedOrders}}</p>
            </div> -->
        </div>

     <div class="pt-8">
        <EachOrder v-if="orderData.length!==0" v-for="(order, index) in orderData" :key="order.orderId" :order="order"/>
        <div v-else class="h-full w-full border rounded-xl p-4 bg-white sm:p-6">
            <span class="text-red-500 flex justify-center text-1xl">No Orders At The Moment</span>
        </div>
    </div>

    <!-- Pagination -->
    <div class="pt-8 flex justify-center">
       <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
    </div>

</template>