<script setup lang="ts">
    import HistoryCard from '@/components/user/HistoryCard.vue';
    import { useToast } from '#imports';
    const toast = useToast();

    interface orderDataType {
        orderId: number,
        customerName: string,
        totalItems: number,
        totalAmount: number,
        location: string,
        order: Array<orderItem>
        customerNotes: string,
        //<TODO>: Fix
        orderProgress:  any// orderProgess must have orderProgressType but when fetching it is fetched as string which is creating problems 
    }

    interface orderItem{
        id: number
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
    const {data, error} = await useFetch<apiResponse>('/api/user/orders/user_history?user=Sworup Karki');

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

    definePageMeta({
        layout: 'user'
    })
</script>

<template>
    <h1 class="text-4xl font-bold mb-8 text-blue-600">Order History</h1>
    <div class="w-full">
        <HistoryCard v-for="order in orderData" :key="order.orderId" :order="order"/>
    </div>
</template>

