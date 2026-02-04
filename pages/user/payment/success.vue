<script setup lang="ts">

    import { useToast } from '#imports';
    const toast = useToast();

    const Amount = ref<number>(0);
    const PaidAt = ref<string>('');
    const ProductCode= ref<string>('')
    

    //-----------------API CALL FOR PAYMENT VERIFICATION AND DB Insert------------//
    onMounted(async () => {
        const route = useRoute();
        const encodedData = route.query.data as string;
        
        if (!encodedData) {
            toast.error({title: 'ERROR', message: 'No payment data received'});
            return;
        }

        try{
            const response = await $fetch('/api/user/esewa/verify', {
                method: 'POST',
                body: {
                    data: encodedData
                }
            })

            if(response?.success){
                const {amount, paidAt, productCode} = response.message;
                if(amount && paidAt && productCode){
                    Amount.value = Number(amount);
                    PaidAt.value = paidAt;
                    ProductCode.value = productCode;
                }
                toast.success({title: 'SUCCESS', message: 'Payment verified successfully'});
            }
            
        }catch(err: unknown) {
            let message = 'Unknown system error';
            if (err && typeof err === 'object' && 'data' in err) {
                const data = err.data;
                if (data && typeof data === 'object' && 'message' in data) {
                    message = String(data.message);
                }
            }
            toast.error({message});
        }
    })
    //--------------------------------------------------------------//


    definePageMeta({
        layout: 'user-no-cart'
    })
</script>

<template>
    <div class="h-full w-full flex justify-center items-center px-4">
        <div class="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">
        
            <span class="material-symbols-outlined text-green-600 text-6xl mb-4 block">verified</span>

            <h2 class="text-2xl font-semibold text-gray-800 mb-1">Payment Successful</h2>
            <p class="text-gray-500 mb-6">Thank you for your purchase</p>

            <div class="border rounded-xl divide-y text-sm mb-6">
                    <div class="flex justify-between px-4 py-3">
                        <span class="text-gray-600">Amount Paid</span>
                        <span class="font-medium text-gray-800">Rs. {{Amount}}</span>
                    </div>
                    <div class="flex justify-between px-4 py-3">
                        <span class="text-gray-600">Date & Time</span>
                        <span class="font-medium text-gray-800">{{PaidAt}}</span>
                    </div>
                    <div class="flex justify-between px-4 py-3">
                        <span class="text-gray-600">Reference Number</span>
                        <span class="font-medium text-gray-800">{{ProductCode}}</span>
                    </div>
            </div>

            <NuxtLink to="/user/home" class="nav-link">
                <button class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition duration-200">
                    Return to Homepage
                </button>
            </NuxtLink> 

        </div>
    </div>
</template>