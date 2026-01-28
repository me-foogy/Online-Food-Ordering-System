/*
    Descriuption: API to add an item to the user cart
    Input: cart object info
    Output: Array of added object
    Dependency: cart Database
*/

import { db } from "~/drizzle";
import { cartTable } from "~/drizzle/schema";


export default defineEventHandler(async(event)=>{

    const body = await readBody(event);
    const user = event.context.user;

    if(typeof(body.menuId)!=='number'){
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'body is not a number'
        }
    }

    const addedItem = await db.insert(cartTable).values({
        userId: user.id,
        menuId: body.menuId,
        quantity: 1
    }).returning({
        id: cartTable.id,
        userId: cartTable.userId,
        menuId: cartTable.menuId,
        quantity: cartTable.quantity
    })

    setResponseStatus(event, 200);
    return{
        success: true,
        message: addedItem
    }

})