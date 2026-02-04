<script setup lang="ts">

    import VPagination from '@hennge/vue3-pagination'
    import '@hennge/vue3-pagination/dist/vue3-pagination.css'
    import EachOrder from '@/components/admin/EachOrder.vue'
    import { useToast } from '#imports';
    import { ref, computed } from 'vue';
    const toast = useToast();

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
    const page = ref<number>(1);
    const pageSize:number = 10;
    const totalPages = ref<number>(1);

    const orderData = ref<orderDataType[]>([]);
    const {data, error} = await useFetch<apiResponse>(`/api/admin/orders/fetch?date=${dateToday}&page=${page}&pageSize=${pageSize}`,{
        method: 'GET'
    })

    if(error.value){
        orderData.value=[];
        console.error('SERVER ERROR');
        toast.error({title: 'SERVER ERROR', message:error.value.data.message});
    }
    else{
        if(data.value?.success && typeof(data.value.message) !== 'string'){
            orderData.value=data.value.message;
            totalPages.value= Math.ceil(data.value.message.length/pageSize);
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

    definePageMeta({
        layout: 'admin' 
    })
</script>

<template>

    <div class="w-full h-[93vh] flex flex-col gap-4">
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
        </div>

        <div class="flex justify-end mt-4">
            <div class="bg-white rounded-lg p-2">
                <VPagination
                    v-model="page"
                    :pages="totalPages"
                    :range-size="1"
                    class="gap-2"
                />
            </div>
        </div>

        <div v-if="orderData.length!==0" class="flex-1 w-full border border-gray-300 rounded-xl p-2 overflow-auto sm:p-3 space-y-3">
            <EachOrder v-for="(order, index) in orderData" :key="order.orderId" :order="order"/>
        </div>
        <div v-else class="h-full w-full border border-gray-300 rounded-xl p-4 flex items-center justify-center sm:p-6">
            <span class="text-red-500 flex justify-center text-1xl">No Orders At The Moment</span>
        </div>
    </div>

</template>

<style>
/* overwrite internal button classes */
.v-pagination .btn {
  @apply px-4 py-2 rounded-lg border border-gray-300;
}

.v-pagination .btn-active {
  @apply bg-blue-500 text-white border-blue-500;
}

.v-pagination .btn:hover:not(.btn-active) {
  @apply border-blue-500;
}
</style>