import {signupSchema} from '@/shared/schemas/signup';
import {db} from "~/server/drizzle/index"
import { signupTable, usersTable } from '~/server/drizzle/schema';
import {eq, is, sql} from 'drizzle-orm'
import { setResponseStatus } from 'h3';
import bcrypt from 'bcrypt';
import { generateOTP } from '~/server/services/otpService';
import { mailService } from '~/server/services/mailService';

const SALT_ROUNDS = 12;
const OTP_LENGTH = Number(process.env.OTP_LENGTH);
const OTP_AGE = Number(process.env.OTP_AGE);



export default defineEventHandler(async(event)=>{
    let body = await readBody(event);
    
    const validated = signupSchema.safeParse(body);
    if(!validated.success){
        throw createError({
            status: 400,
            statusMessage: 'Invalid Body',
            message: validated.error.message
        })
    }

    //generate OTP using crypto
    const otp = generateOTP(OTP_LENGTH);
    const expiresAt = new Date(Date.now()+OTP_AGE*1000);

    const signUpData =  {
        ...validated.data, 
        role: 'user',
        otp,
        expiresAt
    }

    //password hashing
    const hashedPassword = await bcrypt.hash(signUpData.password, SALT_ROUNDS);

    //duplicate email check
    const existing = await db.select({id: usersTable.id}).from(usersTable).where(eq(usersTable.email, signUpData.email));
    if(existing.length>0){
        throw createError({
            status: 409,
            statusMessage: 'Email Conflict',
            message: 'An account with the email already exists'
        })
    }

    //check if otp already exists from previous attempt
    const existingUser = await db.select({
            id: signupTable.id,
            email: signupTable.email,
            name: signupTable.name,
            phoneNo: signupTable.phoneNo,
            address: signupTable.address,
            role: signupTable.role,
            expiresAt: signupTable.expiresAt,
            otp: signupTable.otp
    }).from(signupTable).where(eq(signupTable.email, signUpData.email));

    if(existingUser.length!==0){
        //The user already exists so resend the otp back
        if(new Date(existingUser[0].expiresAt).getTime()>Date.now()){
            mailService(existingUser[0].email, existingUser[0].otp);
            setResponseStatus(event, 200);
            return{
                success: true,
                message: existingUser
            }
        }
        else{
            //send newly generated otp
            const expiresAt = new Date(Date.now()+OTP_AGE*1000)
            const updateUser = await db.update(signupTable).set({
                otp,
                expiresAt
            }).where(eq(signupTable.email, existingUser[0].email))
            .returning({
                id: signupTable.id,
                email: signupTable.email,
                name: signupTable.name,
                phoneNo: signupTable.phoneNo,
                address: signupTable.address,
                role: signupTable.role,
                expiresAt: signupTable.expiresAt,
                otp: signupTable.otp
            });

            mailService(updateUser[0].email, updateUser[0].otp);
            setResponseStatus(event, 200);
            return{
                success: true,
                message: updateUser
            }
        }
    }
    else{
        //insert into signUp table
        const user = await db.insert(signupTable).values({
            email: signUpData.email,
            password: hashedPassword,
            name: signUpData.name,
            phoneNo: signUpData.phoneNo,
            address: signUpData.address,
            role: signUpData.role,
            otp,
            expiresAt
        }).returning({
            id: signupTable.id,
            email: signupTable.email,
            name: signupTable.name,
            role: signupTable.role,
            otp: signupTable.otp
        });

        mailService(user[0].email, user[0].otp);

        setResponseStatus(event, 200);
        return{
            success: true,
            message: user
        }
    }
})