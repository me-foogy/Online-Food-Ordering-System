/*
    Desc: API endpoint to generate OTP for reset  password
*/
import { and, eq } from 'drizzle-orm';
import { db } from '~/server/drizzle';
import { otpAuthTable, usersTable } from '~/server/drizzle/schema';
import {emailSchema} from '~/shared/schemas/email';
import { generateOTPHash } from '~/server/services/otpService';
import { resetMailService } from '~/server/services/mailService';

const OTP_LENGTH = Number(process.env.OTP_LENGTH);
const OTP_AGE = Number(process.env.OTP_AGE);

export default defineEventHandler(async(event)=>{

    const body = await readBody(event);
    const result = emailSchema.safeParse(body)

    if(!result.success){
        throw createError({
            statusCode: 400,
            statusMessage: "Body must contain valid email"
        })
    }

    const email = result.data.email;

    //check if the email exists
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));

    //handle no user
    if(user.length ===0){
        throw createError({
            statusCode: 404, 
            statusMessage: 'The email does not exist'
        })
    }

    //check if otp already exists
    const existingOTP = await db.select().from(otpAuthTable)
    .where(and(
        eq(otpAuthTable.userId, user[0].id),
        eq(otpAuthTable.otpType, 'RESET')
    )).limit(1);

    if(existingOTP.length!==0){

        //update the otp with new hash
        const OTPObject=await generateOTPHash(OTP_LENGTH);
        const expiresAt = new Date(Date.now()+OTP_AGE*1000)
        //store OTP in db table
        const otpRow = await db.update(otpAuthTable).set({
            otp: OTPObject.hashedOTP,
            expiresAt
        }).where(eq(otpAuthTable.id, existingOTP[0].id)).returning();

        resetMailService(email, OTPObject.OTP);
        setResponseStatus(event, 200);
        return{
            success: true,
            message: otpRow
        }

    }else{
        //generate and send OTP
        const OTPObject=await generateOTPHash(OTP_LENGTH);
        const expiresAt = new Date(Date.now()+OTP_AGE*1000)
        //store OTP in db table
        const otpRow = await db.insert(otpAuthTable).values({
            userId: user[0].id,
            otp: OTPObject.hashedOTP,
            email,
            otpType: 'RESET',
            expiresAt
        }).returning()

        //Send OTP to user
        resetMailService(email, OTPObject.OTP);
        setResponseStatus(event, 200);
        return{
            success: true,
            message: otpRow
        }
    } 
})