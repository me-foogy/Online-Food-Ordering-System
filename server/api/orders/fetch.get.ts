/*
    Api for fetching all of the orders from database
    Depends On : ordersTable and orderItemsTable
    Purpose: for each order in ordersTable get items of that order from orderItemstable and send a combined response
*/

import { setResponseStatus } from 'h3';
import {db} from "@/drizzle/index";
import {eq, inArray, ne} from 'drizzle-orm';
import {ordersTable, eachOrderTable} from '~/drizzle/schema';

export default defineEventHandler(async(event)=>{

    //fetch all orders from ordersTable
    try{
            // const orders = await db.select().from(ordersTable).where(ne(ordersTable.orderProgress,'completed'));
            const orders = await db.select().from(ordersTable)
            //if no orders send no orders response
            if(orders.length===0){
                setResponseStatus(event, 204);
                return {
                    success: true,
                    message: []
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
                const totalAmount = orderItems.reduce((sum, item)=>sum+item.itemQuantity*item.itemPrice, 0)
                return{
                        customerName: order.customerName,
                        totalItems,
                        totalAmount,
                        createdAt: order.createdAt.toISOString(),
                        location: order.address,
                        order: orderItems.map(i => ({
                            id: i.id,
                            itemName: i.itemName,
                            itemCategory: i.itemCategory,
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