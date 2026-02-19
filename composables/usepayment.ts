import type { UUID } from "crypto";
import { createEsewaSchema } from "~/shared/schemas/esewa";

type apiResponse = defaultApiType<{orderId: number, transactionUuid: UUID, signature: string, amountWithDecimal: number, productCode: string}>

export function usePayment(){

    async function confirmAndSignPayment(){

        try{
            const config = useRuntimeConfig();
            const baseUrl = config.public.baseUrl as string;
            const esewaUrl = config.public.esewaUrl as string;

            const response = await $fetch<apiResponse>('/api/user/esewa/sign', {
                method: 'GET',
            })

            if(!response.success){
                throw new Error(response.message || 'Signing Failed')
            }

            const {transactionUuid, signature, amountWithDecimal, productCode}= response.message;

            const esewaSchema = createEsewaSchema(baseUrl)

            const validated = esewaSchema.safeParse({
                //undefined fields are replaced with zod default defined values
                amount: amountWithDecimal,
                transaction_uuid: transactionUuid,
                product_code: productCode,
                signature: signature,
                success_url: undefined,
                failure_url: undefined,
                signed_field_names: undefined,
                tax_amount: undefined,
                product_service_charge: undefined,
                product_delivery_charge: undefined
            });

            if (!validated.success) {
                throw new Error("Esewa Data Validation failed");
            }
            const data = validated.data;

            const form = document.createElement('form');
            form.method  = 'POST'
            form.action = esewaUrl

            for(const [key,value] of Object.entries(data)){
                const input = document.createElement('input');
                input.type='hidden';
                input.name = key;
                input.value=value;
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            
        }catch(err){
            console.error('ERROR:', err);
            throw err;
        }
    }
    return {
        confirmAndSignPayment,
    }
}