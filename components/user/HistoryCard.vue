<script setup lang="ts">
  import {ref} from 'vue'
  import { useCartStore } from '@/stores/cart';
  import type { orderDataType } from '~/pages/user/history.vue';
  const {addToCart} = useCart()

  const props = defineProps<{
  order: orderDataType
  }>()

  const isOpen = ref(false)

  function toggle() {
  isOpen.value = !isOpen.value
  }

  const orderAgainHandler = ()=> {
    props.order.order.forEach(item=>{
        console.log(item.menuId, item.itemQuantity);
        addToCart(item.menuId, item.itemQuantity)
    })
  }
    
</script>

<template>
  <div class="mb-4">
    <div class="border rounded-xl bg-white p-4 w-full">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer" @click="toggle">
        <div class="flex flex-col gap-1">
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-6 sm:items-center">
            <span class="font-semibold text-blue-800 break-all">
              Order Id: #{{order.orderId}}
            </span>
            <span class="font-semibold text-gray-800 text-sm">
              {{order.createdAt.substring(0,8).replaceAll('/', '-')}}
            </span>
          </div>
          <span class="text-gray-600 text-sm">
            {{ order.totalItems }} items • Rs. {{order.totalAmount}} • {{ order.location }}
          </span>
        </div>

        <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <button class="bg-blue-600 text-white font-medium px-4 py-2 rounded-md
          hover:bg-blue-700 w-full sm:w-auto"
            @click.stop="orderAgainHandler">
            Order Again
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
            class="py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div class="sm:pl-4">
              <span class="font-medium">{{ item.itemName }}</span>
              <span class="text-gray-500 text-sm ml-0 sm:ml-6 block sm:inline">
                {{ item.itemCategory }}
              </span>
            </div>
            <div class="text-left sm:text-right sm:pr-4">
              <span class="font-medium">
                {{ item.itemQuantity }} x Rs. {{ item.eachItemPrice }}
              </span>
              <p class="text-gray-500 text-sm">
                Total: Rs. {{ item.itemQuantity * item.eachItemPrice }}
              </p>
            </div>
          </li>
        </ul>
        <p class="mt-2 text-gray-500 text-sm italic break-words">
          Notes: {{ order.customerNotes }}
        </p>
      </div>
    </div>
  </div>
</template>

