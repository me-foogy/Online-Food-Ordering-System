/*
    Description: API to delete an item in the cart
    Input: userId from cookies and the cart Item id 
    Output: added item details
*/

import { eq } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { cartTable } from "~/server/drizzle/schema";
import type { cartSchema } from "~/shared/types/cart";

type apiResponse<T> = {success: false, message: string} | {success: true, message: T }

export default defineEventHandler (async(event): Promise<apiResponse<cartSchema[]>>=>{

    const body = await readBody(event);
    const {cartId} = body;

    if(!cartId){
        throw createError({
            status: 400,
            statusMessage:'Bad Request',
            message: 'The cart id is null'
        })
    }

    const deletedItem = await db.delete(cartTable).where(eq(cartTable.id, cartId)).returning();
    if(deletedItem.length===0){
        throw createError({
            status: 404,
            message: 'Item does not exist in cart'
        })
    }

    setResponseStatus(event, 200);
    return{
        success: true,
        message: deletedItem
    }

})