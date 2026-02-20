/*
    Description: Validate payment From backend and update db
*/

import { eq, InferSelectModel, sql } from "drizzle-orm";
import { uuid } from "zod";
import { db } from "~/server/drizzle";
import { cartTable, eachOrderTable, ordersTable, paymentTable, usersTable } from "~/server/drizzle/schema";
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
    if(!data){
        throw createError ({statusCode: 400, statusMessage: 'No data for validation'});
    }

    const decoded = JSON.parse(atob(data)); //string converted response of esewa
    const {product_code, total_amount, transaction_uuid} = decoded;
    const amountNumber = parseFloat(total_amount);
    const user = event.context.user;
    let paymentId: string | undefined;

    const userCart = await getCartByUserId(user.id);
    if (userCart.length===0) throw createError({ statusCode: 400, statusMessage: 'Cart is empty' });


    const cartAmount = userCart.reduce((sum, item)=>sum+item.quantity*Number(item.price), 0)

    try{
        const response = await $fetch<validationEsewaResponse>(`https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`);

        if(response.status === 'COMPLETE' || response.status==='Service is currently unavailable'){
            const user = event.context.user;
            const {id} = user;
            const notes = 'No Notes';
            const uuid = z.uuid().parse(transaction_uuid);
            paymentId = uuid;
            let paymentRow:paymentType|undefined;
            //add items to the payment table
            // const productCode = `ESEWA-PAY:${order.orderId}`
            const productCode = product_code //for dev testing

            //fetch userName for customer_name and address for customer_address
            const result=await db.select({name: usersTable.name, address: usersTable.address}).from(usersTable).where(eq(usersTable.id, id))
            const name=result[0].name || 'Error: call to confirm';
            const address = result[0].address || 'Error: Call to confirm';

            //Check if items was added during transaction
            if(cartAmount.toFixed(2) !== amountNumber.toFixed(2)){
                throw new Error(`Items Added or Removed From cart during Transaction`);
            }

            //Store the payment as the payment has already been made
            await db.insert(paymentTable).values({
                    paymentId: uuid,
                    amount: total_amount.toString(),
                    paidAt: sql`now()`,
                    productCode,
                    userId: id,
                    ordersId: null,
                    status: response.status as 'COMPLETE'|'Service is currently unavailable'
            }).returning()
            
                //first insert into orders table
                const [order] = await db.insert(ordersTable).values({
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

                //add items to eachOrderTable
                await db.insert(eachOrderTable).values(orderItems);

                const [insertedPayment]=await db.update(paymentTable).set({
                    ordersId: order.orderId
                }).where(eq(paymentTable.paymentId, uuid)).returning()

                paymentRow=insertedPayment;

                //clear cart of the user
                await db.delete(cartTable).where(eq(cartTable.userId, user.id))
        
            if (!paymentRow) {
                throw new Error("Payment insert failed");
            }

            //broadcast newOrder to all peers


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
            //Esewa Api Validation Failed
           throw new Error('PAYMENT VALIDATION FAILED');
        }

    }catch(err){
        const message = err instanceof Error ? err.message.slice(0, 200):'unknown system error';
        //Transaction has been made but needs to be refunded due to error
        if(paymentId){
            await db.update(paymentTable).set({
                remarks: message as string
            }).where(eq(paymentTable.paymentId, paymentId)).returning();
        }
        throw err
    }
})