import {db} from '~/server/drizzle/index'
import { eq } from 'drizzle-orm';
import { usersTable, menuTable, cartTable } from '~/server/drizzle/schema';

export async function getCartByUserId(userId: number){
    const userCart = await db.select({
        id: cartTable.id,
        name: menuTable.name,
        quantity: cartTable.quantity,
        category: menuTable.category,
        menuId: menuTable.id,
        price: menuTable.price,
        image: menuTable.image,
        inStock: menuTable.inStock
    }).from(cartTable)
    .leftJoin(usersTable, eq(cartTable.userId, usersTable.id))
    .leftJoin(menuTable, eq(cartTable.menuId, menuTable.id))
    .where(eq(cartTable.userId, userId));
    
    return userCart
}

