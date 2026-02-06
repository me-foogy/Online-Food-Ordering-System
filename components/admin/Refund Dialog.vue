<script setup lang="ts">

  import { useToast, type defaultApiType } from '#imports';
  import type { InferSelectModel } from 'drizzle-orm';
  import type { paymentTable } from '~/server/drizzle/schema';
  const toast = useToast();

  const props = defineProps<{
  isOpen: boolean
  refundDetails:{
    uuid: string
    amount: number
    phoneNo: string
  }
  onClose: (refunded: boolean) => void
  }>()

  let inputPhoneNo=ref<string>('');
  
//-------------------API CALL FOR CONFIRMATION-------------------------//

  //API call to confirm REFUNDING
  const handleRefund = async() => {
    try{
      const response = await $fetch('/api/admin/transaction/refund', {
          method: 'POST',
          body: {
            uuid: props.refundDetails.uuid
          }
      })

      if(response.success===true && typeof(response)!=='string'){
        toast.success({message: 'Transaction set to REFUNDED'});
        props.onClose(true);
      }
      else{
        toast.error({message: response.message as string})
      }
    }catch{
      toast.error({message: 'AN ERROR OCCURED'})
    }
  }

//----------------------------------------------------//
</script>

<template>
  <teleport to="body">
    <div v-if="props.isOpen" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto border border-gray-100">
  
        <!-- Title -->
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
          Confirm Refund
        </h2>
        <p class="text-sm text-red-600 mb-4">
          Only confirm if the refund has already been processed.
        </p>

        <!-- Refund Amount -->
        <div class="mb-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl py-6 border border-gray-200 shadow-sm">
          <div class="text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Refund Amount</p>
            <span class="text-5xl font-bold text-green-700">Rs. {{ refundDetails.amount }}</span>
          </div>
        </div>

        <!-- Phone Number Verification -->
        <div class="mb-8">
          <p class="text-gray-700 mb-2">
            Enter phone number 
            <span class="text-red-600 font-bold">
              "{{ refundDetails.phoneNo }}"
            </span> 
            to confirm refund
          </p>
          <input 
            type="text" 
            v-model="inputPhoneNo" 
            placeholder="Enter phone number" 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          >
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button 
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow-sm"
            @click="onClose(false)"
          >
            <span class="material-symbols-outlined text-base">cancel</span>
            Cancel
          </button>

          <button 
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg 
            hover:bg-red-700 transition shadow-sm hover:shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="refundDetails.phoneNo !== inputPhoneNo"
            @click="handleRefund"
          >
            <span class="material-symbols-outlined text-base">check_circle_outline</span>
            Confirm
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>