/*
    Description: Api to fetch the user iformation from the persistent jwt token
*/

import { eq } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { usersTable } from "~/server/drizzle/schema";

export default defineEventHandler(async(event)=>{

    const jwt_decoded = event.context.user;
    const {id} = jwt_decoded;

    if(!id){
        throw createError({
            statusCode: 401,
            statusMessage: 'JWT token Invalid'
        })
    }

    const user = await db.select({
        email: usersTable.email,
        name: usersTable.name,
        phoneNo: usersTable.phoneNo,
        address: usersTable.address,
        role: usersTable.role
    }).from(usersTable).where(eq(usersTable.id, id));

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    setResponseStatus(event, 200);
    return user[0]
})