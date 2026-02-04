<script setup lang="ts">
    import {ref} from 'vue'
    import { useToast } from '#imports';
    const toast = useToast();

    type orderProgressType = 'notStarted' | 'inProgress' | 'completed';
    const props = defineProps<{
    order: {
        orderId: number
        customerName: string
        totalItems: number
        totalAmount: number
        location: string
        order: {
            itemName: string
            itemCategory: string
            itemQuantity: number
            eachItemPrice: number
        }[]
        customerNotes: string
        orderProgress: orderProgressType
    }
    }>()

    const emits = defineEmits<{
        (e: 'updateProgress', newProgress: orderProgressType):void
    }>()

    //-------------------API call for progress change----------------------//

    const handleButtonClick = async(orderProgress: orderProgressType) => {
        let nextState: orderProgressType
        if (props.order.orderProgress === 'notStarted') nextState = 'inProgress'
        else if (props.order.orderProgress === 'inProgress') nextState = 'completed'
        else nextState = 'completed';

        //----------------------------------//
        const {data, error} = await useFetch('/api/admin/orders/update_progress',{
            method:'POST',
            body: {
                orderId: props.order.orderId,
                orderProgress: nextState
            }
        })

        if(error.value){
            console.error('SERVER ERROR');
            toast.error({title: 'SERVER ERROR', message:error.value.data.message});
        }
        else{
            if(data.value?.success && typeof(data.value.message) !== 'string'){
                toast.success({title: 'Success', message:`Orders updated successfully`});
                props.order.orderProgress=nextState;
            }else{
                toast.error({title: 'ERROR', message:data.value?.message as string});
            }
        }
    //-------------------------------------------//
    }

    //--------------------------------------------------------------------//


    const isOpen = ref(false)

    function toggle() {
    isOpen.value = !isOpen.value
    }
</script>

<template>
    <div class="border rounded-xl bg-white p-4 w-full">

      <div class="flex justify-between items-center cursor-pointer"@click="toggle">

            <div class="flex flex-col">
                <span class="font-semibold text-gray-800">{{ order.customerName }}</span>
                <span class="text-gray-600 text-sm">
                    {{ order.totalItems }} items • Rs. {{order.totalAmount}} •  {{ order.location }}
                </span>
            </div>

            <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <button
                    @click.stop="()=>handleButtonClick(order.orderProgress)"
                    class="rounded-md font-semibold transition-colors duration-300 px-3 py-3 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:text-base"
                    :class="{
                        'bg-red-500 text-white': order.orderProgress === 'notStarted',
                        'bg-blue-500 text-white': order.orderProgress === 'inProgress',
                        'bg-green-500 text-white': order.orderProgress === 'completed'
                    }">
                    {{ order.orderProgress === 'notStarted' ? 'Start Order' :
                        order.orderProgress === 'inProgress' ? 'In Progress' :
                        'Completed' }}
                    </button>
                <span class="material-symbols-outlined transition-transform duration-300 text-xl sm:text-2xl text-gray-600"
                :class="{'rotate-180': isOpen}">
                expand_more
                </span>
            </div>

      </div>

      <div v-show="isOpen" class="mt-3">
            <ul class="divide-y divide-gray-200">
                <li v-for="(item, index) in order.order" :key="index"
                    class="py-2 flex justify-between items-center">
                    <div class="sm:pl-4">
                        <span class="font-medium">{{ item.itemName }}</span>
                        <span class="text-gray-500 text-sm ml-6">{{ item.itemCategory }}</span>
                    </div>
                    <div class="text-right sm:pr-4">
                        <span class="font-medium">{{ item.itemQuantity }} x Rs. {{ item.eachItemPrice }}</span>
                        <p class="text-gray-500 text-sm">
                            Total: Rs. {{ item.itemQuantity * item.eachItemPrice }}
                        </p>
                    </div>
                </li>
            </ul>

        <!-- Customer Notes -->
        <p class="mt-2 text-gray-500 text-sm italic">
          Notes: {{ order.customerNotes }}
        </p>
      </div>
    </div>
</template>
