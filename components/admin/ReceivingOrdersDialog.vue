<script setup lang="ts">

import { useToast, type defaultApiType } from '#imports';
import type { InferSelectModel } from 'drizzle-orm';
import type { receiveOrders } from '~/server/drizzle/schema';
const toast = useToast();
const loading = useLoadingScreen();

  const props = defineProps<{
    isOpen: boolean
    state: boolean
    onClose: () => void
  }>()

    let passwordInput=ref<string>('');
    interface apiResponse {
        success: boolean,
        message: InferSelectModel<typeof receiveOrders>[]
    }
  
//-------------------API CALL To Toggle Receiving Orders------------------------//

    const handleConfirmation = async () =>{
        try{
            const response = await $fetch<apiResponse>('/api/admin/orders/toggle_receiving_orders', {
                method: 'POST',
                body: {
                    password: passwordInput.value,
                    state: props.state
                },
                onRequest(){
                    loading.value = true;
                },
                onResponse(){
                    loading.value = false;
                },
                onResponseError(){
                    loading.value=false;
                }
            })

            if(response.success===true && typeof(response.message)!=='string'){
                toast.success({message: `Taking Orders State is ${response.message[0]!.isReceivingOrders}`});
                props.onClose();
            }
        }catch(err: any){

            if (err.response.status === 401) {
                toast.error({ message: 'Invalid Credentials' })
                return
            }

            if (err.response.status === 400) {
                toast.error({ message: err.response._data?.statusMessage ?? 'Bad Request' })
                return
            }

            toast.error({ message: 'An unexpected error occurred' })
        }finally{
            passwordInput.value='';
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
          Confirm Change
        </h2>
        <p class="text-sm text-red-600 mb-4">
          *This action directly affects whether or not User can order Items
        </p>

        <!-- Password Input -->
        <div class="mb-8">
          <p class="text-gray-700 mb-2">
            Enter password
          </p>
          <input 
            type="text" 
            v-model="passwordInput" 
            placeholder="Enter phone number" 
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          >
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <button 
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow-sm"
            @click="onClose()"
          >
            <span class="material-symbols-outlined text-base">cancel</span>
            Cancel
          </button>

          <button 
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg 
            hover:bg-red-700 transition shadow-sm hover:shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleConfirmation"
          >
            <span class="material-symbols-outlined text-base">check_circle_outline</span>
            Confirm
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>