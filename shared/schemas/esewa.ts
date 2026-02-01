import {z} from 'zod';

export const esewaSchema = z.object({
    // amount: z.string().default('0'),
    // tax_amount: z.string().default('0'),
    total_amount: z.coerce.string(),
    transaction_uuid: z.string(),
    product_code: z.string(),
    // product_service_charge: z.string().default('0'),
    // product_delivery_charge: z.string().default('0'),
    // success_url: z.url().default("https://developer.esewa.com.np/success"),
    // failure_url: z.url().default("https://developer.esewa.com.np/failure"),
    // signed_field_names: z.string().default("total_amount,transaction_uuid,product_code"),
    signature: z.string()
})