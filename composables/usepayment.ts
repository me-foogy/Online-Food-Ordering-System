import { esewaSchema } from "~/shared/schemas/esewa";

type apiResponse = defaultApiType<{totalAmount: number, productCode: string, transactionUuid: string, signature: string}>

export function usePayment(){

    async function signPayment(totalAmount:number, productCode: string){

        try{

            const response = await $fetch<apiResponse>('/api/user/esewa/sign', {
                method: 'POST',
                body: {
                    totalAmount,
                    productCode
                }
            })

            if(!response.success){
                throw new Error(response.message || 'Payment Failed')
            }

            return response.message
            
        }catch(err){
            console.error('ERROR:', err);
            throw err;
        }
    }

    async function makePayment(totalAmount: number, transactionUuid: string, productCode: string, signature: string){

        const validated = esewaSchema.safeParse({
            total_amount: totalAmount,
            transaction_uuid: transactionUuid,
            product_code: productCode,
            signature: signature
        }); 

        if (!validated.success) {
            throw new Error("Esewa Data Validation failed");
        }
        const data = validated.data;

        const form = document.createElement('form');
        form.method  = 'POST'
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

        for(const [key,value] of Object.entries(data)){
            const input = document.createElement('input');
            input.type='hidden';
            input.name = key;
            input.value=value;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    }

    return {
        signPayment,
        makePayment
    }
}