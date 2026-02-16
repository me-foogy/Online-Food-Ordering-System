<script setup lang="ts">

    const props = defineProps<{
    order: orderDataType
    }>()

    function getStateValue (progress: string): number {
        if(progress === 'notStarted') return 1;
        else if(progress == 'inProgress') return 2;
        else return 3 
    }
</script>


<template>
    <span class="text-md md:text-lg px-2 text-blue-700">Order Id: #{{order.orderId}}</span>
    <div class="flex items-center justify-center p-2 py-4 overflow-x-auto md:p-6">
        <div class="flex items-center">
            <!-- Ordered -->
            <div class="flex flex-col items-center">
                <div class=" w-14 h-14 md:h-20 md:w-20 rounded-full flex items-center bg-blue-700 justify-center shadow-md">
                <span class="text-xl material-symbols-outlined text-white md:text-3xl">assignment</span>
                </div>
                <span class="text-xs md:text-sm lg:text-base font-medium text-blue-700 mt-2">Ordered</span>
    
            </div>
            <!-- Line 2-->
            <div class="h-1 w-8 -mt-6 md:w-14"
                :class="{
                        'bg-blue-700': getStateValue(order.orderProgress)>1,
                        'border-t-2 border-dotted border-gray-400': getStateValue(order.orderProgress)<=1
                    }"
                >
            </div>
            <!-- Packed -->
            <div class="flex flex-col items-center">
                <div class="w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-md"
                    :class="{
                        'bg-blue-700': getStateValue(order.orderProgress)>1,
                        'bg-gray-500': getStateValue(order.orderProgress)<=1
                    }">
                    <span class="text-xl material-symbols-outlined text-white md:text-3xl">local_fire_department</span>
                </div>
                <span class="text-xs md:text-sm lg:text-base font-medium mt-2"
                    :class="{
                        'text-blue-700': getStateValue(order.orderProgress)>1,
                        'text-gray-500': getStateValue(order.orderProgress)<=1
                    }"
                >Cooking
                </span>
            </div>
            <!-- Line 4-->
            <div class="h-1 w-8 -mt-6 md:w-14"
                :class="{
                        'bg-blue-700': getStateValue(order.orderProgress)>2,
                        'border-t-2 border-dotted border-gray-400': getStateValue(order.orderProgress)<=2
                    }"
                    >
                </div>

            <!-- In Transit -->
            <div class="flex flex-col items-center">
                <div class="w-14 h-14 md:h-20 md:w-20 rounded-full bg-gray-500 flex items-center justify-center shadow-md"
                    :class="{
                        'bg-blue-700': getStateValue(order.orderProgress)>2,
                        'bg-gray-500': getStateValue(order.orderProgress)<=2
                    }">
                <span class="text-xl material-symbols-outlined text-white md:text-3xl">fastfood</span>
                </div>
                <span class="text-xs md:text-sm lg:text-base font-medium mt-2"
                :class="{
                        'text-blue-700': getStateValue(order.orderProgress)>2,
                        'text-gray-500': getStateValue(order.orderProgress)<=2
                    }"
                >Done</span>
            </div>
        </div>
    </div>
</template>