<script setup lang="ts">

  import VPagination from '@hennge/vue3-pagination'
  import '@hennge/vue3-pagination/dist/vue3-pagination.css'
  import type { InferSelectModel } from 'drizzle-orm';
  import {z} from 'zod'
  import type { paymentTable } from '~/server/drizzle/schema';
  import { useToast } from '#imports';
  import RefundDialog from '~/components/admin/Refund Dialog.vue';

  const toast = useToast()
  const loading = useLoadingScreen()
  const showRefundDialog = ref<boolean>(false);
  const refundDetails = ref<{uuid: string, amount: number, phoneNo: string}>({
    uuid: '',
    amount: 0,
    phoneNo: ''
  }); 

  definePageMeta({
    layout: 'admin'
  })


//-------------------------API FETCH FOR transactions ----------------------//
  const page = ref<number>(1);
  const pageSize:number = 10;
  const days = ref<number>(1)
  const totalPages = ref<number>(1);

  interface apiSuccessResponse {
    success: true,
    message: (InferSelectModel<typeof paymentTable>&{phoneNo: string})[],
    pagination: {
      page: number,
      pagesize: number, 
      totalPages: number
    }
  }

type apiFailureResponse = {success: false, message: string}
const transactionData = ref<(InferSelectModel<typeof paymentTable>&{phoneNo: string})[] | null>(null)

  const {data, error, refresh, pending} = await useFetch<apiSuccessResponse | apiFailureResponse>(`/api/admin/transaction`,{
      method: 'GET',
      query:{
        page: page,
        pageSize,
        days
      },
      key:`transactions-${page.value}`,
      watch: [page, days],
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

  watch([data, error], () => {
    if(error.value){
      toast.error({title: 'SERVER ERROR', message: error.value.data?.message || 'Failed to fetch'});
    }
    else if(data.value?.success && typeof(data.value.message) !== 'string'){
      transactionData.value = [...data.value.message];
      totalPages.value = data.value.pagination.totalPages;
      toast.success({title: 'Success', message:`Transactions fetched successfully`});
    } else if(data.value && !data.value.success) {
      toast.error({title: 'ERROR', message: data.value.message as string});
    }
  }, { immediate: true })


  //-----------------------------------API CALL TO DOWNLOAD DATA AS EXCEL-----------------//

  const downloadData = async () =>{
    loading.value=true;
    try{
        const response = await $fetch('/api/admin/transaction/download', {
        method: "GET",
        query: {
          days: 30
        }
      }) as unknown  as ArrayBuffer
      
      // Create a blob and trigger download
      const blob = new Blob([new Uint8Array(response)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success({ message: 'Transaction Data Downloaded Successfully' });

    }catch{
      loading.value=false;
      toast.error({message: 'Error Downloading Data'})
    }finally{
      loading.value=false;
    }
  }
  //--------------------------------------------------------------------------//

const handleDialogClosure =async(refunded: boolean) =>{
  showRefundDialog.value=false
  if(refunded) await refresh()               ;
}

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
    return 'border-b-2 border-blue-400'
  }
  return ''
}

// Function to truncate payment UUID for display
const truncateId = (id: string) => {
  return `${id.substring(0, 10)}...`
}

//handle payment refund
const handleRefund = (paymentId: string, amount: number, phoneNo:string)=>{
  refundDetails.value={
    uuid: paymentId,
    amount,
    phoneNo
  };
  showRefundDialog.value = true;
}

</script>

<template>
  <div class="w-full bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white shadow-sm">
      <div class="flex flex-row gap-8 items-center">
        <h2 class="text-xl font-semibold text-blue-800 whitespace-nowrap">Transaction History</h2>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            calendar_month
          </span>
          <select
            v-model="days"
            class="appearance-none rounded-xl border border-gray-300
            bg-white pl-10 pr-10 py-2 text-sm text-gray-800
            shadow-sm transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            hover:border-gray-400"
          >
            <option :value="1">Last 24 hours</option>
            <option :value="7">Last 7 days</option>
            <option :value="30">Last 30 days</option>
          </select>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            expand_more
          </span>
        </div>
      </div>
      <button class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg 
        hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
        @click="downloadData">
        <span class="material-symbols-outlined text-xl text-white flex-shrink-0">file_download</span>
        Export
      </button>
    </div>

    <!--Refund Dialog-->
    <RefundDialog :isOpen="showRefundDialog" :onClose="(refunded)=>handleDialogClosure(refunded)" :refundDetails="refundDetails"/>

    <!-- Table -->
    <div class="overflow-x-auto h-[72vh] p-6">
      <table class="w-full border-separate border-spacing-y-2">
        <thead>
          <tr class="bg-blue-600 shadow-sm">
            <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-l-lg">Payment UUID</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone No</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Product Code</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Order ID</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Amount</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Paid At</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-r-lg">Action</th>
          </tr>
        </thead>

        <tbody v-for="tx in transactionData" :key="tx.paymentId">
          <!-- Main transaction row -->
          <tr class="bg-white hover:bg-blue-50/50 rounded-lg shadow-sm transition-colors">

            <td class="px-6 py-4 text-sm text-gray-900 font-mono rounded-l-lg" 
              :class="getBorderClass(tx.remarks)"
              :title="tx.paymentId">
              {{ truncateId(tx.paymentId) }}
            </td>

            <td class="px-6 py-4 text-sm font-medium text-gray-900" 
              :class="getBorderClass(tx.remarks)">
              {{tx.phoneNo}}
            </td>

            <td class="px-6 py-4 text-sm text-gray-900" 
              :class="getBorderClass(tx.remarks)">
              {{ tx.productCode }}
            </td>

            <td class="px-6 py-4 text-sm text-gray-900 font-mono" 
              :class="getBorderClass(tx.remarks)">
              <span v-if="tx.ordersId">{{ tx.ordersId }}</span>
              <span v-else class="text-gray-400">N/A</span>
            </td>

            <td class="px-6 py-4 text-sm font-semibold text-green-700" 
              :class="getBorderClass(tx.remarks)">
              Rs. {{ tx.amount }}
            </td>

            <td class="px-6 py-4 text-sm text-gray-900" :class="getBorderClass(tx.remarks)">
              {{ tx.paidAt }}
            </td>

            <td class="px-6 py-4 text-sm" :class="getBorderClass(tx.remarks)">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm"
                :class="getStatusClass(tx.status)"
              >
                <span class="mr-1.5">•</span>{{ tx.status }}
              </span>
            </td>

            <td class="px-6 py-4 rounded-r-lg" :class="getBorderClass(tx.remarks)">
              <button v-if="!tx.ordersId && tx.status!=='REFUNDED'" @click="handleRefund(tx.paymentId, Number(tx.amount), tx.phoneNo)"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg 
                  hover:bg-red-700 shadow-sm hover:shadow-md transition-all">
                Refund
              </button>
            </td>
          </tr>

          <!-- Optional remark row -->
          <tr v-if="tx.remarks" class="shadow-sm">
            <td colspan="8" class="px-6 py-3 text-sm text-gray-800 font-medium 
              border-b-2 border-blue-400 rounded-lg">
              <div class="flex gap-2 items-center">
                <span class="material-symbols-outlined text-red-600 text-lg">warning</span>
                <div>
                  <span class="font-semibold text-red-900 uppercase">Remarks: </span>
                  {{ tx.remarks }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-between items-center px-6 pb-4">
      <p class="text-sm text-gray-600">
        Page <span class="font-semibold text-gray-900">{{ page }}</span> of 
        <span class="font-semibold text-gray-900">{{ totalPages }}</span>
      </p>
      <div class="bg-white border border-blue-100 rounded-lg p-2 shadow-sm">
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