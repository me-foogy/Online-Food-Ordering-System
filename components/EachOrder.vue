<script setup lang="ts">
    import {ref} from 'vue'

    type orderProgressType = 'notStarted' | 'inProgress' | 'completed';
    const props = defineProps<{
    order: {
        customerName: string
        totalItems: number
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

    const handleButtonClick = (orderProgress: orderProgressType) => {
        let nextState: orderProgressType
        if (props.order.orderProgress === 'notStarted') nextState = 'inProgress'
        else if (props.order.orderProgress === 'inProgress') nextState = 'completed'
        else nextState = 'completed'
        emits('updateProgress', nextState)
    }

    const isOpen = ref(false)

    function toggle() {
    isOpen.value = !isOpen.value
    }
</script>

<template>
  <div class="mb-4">
    <div class="border rounded-xl bg-white p-4 w-full">

      <div class="flex justify-between items-center cursor-pointer"@click="toggle">

            <div class="flex flex-col">
                <span class="font-semibold text-gray-800">{{ order.customerName }}</span>
                <span class="text-gray-600 text-sm">
                    {{ order.totalItems }} items  •  {{ order.location }}
                </span>
            </div>

            <div>
                <button
                    @click.stop="()=>handleButtonClick(order.orderProgress)"
                    class="py-2 px-6 mr-6 rounded-xl font-semibold transition-colors duration-300"
                    :class="{
                        'bg-red-500 text-white': order.orderProgress === 'notStarted',
                        'bg-blue-500 text-white': order.orderProgress === 'inProgress',
                        'bg-green-500 text-white': order.orderProgress === 'completed'
                    }">
                    {{ order.orderProgress === 'notStarted' ? 'Start Order' :
                        order.orderProgress === 'inProgress' ? 'In Progress' :
                        'Completed' }}
                    </button>
                <span class="material-symbols-outlined text-gray-700 transition-transform duration-300"
                :class="{'rotate-180': isOpen}">
                expand_more
                </span>
            </div>

      </div>

      <div v-show="isOpen" class="mt-3">
            <ul class="divide-y divide-gray-200">
                <li v-for="(item, index) in order.order" :key="index"
                    class="py-2 flex justify-between items-center">
                    <div>
                        <span class="font-medium">{{ item.itemName }}</span>
                        <span class="text-gray-500 text-sm ml-6">{{ item.itemCategory }}</span>
                    </div>
                    <div class="text-right">
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
  </div>
</template>
