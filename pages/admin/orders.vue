<script setup lang="ts">

import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import EachOrder from '@/components/admin/EachOrder.vue'
import { useToast } from '#imports';
import { ref, computed } from 'vue';
import ReceivingOrdersDialog from '~/components/admin/ReceivingOrdersDialog.vue';
import ViewLocation from '~/components/admin/ViewLocation.vue';
const toast = useToast();
const loading = useLoadingScreen();
const {receivingOrders, fetchReceivingOrders} = useReceivingOrders();

    interface apiSuccessResponse{
        success: true,
        message: orderDataType[],
        count:{
            notStartedCount: number
            inProgressCount: number
        }
        pagination: {
            page: number,
            pagesize: number,
            totalPages: number
        }
    }

    interface apiFailureResponse{
        success: false,
        message: string,
    }
    
    const openConfirmDialog = ref<boolean>(false);
    //-------------------------API FETCH FOR api/order/fetch GET request ----------------------//
    const page = ref<number>(1);
    const pageSize:number = 10;
    const totalPages = ref<number>(1);
    const notStartedCount=ref<number>(0);
    const inProgressCount=ref<number>(0);
    const orderLocation = ref<[number, number]|null>(null);
    const displayMap = ref<boolean>(false);

    const orderData = ref<orderDataType[]>([]);
    const {data, error} = await useFetch<apiSuccessResponse|apiFailureResponse>(`/api/admin/orders/fetch`,{
        method: 'GET',
        query: {
            page: page,
            pageSize
        },
        key: `orders-${page.value}`,
        watch: [page],
        onRequest(){
            loading.value = true;
        },
        onResponse(){
            loading.value = false;
        },
        onResponseError(){
            loading.value=false;
        }
    })

    watch([data, error], ()=>{
        if(error.value){
            orderData.value=[];
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }
        else{
            if(data.value?.success && typeof(data.value.message) !== 'string'){
                orderData.value=data.value.message;
                totalPages.value= data.value.pagination.totalPages;
                notStartedCount.value=data.value.count.notStartedCount;
                inProgressCount.value=data.value.count.inProgressCount;
                toast.success({title: 'Success', message:`Orders fetched successfully`});
            }else{
                orderData.value=[];
                toast.error({title: 'ERROR', message:data.value?.message as string});
            }
        }
    }, {immediate: true})
    //--------------------------------------------------------------------------------------//
    //Fetch the state of the restaurant
    fetchReceivingOrders();

    const handleClose = () =>{
        openConfirmDialog.value=false;
        fetchReceivingOrders();
    }
    
    const handleMapClose = () => {
        displayMap.value = false
    }

    const handleDisplayEmit = (location: [number, number]) => {
        orderLocation.value=location;
        displayMap.value=true;
    }

    definePageMeta({
        layout: 'admin' 
    })
</script>

<template>
    <ReceivingOrdersDialog :isOpen="openConfirmDialog" :onClose="handleClose" :state="receivingOrders"/>
    <div class="w-full h-[93dvh] flex flex-col gap-1 md:gap-4">
        <div class="flex flex-col gap-1 lg:gap-6">
            <div class="w-full border rounded-lg py-2 px-4 bg-white flex flex-row justify-between"
                :class="{'border-blue-800':receivingOrders, 'border-red-800': !receivingOrders}"
            >
                <p class="text-xs lg:text-base"> Currently Receiving Orders : 
                    <span :class="{'text-blue-800':receivingOrders, 'text-red-800': !receivingOrders}">
                        {{receivingOrders?'YES':'NO'}}                        
                    </span>
                </p>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="receivingOrders" class="sr-only" @click="openConfirmDialog=true">
                    <!-- Toggle Track -->
                    <div
                        class="w-10 h-5 rounded-full transition-colors duration-300"
                        :class="{'bg-blue-600': receivingOrders,  'bg-gray-300':!receivingOrders}"
                    ></div>
                    <!-- Toggle Thumb -->
                    <div
                        class="absolute w-3 h-3 lg:w-4 lg:h-4 bg-white rounded-full top-1 transition-transform duration-300"
                        :class="{'translate-x-5': receivingOrders, 'translate-x-1': !receivingOrders}"
                    ></div>
                </label>
            </div>
            <div class="grid grid-cols-1 gap-2 lg:gap-5 sm:grid-cols-2">
                <!--each card-->
                <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col">
                    <div class="flex flex-row justify-between items-center">
                        <span class="text-sm sm:text-base font-medium text-gray-600">Remaining Orders</span>
                        <span class="material-symbols-outlined text-3xl sm:text-7xl">Fastfood</span>
                    </div>
                    <p class="text-4xl sm:text-6xl lg:text-7xl font-bold text-red-500">{{notStartedCount}}</p>
                </div>
                <!--each card-->
                <div class="h-full w-full border rounded-xl p-4 bg-white sm:p-6 flex flex-col">
                    <div class="flex flex-row justify-between items-center">
                        <span class="text-sm sm:text-base font-medium text-gray-600">Orders In Progress</span>
                        <span class="material-symbols-outlined text-3xl sm:text-7xl">Cached</span>
                    </div>
                    <p class="text-4xl sm:text-6xl lg:text-7xl font-bold text-blue-500">{{inProgressCount}}</p>
                </div>
            </div>
        </div>

        <div class="flex justify-end mt-1 lg:mt-4">
            <div class="bg-white rounded-lg p-1">
                <VPagination
                    v-model="page"
                    :pages="totalPages"
                    :range-size="1"
                    class="gap-2"
                />
            </div>
        </div>

        <div class="flex-1 w-full border border-gray-300 rounded-xl p-2 overflow-y-auto sm:p-3 space-y-3 flex flex-col">
            <EachOrder 
                v-if="orderData.length!==0" 
                v-for="(order) in orderData" 
                :key="order.orderId" 
                :order="order"
                @display-map="handleDisplayEmit"
            />
            <span v-else class="text-red-500 flex justify-center text-1xl self-center m-auto">No Orders At The Moment</span>
        </div>
    </div>

    <ViewLocation
        :is-open="displayMap"
        :current-location="orderLocation"
        @close="handleMapClose"
    />

</template>