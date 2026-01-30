/*
    Descriuption: API to fetch the cart items for an user
    Input: None
    Output: Array of user items
    Dependency: cart Database
*/

import { eq } from "drizzle-orm";
import { db } from "~/drizzle";
import { cartTable, menuTable, usersTable } from "~/drizzle/schema";


export default defineEventHandler(async(event)=>{

    const user = event.context.user;

    const userCart = await db.select({
        id: cartTable.id,
        name: menuTable.name,
        quantity: cartTable.quantity,
        category: menuTable.category,
        price: menuTable.price,
        image: menuTable.image,
        inStock: menuTable.inStock
    }).from(cartTable)
    .leftJoin(usersTable, eq(cartTable.userId, usersTable.id))
    .leftJoin(menuTable, eq(cartTable.menuId, menuTable.id))
    .where(eq(cartTable.userId, user.id));

    setResponseStatus(event, 200);
    return{
        success: true,
        message: userCart
    }

})