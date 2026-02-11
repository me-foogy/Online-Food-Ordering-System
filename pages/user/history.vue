<script setup lang="ts">
    import HistoryCard from '@/components/user/HistoryCard.vue';
    import { useToast } from '#imports';
    import ProgressCard from '~/components/user/ProgressCard.vue';
    const toast = useToast();
    const loading = useLoadingScreen();

    interface apiResponse{
        success: boolean
        message: orderDataType[] | string
    }
    
    //-------------------------API FETCH FOR api/order/fetch GET request ----------------------//

    const orderData = ref<orderDataType[]>([]);
    const ordersNotCompleted=computed(()=>{
        return orderData.value.filter(order=> order.orderProgress!=='completed')
    })

    const {data, error, pending} = useFetch<apiResponse>('/api/user/orders/user_history');
    
    watch(pending, (isPending)=>{
        loading.value=isPending;
    }, {immediate: true})

    watch(data, (newData)=>{
        if(newData?.success && typeof(newData.message) !== 'string'){
            orderData.value=newData.message
            toast.success({title: 'Success', message:`Orders fetched successfully`});
        }else{
            orderData.value=[];
            toast.error({title: 'ERROR', message:data.value?.message as string});
        }
    })

    watch(error, (err)=>{
        if(err){
            orderData.value=[];
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:err.data.message});
        }
    })

    //--------------------------------------------------------------------------------------//

    definePageMeta({
        layout: 'user'
    })
    
</script>

<template>
    <h1 class="text-3xl font-bold mb-6 text-blue-600">Order Progress</h1>
        <div class="border-2 rounded-xl p-2 mb-4">
            <ProgressCard v-if="ordersNotCompleted.length!==0" v-for="order in ordersNotCompleted" :key="order.orderId" :order="order"/>
            <div v-else class="flex flex-col w-full items-center space-y-4 p-2 text-center">
                <p class="text-md text-red-600">Order Something To View Progress</p>
                <P class="text-xs text-red-600">If you have already ordered and do not see order progress then your order is on the way</P>
            </div>
        </div>
        <h1 class="text-3xl font-bold mb-6 mt-8 text-blue-600">Order History</h1>
        <div class="w-full">
            <HistoryCard v-if="orderData.length!==0" v-for="order in orderData" :key="order.orderId" :order="order"/>
            <div v-else class="flex flex-col border-2 rounded-md p-6 w-full items-center space-y-4 text-center">
                <p class="text-md text-red-600">Nothing has been ordered yet</p>
                <P class="text-xs text-red-600">Details of previously ordered items appear here</P>
            </div>
        </div>
</template>

