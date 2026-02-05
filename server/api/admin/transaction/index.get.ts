/*
    Description: Fetch All of the transactions from the database
    Input: body - page, pagesize, days
    Output: array of transactions
*/

import { desc, gte, sql } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { paymentTable } from "~/server/drizzle/schema";

export default defineEventHandler(async(event)=>{
    const params = getQuery(event);
    const page = Number(params.page);
    const pageSize=Number(params.pageSize);
    const days = Number(params.days);

    if(!page || !pageSize || !days){
        setResponseStatus(event, 400);
        return {
            success: false,
            message: 'page, pagesize or days Parameter missing'
        }
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate()-days);

    //fetch the total count
    const [{count}]  = await db.select({ count: sql<number>`count(*)` }).from(paymentTable).where(gte(paymentTable.paidAt, cutoffDate));

    //fetch the paginated data
    const response = await db.select().from(paymentTable)
        .where(gte(paymentTable.paidAt, cutoffDate))
        .orderBy(desc(paymentTable.paidAt))
        .limit(pageSize)
        .offset((page-1)*pageSize);

    setResponseStatus(event, 200)
    return {
        success: true,
        message: response,
        pagination: {
            page,
            pageSize,
            totalPages: Math.ceil(count/pageSize)
        }
    }


})