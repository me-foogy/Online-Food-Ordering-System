<script setup lang="ts">

  import VPagination from '@hennge/vue3-pagination'
  import '@hennge/vue3-pagination/dist/vue3-pagination.css'
  import type { InferSelectModel } from 'drizzle-orm';
  import {z} from 'zod'
  import type { paymentTable } from '~/server/drizzle/schema';
  import { useToast } from '#imports';
  const toast = useToast()

  definePageMeta({
    layout: 'admin'
  })


//-------------------------API FETCH FOR transactions ----------------------//
  const page = ref<number>(1);
  const pageSize:number = 10;
  const totalPages = ref<number>(1);

  interface apiSuccessResponse {
    success: true,
    message: InferSelectModel<typeof paymentTable>[],
    pagination: {
      page: number,
      pagesize: number, 
      totalPages: number
    }
  }

  type apiFailureResponse = {success: false, message: string}
  const transactionData = ref<InferSelectModel<typeof paymentTable>[]| null>(null)


  async function fetchTransaction(){
    const {data, error} = await useFetch<apiSuccessResponse | apiFailureResponse>(`/api/admin/transaction`,{
        method: 'GET',
        query:{
          page: page.value,
          pageSize,
          days: 30
        }
    })

    if(error.value){
      toast.error({title: 'SERVER ERROR', message:error.value.data.message});
    }
    else{
      if(data.value?.success && typeof(data.value.message) !== 'string'){
          transactionData.value=data.value.message;
          totalPages.value= data.value.pagination.totalPages;
          toast.success({title: 'Success', message:`Transactions fetched successfully`});
      }else{
          toast.error({title: 'ERROR', message:data.value?.message as string});
      }
    }
  }

  // Initial fetch
  fetchTransaction();

  // Watch page and refetch
  watch(page, () => {
    fetchTransaction();
  });

  //--------------------------------------------------------------------------------------//

// Function to get status badge styles
const getStatusClass = (status: string | null) => {
  switch (status) {
    case 'COMPLETE':
      return 'bg-green-100 text-green-700'
    case 'REFUNDED':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getBorderClass = (reamrks: string | null) => {
  if(!reamrks){
    return 'border-b border-blue-700'
  }
  return ''
}

// Function to truncate payment ID for display
const truncateId = (id: string) => {
  return `${id.substring(0, 10)}...`
}

</script>

<template>
  <div class="w-full bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <h2 class="text-xl font-semibold text-gray-900">Transaction History</h2>
      <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
        Export
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto h-[72vh] p-6">
      <table class="w-full border-separate border-spacing-y-2">
        <thead>
          <tr class="bg-blue-200 border-b ">
            <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">PAYMENT ID</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">PRODUCT CODE</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">ORDER ID</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">AMOUNT</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">PAID AT</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">STATUS</th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-blue-700">ACTION</th>
          </tr>
        </thead>

        <tbody v-for="tx in transactionData" :key="tx.paymentId">
          <!-- Main transaction row -->
          <tr class="bg-white hover:bg-gray-50 rounded-lg">
            <td class="px-6 py-4 text-sm text-gray-900" :class="getBorderClass(tx.remarks)">{{ truncateId(tx.paymentId) }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900" :class="getBorderClass(tx.remarks)">{{ tx.productCode }}</td>
            <td class="px-6 py-4 text-sm text-gray-900" :class="getBorderClass(tx.remarks)">
              <span v-if="tx.ordersId">{{ tx.ordersId }}</span>
              <span v-else class="text-gray-400">N/A</span>
            </td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900" :class="getBorderClass(tx.remarks)">{{ tx.amount }}</td>
            <td class="px-6 py-4 text-sm text-gray-900" :class="getBorderClass(tx.remarks)">{{ tx.paidAt }}</td>
            <td class="px-6 py-4 text-sm" :class="getBorderClass(tx.remarks)">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(tx.status)"
              >
                <span class="mr-1.5">•</span>{{ tx.status }}
              </span>
            </td>
            <td class="px-6 py-4" :class="getBorderClass(tx.remarks)">
              <button v-if="!tx.ordersId" 
                class="ml-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-800 transition">
                Refund
              </button>
            </td>
          </tr>

          <!-- Optional remark row -->
          <tr v-if="tx.remarks" class="bg-red-50">
            <td colspan="7" class="px-6 py-2 text-sm text-gray-800 font-medium border-b border-blue-700">
              <span class="font-semibold text-red-900 uppercase">RemarkS: </span>
              {{ tx.remarks }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-end mt-4">
      <div class="bg-white border border-blue-100 rounded-lg p-2">
        <VPagination
          v-model="page"
          :pages=totalPages
          :range-size="1"
          class="gap-2"
        />
    </div>
      </div>
  </div>
</template>