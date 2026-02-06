/*
    Description: Fetch All of the transactions from the database
    Input: body - page, pagesize, days
    Output: array of transactions
*/

import { desc, eq, gte, sql } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { paymentTable, usersTable } from "~/server/drizzle/schema";

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
    const response = await db.select({
        paymentId: paymentTable.paymentId,
        amount: paymentTable.amount,
        productCode: paymentTable.productCode,
        ordersId: paymentTable.ordersId,
        status: paymentTable.status,
        paidAt: paymentTable.paidAt,
        remarks: paymentTable.remarks,
        phoneNo: usersTable.phoneNo
    }).from(paymentTable)
        .leftJoin(usersTable, eq(paymentTable.userId, usersTable.id))
        .where(gte(paymentTable.paidAt, cutoffDate))
        .orderBy(desc(paymentTable.paidAt))
        .limit(pageSize)
        .offset((page-1)*pageSize);
    
    const responseDateFormat = response.map(eachTransaction=>({
        ...eachTransaction,
        paidAt: new Date(eachTransaction.paidAt).toLocaleString()
    }))

    setResponseStatus(event, 200)
    return {
        success: true,
        message: responseDateFormat,
        pagination: {
            page,
            pageSize,
            totalPages: Math.ceil(count/pageSize)
        }
    }


})