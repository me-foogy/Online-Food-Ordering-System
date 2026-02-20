<script setup lang="ts">
    import {ref} from 'vue'
    import { useToast } from '#imports';
    const toast = useToast();
    const {parseAddress} = useLocation();

    type orderProgressType = 'notStarted' | 'inProgress' | 'completed';
    const props = defineProps<{
    order: {
        orderId: number
        customerName: string
        totalItems: number
        totalAmount: number
        createdAt: string
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
        (e: 'updateProgress', newProgress: orderProgressType):void,
        (e:'displayMap', location:[number, number]): void
    }>()

    //-------------------API call for progress change----------------------//

    const handleButtonClick = async() => {
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

    const showAddressClick = () =>{
        const location = parseAddress(props.order.location);
        if (location) emits('displayMap', location)
    }

    const isOpen = ref(false)

    function toggle() {
    isOpen.value = !isOpen.value
    }
</script>

<template>
    <div class="border rounded-xl bg-white p-2 md:p-4 w-full">

      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 md:gap-3 cursor-pointer" @click="toggle">

            <div class="flex flex-col">
                <div class="flex flex-col items-start sm:flex-row sm:gap-5">
                    <span class="text-sm md:text-base font-semibold text-gray-800">{{ order.customerName }}</span>
                    <span class="text-xs md:text-base font-semibold text-blue-800">{{ order.createdAt.replaceAll('/','-')}}</span>
                </div>
                <span class="text-gray-600 mt-1 sm:mt-0 text-sm md:text-base">
                    {{ order.totalItems }} items • <span class="text-green-800 font-semibold">Rs. {{order.totalAmount}}</span>
                </span>
            </div>

            <div class="flex items-center justify-center gap-2 sm:gap-4 self-start sm:self-auto w-full sm:w-auto">

                <button 
                     @click.stop="()=>showAddressClick()"
                    class="rounded-md font-semibold flex-1 flex justify-center gap-2 border p-2 md:p-3 text-[clamp(0.8rem,1.5vw,1rem)]
                    sm:px-4 sm:py-2 md:px-6
                    hover:bg-gray-200 hover:shadow-sm hover:text-blue-800"
                >
                    <span class="text-[clamp(0.8rem,1.5vw,1rem)] material-symbols-outlined self-center">location_on</span>
                    Location
                </button>

                <button
                    @click.stop="()=>handleButtonClick()"
                    class="rounded-md font-semibold flex-1 transition-colors duration-300 p-2 md:p-3 text-[clamp(0.8rem,1.5vw,1rem)]
                        sm:px-4 sm:py-2 md:px-6
                        hover:shadow-md"
                    :class="{
                        'bg-red-500 text-white hover:bg-red-700': order.orderProgress === 'notStarted',
                        'bg-blue-500 text-white hover:bg-blue-700': order.orderProgress === 'inProgress',
                        'bg-green-500 text-white hover:bg-green-700': order.orderProgress === 'completed'
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
                    class="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                    <div class="sm:pl-4">
                        <span class="text-xs md:text-base font-medium">{{ item.itemName }}</span>
                        <span class="text-gray-500 text-sm md:text-base ml-6">{{ item.itemCategory }}</span>
                    </div>

                    <div class="text-xs md:text-base text-left sm:text-right sm:pr-4">
                        <span class="font-medium">{{ item.itemQuantity }} x Rs. {{ item.eachItemPrice }}</span>
                        <p class="text-gray-500 text-sm md:text-base">
                            Total: Rs. {{ item.itemQuantity * item.eachItemPrice }}
                        </p>
                    </div>
                </li>
            </ul>

        <!-- Customer Notes -->
        <p class="text-xs md:text-base mt-2 text-gray-500 italic">
          Notes: {{ order.customerNotes }}
        </p>
      </div>
    </div>
</template>
