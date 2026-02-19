/*
    DESC: Verify the otp from the user to reset password
*/
import { and, eq } from 'drizzle-orm';
import {z} from 'zod';
import { db } from '~/server/drizzle';
import { otpAuthTable, usersTable } from '~/server/drizzle/schema';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12

export const bodySchema = z.object({
    email: z.email(),
    otp: z.string().length(6),
    password: z.string().min(1)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
})


export default defineEventHandler(async(event)=>{

    const body = await readBody(event);
    const result = bodySchema.safeParse(body);

    if(!result.success){
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid Body'
        })
    }

    const {email, otp, password} = result.data;

    //fetch and check otp
    const OTPRow = await db.select().from(otpAuthTable)
    .where(and(
        eq(otpAuthTable.email, email),
        eq(otpAuthTable.otpType, 'RESET')
    )).limit(1);

    console.log(OTPRow);

    if(OTPRow.length===0){
        throw createError({
            statusCode: 404,
            statusMessage: 'Email Not Found'
        })
    }

    //validate OTP
    const isValidated = await bcrypt.compare(otp, OTPRow[0].otp);
    console.log(isValidated);                                        

    if(!isValidated){
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid OTP'
        })
    }else{
        //update user password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const userRow = await db.update(usersTable).set({
            password: hashedPassword
        }).where(eq(usersTable.id, OTPRow[0].userId)).returning({
            id: usersTable.id,
            email: usersTable.email,
            name: usersTable.name,
            role: usersTable.role
        })

        //delete OTP from the db
        await db.delete(otpAuthTable).where(eq(otpAuthTable.id, OTPRow[0].id));

        setResponseStatus(event, 200);
        return{
            success: true,
            message: userRow
        }
    }


})