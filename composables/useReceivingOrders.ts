import { useToast } from '#imports';
import type { InferSelectModel } from 'drizzle-orm';
import {z} from 'zod'
import { receiveOrders } from '~/server/drizzle/schema';

export function useReceivingOrders(){

    const receivingOrders = useState<boolean>('receivingOrders', ()=>false)
    const toast = useToast()
    const loading = useLoadingScreen()
    interface apiResponse {
        success: boolean,
        message: InferSelectModel<typeof receiveOrders>[]
    }

    async function fetchReceivingOrders(){
        try{
            const response = await $fetch<apiResponse>('/api/shared/orders/receiving_orders', {
                method: 'GET',
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
                toast.success({message: `Receiving Orders State is ${response.message[0]!.isReceivingOrders}`});
                receivingOrders.value = response.message[0]!.isReceivingOrders;
            }
        }catch(err: any){
            toast.error({ message: 'An unexpected error occurred' })
        }
    }

    return {
        fetchReceivingOrders,
        receivingOrders
    }
    
}