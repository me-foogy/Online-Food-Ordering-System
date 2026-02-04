/*
    Api for fetching all of the orders from database
    Depends On : ordersTable and orderItemsTable
    Purpose: for each order in ordersTable get items of that order from orderItemstable and send a combined response
*/

import { setResponseStatus } from 'h3';
import {db} from "~/server/drizzle/index";
import {eq, inArray, ne, sql} from 'drizzle-orm';
import {ordersTable, eachOrderTable} from '~/server/drizzle/schema';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//order of the progress
const progressOrder: Record<string, number> = {
    'notStarted': 1,
    'inProgress': 2,
    'completed': 3
}

export default defineEventHandler(async(event)=>{

    const params = getQuery(event);
    const targetDate = params.date;

    //fetch all orders of current date from ordersTable
    try{
            // database fetch by using pagination
            const page = Number(params.page) || 1
            const pageSize = Number(params.pageSize) || 10
            const offset = (page - 1) * pageSize
            
            const orders = await db.select().from(ordersTable)
            .where(eq(sql`${ordersTable.createdAt}::date`, targetDate)) //pg supports type casting for date
            .limit(pageSize)
            .offset(offset)

            //if no orders send no orders response
            if(!orders || orders.length===0){
                setResponseStatus(event, 200);
                return {
                    success: true,
                    message: []
                }
            }
            
            //sort orders based on priority
            orders.sort((a, b) => {
                const aPriority = progressOrder[a.orderProgress] ?? 999
                const bPriority = progressOrder[b.orderProgress] ?? 999
                return aPriority - bPriority
            })

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
                        createdAt: order.createdAt.toISOString(),
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
                message: response
            }

    }catch(err){
        setResponseStatus(event, 500)
        return {
            success: false,
            message: 'Internal server error'
        }
    }
})