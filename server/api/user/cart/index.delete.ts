/*
    Description: API to delete an item in the cart
    Input: userId from cookies and the cart Item id 
    Output: added item details
*/

import { eq } from "drizzle-orm";
import { db } from "~/drizzle";
import { cartTable } from "~/drizzle/schema";
import type { cartSchema } from "~/shared/types/cart";

type apiResponse<T> = {success: false, message: string} | {success: true, message: T }

export default defineEventHandler (async(event): Promise<apiResponse<cartSchema[]>>=>{

    const body = await readBody(event);
    const {cartId} = body;

    if(!cartId){
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'cartId Bad Request'
        }
    }

    const deletedItem = await db.delete(cartTable).where(eq(cartTable.id, cartId)).returning();
    if(deletedItem.length===0){
        setResponseStatus(event, 204);
        return{
            success: false,
            message: 'Cart Item not found'
        }
    }

    setResponseStatus(event, 200);
    return{
        success: true,
        message: deletedItem
    }

})