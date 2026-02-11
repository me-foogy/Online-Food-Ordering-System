import {z} from 'zod';
const BASE_URL = process.env.BASE_URL;

export const esewaSchema = z.object({
    amount: z.coerce.number('NOT A NUMBER'),
    tax_amount: z.coerce.number().default(0),
    total_amount: z.coerce.number().default(0),
    transaction_uuid: z.uuid(),
    product_code: z.string(),
    product_service_charge: z.coerce.number().default(0),
    product_delivery_charge: z.coerce.number().default(0),
    success_url: z.url().default(`${BASE_URL}/user/payment/success`),
    failure_url: z.url().default(`${BASE_URL}/user/payment/failed`),
    signed_field_names: z.string().default("total_amount,transaction_uuid,product_code"),
    signature: z.string()

}).transform((data)=>{
    const total_amount = data.amount+data.product_delivery_charge+data.tax_amount+data.product_service_charge;

    return{
        ...data,
        total_amount: total_amount.toFixed(2),
        amount: data.amount.toFixed(2),
        tax_amount: data.tax_amount.toFixed(2),
        product_service_charge: data.product_service_charge.toFixed(2),
        product_delivery_charge: data.product_delivery_charge.toFixed(2)
    }
})