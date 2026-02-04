/*
    This api updates the progress of the order in the database
    Dependency on the database - ordersTable
*/

import { ordersTable } from "~/server/drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { setResponseStatus } from "h3";

export default defineEventHandler(async(event)=>{
    const body = await readBody(event);
    const {orderId, orderProgress} = body;
    console.log(body);
    if(!orderId && orderProgress!=='inProgress' && orderProgress!=='completed'){
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'Invalid body parameters'
        }
    }

    try{
        const order = await db.update(ordersTable).set({
            orderProgress
        }).where(eq(ordersTable.orderId, orderId)).returning()

        if(order.length===0){
            setResponseStatus(event, 404);
            return{
                success: false,
                message: 'Order Not found'
            }
        }

        return{
            success: true,
            message: order
        }

    }catch{

    }
})