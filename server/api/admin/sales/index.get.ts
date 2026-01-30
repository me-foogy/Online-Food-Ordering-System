/*
    Description: API to fetch all of the sales data for a given date.
*/

import { and, gte, lt, lte, eq } from "drizzle-orm";
import { db } from "~/drizzle";
import { eachOrderTable, ordersTable } from "~/drizzle/schema";

export default defineEventHandler(async(event)=>{

    const params = getQuery(event);
    const date = params.date;

    if(!date){
        setResponseStatus(event, 400)
        return {
            success: false, 
            message: 'Date not provided'
        }
    }

    //fetch all orders for that date
    const start = new Date(`${date}T00:00:00.000+05:45`);
    const end   = new Date(`${date}T23:59:59.999+05:45`);
    const orders = await db.select().from(ordersTable).leftJoin(eachOrderTable, eq(ordersTable.orderId, eachOrderTable.orderId))
    .where(and(gte(ordersTable.createdAt, start), lte(ordersTable.createdAt, end)));

    const orderMap = new Map<number, { createdAt: Date; userId: number; totalRevenue: number; totalItems: number }>();

    orders.forEach(row => {
        const orderId = row.orders.orderId;
        const userId = row.orders.userId;
        const createdAt = row.orders.createdAt;

        const itemPrice = row.each_order?.itemPrice ?? 0;
        const itemQuantity = row.each_order?.itemQuantity ?? 0;

        if (!orderMap.has(orderId)) {
            orderMap.set(orderId, { createdAt, userId, totalRevenue: 0, totalItems: 0 });
        }

        const order = orderMap.get(orderId)!;
        order.totalRevenue += itemPrice * itemQuantity;
        order.totalItems += itemQuantity;
    });

    const ordersForChart = Array.from(orderMap.values());

    const hourlyRevenue = Array(24).fill(0);
    const hourlyCustomersSet: Set<number>[] = Array.from({ length: 24 }, () => new Set());
    const hourlyTotalItems = Array(24).fill(0);

    ordersForChart.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        hourlyRevenue[hour] += order.totalRevenue;
        hourlyTotalItems[hour] += order.totalItems;
        hourlyCustomersSet[hour].add(order.userId);
    });

    const hourlyCustomers = hourlyCustomersSet.map(set => set.size);

    setResponseStatus(event, 200);
    return {
        success: true,
        message: {
            date,
            hourlyRevenue,
            hourlyCustomers,
            hourlyTotalItems,
        }
    };
});