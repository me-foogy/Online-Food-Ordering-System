/*
    Api for fetching all of the orders from database
    Depends On : ordersTable and orderItemsTable
    Purpose: for each order in ordersTable get items of that order from orderItemstable and send a combined response
*/

import { setResponseStatus } from 'h3';
import {db} from "~/server/drizzle/index";
import {and, eq, inArray, ne, or, sql} from 'drizzle-orm';
import {ordersTable, eachOrderTable} from '~/server/drizzle/schema';

//order of the progress
const progressOrderSql=sql`
    CASE
    WHEN ${ordersTable.orderProgress} = 'notStarted' THEN 1
    WHEN ${ordersTable.orderProgress} = 'inProgress' THEN 2
    WHEN ${ordersTable.orderProgress} = 'completed' THEN 3
    ELSE 999 
    END
`
export default defineEventHandler(async(event)=>{

    const dateToday = new Date().toISOString().split('T')[0] //format 20xx-xx-xx
    const params = getQuery(event);

    //fetch all orders of current date from ordersTable
    try{
            // database fetch by using pagination
            const page = Number(params.page) || 1
            const pageSize = Number(params.pageSize) || 10
            const offset = (page - 1) * pageSize

            const [{count, notStartedCount, inProgressCount}] = await db.select({
                count: sql<number>`count(*)`,
                notStartedCount: sql<number>`count(CASE WHEN ${ordersTable.orderProgress}='notStarted' THEN 1 END)`,
                inProgressCount: sql<number>`count(CASE WHEN ${ordersTable.orderProgress}='inProgress' THEN 1 END)`
            }).from(ordersTable)
            .where(
                or(eq(sql`${ordersTable.createdAt}::date`, dateToday), ne(ordersTable.orderProgress, 'completed'))
            ) //pg supports type casting for date
            
            const orders = await db.select().from(ordersTable)
            .where(
                or(eq(sql`${ordersTable.createdAt}::date`, dateToday), ne(ordersTable.orderProgress, 'completed'))
            ) //pg supports type casting for date
            .orderBy(progressOrderSql)
            .limit(pageSize)
            .offset(offset)

            //if no orders send no orders response
            if(!orders || orders.length===0){
                setResponseStatus(event, 200);
                return {
                    success: true,
                    message: [],
                    pagination:{
                        page,
                        pageSize,
                        totalPages: 0
                    }
                }
            }

            //if orders exist then fetch each item in the database
            //get all not completed order Id's
            const orderIds = orders.map(order=>order.orderId);
            const items = await db.select().from(eachOrderTable).where(inArray(eachOrderTable.orderId, orderIds));

            const orderedItems = new Map<number, typeof items>();
            for(const item of items){
                if(!orderedItems.has(item.orderId)){
                    orderedItems.set(item.orderId,[])
                }
                orderedItems.get(item.orderId)!.push(item)
            }

            //response Shaping
            const response = orders.map(order=>{
                const orderItems = orderedItems.get(order.orderId) || []
                const totalItems = orderItems.reduce((sum, item)=>sum+item.itemQuantity, 0)
                const totalAmount = orderItems.reduce((sum, item)=>sum+item.itemQuantity*Number(item.itemPrice), 0)
                return{
                        orderId: order.orderId,
                        customerName: order.customerName,
                        totalItems,
                        totalAmount,
                        createdAt: new Date(order.createdAt).toLocaleString(),
                        location: order.address,
                        order: orderItems.map(i => ({
                            id: i.id,
                            itemName: i.itemName,
                            itemQuantity: i.itemQuantity,
                            eachItemPrice: i.itemPrice
                        })),
                        customerNotes: order.customerNotes,
                        orderProgress: order.orderProgress
                    }
            })

            return {
                success: true,
                message: response,
                count:{
                    notStartedCount,
                    inProgressCount
                },
                pagination: {
                    page,
                    pageSize,
                    totalPages: Math.ceil(count/pageSize)
                }
            }

    }catch(err){
        setResponseStatus(event, 500)
        return {
            success: false,
            message: 'Internal server error'
        }
    }
})