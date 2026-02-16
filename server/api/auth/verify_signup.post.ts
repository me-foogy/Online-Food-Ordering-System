/*
    DESC: Verify the  OTP and move the user details from the signup Table to Users Table
*/

import { eq } from "drizzle-orm";
import { db } from "~/server/drizzle";
import { signupTable, usersTable } from "~/server/drizzle/schema";

export default defineEventHandler(async(event)=>{

    const body = await readBody(event);
    const {email, otp} = body;

    if(email===null || otp === null){
        throw createError({
            status: 400,
            message: 'Body must have the email and otp'
        })
    }

    const user = await db.select().from(signupTable).where(eq(signupTable.email, email));
    
    //check if email exists
    if(user.length===0){
        throw createError({
            status: 404,
            message: 'User with the email does not exist'
        })
    }
    
    if(user[0].otp!==otp){
        throw createError({
            status: 401,
            message: "The Entered OTP is incorrect"
        })
    }

    if(new Date(user[0].expiresAt).getTime()<Date.now()){
                throw createError({
            status: 410,
            message: 'The OTP has already expired'
        })
    }

    //delete from temp table and add to the users table
    const removedUser = await db.delete(signupTable).where(eq(signupTable.email, email)).returning();
    const addedUSer = await db.insert(usersTable).values({
        email: removedUser[0].email,
        password: removedUser[0].password,
        name: removedUser[0].name, 
        phoneNo: removedUser[0].phoneNo,
        address: removedUser[0].address,
        role: removedUser[0].role,
    }).returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        role: usersTable.role
    })

    setResponseStatus(event, 200)
    return {
        success: true, 
        message: addedUSer
    }

})