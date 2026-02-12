/*
    DESC: Checks password from the body of the rea and then toggles the state
    of can the restaurant receive orders
*/

import { eq } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { receiveOrders, usersTable } from "~/server/drizzle/schema";
import bcrypt from 'bcrypt';

export default defineEventHandler(async(event)=>{

    const body = await readBody(event);
    const user = event.context.user; //user context from middleware

    const {password, state} = body;
    if(!password==null || !state==null){
        throw createError({
            statusCode: 400,
            statusMessage: 'Body Parameters Missing'
        })
    }

    if(typeof(state)!=='boolean'){
        throw createError({
            statusCode: 400,
            statusMessage: 'State of acceping orders must be a boolean value'
        })
    }

    //check if the password matches
    const [userDbResponse] = await db.select({password: usersTable.password}).from(usersTable).where(eq(usersTable.id, user.id));
    const isPasswordCorrect = await bcrypt.compare( password, userDbResponse.password);

    if(!isPasswordCorrect){
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid Credentials'
        })
    }

    //update the is_receiving_order status in db
    const receiveOrdersResponse = await db.update(receiveOrders).set({
        isReceivingOrders: state
    }).returning() //only one row exists

    return{
        success: true,
        message: receiveOrdersResponse
    }

})