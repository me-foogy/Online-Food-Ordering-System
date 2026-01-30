<script setup lang="ts">

    import { useToast } from '#imports';
    import {z} from 'zod'
    const toast = useToast();
    const {cart, fetchCart, cartTotal} = useCart();

    const props = defineProps<{
    isOpen: boolean
    onClose?: () => void
    }>()

</script>

<template>
  <teleport to="body">
    <div v-if="props.isOpen" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md">
        
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Confirm Checkout</h2>
          <p class="text-sm text-gray-500 mt-1">Review your order before confirming</p>
        </div>

        <!-- Cart Items List -->
        <div class="p-6 max-h-96 overflow-y-auto">
          <div class="space-y-3">
            <div v-for="item in cart" 
              :key="item.id"
              class="flex justify-between items-center py-2">
              <div class="flex-1">
                <p class="font-medium text-gray-800">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <p class="font-semibold text-gray-900">Rs. {{ item.quantity * item.price }}</p>
            </div>
          </div>

          <!-- Total -->
          <div class="border-t border-gray-200 mt-4 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-800">Total</span>
              <span class="text-2xl font-bold text-gray-900">Rs. {{ cartTotal }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-6 border-t border-gray-200 flex gap-3">
          <button @click="onClose"
            class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-red-500 hover:text-white transition-colors">
            Cancel
          </button>
          <button @click=""
            class="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Confirm Order
          </button>
        </div>

      </div>
    </div>
  </teleport>
</template>