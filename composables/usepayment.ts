import CryptoJS from 'crypto-js'

type apiResponse = defaultApiType<string>
export function usePayment(){

    async function getSignature(message: string){
        try{
            const {data, error} = await useFetch<apiResponse>('/api/esewa/sign', {
                method: 'POST',
                body: message
            })

            if(error.value){
                throw new Error(data.value?.message || 'Payment Failed')
            }

            if(data.value?.success===true){
                return data.value.message
            }
        }catch(err){
            console.error('ERROR:', err);
        }
    }

    return {
        getSignature
    }
}