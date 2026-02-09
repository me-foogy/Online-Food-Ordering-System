
import { setResponseStatus } from 'h3';
import {db} from "~/server/drizzle/index";
import {desc, eq, inArray, ne} from 'drizzle-orm';
import {ordersTable, eachOrderTable} from '~/server/drizzle/schema';

export default defineEventHandler(async(event)=>{

    const user = event.context.user;

    if(!user){
        setResponseStatus(event, 400);
        return {
            success: false,
            message: 'No user in cookies '
        }
    }

    //fetch all user orders from ordersTable
    try{
            const orders = await db.select()
                .from(ordersTable)
                .where(eq(ordersTable.customerName, user.name))
                .orderBy(desc(ordersTable.createdAt));
            //if no orders send no orders response
            if(orders.length===0){
                setResponseStatus(event, 200);
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
                            menuId: i.menuId,
                            itemQuantity: i.itemQuantity,
                            eachItemPrice: Number(i.itemPrice)
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