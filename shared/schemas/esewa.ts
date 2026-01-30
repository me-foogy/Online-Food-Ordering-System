import {z} from 'zod';

export const esewaSchema = z.object({
    amount: z.string(),
    tax_amount: z.string(),
    total_amount: z.string(),
    transaction_uuid: z.string(),
    product_code: z.string(),
    product_service_charge: z.string(),
    product_delivery_charge: z.string(),
    success_url: z.string(),
    failure_url: z.string(),
    signed_field_names: z.string(),
    signature: z.string()
})