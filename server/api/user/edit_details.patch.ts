/*
    Description: Api to edit the user details
    Input: User = Omit<loginReturnMessageType,'role'> & {password: string};
    Return: The new user details
*/

import { eq } from "drizzle-orm";
import { db } from "~/drizzle";
import { usersTable } from "~/drizzle/schema";
import { signupSchema } from "~/shared/schemas/signup";
import bcrypt from 'bcrypt';

export default defineEventHandler(async(event)=>{

    const body = await readBody(event);

    //input data is same as the loginSchema so we zod validate using loginSchema

    const validated = signupSchema.safeParse(body);
    if(!validated.success){
        setResponseStatus(event, 400);
        return {success: false, message:validated.error.message}
    }
    console.log(validated.data);
    const {email, password, name, phoneNo, address} = validated.data;

    //fetch user
    const [user]= await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (!user) {
        setResponseStatus(event, 400);
        return { success: false, message: "User not found" };
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        setResponseStatus(event, 401);
        return {success: false, message: "Invalid Credentials"};
    }

    //change user details
    const editedUser = await db.update(usersTable).set({
        name,
        phoneNo,
        address
    }).where(eq(usersTable.email, email)).returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        role: usersTable.role
    })

    setResponseStatus(event, 200);
    return{
        success: true,
        message: editedUser
    }
})