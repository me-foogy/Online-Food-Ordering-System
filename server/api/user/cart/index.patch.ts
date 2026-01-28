/*
    Description: alter the quantity of the menu
    Input: cartId, quantity
    Output: Altered Item Details
    Depends on: cart Database
*/

import { eq } from "drizzle-orm";
import { db } from "~/drizzle";
import { cartTable } from "~/drizzle/schema";
import type { cartSchema } from "~/shared/types/cart";

type apiResponse<T> = {success: false, message: string} | {success: true, message: T }

export default defineEventHandler (async(event): Promise<apiResponse<cartSchema[]>>=>{

    const body = await readBody(event);
    const {cartId, quantity} = body;

    if(!cartId && !quantity){
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'cartId Bad Request'
        }
    }

    const updatedItem = await db.update(cartTable).set({
        quantity
    }).where(eq(cartTable.id,cartId)).returning()

    if(updatedItem.length===0){
        setResponseStatus(event, 204);
        return{
            success: false,
            message: 'Cart Item not found'
        }
    }

    setResponseStatus(event, 200);
    return{
        success: true,
        message: updatedItem
    }

})