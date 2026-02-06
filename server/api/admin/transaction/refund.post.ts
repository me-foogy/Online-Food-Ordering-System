/*
    Desctiprion: API FOR REFUND CONFIRM
*/

import { eq } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { paymentTable } from "~/server/drizzle/schema";

export default defineEventHandler(async(event)=>{

    const {uuid} = await readBody(event);
    if(typeof(uuid)!=='string'){
        setResponseStatus(event, 400);
        return{
            success: false,
            message: 'Body has no uuid'
        }
    }

    //db modification
    const response = await db.update(paymentTable).set({
        status: 'REFUNDED'
    }).where(eq(paymentTable.paymentId, uuid)).returning()

    if(response.length===0){
        setResponseStatus(event, 204);
        return{
            success: false,
            message: 'No transaction Found'
        }
    }

    //on success
    setResponseStatus(event, 200);
    return{
        success: true,
        message: response
    }
})