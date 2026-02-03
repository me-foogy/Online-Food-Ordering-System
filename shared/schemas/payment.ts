import {z} from 'zod';

const paymentStatus = ['pending', 'completed'];

export const  paymentSchema =  z.object({
    paymentId: z.uuid(),
    status: z.enum(paymentStatus),
    amount: z.number(),
    productCode: z.string(),
    ordersID: z.number()
})
