/*
    Description: Fetches items from cart of the user. Checks for availability and places order and creates transaction data row
    Input: none
    Output: esewa payment credentials
    Dependencies: cart, menu, orders, each_order
*/

import { db } from "~/server/drizzle";
import { eachOrderTable, ordersTable, paymentTable } from "~/server/drizzle/schema";
import { getCartByUserId } from "~/server/services/cartService";
import CryptoJS from 'crypto-js'

const ESEWA_SECRET = process.env.ESEWA_SECRET

export default defineEventHandler(async(event)=>{

    const body = await readBody(event);
    const user = event.context.user;

    const {id, name} = user;
    const address = "Temp Hardcoded Address"
    const {notes} = body;
    const uuid= crypto.randomUUID();
    //add items to the payment table
    // const productCode = `ESEWA-PAY:${order.orderId}`
    const productCode = `EPAYTEST` //for dev testing

    if(!id || !name || !address){
        throw new Error('User Parameter Missing');
    }

    const userCart = await getCartByUserId(id);
    if(userCart.length===0){
        throw new Error('User Cart is Empty');
    }

    //first insert into orders table
    const [order] = await db.insert(ordersTable).values({
        userId: id,
        customerName: name,
        address: address,
        customerNotes: notes
    }).returning({orderId: ordersTable.orderId})

    //get each item from the user cart
    let amount = 0;
    const orderItems = userCart.map((item)=>{

        if (!item.name) {
            throw new Error('Cart item has no name');
        }

        if (!item.price) {
            throw new Error(`Price missing for ${item.name}`);
        }
        
        amount=amount+item.quantity*item.price;
        return{
        orderId: order.orderId,
        menuId: item.menuId,
        itemName: item.name,
        itemQuantity: item.quantity,
        itemPrice: item.price.toString() //to string for numeric type
        }

    })



    //add items to eachOrderTable
    await db.insert(eachOrderTable).values(orderItems).returning();

    await db.insert(paymentTable).values({
        paymentId: uuid,
        amount: amount.toString(),
        productCode,
        ordersId: order.orderId,
        status: 'COMPLETE'
    }).returning()

    //sign the total amount for payment
    const amountWithDecimal = Number(amount).toFixed(2);
    const message = `total_amount=${amountWithDecimal},transaction_uuid=${uuid},product_code=${productCode}`
    
    if(!ESEWA_SECRET){
        setResponseStatus(event, 400);
        return {
            success: false,
            message: 'Esewa Secret Key is missing'
        }
    }
    
    const hash = CryptoJS.HmacSHA256(message, ESEWA_SECRET);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    return{
        success: true,
        message: {
            orderId: order.orderId,
            transactionUuid: uuid,
            signature,
            amountWithDecimal,
            productCode,
        }
    }

})