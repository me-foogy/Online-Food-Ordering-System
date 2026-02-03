/*
    Description: sign the amount uuid data and product code 
    Input: none
    Output: esewa payment credentials
    Dependencies: cart, menu, orders, each_order
*/

import { db } from "~/drizzle";
import { eachOrderTable, ordersTable, paymentTable } from "~/drizzle/schema";
import { getCartByUserId } from "~/server/services/cartService";
import CryptoJS from 'crypto-js'

const ESEWA_SECRET = process.env.ESEWA_SECRET

export default defineEventHandler(async(event)=>{

    const user = event.context.user;

    const {id} = user;
    const uuid= crypto.randomUUID();
    //add items to the payment table
    const productCode = `EPAYTEST` //for dev testing

    if(!id){
        throw new Error('Id Parameter Missing');
    }

    const userCart = await getCartByUserId(id);
    if(userCart.length===0){
        throw new Error('User Cart is Empty');
    }

    let totalAmount = 0;
    userCart.forEach((item) => {
        if (!item.name) {
            throw new Error('Cart item has no name');
        }
        if (!item.price) {
            throw new Error(`Price missing for ${item.name}`);
        }
        totalAmount += item.quantity * item.price;
    });

    //sign the total amount for payment
    const amountWithDecimal = Number(totalAmount).toFixed(2);
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
            transactionUuid: uuid,
            signature,
            amountWithDecimal,
            productCode,
        }
    }
})