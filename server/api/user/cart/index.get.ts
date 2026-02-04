/*
    Descriuption: API to fetch the cart items for an user
    Input: None
    Output: Array of user items
    Dependency: cart Database
*/

import { eq } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { cartTable, menuTable, usersTable } from "~/server/drizzle/schema";
import { getCartByUserId } from "~/server/services/cartService";


export default defineEventHandler(async(event)=>{

    const user = event.context.user;

    const userCart = await getCartByUserId(user.id);

    setResponseStatus(event, 200);
    return{
        success: true,
        message: userCart
    }

})