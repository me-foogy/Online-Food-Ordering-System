<script setup lang="ts">
    const props = defineProps<{
        order: orderDataType
    }>()

    function getStateValue(progress: string): number {
        if (progress === 'notStarted') return 1;
        else if (progress === 'inProgress') return 2;
        else return 3;
    }
</script>

<template>
    <span class="text-sm md:text-lg px-2 text-blue-700">Order Id: #{{ order.orderId }}</span>
    <div class="flex items-center justify-center p-2 py-4 overflow-x-auto md:p-6">
        <div class="flex items-center gap-1 sm:gap-2 md:gap-0">
             
            <!-- Step 1: Ordered -->
            <div class="flex flex-col items-center">
                <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center bg-blue-700 justify-center shadow-md">
                    <span class="text-base sm:text-lg md:text-2xl lg:text-3xl material-symbols-outlined text-white">assignment</span>
                </div>
                <span class="text-[10px] sm:text-xs md:text-sm lg:text-base font-medium text-blue-700 mt-1 md:mt-2">Ordered</span>
            </div>
            
            <!-- Line 1 -->
            <div class="h-0.5 w-4 sm:w-6 md:w-10 lg:w-14 -mt-4 sm:-mt-5 md:-mt-6"
                :class="{
                    'bg-blue-700': getStateValue(order.orderProgress) > 1,
                    'border-t-2 border-dotted border-gray-400': getStateValue(order.orderProgress) <= 1
                }">
            </div>
            
            <!-- Step 2: Cooking -->
            <div class="flex flex-col items-center">
                <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-md"
                    :class="{
                        'bg-blue-700': getStateValue(order.orderProgress) > 1,
                        'bg-gray-500': getStateValue(order.orderProgress) <= 1
                    }">
                    <span class="text-base sm:text-lg md:text-2xl lg:text-3xl material-symbols-outlined text-white">local_fire_department</span>
                </div>
                <span class="text-[10px] sm:text-xs md:text-sm lg:text-base font-medium mt-1 md:mt-2"
                    :class="{
                        'text-blue-700': getStateValue(order.orderProgress) > 1,
                        'text-gray-500': getStateValue(order.orderProgress) <= 1
                    }">
                    Cooking
                </span>
            </div>
            
            <!-- Line 2 -->
            <div class="h-0.5 w-4 sm:w-6 md:w-10 lg:w-14 -mt-4 sm:-mt-5 md:-mt-6"
                :class="{
                    'bg-blue-700': getStateValue(order.orderProgress) > 2,
                    'border-t-2 border-dotted border-gray-400': getStateValue(order.orderProgress) <= 2
                }">
            </div>

            <!-- Step 3: Done -->
            <div class="flex flex-col items-center">
                <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-md"
                    :class="{
                        'bg-blue-700': getStateValue(order.orderProgress) > 2,
                        'bg-gray-500': getStateValue(order.orderProgress) <= 2
                    }">
                    <span class="text-base sm:text-lg md:text-2xl lg:text-3xl material-symbols-outlined text-white">fastfood</span>
                </div>
                <span class="text-[10px] sm:text-xs md:text-sm lg:text-base font-medium mt-1 md:mt-2"
                    :class="{
                        'text-blue-700': getStateValue(order.orderProgress) > 2,
                        'text-gray-500': getStateValue(order.orderProgress) <= 2
                    }">
                    Done
                </span>
            </div>
        </div>
    </div>
</template>