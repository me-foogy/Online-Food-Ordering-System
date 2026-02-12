/*
    DESC: Fetch whether the restaurant is receiving orders or not
*/

import { db } from "~/server/drizzle";
import { receiveOrders} from "~/server/drizzle/schema";

export default defineEventHandler(async(event)=>{

    const receiveOrdersResponse = await db.select().from(receiveOrders).limit(1)

    return{
        success: true,
        message: receiveOrdersResponse
    }

})