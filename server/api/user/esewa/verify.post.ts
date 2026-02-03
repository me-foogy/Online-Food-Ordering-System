/*
    Description: Validate payment From backend and update db
*/

import { eq, InferSelectModel, sql } from "drizzle-orm";
import { uuid } from "zod";
import { db } from "~/drizzle";
import { eachOrderTable, ordersTable, paymentTable } from "~/drizzle/schema";
import { getCartByUserId } from "~/server/services/cartService";
import {z} from 'zod';
import CryptoJS from 'crypto-js'

type paymentType = InferSelectModel<typeof paymentTable>

type validationEsewaResponse = {
    product_code: string,
    transaction_uuid: string,
    total_amount: number,
    status: 'PENDING' | 'COMPLETE' | 'FULL_REFUND' | 'PARTIAL_REFUND' | 'AMBIGUOUS' | 'NOT_FOUND' | 'CANCELED' | 'Service is currently unavailable',
    ref_id: string
}

export default defineEventHandler(async(event)=>{

    const {data} = await readBody(event);
    console.log('API CALLED');
    if(!data){
        throw createError ({statusCode: 400, statusMessage: 'No data for validation'});
    }

    const decoded = JSON.parse(atob(data)); //string converted response of esewa
    const {product_code, total_amount, transaction_uuid, signature} = decoded;
    const amountNumber = parseFloat(total_amount);
    const user = event.context.user;

    //genrating signature for hash validation
    const expectedMessage = `total_amount=${amountNumber.toFixed(2)},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const expectedHash = CryptoJS.HmacSHA256(expectedMessage, process.env.ESEWA_SECRET!);
    const expectedSignature = CryptoJS.enc.Base64.stringify(expectedHash);

    // if(signature !== expectedSignature){
    //     throw new Error("Payment validation failed: Signature mismatch");
    // }

    const userCart = await getCartByUserId(user.id);
    if (userCart.length===0) throw createError({ statusCode: 400, statusMessage: 'Cart is empty' });


    const cartAmount = userCart.reduce((sum, item)=>sum+item.quantity*Number(item.price), 0)

    try{
        const response = await $fetch<validationEsewaResponse>(`https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`);

        if(response.status === 'COMPLETE' || response.status==='Service is currently unavailable'){

            const user = event.context.user;
            const {id, name} = user;
            const address = "Temp Hardcoded Address"
            const notes = 'hardcoded notes';
            const uuid = z.uuid().parse(transaction_uuid);
            let paymentRow:paymentType|undefined;
            //add items to the payment table
            // const productCode = `ESEWA-PAY:${order.orderId}`
            const productCode = product_code //for dev testing

            if(!id || !name || !address){
                throw new Error('User Parameter Missing');
            }

            await db.transaction(async(tx)=>{
                //first insert into orders table
                const [order] = await tx.insert(ordersTable).values({
                    userId: id,
                    customerName: name,
                    address: address,
                    customerNotes: notes
                }).returning({orderId: ordersTable.orderId})

                //get each item from the user cart
                const orderItems = userCart.map((item)=>{

                    if (!item.name) {
                        throw new Error('Cart item has no name');
                    }

                    if (!item.price) {
                        throw new Error(`Price missing for ${item.name}`);
                    }
                    return{
                    orderId: order.orderId,
                    menuId: item.menuId,
                    itemName: item.name,
                    itemQuantity: item.quantity,
                    itemPrice: item.price.toString() //to string for numeric type
                    }
                })

                console.log(orderItems);

                //add items to eachOrderTable
                await tx.insert(eachOrderTable).values(orderItems);

                const [insertedPayment]=await tx.insert(paymentTable).values({
                    paymentId: uuid,
                    amount: total_amount.toString(),
                    paidAt: sql`now()`,
                    productCode,
                    ordersId: order.orderId,
                    status: response.status as 'COMPLETE'|'Service is currently unavailable'
                }).returning()

                paymentRow=insertedPayment;
            })
        
            if (!paymentRow) {
                throw new Error("Payment insert failed");
            }

            console.log('AMOUNT', cartAmount);
            console.log('AMOUNT NO', amountNumber);

            if(cartAmount.toFixed(2) !== amountNumber.toFixed(2)){
                throw new Error(`Items Added or Removed From cart during Transaction`);
            }

            setResponseStatus(event, 200);
            return {
            success: true,
            message: {
                amount: paymentRow.amount,
                paidAt: new Date(paymentRow.paidAt).toLocaleString(),
                productCode: paymentRow.productCode
            }
        }
            
        }else{
            //No need to add to database
           throw new Error('PAYMENT VALIDATION FAILED')
        }

    }catch(err){
        throw err
    }
})