/*
    Description: alter the quantity of the menu
    Input: cartId, quantity
    Output: Altered Item Details
    Depends on: cart Database
*/

import { eq } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { cartTable } from "~/server/drizzle/schema";
import type { cartSchema } from "~/shared/types/cart";

type apiResponse<T> = {success: false, message: string} | {success: true, message: T }

export default defineEventHandler (async(event): Promise<apiResponse<cartSchema[]>>=>{

    const body = await readBody(event);
    const {cartId, quantity} = body;

    if(!cartId && !quantity){
        throw createError({
            status: 400,
            statusMessage: 'Invalid Body',
            message: 'The cart Id does not match' 
        })
    }

    const updatedItem = await db.update(cartTable).set({
        quantity
    }).where(eq(cartTable.id,cartId)).returning()

    if(updatedItem.length===0){
        setResponseStatus(event, 204);
        throw createError({
            status: 404,
            statusMessage: 'Item not found',
            message: 'The item does not exist in cart' 
        })
    }

    setResponseStatus(event, 200);
    return{
        success: true,
        message: updatedItem
    }

})