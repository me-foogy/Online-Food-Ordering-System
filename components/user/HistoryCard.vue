<script setup lang="ts">
    import {ref} from 'vue'
    import { useCartStore } from '@/stores/cart';
    const cart = useCartStore();

    const props = defineProps<{
    order: {
        orderId: number,
        customerName: string
        totalItems: number
        totalAmount: number
        location: string
        order: {
        id:number
        itemName: string
        itemCategory: string
        itemQuantity: number
        eachItemPrice: number
        }[]
        customerNotes: string
    }
    }>()

    const isOpen = ref(false)

    function toggle() {
    isOpen.value = !isOpen.value
    }

    const addToCart = ()=> {
        //push data to the pinia store
        /*
        interface cartDataType {
        id: number,
        name: string,
        category: string,
        price: number,
        image: string,
        quantity: number
        }
        */

       props.order.order.map(eachOrder=>{
        let cartDetails = {
            id: eachOrder.id,
            name: eachOrder.itemName,
            category: eachOrder.itemCategory,
            price: eachOrder.eachItemPrice,
            image: 'https://placehold.co/600x400',
            quantity: eachOrder.itemQuantity
        }

        cart.orderAgain(cartDetails);
       })
    }
</script>

<template>
  <div class="mb-4">
    <div class="border rounded-xl bg-white p-4 w-full">

      <div class="flex justify-between items-center cursor-pointer"@click="toggle">

            <div class="flex flex-col">
                <span class="font-semibold text-gray-800">2026-1-10</span>
                <span class="text-gray-600 text-sm">
                    {{ order.totalItems }} items • Rs. {{order.totalAmount}} •  {{ order.location }}
                </span>
            </div>

            <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <button class="bg-blue-600 text-white font:medium px-4 py-2 rounded-md
                        hover:bg-blue-700 " @click.stop="addToCart">Order Again</button>
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
  </div>
</template>
