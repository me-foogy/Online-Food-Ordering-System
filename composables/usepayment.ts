import type { UUID } from "crypto";
import { createEsewaSchema } from "~/shared/schemas/esewa";

type baseApiResponse = {orderId: number, transactionUuid: UUID, signature: string, amountWithDecimal: number, productCode: string}
type apiResponse = {success: true, message:baseApiResponse}

export function usePayment(){
    const loading = useLoadingScreen(); //using global loader
    const toast = useToast();

    async function confirmAndSignPayment(){

        try{
            loading.value=true;
            const config = useRuntimeConfig();
            const baseUrl = config.public.baseUrl as string;
            const esewaUrl = config.public.esewaUrl as string;

            const response = await $fetch<apiResponse>('/api/user/esewa/sign', {
                method: 'GET',
            })
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
                throw createError({
                    status: 404,
                    message: "Esewa Data Validation failed"
                })
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
            
        }catch(err: any){
            const status = err?.statusCode;
            
            if(status === 404){
                toast.error({message: 'The cart is empty'});
            }else{
                toast.error({message: 'Unexpected Error Occured'});
            }
            
        }finally{
            loading.value=false;
        }
    }
    return {
        confirmAndSignPayment,
    }
}